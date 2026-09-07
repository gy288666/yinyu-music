# 电台接口（Radio）

**Base URL**: `http://localhost:5090/api/radio`

---

## 1. 获取电台分类列表

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/categories` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

无

### 请求示例

```bash
curl -X GET http://localhost:5090/api/radio/categories
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "categoryId": "1",
      "name": "音乐电台",
      "icon": "http://localhost:5090/static/images/icons/radio_music.png",
      "radioCount": 50
    },
    {
      "categoryId": "2",
      "name": "情感电台",
      "icon": "http://localhost:5090/static/images/icons/radio_emotion.png",
      "radioCount": 30
    },
    {
      "categoryId": "3",
      "name": "有声书",
      "icon": "http://localhost:5090/static/images/icons/radio_book.png",
      "radioCount": 40
    },
    {
      "categoryId": "4",
      "name": "儿童故事",
      "icon": "http://localhost:5090/static/images/icons/radio_kids.png",
      "radioCount": 25
    },
    {
      "categoryId": "5",
      "name": "相声小品",
      "icon": "http://localhost:5090/static/images/icons/radio_crosstalk.png",
      "radioCount": 20
    }
  ],
  "timestamp": 1721308800000
}
```

### 错误码

无

---

## 2. 获取电台列表

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/list` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| categoryId | query | 否 | 分类 ID，不传则获取全部 |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

### 请求示例

```bash
# 获取全部电台
curl -X GET "http://localhost:5090/api/radio/list"

# 获取指定分类电台
curl -X GET "http://localhost:5090/api/radio/list?categoryId=1"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "radioId": "1001",
        "name": "深夜情感电台",
        "coverUrl": "http://localhost:5090/static/images/radio/radio_001.jpg",
        "description": "每晚陪你度过漫长深夜",
        "anchor": {
          "anchorId": "5001",
          "name": "主播小明",
          "avatar": "http://localhost:5090/static/images/avatars/anchor_001.jpg"
        },
        "programCount": 150,
        "subCount": 23456,
        "playCount": 567890,
        "categoryName": "情感电台"
      },
      {
        "radioId": "1002",
        "name": "经典音乐汇",
        "coverUrl": "http://localhost:5090/static/images/radio/radio_002.jpg",
        "description": "每天分享一首经典好歌",
        "anchor": {
          "anchorId": "5002",
          "name": "音乐达人",
          "avatar": "http://localhost:5090/static/images/avatars/anchor_002.jpg"
        },
        "programCount": 200,
        "subCount": 45678,
        "playCount": 890123,
        "categoryName": "音乐电台"
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

### 错误码

无

---

## 3. 获取电台详情

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/detail/{radioId}` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| radioId | path | 是 | 电台 ID |

### 请求示例

```bash
curl -X GET http://localhost:5090/api/radio/detail/1001
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "radioId": "1001",
    "name": "深夜情感电台",
    "coverUrl": "http://localhost:5090/static/images/radio/radio_001.jpg",
    "description": "每晚陪你度过漫长深夜，用声音温暖你的心灵",
    "anchor": {
      "anchorId": "5001",
      "name": "主播小明",
      "avatar": "http://localhost:5090/static/images/avatars/anchor_001.jpg",
      "introduction": "资深情感主播，从业 10 年"
    },
    "categoryName": "情感电台",
    "programCount": 150,
    "subCount": 23456,
    "playCount": 567890,
    "isSubed": false,
    "createTime": 1609459200000,
    "programs": [
      {
        "programId": "10001",
        "title": "第 150 期：如何处理失恋的痛苦",
        "description": "本期节目我们聊聊如何走出失恋的阴影",
        "coverUrl": "http://localhost:5090/static/images/radio/program_001.jpg",
        "duration": 1800,
        "playCount": 12345,
        "publishTime": 1721222400000
      },
      {
        "programId": "10002",
        "title": "第 149 期：异地恋能坚持多久",
        "description": "异地恋真的没有好结果吗？",
        "coverUrl": "http://localhost:5090/static/images/radio/program_002.jpg",
        "duration": 1650,
        "playCount": 23456,
        "publishTime": 1721136000000
      }
    ]
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60050 | 电台不存在 |

---

## 4. 获取节目详情

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/program/{programId}` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| programId | path | 是 | 节目 ID |

### 请求示例

```bash
curl -X GET http://localhost:5090/api/radio/program/10001
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "programId": "10001",
    "title": "第 150 期：如何处理失恋的痛苦",
    "description": "本期节目我们聊聊如何走出失恋的阴影，分享一些实用的方法和心得",
    "coverUrl": "http://localhost:5090/static/images/radio/program_001.jpg",
    "playUrl": "http://localhost:5090/static/radio/program_001.mp3",
    "duration": 1800,
    "radio": {
      "radioId": "1001",
      "name": "深夜情感电台",
      "coverUrl": "http://localhost:5090/static/images/radio/radio_001.jpg"
    },
    "anchor": {
      "anchorId": "5001",
      "name": "主播小明",
      "avatar": "http://localhost:5090/static/images/avatars/anchor_001.jpg"
    },
    "playCount": 12345,
    "likeCount": 567,
    "commentCount": 89,
    "publishTime": 1721222400000,
    "isLiked": false
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60051 | 节目不存在 |

---

## 5. 订阅电台

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/subscribe/{radioId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| radioId | path | 是 | 电台 ID |

### 请求示例

```bash
curl -X POST http://localhost:5090/api/radio/subscribe/1001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "订阅成功",
  "data": {
    "subscribed": true,
    "subCount": 23457
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60050 | 电台不存在 |
| 60052 | 已订阅该电台 |

---

## 6. 取消订阅电台

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/unsubscribe/{radioId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求示例

```bash
curl -X POST http://localhost:5090/api/radio/unsubscribe/1001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "取消成功",
  "data": {
    "subscribed": false,
    "subCount": 23456
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60053 | 未订阅该电台 |

---

## 7. 获取我订阅的电台

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/my-subscribe` |
| **请求方式** | `GET` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/radio/my-subscribe?pageSize=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "radioId": "1001",
        "name": "深夜情感电台",
        "coverUrl": "http://localhost:5090/static/images/radio/radio_001.jpg",
        "description": "每晚陪你度过漫长深夜",
        "programCount": 150,
        "subCount": 23456,
        "subTime": 1715616000000
      }
    ],
    "total": 5,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |

---

## 8. 节目点赞

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/program/like/{programId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求示例

```bash
curl -X POST http://localhost:5090/api/radio/program/like/10001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "点赞成功",
  "data": {
    "liked": true,
    "likeCount": 568
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60051 | 节目不存在 |

---

## 接口状态

| 接口 | 状态 | 备注 |
|------|------|------|
| 获取电台分类列表 | 待开发 | - |
| 获取电台列表 | 待开发 | - |
| 获取电台详情 | 待开发 | - |
| 获取节目详情 | 待开发 | - |
| 订阅电台 | 待开发 | - |
| 取消订阅电台 | 待开发 | - |
| 获取我订阅的电台 | 待开发 | - |
| 节目点赞 | 待开发 | - |
