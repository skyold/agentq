# OAuth 登录部署配置指南

## 问题描述

之前的实现使用 `https://account.akooi.com/arena-callback` 作为 OAuth 回调中继，导致部署到服务器后无法登录。原因是：
1. Casdoor 的回调 URL 白名单限制
2. 本地开发和生产环境使用不同的域名

## 解决方案

已将 OAuth 回调改为**直接回调到前端应用的 `/callback` 路径**，支持任意部署域名。

### 代码修改

**修改前：**
```typescript
const redirectUri = `${config.authProvider}/arena-callback?return_to=${window.location.origin}&...`
```

**修改后：**
```typescript
const redirectUri = `${window.location.origin}${config.redirectPath || '/callback'}`
```

## Casdoor 配置步骤

### 1. 登录 Casdoor 管理后台

访问：https://account.akooi.com

### 2. 找到应用配置

1. 进入 "应用管理" (Applications)
2. 找到 `hyper-alpha-arena` 应用（Client ID: `4db5ed37c6d34d03d656`）
3. 点击编辑

### 3. 配置回调 URL 白名单

在 "重定向 URL" (Redirect URLs) 字段中，添加以下回调地址：

**方案 A：使用通配符（推荐）**
```
*/callback
```
或者
```
*
```

**方案 B：添加所有可能的域名（如果 Casdoor 不支持通配符）**
```
http://localhost:8802/callback
http://127.0.0.1:8802/callback
https://your-production-domain.com/callback
https://test.your-domain.com/callback
...（其他可能的域名）
```

### 4. 保存配置

点击 "保存" 按钮使配置生效。

## 前端配置

### auth-config.json

文件位置：`/frontend/public/auth-config.json`

```json
{
  "authProvider": "https://account.akooi.com",
  "clientId": "4db5ed34d03d656",
  "appName": "hyper-alpha-arena",
  "organizationName": "built-in",
  "redirectPath": "/callback"
}
```

**说明：**
- `authProvider`: Casdoor 服务器地址
- `clientId`: 应用 Client ID
- `redirectPath`: OAuth 回调路径（相对于前端应用根路径）

### 部署时的注意事项

1. **确保 `auth-config.json` 可访问**：该文件需要部署到静态资源目录
2. **确保 `/callback` 路由存在**：前端应用需要处理 `/callback` 路径的 OAuth 回调
3. **CORS 配置**：后端 API 需要允许前端域名的跨域请求

## 后端 CORS 配置

在 `backend/main.py` 中已配置 CORS：

```python
_cors_env = os.getenv("CORS_ALLOWED_ORIGINS", "")
_cors_origins = [o.strip() for o in _cors_env.split(",") if o.strip()] if _cors_env else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins if _cors_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 生产环境配置

建议在 `.env` 文件中配置允许的域名：

```env
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

## 测试步骤

### 本地测试

1. 启动开发服务器：
   ```bash
   cd frontend
   pnpm dev
   ```

2. 访问 `http://localhost:8802`
3. 点击登录按钮
4. 验证能否正常登录并回调

### 服务器部署测试

1. 构建并部署前端：
   ```bash
   cd frontend
   pnpm build
   # 将 dist 目录部署到服务器
   ```

2. 访问服务器域名，例如 `https://your-domain.com`
3. 点击登录按钮
4. 验证能否正常登录并回调

## 故障排查

### 问题 1：登录后无法回调

**症状：** 登录成功后页面停留在 Casdoor 或显示错误

**可能原因：**
- Casdoor 回调 URL 白名单未正确配置
- 前端 `/callback` 路由不存在

**解决方法：**
1. 检查 Casdoor 应用配置中的 Redirect URLs
2. 确认前端应用正确处理 `/callback` 路径

### 问题 2：CORS 错误

**症状：** 浏览器控制台显示 CORS 相关错误

**解决方法：**
1. 检查后端 CORS 配置
2. 在生产环境中设置 `CORS_ALLOWED_ORIGINS` 环境变量

### 问题 3：Token 无法获取用户信息

**症状：** 登录后显示 "Unable to get user information"

**可能原因：**
- Token 格式不正确
- Casdoor API 无法访问

**解决方法：**
1. 检查浏览器控制台日志
2. 验证 Casdoor 服务正常运行
3. 检查网络请求中的 Token 是否正确传递

## 安全建议

1. **使用 HTTPS**：生产环境必须使用 HTTPS 协议
2. **配置 CORS 白名单**：不要在生产环境使用 `*` 允许所有域名
3. **定期更新 Token**：使用 refresh_token 机制定期刷新访问令牌
4. **监控登录日志**：记录所有登录尝试，便于发现异常

## 联系支持

如有问题，请检查：
1. 浏览器控制台日志
2. Casdoor 应用日志
3. 后端 API 日志
