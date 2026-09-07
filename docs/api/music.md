# 音乐播放接口（Music）

**Base URL**: `http://localhost:5090/api/music`

---

## 1. 获取音乐详情

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/detail/{musicId}` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| musicId | path | 是 | 音乐 ID |

### 请求示例

```bash
curl -X GET http://localhost:5090/api/music/detail/1001
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "musicId": "1001",
    "title": "若月亮没来（若月亮还没来来）",
    "artist": {
      "artistId": "2001",
      "name": "王宇宙 Leto"
    },
    "album": {
      "albumId": "3001",
      "name": "若月亮没来",
      "coverUrl": "http://localhost:5090/static/images/albums/album_001.jpg"
    },
    "duration": 245,
    "playUrl": "http://localhost:5090/static/music/music_036_225800_45s.mp3",
    "quality": "standard",
    "playCount": 2345678,
    "likeCount": 123456,
    "status": 1,
    "publishTime": 1715616000000,
    "createTime": 1715702400000
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60010 | 音乐资源不存在 |
| 60011 | 音乐已下架 |

---

## 2. 获取音乐播放 URL

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/play-url/{musicId}` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| musicId | path | 是 | 音乐 ID |
| quality | query | 否 | 音质：standard/high/lossless，默认 standard |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/music/play-url/1001?quality=standard"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "musicId": "1001",
    "playUrl": "http://localhost:5090/static/music/music_036_225800_45s.mp3",
    "quality": "standard",
    "bitrate": 128,
    "format": "mp3",
    "size": 3395803,
    "duration": 245,
    "expiresIn": 3600
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60010 | 音乐资源不存在 |
| 60011 | 音乐已下架 |
| 60012 | 音质不支持 |

---

## 3. 获取推荐歌单/音乐

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/recommend` |
| **请求方式** | `GET` |
| **认证要求** | 不需要（登录后返回个性化推荐） |
| **优先级** | P0 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | query | 否 | 推荐类型：playlist/music/album，默认 playlist |
| limit | query | 否 | 返回数量，默认 20，最大 50 |

### 请求示例

```bash
# 获取推荐歌单
curl -X GET "http://localhost:5090/api/music/recommend?type=playlist&limit=20"

# 获取推荐音乐（登录后）
curl -X GET "http://localhost:5090/api/music/recommend?type=music" \
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
        "musicId": "1001",
        "title": "若月亮没来（若月亮还没来来）",
        "artist": {
          "artistId": "2001",
          "name": "王宇宙 Leto"
        },
        "album": {
          "albumId": "3001",
          "name": "若月亮没来",
          "coverUrl": "http://localhost:5090/static/images/albums/album_001.jpg"
        },
        "duration": 245,
        "playCount": 2345678,
        "reason": "因为你收藏了相似风格的音乐"
      },
      {
        "musicId": "1002",
        "title": "还是会想你",
        "artist": {
          "artistId": "2002",
          "name": "林达浪/h3R3"
        },
        "album": {
          "albumId": "3002",
          "name": "还是会想你",
          "coverUrl": "http://localhost:5090/static/images/albums/album_002.jpg"
        },
        "duration": 230,
        "playCount": 2123456,
        "reason": "热门歌曲"
      }
    ],
    "hasMore": true
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40010 | 参数格式错误 |

---

## 4. 获取每日推荐

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/daily-recommend` |
| **请求方式** | `GET` |
| **认证要求** | 需要 |
| **优先级** | P0 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date | query | 否 | 日期，格式 YYYY-MM-DD，默认今天 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/music/daily-recommend?date=2026-07-18" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "date": "2026-07-18",
    "list": [
      {
        "musicId": "1001",
        "title": "若月亮没来（若月亮还没来来）",
        "artist": {
          "artistId": "2001",
          "name": "王宇宙 Leto"
        },
        "album": {
          "albumId": "3001",
          "name": "若月亮没来",
          "coverUrl": "http://localhost:5090/static/images/albums/album_001.jpg"
        },
        "duration": 245,
        "reason": "你喜欢的流行风格"
      }
    ],
    "updateTime": 1721308800000
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 40010 | 参数格式错误 |

---

## 5. 上报播放记录

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/play-record` |
| **请求方式** | `POST` |
| **认证要求** | 不需要（登录后记录到用户账号） |
| **优先级** | P0 |

### 请求参数

```json
{
  "musicId": "string, 必填，音乐 ID",
  "source": "string, 可选，播放来源：search/playlist/rank/recommend，默认 direct",
  "duration": "number, 可选，已播放时长（秒），用于判断有效播放"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/music/play-record \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "musicId": "1001",
    "source": "playlist",
    "duration": 120
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60010 | 音乐资源不存在 |

---

## 6. 获取新歌速递

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/new-songs` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | query | 否 | 返回数量，默认 20，最大 50 |
| offset | query | 否 | 偏移量，默认 0 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/music/new-songs?limit=20"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "musicId": "1050",
        "title": "夏日涟漪",
        "artist": {
          "artistId": "2050",
          "name": "陈粒"
        },
        "album": {
          "albumId": "3050",
          "name": "夏日涟漪",
          "coverUrl": "http://localhost:5090/static/images/albums/album_050.jpg"
        },
        "duration": 210,
        "publishTime": 1716134400000,
        "playCount": 123456
      }
    ],
    "total": 100,
    "hasMore": true
  },
  "timestamp": 1721308800000
}
```

### 错误码

无

---

## 7. 批量获取音乐详情

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/details` |
| **请求方式** | `POST` |
| **认证要求** | 不需要 |
| **优先级** | P0 |

### 请求参数

```json
{
  "musicIds": ["string, 必填，音乐 ID 列表"]
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/music/details \
  -H "Content-Type: application/json" \
  -d '{
    "musicIds": ["1001", "1002", "1003"]
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "musicId": "1001",
      "title": "若月亮没来（若月亮还没来来）",
      "artist": {
        "artistId": "2001",
        "name": "王宇宙 Leto"
      },
      "album": {
        "albumId": "3001",
        "name": "若月亮没来",
        "coverUrl": "http://localhost:5090/static/images/albums/album_001.jpg"
      },
      "duration": 245,
      "playCount": 2345678
    },
    {
      "musicId": "1002",
      "title": "还是会想你",
      "artist": {
        "artistId": "2002",
        "name": "林达浪/h3R3"
      },
      "album": {
        "albumId": "3002",
        "name": "还是会想你",
        "coverUrl": "http://localhost:5090/static/images/albums/album_002.jpg"
      },
      "duration": 230,
      "playCount": 2123456
    }
  ],
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40011 | 必填参数缺失 |

---

## 接口状态

| 接口 | 状态 | 备注 |
|------|------|------|
| 获取音乐详情 | 待开发 | - |
| 获取音乐播放 URL | 待开发 | - |
| 获取推荐歌单/音乐 | 待开发 | - |
| 获取每日推荐 | 待开发 | 需登录 |
| 上报播放记录 | 待开发 | - |
| 获取新歌速递 | 待开发 | - |
| 批量获取音乐详情 | 待开发 | - |
