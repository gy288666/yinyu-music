# 搜索功能接口（Search）

**Base URL**: `http://localhost:5090/api/search`

---

## 1. 综合搜索

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/search` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | query | 是 | 搜索关键词 |
| type | query | 否 | 搜索类型：all/music/artist/album/playlist，默认 all |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

### 请求示例

```bash
# 综合搜索
curl -X GET "http://localhost:5090/api/search/search?keyword=若月亮没来&type=all"

# 只搜索音乐
curl -X GET "http://localhost:5090/api/search/search?keyword=若月亮没来&type=music"

# 只搜索歌手
curl -X GET "http://localhost:5090/api/search/search?keyword=王宇宙&type=artist"
```

### 响应示例（综合搜索）

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "keyword": "若月亮没来",
    "music": {
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
          "playCount": 2345678
        }
      ],
      "total": 5
    },
    "artist": {
      "list": [
        {
          "artistId": "2001",
          "name": "王宇宙 Leto",
          "avatar": "http://localhost:5090/static/images/artists/artist_001.jpg",
          "songCount": 15,
          "fanCount": 123456
        }
      ],
      "total": 2
    },
    "album": {
      "list": [
        {
          "albumId": "3001",
          "name": "若月亮没来",
          "coverUrl": "http://localhost:5090/static/images/albums/album_001.jpg",
          "artist": "王宇宙 Leto",
          "songCount": 10,
          "publishTime": 1715616000000
        }
      ],
      "total": 1
    },
    "playlist": {
      "list": [],
      "total": 0
    }
  },
  "timestamp": 1721308800000
}
```

### 响应示例（单类型搜索 - 音乐）

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
        "highlight": {
          "title": "<em>若月亮没来</em>（<em>若月亮</em>还没来来）"
        }
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
| 40011 | 必填参数缺失（keyword） |
| 60030 | 搜索服务异常 |

---

## 2. 搜索建议（自动补全）

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/suggest` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | query | 是 | 搜索关键词（至少 2 个字符） |
| limit | query | 否 | 返回数量，默认 10，最大 20 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/search/suggest?keyword=若月&limit=10"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "keyword": "若月",
    "suggestions": [
      {
        "type": "music",
        "text": "若月亮没来",
        "subText": "王宇宙 Leto",
        "musicId": "1001"
      },
      {
        "type": "music",
        "text": "若月亮没来（DJ 版）",
        "subText": "王宇宙 Leto",
        "musicId": "1005"
      },
      {
        "type": "artist",
        "text": "王宇宙 Leto",
        "subText": "歌手",
        "artistId": "2001"
      }
    ],
    "hotQueries": ["还是会想你", "若月亮没来歌词", "王宇宙新歌"]
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40010 | 参数格式错误（keyword 太短） |
| 60030 | 搜索服务异常 |

---

## 3. 热门搜索

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/hot` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | query | 否 | 返回数量，默认 10，最大 50 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/search/hot?limit=10"
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "rank": 1,
      "keyword": "若月亮没来",
      "searchCount": 1234567,
      "trend": "up",
      "icon": "HOT"
    },
    {
      "rank": 2,
      "keyword": "还是会想你",
      "searchCount": 987654,
      "trend": "stable",
      "icon": ""
    },
    {
      "rank": 3,
      "keyword": "周杰伦",
      "searchCount": 876543,
      "trend": "down",
      "icon": ""
    },
    {
      "rank": 4,
      "keyword": "陈奕迅 新歌",
      "searchCount": 765432,
      "trend": "up",
      "icon": "NEW"
    },
    {
      "rank": 5,
      "keyword": "治愈系纯音乐",
      "searchCount": 654321,
      "trend": "up",
      "icon": ""
    }
  ],
  "updateTime": 1721308800000,
  "timestamp": 1721308800000
}
```

### 错误码

无

---

## 4. 搜索历史

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/history` |
| **请求方式** | `GET` |
| **认证要求** | 需要（未登录返回本地历史） |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | query | 否 | 返回数量，默认 20，最大 50 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/search/history?limit=20" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "keyword": "若月亮没来",
      "searchTime": 1721395200000,
      "resultCount": 5
    },
    {
      "keyword": "王宇宙",
      "searchTime": 1721308800000,
      "resultCount": 15
    },
    {
      "keyword": "放松音乐",
      "searchTime": 1721222400000,
      "resultCount": 100
    }
  ],
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |

---

## 5. 清除搜索历史

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/history/clear` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P1 |

### 请求参数

```json
{
  "keyword": "string, 可选，指定清除的关键词，不传则清空全部"
}
```

### 请求示例

```bash
# 清空全部历史
curl -X POST http://localhost:5090/api/search/history/clear \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 清除指定历史
curl -X POST http://localhost:5090/api/search/history/clear \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"keyword": "若月亮没来"}'
```

### 响应示例

```json
{
  "code": 200,
  "message": "清除成功",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |

---

## 6. 高级搜索（按条件筛选）

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/advanced` |
| **请求方式** | `POST` |
| **认证要求** | 不需要 |
| **优先级** | P1 |

### 请求参数

```json
{
  "type": "string, 必填，搜索类型：music/album/playlist",
  "keyword": "string, 可选，关键词",
  "filters": {
    "artistId": "string, 可选，歌手 ID",
    "albumId": "string, 可选，专辑 ID",
    "genre": "string, 可选，音乐类型",
    "tags": ["string, 可选，标签列表"],
    "publishTimeStart": "number, 可选，发布时间起始（时间戳）",
    "publishTimeEnd": "number, 可选，发布时间结束（时间戳）",
    "durationMin": "number, 可选，最小时长（秒）",
    "durationMax": "number, 可选，最大时长（秒）",
    "playCountMin": "number, 可选，最小播放量",
    "hasLyrics": "boolean, 可选，是否有歌词"
  },
  "sort": "string, 可选，排序：relevance/default/playCount/publishTime，默认 relevance",
  "order": "string, 可选，顺序：asc/desc，默认 desc",
  "pageNum": "number, 可选，页码，默认 1",
  "pageSize": "number, 可选，每页数量，默认 20"
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/search/advanced \
  -H "Content-Type: application/json" \
  -d '{
    "type": "music",
    "keyword": "月亮",
    "filters": {
      "genre": "流行",
      "publishTimeStart": 1704067200000,
      "playCountMin": 100000
    },
    "sort": "playCount",
    "order": "desc",
    "pageSize": 20
  }'
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
        "publishTime": 1715616000000
      }
    ],
    "total": 3,
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
| 40011 | 必填参数缺失（type） |
| 40010 | 参数格式错误 |
| 60030 | 搜索服务异常 |

---

## 接口状态

| 接口 | 状态 | 备注 |
|------|------|------|
| 综合搜索 | 待开发 | 初期 MySQL 全文索引，后期 ES |
| 搜索建议 | 待开发 | - |
| 热门搜索 | 待开发 | - |
| 搜索历史 | 待开发 | - |
| 清除历史 | 待开发 | - |
| 高级搜索 | 待开发 | 可选功能 |
