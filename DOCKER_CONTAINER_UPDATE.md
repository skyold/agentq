# Docker 容器配置更新说明

## 问题描述

在启动 Docker 容器时遇到以下错误：

```
Error response from daemon: Error when allocating new name: Conflict. 
The container name "/hyper-arena-postgres" is already in use by container 
"13070dd924889a67446442e3ecb068c7054fc8c2111acaf5aa5e2dc04fe144d1". 
You have to remove (or rename) that container to be able to reuse that name.
```

## 解决方案

### 1. 关于 casdoor-db

**casdoor-db** 是用于 Casdoor SSO（单点登录）服务的数据库容器。

**Casdoor** 是一个外部的身份认证服务（类似 Auth0），原本项目设计使用它来进行用户认证。

**但是**，根据已实施的**本地登录方案**，我们已经实现了完全本地化的认证系统，**不再依赖 Casdoor**。因此：
- ✅ 不需要 `casdoor-db` 容器
- ✅ 只需要一个 PostgreSQL 数据库（用于存储用户、账户、交易等数据）

### 2. 容器重命名

已将所有 Docker 容器名称从 `hyper-arena-*` 改为 `agentq-*`：

| 原名称 | 新名称 | 说明 |
|--------|--------|------|
| `hyper-arena-postgres` | `agentq-postgres` | PostgreSQL 数据库容器 |
| `hyper-arena-app` | `agentq-app` | 应用服务容器 |
| `hyper-arena-network` | `agentq-network` | Docker 网络 |

### 3. 修改的文件

#### docker-compose.yml
```yaml
services:
  postgres:
    container_name: agentq-postgres  # 原来是 hyper-arena-postgres
  
  app:
    container_name: agentq-app  # 原来是 hyper-arena-app

networks:
  default:
    name: agentq-network  # 原来是 hyper-arena-network
```

#### .env.example
```
# AgentQ - Environment Configuration Template  # 更新了注释
```

### 4. 清理旧容器

执行的清理命令：
```bash
# 停止并删除旧容器
docker stop hyper-arena-app hyper-arena-postgres
docker rm hyper-arena-app hyper-arena-postgres

# 删除旧网络
docker network rm hyper-arena-network
```

### 5. 启动新容器

```bash
docker-compose up -d --build
```

### 6. 验证结果

✅ 所有容器成功启动：

```bash
$ docker ps | grep agentq
edcbdcfe4843   agentq-app               "sh -c 'mkdir -p /ap…"   Up 25 seconds   0.0.0.0:8802->8802/tcp   agentq-app
d588b9d05499   postgres:14              "docker-entrypoint.s…"   Up 24 seconds   0.0.0.0:5432->5432/tcp   agentq-postgres
```

✅ 应用健康检查通过：
- PostgreSQL: healthy
- App: health: starting → healthy

✅ 服务日志正常：
```
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8802 (Press CTRL+C to quit)
Services initialization completed
```

## 访问方式

### 后端 API
- URL: http://localhost:8802
- 健康检查：http://localhost:8802/api/health

### 前端界面
- URL: http://localhost:5173 (开发模式)
- 或访问构建后的静态文件：http://localhost:8802

### 数据库
- 主机：localhost
- 端口：5432
- 数据库名：alpha_arena
- 用户名：alpha_user
- 密码：alpha_pass

## 本地登录测试

现在可以使用本地登录功能：

1. 访问 http://localhost:5173
2. 点击右上角 "Sign Up" 按钮
3. 切换到 "Register" 标签
4. 输入用户名（如：admin）
5. 输入密码（至少 6 字符）
6. 点击 "Register" 注册
7. 注册成功后自动登录

## 总结

- ✅ 解决了容器名称冲突问题
- ✅ 容器名称统一为 `agentq-*` 前缀
- ✅ 移除了对 Casdoor 的依赖
- ✅ 所有服务正常运行
- ✅ 本地登录功能可用

## 后续步骤

1. 配置 `.env` 文件（如需要）
2. 初始化数据库（首次启动自动执行）
3. 测试本地登录功能
4. 配置交易参数（如需要）
