# 排行榜接口（Rank）

**Base URL**: `http://localhost:5090/api/rank`

---

## 1. 获取排行榜列表

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/list` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

无

### 请求示例

```bash
curl -X GET http://localhost:5090/api/rank/list
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "rankId": "1",
      "name": "热歌榜",
      "description": "全网播放量最高的歌曲",
      "coverUrl": "http://localhost:5090/static/images/banners/rank_hot.png",
      "updateTime": 1721308800000,
      "songCount": 100
    },
    {
      "rankId": "2",
      "name": "新歌榜",
      "description": "最新发布的热门歌曲",
      "coverUrl": "http://localhost:5090/static/images/banners/rank_new.png",
      "updateTime": 1721308800000,
      "songCount": 100
    },
    {
      "rankId": "3",
      "name": "原创榜",
      "description": "原创音乐人作品排行",
      "coverUrl": "http://localhost:5090/static/images/banners/rank_original.png",
      "updateTime": 1721308800000,
      "songCount": 50
    },
    {
      "rankId": "4",
      "name": "飙升榜",
      "description": "播放量增长最快的歌曲",
      "coverUrl": "http://localhost:5090/static/images/banners/rank_rising.png",
      "updateTime": 1721308800000,
      "songCount": 50
    }
  ],
  "timestamp": 1721308800000
}
```

### 错误码

无

---

## 2. 获取排行榜详情

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/detail/{rankId}` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| rankId | path | 是 | 排行榜 ID |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 50，最大 100 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/rank/detail/1?pageSize=50"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "rankInfo": {
      "rankId": "1",
      "name": "热歌榜",
      "description": "全网播放量最高的歌曲",
      "coverUrl": "http://localhost:5090/static/images/banners/rank_hot.png",
      "updateTime": 1721308800000,
      "songCount": 100
    },
    "list": [
      {
        "rank": 1,
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
        "rankChange": 0,
        "hotValue": 98765
      },
      {
        "rank": 2,
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
        "rankChange": 1,
        "hotValue": 87654
      },
      {
        "rank": 3,
        "musicId": "1003",
        "title": "可能",
        "artist": {
          "artistId": "2003",
          "name": "李柏然同学"
        },
        "album": {
          "albumId": "3003",
          "name": "可能",
          "coverUrl": "http://localhost:5090/static/images/albums/album_003.jpg"
        },
        "duration": 240,
        "playCount": 1987654,
        "rankChange": -1,
        "hotValue": 76543
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 50,
    "totalPages": 2
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60040 | 排行榜不存在 |

---

## 3. 获取歌手榜

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/artist` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | query | 否 | 排序类型：hot/fan/new，默认 hot |
| limit | query | 否 | 返回数量，默认 50，最大 100 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/rank/artist?type=hot&limit=50"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "rank": 1,
      "artistId": "2001",
      "name": "王宇宙 Leto",
      "avatar": "http://localhost:5090/static/images/artists/artist_001.jpg",
      "songCount": 15,
      "fanCount": 234567,
      "playCount": 12345678,
      "rankChange": 0
    },
    {
      "rank": 2,
      "artistId": "2002",
      "name": "林达浪/h3R3",
      "avatar": "http://localhost:5090/static/images/artists/artist_002.jpg",
      "songCount": 12,
      "fanCount": 198765,
      "playCount": 9876543,
      "rankChange": 1
    }
  ],
  "timestamp": 1721308800000
}
```

### 错误码

无

---

## 4. 获取专辑榜

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/album` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P2 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | query | 否 | 排序类型：hot/new，默认 hot |
| limit | query | 否 | 返回数量，默认 50，最大 100 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/rank/album?type=hot&limit=50"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "rank": 1,
      "albumId": "3001",
      "name": "若月亮没来",
      "coverUrl": "http://localhost:5090/static/images/albums/album_001.jpg",
      "artist": {
        "artistId": "2001",
        "name": "王宇宙 Leto"
      },
      "songCount": 10,
      "playCount": 5678901,
      "publishTime": 1715616000000,
      "rankChange": 0
    },
    {
      "rank": 2,
      "albumId": "3002",
      "name": "还是会想你",
      "coverUrl": "http://localhost:5090/static/images/albums/album_002.jpg",
      "artist": {
        "artistId": "2002",
        "name": "林达浪/h3R3"
      },
      "songCount": 8,
      "playCount": 4567890,
      "publishTime": 1713024000000,
      "rankChange": 1
    }
  ],
  "timestamp": 1721308800000
}
```

### 错误码

无

---

## 接口状态

| 接口 | 状态 | 备注 |
|------|------|------|
| 获取排行榜列表 | 待开发 | - |
| 获取排行榜详情 | 待开发 | - |
| 获取歌手榜 | 待开发 | - |
| 获取专辑榜 | 待开发 | - |
