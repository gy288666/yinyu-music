# 音域（YINYU）API 接口文档

## 一、接口概览

| 项目 | 内容 |
|------|------|
| **Base URL** | `http://localhost:5090/api` |
| **前端端口** | `5060` |
| **后端端口** | `5090` |
| **数据格式** | `application/json; charset=utf-8` |
| **认证方式** | JWT Bearer Token |

## 二、统一返回格式

### 2.1 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": { ... },
  "timestamp": 1721308800000
}
```

### 2.2 错误响应

```json
{
  "code": 40001,
  "message": "Token 已过期",
  "data": null,
  "timestamp": 1721308800000
}
```

### 2.3 分页响应

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [ ... ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "timestamp": 1721308800000
}
```

## 三、错误码规范

| 错误码 | 说明 |
|--------|------|
| **200** | 成功 |
| **400** | 请求参数错误 |
| **401** | 未授权/Token 无效 |
| **403** | 禁止访问 |
| **404** | 资源不存在 |
| **500** | 服务器内部错误 |

### 业务错误码

| 错误码范围 | 说明 |
|------------|------|
| **40000-40099** | 客户端错误（参数错误、Token 问题等） |
| **50000-50099** | 服务端错误 |
| **60000-60099** | 业务逻辑错误 |

### 详细错误码表

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 不存在 |
| 40002 | Token 已过期 |
| 40003 | Token 无效 |
| 40010 | 参数格式错误 |
| 40011 | 必填参数缺失 |
| 40020 | 文件上传失败 |
| 40021 | 文件类型不支持 |
| 40022 | 文件大小超限 |
| 50001 | 数据库操作失败 |
| 50002 | 文件读写失败 |
| 50003 | 转码任务失败 |
| 60001 | 用户不存在 |
| 60002 | 密码错误 |
| 60003 | 用户已被禁用 |
| 60010 | 音乐资源不存在 |
| 60011 | 音乐已下架 |
| 60020 | 歌单不存在 |
| 60021 | 无权限操作 |
| 60030 | 搜索服务异常 |

## 四、静态资源访问

### 4.1 音频文件

```
http://localhost:5090/static/music/{filename}
```

### 4.2 图片资源

```
http://localhost:5090/static/images/albums/{filename}      # 专辑封面
http://localhost:5090/static/images/artists/{filename}     # 歌手头像
http://localhost:5090/static/images/playlists/{filename}   # 歌单封面
http://localhost:5090/static/images/avatars/{filename}     # 用户头像
http://localhost:5090/static/images/banners/{filename}     # Banner 背景
```

## 五、认证说明

### 5.1 Token 获取

通过登录接口获取 JWT Token：

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password123"
}
```

响应：

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "expiresIn": 7200,
    "userInfo": { ... }
  }
}
```

### 5.2 Token 使用

在请求头中携带 Token：

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5.3 Token 刷新

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

## 六、接口列表

### P0 优先级

| 模块 | 文档 |
|------|------|
| 用户认证 | [auth.md](./auth.md) |
| 音乐播放 | [music.md](./music.md) |

### P1 优先级

| 模块 | 文档 |
|------|------|
| 歌单管理 | [playlist.md](./playlist.md) |
| 搜索功能 | [search.md](./search.md) |

### P2 优先级

| 模块 | 文档 |
|------|------|
| 排行榜 | [rank.md](./rank.md) |
| 电台 | [radio.md](./radio.md) |
| 会员 | [vip.md](./vip.md) |
| 后台管理 - 内容 | [admin/content.md](./admin/content.md) |
| 后台管理 - 用户 | [admin/user.md](./admin/user.md) |
| 后台管理 - 运营 | [admin/operation.md](./admin/operation.md) |

## 七、版本历史

| 版本 | 日期 | 变更内容 |
|------|------|----------|
| v1.0 | 2026-07-18 | 初始版本 |
