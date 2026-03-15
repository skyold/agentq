# Hyper Alpha Arena 项目结构分析

本文档详细分析了 Hyper Alpha Arena 项目的功能页面、API 端点及其对应的源代码文件。

---

## 1. 功能页面及对应文件

### 1.1 Hyper AI (`hyper-ai`)
**功能**: AI 助手主页面，提供智能交易咨询

**前端组件文件**:
- [`frontend/app/components/hyper-ai/HyperAiPage.tsx`](frontend/app/components/hyper-ai/HyperAiPage.tsx) - 主页面
- [`frontend/app/components/hyper-ai/SplashScreen.tsx`](frontend/app/components/hyper-ai/SplashScreen.tsx) - 启动画面
- [`frontend/app/components/hyper-ai/HyperAiOnboarding.tsx`](frontend/app/components/hyper-ai/HyperAiOnboarding.tsx) - Onboarding 引导
- [`frontend/app/components/hyper-ai/NotificationConfigModal.tsx`](frontend/app/components/hyper-ai/NotificationConfigModal.tsx) - 通知配置
- [`frontend/app/components/hyper-ai/ToolConfigModal.tsx`](frontend/app/components/hyper-ai/ToolConfigModal.tsx) - 工具配置
- [`frontend/app/components/hyper-ai/BotIntegrationModal.tsx`](frontend/app/components/hyper-ai/BotIntegrationModal.tsx) - Bot 集成

**主入口文件**:
- [`frontend/app/main.tsx`](frontend/app/main.tsx) - 应用主入口（包含路由和状态管理）

---

### 1.2 Dashboard (`comprehensive`)
**功能**: 综合交易仪表盘

**前端组件文件**:
- [`frontend/app/components/portfolio/ComprehensiveView.tsx`](frontend/app/components/portfolio/ComprehensiveView.tsx) - 主视图
- [`frontend/app/components/portfolio/AlphaArenaFeed.tsx`](frontend/app/components/portfolio/AlphaArenaFeed.tsx) - Alpha Arena 数据流
- [`frontend/app/components/portfolio/ArenaAnalyticsFeed.tsx`](frontend/app/components/portfolio/ArenaAnalyticsFeed.tsx) - Arena 分析数据流
- [`frontend/app/components/portfolio/AssetCurveWithData.tsx`](frontend/app/components/portfolio/AssetCurveWithData.tsx) - 资产曲线
- [`frontend/app/components/portfolio/HyperliquidSummary.tsx`](frontend/app/components/portfolio/HyperliquidSummary.tsx) - Hyperliquid 汇总
- [`frontend/app/components/portfolio/HyperliquidMultiAccountSummary.tsx`](frontend/app/components/portfolio/HyperliquidMultiAccountSummary.tsx) - 多账户汇总
- [`frontend/app/components/layout/AccountSelector.tsx`](frontend/app/components/layout/AccountSelector.tsx) - 账户选择器

---

### 1.3 AI Trader Management (`trader-management`)
**功能**: AI 交易员管理

**前端组件文件**:
- [`frontend/app/components/trader/TraderManagement.tsx`](frontend/app/components/trader/TraderManagement.tsx) - 主页面
- [`frontend/app/components/trader/ExchangeWalletsPanel.tsx`](frontend/app/components/trader/ExchangeWalletsPanel.tsx) - 交易所钱包面板
- [`frontend/app/components/trader/BinanceWalletSection.tsx`](frontend/app/components/trader/BinanceWalletSection.tsx) - Binance 钱包
- [`frontend/app/components/trader/HyperliquidWalletSection.tsx`](frontend/app/components/trader/HyperliquidWalletSection.tsx) - Hyperliquid 钱包
- [`frontend/app/components/trader/WalletConfigPanel.tsx`](frontend/app/components/trader/WalletConfigPanel.tsx) - 钱包配置
- [`frontend/app/components/trader/TraderDataImportDialog.tsx`](frontend/app/components/trader/TraderDataImportDialog.tsx) - 数据导入

---

### 1.4 Prompt Templates (`prompt-management`)
**功能**: AI 提示词模板管理

**前端组件文件**:
- [`frontend/app/components/prompt/PromptManager.tsx`](frontend/app/components/prompt/PromptManager.tsx) - 主页面
- [`frontend/app/components/prompt/PromptPreviewDialog.tsx`](frontend/app/components/prompt/PromptPreviewDialog.tsx) - 预览对话框
- [`frontend/app/components/prompt/AiPromptChatModal.tsx`](frontend/app/components/prompt/AiPromptChatModal.tsx) - AI Prompt 聊天

---

### 1.5 Program Trader (`program-trader`)
**功能**: 程序化交易策略

**前端组件文件**:
- [`frontend/app/components/program/ProgramTrader.tsx`](frontend/app/components/program/ProgramTrader.tsx) - 主页面
- [`frontend/app/components/program/AiProgramChatModal.tsx`](frontend/app/components/program/AiProgramChatModal.tsx) - AI 程序聊天
- [`frontend/app/components/program/BacktestModal.tsx`](frontend/app/components/program/BacktestModal.tsx) - 回测对话框
- [`frontend/app/components/program/BindingPreviewRunDialog.tsx`](frontend/app/components/program/BindingPreviewRunDialog.tsx) - 绑定预览

---

### 1.6 Signal System (`signal-management`)
**功能**: 信号生成和管理系统

**前端组件文件**:
- [`frontend/app/components/signal/SignalManager.tsx`](frontend/app/components/signal/SignalManager.tsx) - 主页面
- [`frontend/app/components/signal/SignalPreviewChart.tsx`](frontend/app/components/signal/SignalPreviewChart.tsx) - 信号预览图表
- [`frontend/app/components/signal/AiSignalChatModal.tsx`](frontend/app/components/signal/AiSignalChatModal.tsx) - AI 信号聊天
- [`frontend/app/components/signal/MarketRegimeConfig.tsx`](frontend/app/components/signal/MarketRegimeConfig.tsx) - 市场状态配置

---

### 1.7 Attribution Analysis (`attribution`)
**功能**: 交易归因分析

**前端组件文件**:
- [`frontend/app/components/analytics/AttributionAnalysis.tsx`](frontend/app/components/analytics/AttributionAnalysis.tsx) - 主页面
- [`frontend/app/components/analytics/AiAttributionChatModal.tsx`](frontend/app/components/analytics/AiAttributionChatModal.tsx) - AI 归因聊天
- [`frontend/app/components/analytics/TradeReplayModal.tsx`](frontend/app/components/analytics/TradeReplayModal.tsx) - 交易回放
- [`frontend/app/components/analytics/PromptBacktest.tsx`](frontend/app/components/analytics/PromptBacktest.tsx) - Prompt 回测
- [`frontend/app/components/analytics/BacktestHistoryModal.tsx`](frontend/app/components/analytics/BacktestHistoryModal.tsx) - 回测历史

---

### 1.8 Factor Library (`factor-library`)
**功能**: 因子库和因子分析

**前端组件文件**:
- [`frontend/app/components/factor/FactorLibrary.tsx`](frontend/app/components/factor/FactorLibrary.tsx) - 主页面
- [`frontend/app/components/factor/FactorOverviewTab.tsx`](frontend/app/components/factor/FactorOverviewTab.tsx) - 因子概览
- [`frontend/app/components/factor/FactorEffectivenessTab.tsx`](frontend/app/components/factor/FactorEffectivenessTab.tsx) - 因子有效性

---

### 1.9 Manual Trading (`hyperliquid`)
**功能**: Hyperliquid 手动交易

**前端组件文件**:
- [`frontend/app/components/hyperliquid/HyperliquidPage.tsx`](frontend/app/components/hyperliquid/HyperliquidPage.tsx) - 主页面
- [`frontend/app/components/hyperliquid/HyperliquidView.tsx`](frontend/app/components/hyperliquid/HyperliquidView.tsx) - 交易视图
- [`frontend/app/components/hyperliquid/OrderForm.tsx`](frontend/app/components/hyperliquid/OrderForm.tsx) - 订单表单
- [`frontend/app/components/hyperliquid/PositionsTable.tsx`](frontend/app/components/hyperliquid/PositionsTable.tsx) - 持仓表格
- [`frontend/app/components/hyperliquid/BalanceCard.tsx`](frontend/app/components/hyperliquid/BalanceCard.tsx) - 余额卡片
- [`frontend/app/components/hyperliquid/ConfigPanel.tsx`](frontend/app/components/hyperliquid/ConfigPanel.tsx) - 配置面板
- [`frontend/app/components/hyperliquid/EnvironmentSwitcher.tsx`](frontend/app/components/hyperliquid/EnvironmentSwitcher.tsx) - 环境切换
- [`frontend/app/components/hyperliquid/WalletSelector.tsx`](frontend/app/components/hyperliquid/WalletSelector.tsx) - 钱包选择器
- [`frontend/app/components/hyperliquid/AuthorizationModal.tsx`](frontend/app/components/hyperliquid/AuthorizationModal.tsx) - 授权对话框
- [`frontend/app/components/hyperliquid/AgentWalletUpgradeModal.tsx`](frontend/app/components/hyperliquid/AgentWalletUpgradeModal.tsx) - 钱包升级
- [`frontend/app/components/hyperliquid/ActionSummaryCard.tsx`](frontend/app/components/hyperliquid/ActionSummaryCard.tsx) - 操作汇总
- [`frontend/app/components/hyperliquid/WalletApiUsage.tsx`](frontend/app/components/hyperliquid/WalletApiUsage.tsx) - API 使用
- [`frontend/app/components/hyperliquid/HyperliquidAssetChart.tsx`](frontend/app/components/hyperliquid/HyperliquidAssetChart.tsx) - 资产图表
- [`frontend/app/components/hyperliquid/TradingModeSwitch.tsx`](frontend/app/components/hyperliquid/TradingModeSwitch.tsx) - 交易模式切换

---

### 1.10 K-Line Charts (`klines`)
**功能**: K 线图表和 AI 分析

**前端组件文件**:
- [`frontend/app/components/klines/KlinesView.tsx`](frontend/app/components/klines/KlinesView.tsx) - 主页面
- [`frontend/app/components/klines/TradingViewChart.tsx`](frontend/app/components/klines/TradingViewChart.tsx) - TradingView 图表
- [`frontend/app/components/klines/AIAnalysisPanel.tsx`](frontend/app/components/klines/AIAnalysisPanel.tsx) - AI 分析面板
- [`frontend/app/components/klines/MarketFlowIndicators.tsx`](frontend/app/components/klines/MarketFlowIndicators.tsx) - 市场流指标

---

### 1.11 Premium Features (`premium-features`)
**功能**: 高级功能展示

**前端组件文件**:
- [`frontend/app/components/premium/PremiumFeaturesView.tsx`](frontend/app/components/premium/PremiumFeaturesView.tsx) - 主页面
- [`frontend/app/components/ui/PremiumRequiredModal.tsx`](frontend/app/components/ui/PremiumRequiredModal.tsx) - 高级功能提示

---

### 1.12 System Logs (`system-logs`)
**功能**: 系统日志查看

**前端组件文件**:
- [`frontend/app/components/layout/SystemLogs.tsx`](frontend/app/components/layout/SystemLogs.tsx) - 日志查看器

---

### 1.13 Settings (`settings`)
**功能**: 系统设置

**前端组件文件**:
- [`frontend/app/components/settings/SettingsPage.tsx`](frontend/app/components/settings/SettingsPage.tsx) - 设置页面
- [`frontend/app/components/layout/SettingsDialog.tsx`](frontend/app/components/layout/SettingsDialog.tsx) - 设置对话框
- [`frontend/app/components/settings/DataCoverageHeatmap.tsx`](frontend/app/components/settings/DataCoverageHeatmap.tsx) - 数据覆盖热力图

---

## 2. API 端点及对应文件

### 2.1 用户认证 API (`/api/users`)
**后端路由文件**: [`backend/api/user_routes.py`](backend/api/user_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/users/register` | POST | 用户注册 |
| `/api/users/login` | POST | 用户登录 |
| `/api/users/profile` | GET | 获取用户信息 |

---

### 2.2 账户管理 API (`/api/account`)
**后端路由文件**: [`backend/api/account_routes.py`](backend/api/account_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/account/list` | GET | 获取账户列表 |
| `/api/account/` | POST | 创建账户 |
| `/api/account/{id}` | PUT | 更新账户 |
| `/api/account/{id}` | DELETE | 删除账户 |
| `/api/account/overview` | GET | 账户总览 |
| `/api/account/{id}/strategy` | GET | 获取策略配置 |
| `/api/account/{id}/strategy` | PUT | 更新策略配置 |
| `/api/account/dashboard-visibility` | PATCH | 更新仪表盘可见性 |
| `/api/account/test-llm` | POST | 测试 LLM 连接 |

---

### 2.3 Hyper AI API (`/api/hyper-ai`)
**后端路由文件**: [`backend/api/hyper_ai_routes.py`](backend/api/hyper_ai_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/hyper-ai/providers` | GET | 获取 LLM 提供商列表 |
| `/api/hyper-ai/profile` | GET | 获取 AI 配置文件 |
| `/api/hyper-ai/profile/llm` | POST | 保存 LLM 配置 |
| `/api/hyper-ai/test-connection` | POST | 测试 LLM 连接 |
| `/api/hyper-ai/profile/preferences` | POST | 保存交易偏好 |
| `/api/hyper-ai/conversations` | GET | 获取对话列表 |
| `/api/hyper-ai/conversations` | POST | 创建对话 |
| `/api/hyper-ai/conversations/{id}/messages` | GET | 获取对话消息 |
| `/api/hyper-ai/chat` | POST | 开始聊天 |
| `/api/hyper-ai/skills` | GET | 获取技能列表 |
| `/api/hyper-ai/skills/{name}/toggle` | PUT | 切换技能状态 |
| `/api/hyper-ai/tools` | GET | 获取工具列表 |
| `/api/hyper-ai/tools/{tool_name}/config` | PUT | 保存工具配置 |
| `/api/hyper-ai/tools/{tool_name}/config` | DELETE | 删除工具配置 |

---

### 2.4 Prompt 模板 API (`/api/prompts`)
**后端路由文件**: [`backend/api/prompt_routes.py`](backend/api/prompt_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/prompts` | GET | 获取模板和绑定列表 |
| `/api/prompts/{key}` | PUT | 更新模板 |
| `/api/prompts` | POST | 创建模板 |
| `/api/prompts/{id}/copy` | POST | 复制模板 |
| `/api/prompts/{id}` | DELETE | 删除模板 |
| `/api/prompts/{id}/name` | PATCH | 更新模板名称 |
| `/api/prompts/bindings` | POST | 创建/更新绑定 |
| `/api/prompts/bindings/{id}` | DELETE | 删除绑定 |
| `/api/prompts/variables-reference` | GET | 获取变量参考 |
| `/api/prompts/preview` | POST | 预览提示词 |

---

### 2.5 信号系统 API (`/api/signals`)
**后端路由文件**: [`backend/api/signal_routes.py`](backend/api/signal_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/signals` | GET | 获取信号和信号池列表 |
| `/api/signals/definitions` | POST | 创建信号定义 |
| `/api/signals/definitions/{id}` | PUT | 更新信号定义 |
| `/api/signals/definitions/{id}` | DELETE | 删除信号定义 |
| `/api/signals/pools` | POST | 创建信号池 |
| `/api/signals/pools/{id}` | PUT | 更新信号池 |
| `/api/signals/pools/{id}` | DELETE | 删除信号池 |
| `/api/signals/trigger-logs` | GET | 获取触发日志 |

---

### 2.6 因子系统 API (`/api/factors`)
**后端路由文件**: [`backend/api/factor_routes.py`](backend/api/factor_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/factors/library` | GET | 获取因子库 |
| `/api/factors/values` | GET | 获取因子值 |
| `/api/factors/effectiveness` | GET | 获取因子有效性 |
| `/api/factors/effectiveness/{name}/history` | GET | 获取 IC 趋势 |
| `/api/factors/status` | GET | 获取计算引擎状态 |
| `/api/factors/compute/estimate` | GET | 预估计算时间 |
| `/api/factors/compute` | POST | 手动触发计算 |
| `/api/factors/compute/progress` | GET | 获取计算进度 |

---

### 2.7 分析 API (`/api/analytics`)
**后端路由文件**: [`backend/api/analytics_routes.py`](backend/api/analytics_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/analytics/metrics` | GET | 获取绩效指标 |
| `/api/analytics/data-completeness` | GET | 数据完整性检查 |
| `/api/analytics/trigger-types` | GET | 触发类型分析 |
| `/api/analytics/decision-chat` | GET | AI 决策聊天 |
| `/api/analytics/prompt-performance` | GET | Prompt 性能分析 |

---

### 2.8 Alpha Arena API (`/api/arena`)
**后端路由文件**: [`backend/api/arena_routes.py`](backend/api/arena_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/arena/trades` | GET | 获取聚合交易数据 |
| `/api/arena/update-pnl` | POST | 更新 PnL 数据 |
| `/api/arena/check-pnl-status` | GET | 检查 PnL 同步状态 |

---

### 2.9 K 线数据 API (`/api/klines`)
**后端路由文件**: [`backend/api/kline_routes.py`](backend/api/kline_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/klines` | GET | 获取 K 线数据 |
| `/api/klines/symbols` | GET | 获取交易对列表 |

---

### 2.10 K 线分析 API (`/api/kline-analysis`)
**后端路由文件**: [`backend/api/kline_analysis_routes.py`](backend/api/kline_analysis_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/kline-analysis` | POST | 创建 AI 分析 |
| `/api/kline-analysis` | GET | 获取分析历史 |

---

### 2.11 市场流 API (`/api/market-flow`)
**后端路由文件**: [`backend/api/market_flow_routes.py`](backend/api/market_flow_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/market-flow/indicators` | GET | 获取市场流指标 |

---

### 2.12 市场状态 API (`/api/market-regime`)
**后端路由文件**: [`backend/api/market_regime_routes.py`](backend/api/market_regime_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/market-regime/config` | GET | 获取配置 |
| `/api/market-regime/config` | PUT | 更新配置 |

---

### 2.13 程序交易 API (`/api/programs`)
**后端路由文件**: [`backend/routes/program_routes.py`](backend/routes/program_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/programs` | GET | 获取程序列表 |
| `/api/programs` | POST | 创建程序 |
| `/api/programs/{id}` | PUT | 更新程序 |
| `/api/programs/{id}` | DELETE | 删除程序 |
| `/api/programs/backtest` | POST | 执行回测 |
| `/api/programs/chat` | POST | AI 程序聊天 |

---

### 2.14 Hyperliquid 交易 API (`/api/hyperliquid`)
**后端路由文件**: [`backend/api/hyperliquid_routes.py`](backend/api/hyperliquid_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/hyperliquid/accounts` | GET | 获取账户信息 |
| `/api/hyperliquid/positions` | GET | 获取持仓 |
| `/api/hyperliquid/orders` | POST | 下单 |
| `/api/hyperliquid/orders` | DELETE | 撤单 |
| `/api/hyperliquid/balances` | GET | 获取余额 |
| `/api/hyperliquid/fills` | GET | 获取成交记录 |
| `/api/hyperliquid/authorize` | POST | 授权钱包 |

---

### 2.15 Hyperliquid 操作 API (`/api/hyperliquid/actions`)
**后端路由文件**: [`backend/api/hyperliquid_action_routes.py`](backend/api/hyperliquid_action_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/hyperliquid/actions/*` | POST | 各种交易操作 |

---

### 2.16 币安数据 API (`/api/binance`)
**后端路由文件**: [`backend/api/binance_routes.py`](backend/api/binance_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/binance/symbols` | GET | 获取交易对 |
| `/api/binance/price` | GET | 获取价格 |
| `/api/binance/status` | GET | 获取市场状态 |

---

### 2.17 加密货币 API (`/api/crypto`)
**后端路由文件**: [`backend/api/crypto_routes.py`](backend/api/crypto_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/crypto/symbols` | GET | 获取加密货币列表 |
| `/api/crypto/price/{symbol}` | GET | 获取价格 |
| `/api/crypto/status/{symbol}` | GET | 获取市场状态 |
| `/api/crypto/popular` | GET | 获取热门币种 |

---

### 2.18 订单管理 API (`/api/orders`)
**后端路由文件**: [`backend/api/order_routes.py`](backend/api/order_routes.py)

---

### 2.19 配置管理 API (`/api/config`)
**后端路由文件**: [`backend/api/config_routes.py`](backend/api/config_routes.py)

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/config/check-required` | GET | 检查必要配置 |

---

### 2.20 排名 API (`/api/ranking`)
**后端路由文件**: [`backend/api/ranking_routes.py`](backend/api/ranking_routes.py)

---

### 2.21 系统日志 API (`/api/system-logs`)
**后端路由文件**: [`backend/api/system_log_routes.py`](backend/api/system_log_routes.py)

---

### 2.22 系统 API (`/api/system`)
**后端路由文件**: [`backend/api/system_routes.py`](backend/api/system_routes.py)

---

### 2.23 采样 API (`/api/sampling`)
**后端路由文件**: [`backend/api/sampling_routes.py`](backend/api/sampling_routes.py)

---

### 2.24 交易员数据 API (`/api/trader-data`)
**后端路由文件**: [`backend/api/trader_data_routes.py`](backend/api/trader_routes.py)

---

### 2.25 Prompt 回测 API (`/api/prompt-backtest`)
**后端路由文件**: [`backend/api/prompt_backtest_routes.py`](backend/api/prompt_backtest_routes.py)

---

### 2.26 AI 流 API (`/api/ai-stream`)
**后端路由文件**: [`backend/api/ai_stream_routes.py`](backend/api/ai_stream_routes.py)

---

### 2.27 机器人 API (`/api/bot`)
**后端路由文件**: [`backend/api/bot_routes.py`](backend/api/bot_routes.py)

---

### 2.28 市场数据 API (`/api/market-data`)
**后端路由文件**: [`backend/api/market_data_routes.py`](backend/api/market_data_routes.py)

---

### 2.29 WebSocket API
**后端路由文件**: [`backend/api/ws.py`](backend/api/ws.py)

| 端点 | 功能 |
|------|------|
| `/ws` | 实时数据推送（持仓、订单、交易、AI 决策等） |

---

## 3. 页面与 API 使用关系

### 3.1 Hyper AI 页面
**前端组件**: `frontend/app/components/hyper-ai/HyperAiPage.tsx`

**使用的 API**:
- `GET /api/hyper-ai/profile` - 获取配置状态
- `GET /api/hyper-ai/providers` - 获取 LLM 提供商
- `POST /api/hyper-ai/profile/llm` - 保存 LLM 配置
- `POST /api/hyper-ai/test-connection` - 测试连接
- `POST /api/hyper-ai/profile/preferences` - 保存偏好
- `GET /api/hyper-ai/conversations` - 对话管理
- `POST /api/hyper-ai/chat` - AI 聊天
- `GET /api/hyper-ai/skills` - 技能管理
- `GET /api/hyper-ai/tools` - 工具配置

**后端文件**: [`backend/api/hyper_ai_routes.py`](backend/api/hyper_ai_routes.py)

---

### 3.2 Dashboard 页面
**前端组件**: `frontend/app/components/portfolio/ComprehensiveView.tsx`

**使用的 API**:
- `GET /api/account/overview` - 账户总览
- `GET /api/account/list` - 账户列表
- `GET /api/arena/trades` - 聚合交易数据
- `GET /api/arena/check-pnl-status` - 检查 PnL 状态
- `WebSocket /ws` - 实时数据推送

**后端文件**: 
- [`backend/api/account_routes.py`](backend/api/account_routes.py)
- [`backend/api/arena_routes.py`](backend/api/arena_routes.py)
- [`backend/api/ws.py`](backend/api/ws.py)

---

### 3.3 AI Trader Management 页面
**前端组件**: `frontend/app/components/trader/TraderManagement.tsx`

**使用的 API**:
- `GET /api/account/list` - 获取账户列表
- `POST /api/account/` - 创建账户
- `PUT /api/account/{id}` - 更新/删除账户
- `GET /api/account/{id}/strategy` - 获取/更新策略
- `POST /api/hyperliquid/authorize` - 钱包授权
- `POST /api/trader-data/import` - 数据导入

**后端文件**: 
- [`backend/api/account_routes.py`](backend/api/account_routes.py)
- [`backend/api/hyperliquid_routes.py`](backend/api/hyperliquid_routes.py)
- [`backend/api/trader_data_routes.py`](backend/api/trader_data_routes.py)

---

### 3.4 Prompt Management 页面
**前端组件**: `frontend/app/components/prompt/PromptManager.tsx`

**使用的 API**:
- `GET /api/prompts` - 获取模板列表
- `PUT /api/prompts/{key}` - 更新模板
- `POST /api/prompts` - 创建模板
- `POST /api/prompts/bindings` - 管理绑定
- `POST /api/prompts/preview` - 预览提示词
- `GET /api/prompts/variables-reference` - 变量参考

**后端文件**: [`backend/api/prompt_routes.py`](backend/api/prompt_routes.py)

---

### 3.5 Program Trader 页面
**前端组件**: `frontend/app/components/program/ProgramTrader.tsx`

**使用的 API**:
- `GET /api/programs` - 获取程序列表
- `POST /api/programs/chat` - AI 程序聊天
- `POST /api/programs/backtest` - 执行回测
- `POST /api/prompts/preview` - 绑定预览

**后端文件**: 
- [`backend/routes/program_routes.py`](backend/routes/program_routes.py)
- [`backend/api/prompt_routes.py`](backend/api/prompt_routes.py)

---

### 3.6 Signal Management 页面
**前端组件**: `frontend/app/components/signal/SignalManager.tsx`

**使用的 API**:
- `GET /api/signals` - 获取信号列表
- `POST /api/signals/definitions` - 管理信号定义
- `POST /api/signals/pools` - 管理信号池
- `GET /api/signals/trigger-logs` - 查看触发日志
- `POST /api/signals/chat` - AI 信号聊天

**后端文件**: [`backend/api/signal_routes.py`](backend/api/signal_routes.py)

---

### 3.7 Attribution Analysis 页面
**前端组件**: `frontend/app/components/analytics/AttributionAnalysis.tsx`

**使用的 API**:
- `GET /api/analytics/metrics` - 绩效指标
- `GET /api/analytics/decision-chat` - 归因聊天
- `GET /api/analytics/prompt-performance` - Prompt 性能
- `GET /api/prompt-backtest` - Prompt 回测
- `GET /api/analytics/trade-replay` - 交易回放

**后端文件**: 
- [`backend/api/analytics_routes.py`](backend/api/analytics_routes.py)
- [`backend/api/prompt_backtest_routes.py`](backend/api/prompt_backtest_routes.py)

---

### 3.8 Factor Library 页面
**前端组件**: `frontend/app/components/factor/FactorLibrary.tsx`

**使用的 API**:
- `GET /api/factors/library` - 因子库
- `GET /api/factors/values` - 因子值
- `GET /api/factors/effectiveness` - 因子有效性
- `POST /api/factors/compute` - 触发计算
- `GET /api/factors/compute/progress` - 计算进度

**后端文件**: [`backend/api/factor_routes.py`](backend/api/factor_routes.py)

---

### 3.9 Manual Trading (Hyperliquid) 页面
**前端组件**: `frontend/app/components/hyperliquid/HyperliquidPage.tsx`

**使用的 API**:
- `GET /api/hyperliquid/accounts` - 账户信息
- `GET /api/hyperliquid/positions` - 持仓
- `POST /api/hyperliquid/orders` - 下单/撤单
- `GET /api/hyperliquid/balances` - 余额
- `GET /api/hyperliquid/fills` - 成交记录
- `POST /api/hyperliquid/authorize` - 授权

**后端文件**: [`backend/api/hyperliquid_routes.py`](backend/api/hyperliquid_routes.py)

---

### 3.10 K-Line Charts 页面
**前端组件**: `frontend/app/components/klines/KlinesView.tsx`

**使用的 API**:
- `GET /api/klines` - K 线数据
- `POST /api/kline-analysis` - AI 分析
- `GET /api/market-flow/indicators` - 市场流指标
- `GET /api/crypto/symbols` - 交易对列表

**后端文件**: 
- [`backend/api/kline_routes.py`](backend/api/kline_routes.py)
- [`backend/api/kline_analysis_routes.py`](backend/api/kline_analysis_routes.py)
- [`backend/api/market_flow_routes.py`](backend/api/market_flow_routes.py)
- [`backend/api/crypto_routes.py`](backend/api/crypto_routes.py)

---

### 3.11 Premium Features 页面
**前端组件**: `frontend/app/components/premium/PremiumFeaturesView.tsx`

**使用的 API**:
- 订阅相关 API（待实现）

**后端文件**: 待实现

---

### 3.12 System Logs 页面
**前端组件**: `frontend/app/components/layout/SystemLogs.tsx`

**使用的 API**:
- `GET /api/system-logs` - 日志查询

**后端文件**: [`backend/api/system_log_routes.py`](backend/api/system_log_routes.py)

---

### 3.13 Settings 页面
**前端组件**: `frontend/app/components/settings/SettingsPage.tsx`

**使用的 API**:
- `GET /api/config/check-required` - 检查配置
- `GET /api/market-regime/config` - 市场状态配置
- `GET /api/system` - 系统信息

**后端文件**: 
- [`backend/api/config_routes.py`](backend/api/config_routes.py)
- [`backend/api/market_regime_routes.py`](backend/api/market_regime_routes.py)
- [`backend/api/system_routes.py`](backend/api/system_routes.py)

---

## 4. 核心服务层文件

### 4.1 AI 相关服务
- [`backend/services/hyper_ai_service.py`](backend/services/hyper_ai_service.py) - Hyper AI 核心服务
- [`backend/services/hyper_ai_llm_providers.py`](backend/services/hyper_ai_llm_providers.py) - LLM 提供商管理
- [`backend/services/ai_decision_service.py`](backend/services/ai_decision_service.py) - AI 决策服务
- [`backend/services/ai_signal_generation_service.py`](backend/services/ai_signal_generation_service.py) - AI 信号生成
- [`backend/services/ai_prompt_generation_service.py`](backend/services/ai_prompt_generation_service.py) - AI Prompt 生成
- [`backend/services/ai_program_service.py`](backend/services/ai_program_service.py) - AI 程序服务
- [`backend/services/ai_attribution_service.py`](backend/services/ai_attribution_service.py) - AI 归因服务

### 4.2 交易相关服务
- [`backend/services/auto_trader.py`](backend/services/auto_trader.py) - 自动交易服务
- [`backend/services/trading_strategy.py`](backend/services/trading_strategy.py) - 交易策略
- [`backend/services/hyperliquid_cache.py`](backend/services/hyperliquid_cache.py) - Hyperliquid 缓存
- [`backend/services/exchanges/`](backend/services/exchanges/) - 交易所适配器

### 4.3 数据服务
- [`backend/services/factor_registry.py`](backend/services/factor_registry.py) - 因子注册表
- [`backend/services/factor_expression_engine.py`](backend/services/factor_expression_engine.py) - 因子计算引擎
- [`backend/services/asset_curve_calculator.py`](backend/services/asset_curve_calculator.py) - 资产曲线计算

---

## 5. 数据库相关文件

### 5.1 数据库连接
- [`backend/database/connection.py`](backend/database/connection.py) - PostgreSQL 连接
- [`backend/database/snapshot_connection.py`](backend/database/snapshot_connection.py) - 快照数据库连接

### 5.2 数据模型
- [`backend/database/models.py`](backend/database/models.py) - 主数据库模型
- [`backend/database/snapshot_models.py`](backend/database/snapshot_models.py) - 快照数据库模型

### 5.3 数据仓库
- [`backend/repositories/account_repo.py`](backend/repositories/account_repo.py)
- [`backend/repositories/user_repo.py`](backend/repositories/user_repo.py)
- [`backend/repositories/prompt_repo.py`](backend/repositories/prompt_repo.py)
- [`backend/repositories/strategy_repo.py`](backend/repositories/strategy_repo.py)

### 5.4 数据迁移
- [`backend/database/migrations/`](backend/database/migrations/) - 数据库迁移脚本

---

## 6. 前端核心文件

### 6.1 上下文
- [`frontend/app/contexts/AuthContext.tsx`](frontend/app/contexts/AuthContext.tsx) - 认证上下文
- [`frontend/app/contexts/TradingModeContext.tsx`](frontend/app/contexts/TradingModeContext.tsx) - 交易模式上下文
- [`frontend/app/contexts/ExchangeContext.tsx`](frontend/app/contexts/ExchangeContext.tsx) - 交易所上下文
- [`frontend/app/contexts/ArenaDataContext.tsx`](frontend/app/contexts/ArenaDataContext.tsx) - Arena 数据上下文

### 6.2 API 客户端
- [`frontend/app/lib/api.ts`](frontend/app/lib/api.ts) - API 调用封装
- [`frontend/app/lib/auth.ts`](frontend/app/lib/auth.ts) - 认证相关
- [`frontend/app/lib/hyperliquidApi.ts`](frontend/app/lib/hyperliquidApi.ts) - Hyperliquid API

### 6.3 布局组件
- [`frontend/app/components/layout/Sidebar.tsx`](frontend/app/components/layout/Sidebar.tsx) - 侧边栏
- [`frontend/app/components/layout/Header.tsx`](frontend/app/components/layout/Header.tsx) - 顶部栏

---

## 7. 项目入口文件

### 7.1 后端入口
- [`backend/main.py`](backend/main.py) - FastAPI 应用入口，路由注册

### 7.2 前端入口
- [`frontend/app/main.tsx`](frontend/app/main.tsx) - React 应用入口，路由和状态管理

---

## 8. 技术栈总结

### 后端
- **框架**: FastAPI
- **数据库**: PostgreSQL
- **ORM**: SQLAlchemy
- **AI 集成**: 多 LLM 提供商支持

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 库**: shadcn/ui
- **状态管理**: React Context
- **实时通信**: WebSocket

### 基础设施
- **容器化**: Docker
- **进程管理**: PM2
- **包管理**: pnpm

---

## 9. 项目特点

1. **AI 驱动**: 深度集成 AI 能力，包括 Hyper AI 助手、Prompt 工程、程序化交易
2. **多交易所**: 支持 Hyperliquid 和 Binance
3. **多环境**: Paper Trading、Testnet、Mainnet 隔离
4. **实时性**: WebSocket 实时推送交易数据
5. **模块化**: 清晰的分层架构（路由层 → 服务层 → 数据仓库层 → 数据模型层）
6. **可扩展**: 因子系统、信号系统、Prompt 模板系统高度可配置

---

**文档生成时间**: 2026-03-15
**项目版本**: 基于当前代码库分析
