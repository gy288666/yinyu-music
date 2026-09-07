# 后台管理 - 用户管理接口（Admin User）

**Base URL**: `http://localhost:5090/api/admin/user`

---

## 一、用户列表

### 1. 获取用户列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |
| **优先级** | P2 |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | query | 否 | 关键词（昵称/手机号） |
| status | query | 否 | 状态：0-全部，1-正常，2-禁用 |
| startTime | query | 否 | 注册开始时间（时间戳） |
| endTime | query | 否 | 注册结束时间（时间戳） |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

**请求示例**

```bash
curl -X GET "http://localhost:5090/api/admin/user/list?pageNum=1&pageSize=20&status=1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "userId": "1001",
        "avatar": "http://localhost:5090/static/images/avatars/avatar_001.jpg",
        "nickname": "张三",
        "username": "zhangsan",
        "phone": "138****0000",
        "email": "zhangsan@example.com",
        "vipLevel": 2,
        "status": 1,
        "statusName": "正常",
        "createTime": 1609459200000,
        "lastLoginTime": 1721395200000
      }
    ],
    "total": 1000,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 50
  },
  "timestamp": 1721308800000
}
```

---

### 2. 获取用户详情

| 项目 | 内容 |
|------|------|
| **接口路径** | `/detail/{userId}` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "1001",
    "nickname": "张三",
    "username": "zhangsan",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "gender": 1,
    "birthday": 631152000000,
    "signature": "热爱音乐，热爱生活",
    "avatar": "http://localhost:5090/static/images/avatars/avatar_001.jpg",
    "vipLevel": 2,
    "vipLevelName": "黄金会员",
    "vipExpireTime": 1747152000000,
    "status": 1,
    "createTime": 1609459200000,
    "lastLoginTime": 1721395200000,
    "lastLoginIp": "192.168.1.100",
    "playCount": 12345,
    "likeCount": 567,
    "playlistCount": 10,
    "downloadCount": 89
  },
  "timestamp": 1721308800000
}
```

---

### 3. 禁用/启用用户

| 项目 | 内容 |
|------|------|
| **接口路径** | `/toggle-status/{userId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要（管理员） |

**请求参数**

```json
{
  "status": "number, 必填，1-启用，2-禁用",
  "reason": "string, 禁用时必填，原因说明"
}
```

**响应示例**

```json
{ "code": 200, "message": "操作成功", "data": null, "timestamp": 1721308800000 }
```

---

### 4. 重置用户密码

| 项目 | 内容 |
|------|------|
| **接口路径** | `/reset-password/{userId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{
  "code": 200,
  "message": "重置成功",
  "data": { "newPassword": "abc123456" },
  "timestamp": 1721308800000
}
```

---

## 二、会员管理

### 5. 获取会员列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/vip/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| levelId | query | 否 | 会员等级 ID |
| status | query | 否 | 状态：active/expired/all，默认 all |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "userId": "1001",
        "nickname": "张三",
        "avatar": "http://localhost:5090/static/images/avatars/avatar_001.jpg",
        "levelId": 2,
        "levelName": "黄金会员",
        "startTime": 1715616000000,
        "expireTime": 1747152000000,
        "autoRenew": true,
        "totalSpent": 180
      }
    ],
    "total": 200,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 10
  },
  "timestamp": 1721308800000
}
```

---

### 6. 会员等级配置

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取等级配置 | `GET` | `/admin/user/vip/level-config` |
| 更新等级配置 | `PUT` | `/admin/user/vip/level-config` |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "levelId": 1,
      "name": "普通会员",
      "price": 0,
      "benefits": ["标准音质"],
      "status": 1
    },
    {
      "levelId": 2,
      "name": "黄金会员",
      "price": 15,
      "priceUnit": "元/月",
      "benefits": ["高品质音质", "去除广告", "下载歌曲"],
      "status": 1
    },
    {
      "levelId": 3,
      "name": "铂金会员",
      "price": 30,
      "priceUnit": "元/月",
      "benefits": ["Hi-Res无损", "无限下载", "专属徽章"],
      "status": 1
    }
  ],
  "timestamp": 1721308800000
}
```

---

## 三、用户等级管理

### 7. 获取用户等级规则

| 项目 | 内容 |
|------|------|
| **接口路径** | `/level-rules` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "level": 1,
      "name": "Lv.1 初入乐坛",
      "icon": "http://localhost:5090/static/images/icons/level_1.png",
      "minExp": 0,
      "maxExp": 100,
      "benefits": ["每天 5 次下载"]
    },
    {
      "level": 2,
      "name": "Lv.2 音乐新手",
      "icon": "http://localhost:5090/static/images/icons/level_2.png",
      "minExp": 101,
      "maxExp": 500,
      "benefits": ["每天 10 次下载", "创建歌单（上限 10）"]
    },
    {
      "level": 3,
      "name": "Lv.3 音乐达人",
      "icon": "http://localhost:5090/static/images/icons/level_3.png",
      "minExp": 501,
      "maxExp": 2000,
      "benefits": ["每天 20 次下载", "创建歌单（上限 30）"]
    }
  ],
  "timestamp": 1721308800000
}
```

---

### 8. 更新等级规则

| 项目 | 内容 |
|------|------|
| **接口路径** | `/level-rules` |
| **请求方式** | `PUT` |
| **认证要求** | 需要（管理员） |

---

## 四、用户反馈管理

### 9. 获取反馈列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/feedback/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | query | 否 | 反馈类型：bug/suggestion/complaint/other |
| status | query | 否 | 状态：0-待处理，1-已处理，2-已驳回 |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "feedbackId": "1",
        "userId": "1001",
        "userName": "张三",
        "avatar": "http://localhost:5090/static/images/avatars/avatar_001.jpg",
        "type": "bug",
        "typeName": "问题反馈",
        "content": "播放歌曲时出现卡顿",
        "images": ["http://localhost:5090/static/images/feedback/001.jpg"],
        "status": 0,
        "statusName": "待处理",
        "createTime": 1721308800000,
        "handlerId": null,
        "handlerName": null,
        "handleTime": null,
        "reply": null
      }
    ],
    "total": 50,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 3
  },
  "timestamp": 1721308800000
}
```

---

### 10. 处理反馈

| 项目 | 内容 |
|------|------|
| **接口路径** | `/feedback/handle/{feedbackId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要（管理员） |

**请求参数**

```json
{
  "status": "number, 必填，1-已处理，2-已驳回",
  "reply": "string, 可选，回复内容"
}
```

---

## 接口状态

| 接口 | 状态 |
|------|------|
| 获取用户列表 | 待开发 |
| 获取用户详情 | 待开发 |
| 禁用/启用用户 | 待开发 |
| 重置用户密码 | 待开发 |
| 获取会员列表 | 待开发 |
| 会员等级配置 | 待开发 |
| 获取用户等级规则 | 待开发 |
| 更新等级规则 | 待开发 |
| 获取反馈列表 | 待开发 |
| 处理反馈 | 待开发 |