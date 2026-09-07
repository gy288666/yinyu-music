# 会员接口（VIP）

**Base URL**: `http://localhost:5090/api/vip`

---

## 1. 获取会员等级列表

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/levels` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

无

### 请求示例

```bash
curl -X GET http://localhost:5090/api/vip/levels
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "levelId": 1,
      "name": "普通会员",
      "price": 0,
      "benefits": [
        "标准音质",
        "基础推荐",
        "收藏歌单（上限 50）"
      ]
    },
    {
      "levelId": 2,
      "name": "黄金会员",
      "price": 15,
      "priceUnit": "元/月",
      "benefits": [
        "高品质音质",
        "个性化推荐",
        "收藏歌单（上限 200）",
        "去除广告",
        "下载歌曲（每月 100 首）"
      ]
    },
    {
      "levelId": 3,
      "name": "铂金会员",
      "price": 30,
      "priceUnit": "元/月",
      "benefits": [
        "Hi-Res 无损音质",
        "专属推荐算法",
        "收藏歌单（无上限）",
        "去除广告",
        "无限下载",
        "专属徽章",
        "抢先体验新功能"
      ]
    }
  ],
  "timestamp": 1721308800000
}
```

### 错误码

无

---

## 2. 获取用户会员信息

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/user-info` |
| **请求方式** | `GET` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求参数

无

### 请求示例

```bash
curl -X GET http://localhost:5090/api/vip/user-info \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "1001",
    "currentLevel": {
      "levelId": 2,
      "name": "黄金会员",
      "startTime": 1715616000000,
      "expireTime": 1747152000000,
      "status": "active",
      "autoRenew": true
    },
    "historyLevels": [
      {
        "levelId": 1,
        "name": "普通会员",
        "startTime": 1609459200000,
        "expireTime": 1715616000000
      }
    ],
    "consumption": {
      "totalSpent": 180,
      "purchaseCount": 12,
      "lastPurchaseTime": 1715616000000
    },
    "nextLevelUpgrade": {
      "targetLevel": 3,
      "targetName": "铂金会员",
      "price": 30,
      "priceUnit": "元/月"
    }
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |

---

## 3. 开通会员

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/subscribe` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求参数

```json
{
  "levelId": "number, 必填，会员等级 ID（2 或 3）",
  "cycle": "string, 必填，付费周期：month/quarter/year",
  "autoRenew": "boolean, 可选，是否自动续费，默认 true",
  "paymentMethod": "string, 必填，支付方式：alipay/wechat/unionpay",
  "couponCode": "string, 可选，优惠券码"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/vip/subscribe \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "levelId": 2,
    "cycle": "month",
    "autoRenew": true,
    "paymentMethod": "alipay"
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "orderId": "ORD20260718001",
    "levelName": "黄金会员",
    "cycle": "month",
    "amount": 15,
    "paymentMethod": "alipay",
    "paymentUrl": "https://pay.example.com/alipay?orderId=ORD20260718001",
    "status": "pending",
    "expireTime": 1747152000000
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 40011 | 必填参数缺失 |
| 60060 | 会员等级无效 |
| 60061 | 支付方式不支持 |
| 60062 | 优惠券无效 |

---

## 4. 取消自动续费

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/cancel-auto-renew` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求参数

无

### 请求示例

```bash
curl -X POST http://localhost:5090/api/vip/cancel-auto-renew \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "已取消自动续费",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60063 | 未开通自动续费 |

---

## 5. 获取会员权益

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/benefits` |
| **请求方式** | `GET` |
| **认证要求** | 需要 |
| **优先级** | P2 |

### 请求参数

无

### 请求示例

```bash
curl -X GET http://localhost:5090/api/vip/benefits \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "currentLevel": "黄金会员",
    "availableBenefits": [
      {
        "key": "high_quality",
        "name": "高品质音质",
        "description": "享受 320kbps 高品质音频",
        "icon": "http://localhost:5090/static/images/icons/vip_quality.png",
        "usage": {
          "used": 50,
          "total": null,
          "unit": "无限"
        }
      },
      {
        "key": "download",
        "name": "下载歌曲",
        "description": "每月可下载 100 首歌曲",
        "icon": "http://localhost:5090/static/images/icons/vip_download.png",
        "usage": {
          "used": 23,
          "total": 100,
          "unit": "首"
        }
      },
      {
        "key": "ad_free",
        "name": "去除广告",
        "description": "享受无广告的音乐体验",
        "icon": "http://localhost:5090/static/images/icons/vip_adfree.png",
        "usage": null
      }
    ]
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |

---

## 6. 获取支付记录

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/payment-history` |
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
curl -X GET "http://localhost:5090/api/vip/payment-history?pageSize=20" \
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
        "orderId": "ORD20260718001",
        "levelName": "黄金会员",
        "cycle": "month",
        "amount": 15,
        "paymentMethod": "alipay",
        "status": "success",
        "payTime": 1721308800000
      },
      {
        "orderId": "ORD20260618001",
        "levelName": "黄金会员",
        "cycle": "month",
        "amount": 15,
        "paymentMethod": "wechat",
        "status": "success",
        "payTime": 1718620800000
      }
    ],
    "total": 12,
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

## 接口状态

| 接口 | 状态 | 备注 |
|------|------|------|
| 获取会员等级列表 | 待开发 | - |
| 获取用户会员信息 | 待开发 | - |
| 开通会员 | 待开发 | 对接第三方支付 |
| 取消自动续费 | 待开发 | - |
| 获取会员权益 | 待开发 | - |
| 获取支付记录 | 待开发 | - |