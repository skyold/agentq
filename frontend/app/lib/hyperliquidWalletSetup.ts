/**
 * Hyperliquid One-Click Wallet Setup
 *
 * Handles browser wallet connection via EIP-1193, EIP-712 typed data signing
 * for ApproveBuilderFee and ApproveAgent actions, and submission to Hyperliquid API.
 */

import { ethers } from 'ethers'

// Hyperliquid EIP-712 domain (same for all user-signed actions)
const EIP712_DOMAIN = {
  name: 'HyperliquidSignTransaction',
  version: '1',
  chainId: 0x66eee,
  verifyingContract: '0x0000000000000000000000000000000000000000',
}

// EIP712Domain type definition — must be explicit to match SDK's encode_typed_data
const EIP712_DOMAIN_TYPE = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
]

// Builder fee config
const BUILDER_ADDRESS = '0x012E82f81e506b8f0EF69FF719a6AC65822b5924'
const BUILDER_FEE_RATE = '0.03%' // 30 internal units = 3 bps = 0.03%
const BUILDER_FEE_THRESHOLD = 30

const MAINNET_API = 'https://api.hyperliquid.xyz'
const TESTNET_API = 'https://api.hyperliquid-testnet.xyz'

// Hyperliquid requires signing on this chainId (Arbitrum Sepolia)
const SIGNING_CHAIN_ID = '0x66eee'

function getApiUrl(env: 'testnet' | 'mainnet') {
  return env === 'mainnet' ? MAINNET_API : TESTNET_API
}

function getChainName(env: 'testnet' | 'mainnet') {
  return env === 'mainnet' ? 'Mainnet' : 'Testnet'
}

/**
 * Connect to browser wallet via EIP-1193 (MetaMask, Rabby, OKX, Coinbase, etc.)
 */
export async function connectBrowserWallet(): Promise<string> {
  const ethereum = (window as any).ethereum
  if (!ethereum) {
    throw new Error('No browser wallet detected. Please install MetaMask, Rabby, or another EIP-1193 compatible wallet.')
  }
  const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' })
  if (!accounts || accounts.length === 0) {
    throw new Error('No account selected in wallet')
  }
  return accounts[0]
}

/**
 * Switch wallet to the required signing chain (0x66eee / Arbitrum Sepolia).
 * Some wallets enforce that EIP-712 domain chainId matches the active network.
 * Returns the previous chainId so caller can switch back after signing.
 */
async function ensureSigningChain(): Promise<string | null> {
  const ethereum = (window as any).ethereum
  const currentChainId: string = await ethereum.request({ method: 'eth_chainId' })

  if (currentChainId.toLowerCase() === SIGNING_CHAIN_ID) {
    return null
  }

  // Best-effort chain switch: MetaMask requires it, Rabby/OKX don't need it.
  // If switching fails (except user rejection), silently skip — the wallet
  // may sign EIP-712 typed data regardless of active chain.
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SIGNING_CHAIN_ID }],
    })
    return currentChainId
  } catch (switchErr: any) {
    // User explicitly rejected — abort
    if (switchErr?.code === 4001) {
      throw switchErr
    }
    // Chain not added — try adding it
    if (switchErr?.code === 4902) {
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: SIGNING_CHAIN_ID,
            chainName: 'Arbitrum Sepolia',
            rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: ['https://sepolia.arbiscan.io'],
          }],
        })
        return currentChainId
      } catch (addErr: any) {
        if (addErr?.code === 4001) throw addErr
        // Adding chain also failed — skip silently
        console.warn('[WalletSetup] Chain add failed, proceeding without chain switch:', addErr?.message)
        return null
      }
    }
    // Any other error (Rabby "Unrecognized chain ID", etc.) — skip silently
    console.warn('[WalletSetup] Chain switch failed, proceeding without chain switch:', switchErr?.message)
    return null
  }
}

/**
 * Restore wallet to its previous chain after signing is complete.
 */
async function restoreChain(previousChainId: string | null): Promise<void> {
  if (!previousChainId) return
  const ethereum = (window as any).ethereum
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: previousChainId }],
    })
  } catch {
    // Best-effort restore
  }
}

/**
 * Parse EIP-712 signature hex into {r, s, v} format for Hyperliquid API
 */
function parseSignature(sigHex: string): { r: string; s: string; v: number } {
  const sig = ethers.Signature.from(sigHex)
  return { r: sig.r, s: sig.s, v: sig.v }
}

/**
 * Convert Hyperliquid API errors to user-friendly messages
 */
function friendlyError(response: string, env: 'testnet' | 'mainnet'): string {
  if (response?.includes('Must deposit before performing actions')) {
    const url = env === 'testnet'
      ? 'https://app.hyperliquid-testnet.xyz'
      : 'https://app.hyperliquid.xyz'
    return `This wallet has not deposited on Hyperliquid ${env}. Please visit ${url} and deposit USDC first.`
  }
  return response || 'Unknown error'
}

/**
 * Safe JSON parse from fetch response with proper error handling
 */
async function parseJsonResponse(resp: Response, context: string): Promise<any> {
  const text = await resp.text()
  if (!resp.ok) {
    console.error(`[WalletSetup] ${context} HTTP ${resp.status}: ${text}`)
    throw new Error(`${context}: ${text}`)
  }
  try {
    return JSON.parse(text)
  } catch {
    console.error(`[WalletSetup] ${context} invalid JSON response: ${text}`)
    throw new Error(`${context}: unexpected response from server`)
  }
}

/**
 * Build EIP-712 typed data matching the SDK's user_signed_payload format exactly.
 * - Includes EIP712Domain in types (matches SDK's encode_typed_data)
 * - Message contains ONLY the fields defined in the primary type
 */
function buildTypedData(
  primaryType: string,
  primaryTypeFields: Array<{ name: string; type: string }>,
  messageValues: Record<string, any>,
) {
  // Build clean message with only the typed fields
  const message: Record<string, any> = {}
  for (const field of primaryTypeFields) {
    message[field.name] = messageValues[field.name]
  }

  return {
    domain: EIP712_DOMAIN,
    types: {
      EIP712Domain: EIP712_DOMAIN_TYPE,
      [primaryType]: primaryTypeFields,
    },
    primaryType,
    message,
  }
}

// Type definitions matching the Hyperliquid SDK
const APPROVE_BUILDER_FEE_TYPES = [
  { name: 'hyperliquidChain', type: 'string' },
  { name: 'maxFeeRate', type: 'string' },
  { name: 'builder', type: 'address' },
  { name: 'nonce', type: 'uint64' },
]

const APPROVE_AGENT_TYPES = [
  { name: 'hyperliquidChain', type: 'string' },
  { name: 'agentAddress', type: 'address' },
  { name: 'agentName', type: 'string' },
  { name: 'nonce', type: 'uint64' },
]

/**
 * Check if builder fee is already authorized for a wallet address
 */
export async function checkBuilderFeeAuthorized(
  masterAddress: string,
  env: 'testnet' | 'mainnet'
): Promise<boolean> {
  if (env === 'testnet') return true
  try {
    const resp = await fetch(`${MAINNET_API}/info`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'maxBuilderFee',
        user: masterAddress,
        builder: BUILDER_ADDRESS,
      }),
    })
    const maxFee = await parseJsonResponse(resp, 'Check builder fee')
    return maxFee >= BUILDER_FEE_THRESHOLD
  } catch {
    return false
  }
}

/**
 * Sign and submit ApproveBuilderFee action via browser wallet
 */
async function approveBuilderFee(
  masterAddress: string,
  env: 'testnet' | 'mainnet'
): Promise<void> {
  const ethereum = (window as any).ethereum
  const nonce = Date.now()

  const messageValues = {
    hyperliquidChain: getChainName(env),
    maxFeeRate: BUILDER_FEE_RATE,
    builder: BUILDER_ADDRESS,
    nonce,
  }

  const typedData = buildTypedData(
    'HyperliquidTransaction:ApproveBuilderFee',
    APPROVE_BUILDER_FEE_TYPES,
    messageValues,
  )

  const sigHex: string = await ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [masterAddress, JSON.stringify(typedData)],
  })

  const signature = parseSignature(sigHex)

  const action = {
    type: 'approveBuilderFee',
    hyperliquidChain: getChainName(env),
    maxFeeRate: BUILDER_FEE_RATE,
    builder: BUILDER_ADDRESS,
    nonce,
    signatureChainId: SIGNING_CHAIN_ID,
  }

  const resp = await fetch(`${getApiUrl(env)}/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, nonce, signature, vaultAddress: null }),
  })

  const result = await parseJsonResponse(resp, 'ApproveBuilderFee')
  if (result.status === 'err') {
    throw new Error(friendlyError(result.response, env))
  }
}

interface AgentSetupResult {
  agentPrivateKey: string
  agentAddress: string
  masterAddress: string
}

/**
 * Generate agent key, sign ApproveAgent via browser wallet, and submit to Hyperliquid
 */
async function createAgentWallet(
  masterAddress: string,
  env: 'testnet' | 'mainnet',
  agentName: string = ''
): Promise<AgentSetupResult> {
  const ethereum = (window as any).ethereum

  const agentWallet = ethers.Wallet.createRandom()
  const agentPrivateKey = agentWallet.privateKey
  const agentAddress = agentWallet.address

  const nonce = Date.now()

  const messageValues = {
    hyperliquidChain: getChainName(env),
    agentAddress,
    agentName,
    nonce,
  }

  const typedData = buildTypedData(
    'HyperliquidTransaction:ApproveAgent',
    APPROVE_AGENT_TYPES,
    messageValues,
  )

  const sigHex: string = await ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [masterAddress, JSON.stringify(typedData)],
  })

  const signature = parseSignature(sigHex)

  // Action sent to API includes signatureChainId/hyperliquidChain (SDK convention)
  const action: Record<string, any> = {
    type: 'approveAgent',
    hyperliquidChain: getChainName(env),
    agentAddress,
    agentName,
    nonce,
    signatureChainId: SIGNING_CHAIN_ID,
  }
  if (!agentName) {
    delete action.agentName
  }

  const resp = await fetch(`${getApiUrl(env)}/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, nonce, signature, vaultAddress: null }),
  })

  const result = await parseJsonResponse(resp, 'ApproveAgent')
  if (result.status === 'err') {
    throw new Error(friendlyError(result.response, env))
  }

  return { agentPrivateKey, agentAddress, masterAddress }
}

export type SetupStep = 'idle' | 'connecting' | 'checking_auth' | 'signing_auth' | 'signing_agent' | 'saving' | 'done' | 'error'

export interface SetupProgress {
  step: SetupStep
  message: string
  error?: string
}

/**
 * Full one-click wallet setup flow:
 * 1. Connect browser wallet & switch to signing chain
 * 2. (Mainnet only) Check & sign builder fee authorization
 * 3. Generate agent key & sign ApproveAgent
 * 4. Save to backend via configureAgentWallet API
 */
export async function oneClickWalletSetup(
  env: 'testnet' | 'mainnet',
  accountId: number,
  saveToBackend: (agentKey: string, masterAddr: string) => Promise<void>,
  onProgress: (progress: SetupProgress) => void
): Promise<void> {
  let previousChainId: string | null = null
  try {
    // Step 1: Connect wallet and switch to signing chain
    onProgress({ step: 'connecting', message: 'Connecting browser wallet...' })
    await connectBrowserWallet()

    // Switch chain before reading final address (chain switch can change active account)
    previousChainId = await ensureSigningChain()

    // Re-fetch address after chain switch to get the actual signer
    const ethereum = (window as any).ethereum
    const accounts: string[] = await ethereum.request({ method: 'eth_accounts' })
    const masterAddress = accounts[0]

    // Step 2: Builder fee check (mainnet only)
    if (env === 'mainnet') {
      onProgress({ step: 'checking_auth', message: 'Checking trading authorization...' })
      const authorized = await checkBuilderFeeAuthorized(masterAddress, env)

      if (!authorized) {
        onProgress({ step: 'signing_auth', message: 'Please approve trading authorization in your wallet...' })
        await approveBuilderFee(masterAddress, env)
      }
    }

    // Step 3: Create agent wallet
    onProgress({ step: 'signing_agent', message: 'Please approve API Wallet creation in your wallet...' })
    const result = await createAgentWallet(masterAddress, env, 'HyperArena')

    // Restore wallet to original chain
    await restoreChain(previousChainId)

    // Step 4: Save to backend
    onProgress({ step: 'saving', message: 'Saving wallet configuration...' })
    await saveToBackend(result.agentPrivateKey, result.masterAddress)

    onProgress({ step: 'done', message: 'Wallet setup complete!' })
  } catch (err: any) {
    await restoreChain(previousChainId)
    const message = err?.code === 4001
      ? 'User rejected the request'
      : err?.message || 'Setup failed'
    onProgress({ step: 'error', message, error: message })
    throw err
  }
}
