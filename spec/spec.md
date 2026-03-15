# 本地登录方案规范文档

## 1. 当前登录方式分析

### 1.1 现有认证架构

当前系统采用 **Casdoor SSO（单点登录）** 作为主要认证方式：

```
用户浏览器 → Casdoor (https://account.akooi.com) → 回调到应用 → JWT Token 认证
```

#### 核心组件：

1. **前端认证流程** (`frontend/app/lib/auth.ts`)
   - 使用 OAuth 2.0 + PKCE 流程
   - 依赖外部 Casdoor 服务：`https://account.akooi.com`
   - Token 存储在 cookies 中：`arena_token`, `arena_refresh_token`
   - 通过 `www.akooi.com/api/arena-refresh` 刷新 token

2. **认证上下文** (`frontend/app/contexts/AuthContext.tsx`)
   - 管理用户状态和 membership 信息
   - 自动刷新 token（过期前 5 分钟）
   - 同步 membership 到本地数据库

3. **后端用户系统** (`backend/api/user_routes.py`)
   - 支持本地用户注册/登录（未启用）
   - 使用 `UserAuthSession` 表管理会话
   - 会话有效期 180 天
   - 通过 `session_token` 验证用户

4. **数据库模型** (`backend/database/models.py`)
   ```python
   class User(Base):
       # 用户表
       id, username, email, password_hash, is_active
   
   class UserAuthSession(Base):
       # 会话表
       id, user_id, session_token, expires_at
   ```

### 1.2 当前问题

1. **依赖外部服务**：必须有 Casdoor 服务才能登录
2. **跨域问题**：本地开发需要处理跨域认证
3. **部署复杂**：需要配置多个外部服务（Casdoor + www.akooi.com）
4. **无法完全离线**：token 刷新需要访问外部服务器

## 2. 本地登录方案设计

### 2.1 设计目标

- ✅ 完全本地化：不依赖任何外部认证服务
- ✅ 简单部署：开箱即用，无需复杂配置
- ✅ 安全可靠：使用成熟的密码哈希和会话管理
- ✅ 向后兼容：保留现有 SSO 登录能力（可选）
- ✅ 用户友好：简洁的登录/注册界面

### 2.2 认证流程

```
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│   用户输入   │      │  后端验证    │      │  创建会话    │
│ 用户名密码  │ ──→  │  密码哈希    │ ──→  │  返回 token  │
└─────────────┘      └──────────────┘      └──────────────┘
                              ↓
                      ┌──────────────┐
                      │  本地数据库  │
                      │  存储会话    │
                      └──────────────┘
```

### 2.3 技术选型

1. **密码哈希**：bcrypt（比 SHA256 更安全）
2. **会话管理**：继续使用 `UserAuthSession` 表
3. **Token 格式**：保持现有 session_token 格式
4. **前端存储**：Cookies（同现有方案）

## 3. 实现方案

### 3.1 后端改动

#### 3.1.1 增强密码安全（使用 bcrypt）

```python
# backend/repositories/user_repo.py
import bcrypt

def _hash_password(password: str) -> str:
    """使用 bcrypt 哈希密码"""
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def verify_user_password(db: Session, user_id: int, password: str) -> bool:
    """验证用户密码"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.password_hash:
        return False
    
    return bcrypt.checkpw(password.encode(), user.password_hash.encode())
```

#### 3.1.2 启用登录注册接口

```python
# backend/api/user_routes.py

@router.post("/register", response_model=UserAuthResponse)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """用户注册并自动登录"""
    try:
        # 检查用户名是否存在
        existing = get_user_by_username(db, user_data.username)
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # 创建新用户
        user = create_user(
            db=db,
            username=user_data.username,
            email=user_data.email,
            password=user_data.password
        )
        
        # 创建会话
        session = create_auth_session(db, user.id)
        
        return UserAuthResponse(
            user=UserOut(
                id=user.id,
                username=user.username,
                email=user.email,
                is_active=user.is_active == "true"
            ),
            session_token=session.session_token,
            expires_at=session.expires_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User registration failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@router.post("/login", response_model=UserAuthResponse)
async def login_user(login_data: UserLogin, db: Session = Depends(get_db)):
    """用户登录"""
    try:
        # 查找用户
        user = get_user_by_username(db, login_data.username)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # 验证密码
        if not verify_user_password(db, user.id, login_data.password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # 创建会话
        session = create_auth_session(db, user.id)
        
        return UserAuthResponse(
            user=UserOut(
                id=user.id,
                username=user.username,
                email=user.email,
                is_active=user.is_active == "true"
            ),
            session_token=session.session_token,
            expires_at=session.expires_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"User login failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")


@router.post("/logout")
async def logout_user(session_token: str, db: Session = Depends(get_db)):
    """用户登出"""
    try:
        revoke_auth_session(db, session_token)
        return {"status": "success", "message": "Logged out successfully"}
    except Exception as e:
        logger.error(f"User logout failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")
```

#### 3.1.3 添加依赖

```toml
# backend/pyproject.toml
[project]
dependencies = [
    # ... existing dependencies
    "bcrypt>=4.0.0",
]
```

### 3.2 前端改动

#### 3.2.1 创建登录/注册组件

```tsx
// frontend/app/components/auth/LoginDialog.tsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'react-hot-toast'
import { loginUser, registerUser } from '@/lib/api'

interface LoginDialogProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (sessionToken: string) => void
}

export default function LoginDialog({ isOpen, onClose, onLoginSuccess }: LoginDialogProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let response
      if (isLogin) {
        response = await loginUser(username, password)
      } else {
        response = await registerUser(username, email, password)
      }

      // 保存 session_token 到 cookie
      Cookies.set('session_token', response.session_token, { expires: 7 })
      
      toast.success(isLogin ? 'Login successful!' : 'Registration successful!')
      onLoginSuccess(response.session_token)
      onClose()
    } catch (error) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 w-80 max-w-sm mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {isLogin ? 'Login' : 'Register'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
            </Button>
          </div>

          <div className="text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary hover:underline"
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
```

#### 3.2.2 修改认证上下文

```tsx
// frontend/app/contexts/AuthContext.tsx
// 添加本地登录支持

interface AuthContextType {
  user: User | null
  loading: boolean
  authEnabled: boolean
  // ... existing fields
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // ... existing state

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await loginUser(username, password)
      
      Cookies.set('session_token', response.session_token, { expires: 7 })
      setUser(response.user)
      Cookies.set('arena_user', JSON.stringify(response.user), { expires: 7 })
      
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await registerUser(username, email, password)
      
      Cookies.set('session_token', response.session_token, { expires: 7 })
      setUser(response.user)
      Cookies.set('arena_user', JSON.stringify(response.user), { expires: 7 })
      
      return true
    } catch (error) {
      console.error('Registration failed:', error)
      return false
    }
  }

  const logout = async () => {
    // 清除本地会话
    try {
      const sessionToken = Cookies.get('session_token')
      if (sessionToken) {
        await fetch('/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_token: sessionToken }),
        })
      }
    } catch (e) {
      console.warn('Failed to clear backend session:', e)
    }

    // 清除所有 cookies
    Cookies.remove('session_token')
    Cookies.remove('arena_token')
    Cookies.remove('arena_refresh_token')
    Cookies.remove('arena_user')
    setUser(null)
    setMembership(null)

    // 清除刷新定时器
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }

    // 刷新页面
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authEnabled,
      membership,
      membershipLoading,
      setUser,
      logout,
      login,      // 新增
      register,   // 新增
      refreshMembership
    }}>
      {children}
    </AuthContext.Provider>
  )
}
```

#### 3.2.3 修改 Header 组件

```tsx
// frontend/app/components/layout/Header.tsx
// 添加登录/注册按钮（未登录时）

const { user, login, logout, authEnabled } = useAuth()
const [showLoginDialog, setShowLoginDialog] = useState(false)

if (!user) {
  return (
    <Button onClick={() => setShowLoginDialog(true)}>
      Login / Register
    </Button>
  )
}

return (
  <div className="flex items-center gap-4">
    <span>{user.username}</span>
    <Button variant="outline" onClick={logout}>
      Logout
    </Button>
  </div>
)
```

#### 3.2.4 更新 API 客户端

```typescript
// frontend/app/lib/api.ts

export interface UserRegister {
  username: string
  email?: string
  password: string
}

export async function registerUser(
  username: string, 
  email: string, 
  password: string
): Promise<UserAuthResponse> {
  const response = await apiRequest('/users/register', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
  return response.json()
}

// 修改现有登录函数
export async function loginUser(username: string, password: string): Promise<UserAuthResponse> {
  const response = await apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  return response.json()
}
```

### 3.3 数据库迁移

创建默认管理员用户（可选）：

```python
# backend/database/init_postgresql.py

def initialize_default_user(db: Session):
    """创建默认管理员用户（如果不存在）"""
    default_user = get_user_by_username(db, "admin")
    if not default_user:
        default_user = create_user(
            db=db,
            username="admin",
            email="admin@localhost",
            password="admin123"  # 首次登录后应修改
        )
        print(f"Created default admin user: admin (password: admin123)")
```

## 4. 迁移策略

### 4.1 向后兼容

保留现有 Casdoor SSO 登录作为可选方案：

```tsx
// frontend/app/components/auth/LoginDialog.tsx

<div className="mt-4 border-t pt-4">
  <p className="text-sm text-center text-muted-foreground mb-2">
    Or continue with
  </p>
  <Button
    variant="outline"
    className="w-full"
    onClick={handleCasdoorLogin}
  >
    Login with Casdoor SSO
  </Button>
</div>
```

### 4.2 配置选项

添加环境变量控制认证方式：

```bash
# backend/.env

# 认证模式：local | casdoor | both
AUTH_MODE=local

# Casdoor 配置（仅在 AUTH_MODE=casdoor 或 both 时需要）
CASDOOR_URL=https://account.akooi.com
CASDOOR_CLIENT_ID=4db5ed37c6d34d03d656
```

## 5. 安全考虑

### 5.1 密码策略

- 最小长度：6 字符（可配置）
- 推荐使用：大小写字母 + 数字组合
- 密码哈希：bcrypt（cost=12）

### 5.2 会话安全

- 会话有效期：180 天（可配置）
- Session Token：加密随机字符串（32 字节）
- 支持多设备登录
- 登出时销毁会话

### 5.3 防止攻击

- 登录失败限制：连续失败 5 次后锁定 15 分钟
- SQL 注入防护：使用 SQLAlchemy ORM
- XSS 防护：React 自动转义
- CSRF 防护：使用 session token 验证

## 6. 测试计划

### 6.1 单元测试

- [ ] 密码哈希函数测试
- [ ] 用户注册流程测试
- [ ] 用户登录流程测试
- [ ] 会话验证测试
- [ ] 登出流程测试

### 6.2 集成测试

- [ ] 前端登录表单提交
- [ ] Token 存储和读取
- [ ] 受保护路由访问
- [ ] 会话过期处理
- [ ] 多设备登录场景

### 6.3 安全测试

- [ ] 密码强度验证
- [ ] 暴力破解防护
- [ ] SQL 注入测试
- [ ] XSS 攻击测试
- [ ] CSRF 攻击测试

## 7. 部署指南

### 7.1 本地开发

```bash
# 1. 安装依赖
cd backend
pip install -e .

# 2. 初始化数据库
python -m database.init_postgresql

# 3. 启动后端
uvicorn main:app --reload

# 4. 启动前端
cd frontend
pnpm install
pnpm dev
```

### 7.2 生产部署

```bash
# Docker 部署
docker-compose up -d

# 默认管理员账户
用户名：admin
密码：admin123（首次登录后修改）
```

## 8. 用户文档

### 8.1 首次使用

1. 访问应用首页
2. 点击 "Login / Register"
3. 选择 "Register" 创建账户
4. 输入用户名和密码
5. 注册成功后自动登录

### 8.2 日常使用

- 登录：输入用户名和密码
- 登出：点击右上角用户名旁的 "Logout"
- 修改密码：在设置页面修改（待实现）

## 9. 后续优化

### 9.1 短期（v1.1）

- [ ] 密码重置功能（邮件验证）
- [ ] 邮箱验证
- [ ] 双因素认证（2FA）
- [ ] 登录历史记录

### 9.2 中期（v1.2）

- [ ] 用户角色系统（管理员/普通用户）
- [ ] 权限控制
- [ ] OAuth 集成（Google/GitHub）
- [ ] 会话管理界面

### 9.3 长期（v2.0）

- [ ] LDAP/AD 集成
- [ ] SAML SSO
- [ ] 审计日志
- [ ] 合规性认证（SOC2 等）

## 10. 总结

本方案实现了完全本地化的登录认证系统，具有以下优势：

✅ **独立性**：不依赖任何外部认证服务
✅ **简单性**：部署简单，开箱即用
✅ **安全性**：使用行业标准的 bcrypt 密码哈希
✅ **兼容性**：保留现有 SSO 登录能力
✅ **可扩展**：支持后续功能增强

通过本方案，用户可以在完全离线的环境下部署和使用系统，同时保持灵活的认证选项。
