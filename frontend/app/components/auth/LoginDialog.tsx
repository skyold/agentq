import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'react-hot-toast'
import { loginUser, registerUser } from '@/lib/api'
import Cookies from 'js-cookie'

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

export default function LoginDialog({ isOpen, onClose, onLoginSuccess }: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[LoginDialog] Form submitted, isLogin:', isLogin, 'username:', username)
    setLoading(true)

    try {
      let response
      if (isLogin) {
        // Login
        console.log('[LoginDialog] Calling loginUser...')
        response = await loginUser(username, password)
        console.log('[LoginDialog] Login response:', response)
        toast.success('Login successful!')
      } else {
        // Register
        console.log('[LoginDialog] Calling registerUser...')
        response = await registerUser(username, email || undefined, password)
        console.log('[LoginDialog] Register response:', response)
        toast.success('Registration successful!')
      }

      // Save session_token to cookie
      Cookies.set('session_token', response.session_token, { expires: 7 })
      
      // Save user info
      Cookies.set('arena_user', JSON.stringify(response.user), { expires: 7 })
      
      onLoginSuccess()
      onClose()
    } catch (error: any) {
      console.error('[LoginDialog] Error:', error)
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isLogin ? 'Login' : 'Register'}</DialogTitle>
          <DialogDescription>
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Create a new account to get started'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              placeholder="Enter username"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div>
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter password (min 6 characters)"
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
          </Button>

          <div className="text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline disabled:opacity-50"
              disabled={loading}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
