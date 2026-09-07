# 用户认证接口（Auth）

**Base URL**: `http://localhost:5090/api/auth`

---

## 1. 用户注册

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/register` |
| **请求方式** | `POST` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

```json
{
  "username": "string, 必填，用户名，长度 3-20",
  "email": "string, 必填，邮箱，用于登录和找回密码",
  "password": "string, 必填，密码，长度 6-20",
  "nickname": "string, 可选，昵称，默认与用户名相同",
  "avatar": "string, 可选，头像 URL",
  "phone": "string, 可选，手机号",
  "verifyCode": "string, 可选，邮箱验证码（如开启验证）"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "password": "123456",
    "nickname": "张三"
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "userId": "1001",
    "username": "zhangsan",
    "email": "zhangsan@example.com",
    "nickname": "张三",
    "avatar": null,
    "createTime": 1721308800000
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40010 | 参数格式错误 |
| 40011 | 必填参数缺失 |
| 60004 | 用户名已存在 |
| 60005 | 邮箱已注册 |
| 60006 | 验证码错误 |

---

## 2. 用户登录

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/login` |
| **请求方式** | `POST` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

```json
{
  "loginType": "string, 必填，登录方式：PASSWORD/SMS/EMAIL",
  "account": "string, 必填，登录账号（用户名/邮箱/手机号）",
  "password": "string, 可选，密码（PASSWORD 方式必填）",
  "verifyCode": "string, 可选，验证码（SMS/EMAIL 方式必填）",
  "captcha": "string, 可选，图形验证码（连续失败后需要）"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "loginType": "PASSWORD",
    "account": "zhangsan",
    "password": "123456"
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAxIiwiZXhwIjoxNzIxMzE2MDAwfQ.xxx",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4uLi4=",
    "expiresIn": 7200,
    "userInfo": {
      "userId": "1001",
      "username": "zhangsan",
      "nickname": "张三",
      "avatar": "http://localhost:5090/static/images/avatars/default.png",
      "email": "zhangsan@example.com",
      "phone": "138****0000",
      "vipLevel": 0,
      "vipExpireTime": null
    }
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60001 | 用户不存在 |
| 60002 | 密码错误 |
| 60003 | 用户已被禁用 |
| 60006 | 验证码错误 |
| 60007 | 验证码已过期 |

---

## 3. 退出登录

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/logout` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P0 |

### 请求参数

无

### 请求示例

```bash
curl -X POST http://localhost:5090/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "退出成功",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 不存在 |
| 40002 | Token 已过期 |

---

## 4. 刷新 Token

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/refresh` |
| **请求方式** | `POST` |
| **认证要求** | 不需要（需要 refreshToken） |
| **优先级** | P0 |

### 请求参数

```json
{
  "refreshToken": "string, 必填，刷新令牌"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4uLi4="
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDAxIiwiZXhwIjoxNzIxMzIzMjAwfQ.yyy",
    "refreshToken": "bmV3IHJlZnJlc2ggdG9rZW4uLi4=",
    "expiresIn": 7200
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40003 | RefreshToken 无效 |
| 40004 | RefreshToken 已过期 |
| 60001 | 用户不存在 |

---

## 5. 获取验证码

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/captcha` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 验证码类型：IMAGE/SMS/EMAIL |
| account | string | 否 | 账号（短信/邮件验证时需要） |

### 请求示例

```bash
# 获取图形验证码
curl -X GET "http://localhost:5090/api/auth/captcha?type=IMAGE"

# 获取短信验证码
curl -X GET "http://localhost:5090/api/auth/captcha?type=SMS&account=13800138000"

# 获取邮件验证码
curl -X GET "http://localhost:5090/api/auth/captcha?type=EMAIL&account=user@example.com"
```

### 响应示例（图形验证码）

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "captchaId": "uuid-xxx-xxx",
    "captchaImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
  },
  "timestamp": 1721308800000
}
```

### 响应示例（短信/邮件验证码）

```json
{
  "code": 200,
  "message": "验证码已发送",
  "data": {
    "expireIn": 300
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40010 | 参数格式错误 |
| 60008 | 发送频率过高 |
| 60009 | 账号不存在 |

---

## 6. 找回密码

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/reset-password` |
| **请求方式** | `POST` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

```json
{
  "email": "string, 必填，注册邮箱",
  "verifyCode": "string, 必填，邮箱验证码",
  "newPassword": "string, 必填，新密码，长度 6-20"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "zhangsan@example.com",
    "verifyCode": "123456",
    "newPassword": "newpassword123"
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "密码重置成功",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60001 | 用户不存在 |
| 60006 | 验证码错误 |
| 60007 | 验证码已过期 |

---

## 7. 修改密码（已登录）

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/change-password` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P0 |

### 请求参数

```json
{
  "oldPassword": "string, 必填，原密码",
  "newPassword": "string, 必填，新密码，长度 6-20"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "oldPassword": "oldpassword123",
    "newPassword": "newpassword123"
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "密码修改成功",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60002 | 原密码错误 |
| 60010 | 新密码不能与原密码相同 |

---

## 8. 获取当前用户信息

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/userinfo` |
| **请求方式** | `GET` |
| **认证要求** | 需要 |
| **优先级** | P0 |

### 请求参数

无

### 请求示例

```bash
curl -X GET http://localhost:5090/api/auth/userinfo \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "1001",
    "username": "zhangsan",
    "nickname": "张三",
    "avatar": "http://localhost:5090/static/images/avatars/avatar_001.jpg",
    "email": "zhangsan@example.com",
    "phone": "138****0000",
    "gender": 1,
    "birthday": null,
    "signature": "热爱音乐，热爱生活",
    "vipLevel": 2,
    "vipExpireTime": 1752844800000,
    "createTime": 1721308800000,
    "lastLoginTime": 1721395200000
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60001 | 用户不存在 |

---

## 接口状态

| 接口 | 状态 | 备注 |
|------|------|------|
| 用户注册 | 待开发 | - |
| 用户登录 | 待开发 | - |
| 退出登录 | 待开发 | - |
| 刷新 Token | 待开发 | - |
| 获取验证码 | 待开发 | - |
| 找回密码 | 待开发 | - |
| 修改密码 | 待开发 | - |
| 获取用户信息 | 待开发 | - |
