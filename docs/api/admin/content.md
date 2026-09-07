# 后台管理 - 内容管理接口（Admin Content）

**Base URL**: `http://localhost:5090/api/admin/content`

---

## 一、音乐管理

### 1. 获取音乐列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/music/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |
| **优先级** | P2 |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | query | 否 | 关键词搜索 |
| categoryId | query | 否 | 分类 ID |
| status | query | 否 | 状态：0-全部，1-上架，2-下架 |
| artistId | query | 否 | 歌手 ID |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

**请求示例**

```bash
curl -X GET "http://localhost:5090/api/admin/content/music/list?pageNum=1&pageSize=20&status=1" \
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
        "musicId": "1001",
        "title": "若月亮没来（若月亮还没来来）",
        "artistName": "王宇宙 Leto",
        "artistId": "2001",
        "albumName": "若月亮没来",
        "albumId": "3001",
        "categoryName": "流行",
        "duration": 245,
        "fileSize": 3395803,
        "status": 1,
        "statusName": "已上架",
        "playCount": 2345678,
        "uploadTime": 1715702400000,
        "publishTime": 1715616000000
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "timestamp": 1721308800000
}
```

---

### 2. 获取音乐详情（管理端）

| 项目 | 内容 |
|------|------|
| **接口路径** | `/music/detail/{musicId}` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求示例**

```bash
curl -X GET http://localhost:5090/api/admin/content/music/detail/1001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "musicId": "1001",
    "title": "若月亮没来（若月亮还没来来）",
    "artistId": "2001",
    "artistName": "王宇宙 Leto",
    "albumId": "3001",
    "albumName": "若月亮没来",
    "categoryId": "1",
    "categoryName": "流行",
    "duration": 245,
    "filePath": "music/music_036_225800_45s.mp3",
    "fileSize": 3395803,
    "fileFormat": "mp3",
    "bitrate": 128,
    "lyricsPath": null,
    "tags": ["流行", "华语", "情歌"],
    "status": 1,
    "playCount": 2345678,
    "likeCount": 123456,
    "uploadUserId": "1001",
    "uploadUserName": "张三",
    "publishTime": 1715616000000,
    "createTime": 1715702400000,
    "updateTime": 1721308800000,
    "auditRemark": null
  },
  "timestamp": 1721308800000
}
```

---

### 3. 新增音乐

| 项目 | 内容 |
|------|------|
| **接口路径** | `/music/add` |
| **请求方式** | `POST` |
| **认证要求** | 需要（管理员） |

**请求参数（表单）**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 歌曲名称 |
| artistId | string | 是 | 歌手 ID |
| albumId | string | 否 | 专辑 ID |
| categoryId | string | 是 | 分类 ID |
| tags | array | 否 | 标签列表 |
| file | file | 是 | 音频文件（MP3/FLAC/WAV） |
| coverFile | file | 否 | 封面图片 |
| status | number | 否 | 状态：1-上架，2-下架，默认 2 |

**请求示例**

```bash
curl -X POST http://localhost:5090/api/admin/content/music/add \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "title=新歌测试" \
  -F "artistId=2001" \
  -F "categoryId=1" \
  -F "tags=流行" \
  -F "tags=华语" \
  -F "file=@/path/to/song.mp3"
```

**响应示例**

```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "musicId": "1100",
    "title": "新歌测试",
    "artistName": "王宇宙 Leto",
    "duration": 210,
    "filePath": "music/original/2026/07/music_1100.mp3",
    "status": 2,
    "createTime": 1721308800000
  },
  "timestamp": 1721308800000
}
```

---

### 4. 更新音乐

| 项目 | 内容 |
|------|------|
| **接口路径** | `/music/update/{musicId}` |
| **请求方式** | `PUT` |
| **认证要求** | 需要（管理员） |

**请求参数**

```json
{
  "title": "string, 可选，歌曲名称",
  "artistId": "string, 可选，歌手 ID",
  "albumId": "string, 可选，专辑 ID",
  "categoryId": "string, 可选，分类 ID",
  "tags": ["string, 可选，标签列表"],
  "status": "number, 可选，状态：1-上架，2-下架",
  "file": "file, 可选，更新音频文件",
  "coverFile": "file, 可选，更新封面图片"
}
```

**响应示例**

```json
{ "code": 200, "message": "更新成功", "data": null, "timestamp": 1721308800000 }
```

---

### 5. 批量操作音乐

| 项目 | 内容 |
|------|------|
| **接口路径** | `/music/batch` |
| **请求方式** | `POST` |
| **认证要求** | 需要（管理员） |

**请求参数**

```json
{
  "action": "string, 必填，操作：publish/unpublish/delete",
  "musicIds": ["string, 必填，音乐 ID 列表"]
}
```

**响应示例**

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { "successCount": 3, "failCount": 0 },
  "timestamp": 1721308800000
}
```

---

## 二、歌单管理

### 6. 获取歌单列表（管理端）

| 项目 | 内容 |
|------|------|
| **接口路径** | `/playlist/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |
| **优先级** | P2 |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | query | 否 | 关键词搜索 |
| status | query | 否 | 状态：0-全部，1-公开，2-私密 |
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
        "playlistId": "1001",
        "name": "Chill 放松指南",
        "coverUrl": "http://localhost:5090/static/images/playlists/playlist_001.jpg",
        "creatorName": "张三",
        "creatorId": "1001",
        "songCount": 50,
        "playCount": 256000,
        "likeCount": 12300,
        "status": 1,
        "createTime": 1715616000000
      }
    ],
    "total": 100,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 5
  },
  "timestamp": 1721308800000
}
```

---

### 7. 删除歌单（管理端）

| 项目 | 内容 |
|------|------|
| **接口路径** | `/playlist/delete/{playlistId}` |
| **请求方式** | `DELETE` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{ "code": 200, "message": "删除成功", "data": null, "timestamp": 1721308800000 }
```

---

## 三、专辑管理

### 8. 获取专辑列表（管理端）

| 项目 | 内容 |
|------|------|
| **接口路径** | `/album/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | query | 否 | 关键词搜索 |
| artistId | query | 否 | 歌手 ID |
| status | query | 否 | 状态：0-全部，1-已发布，2-未发布 |
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
        "albumId": "3001",
        "name": "若月亮没来",
        "coverUrl": "http://localhost:5090/static/images/albums/album_001.jpg",
        "artistName": "王宇宙 Leto",
        "artistId": "2001",
        "songCount": 10,
        "playCount": 5678901,
        "publishTime": 1715616000000,
        "status": 1,
        "createTime": 1715529600000
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

### 9. 删除专辑

| 项目 | 内容 |
|------|------|
| **接口路径** | `/album/delete/{albumId}` |
| **请求方式** | `DELETE` |
| **认证要求** | 需要（管理员） |

---

## 四、歌手管理

### 10. 获取歌手列表（管理端）

| 项目 | 内容 |
|------|------|
| **接口路径** | `/artist/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | query | 否 | 关键词搜索 |
| status | query | 否 | 状态 |
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
        "artistId": "2001",
        "name": "王宇宙 Leto",
        "avatar": "http://localhost:5090/static/images/artists/artist_001.jpg",
        "gender": 1,
        "region": "中国大陆",
        "songCount": 15,
        "albumCount": 5,
        "fanCount": 123456,
        "status": 1,
        "createTime": 1609459200000
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

### 11. 新增歌手

| 项目 | 内容 |
|------|------|
| **接口路径** | `/artist/add` |
| **请求方式** | `POST` |
| **认证要求** | 需要（管理员） |

**请求参数（表单）**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | string | 是 | 歌手名称 |
| gender | number | 否 | 性别：0-未知，1-男，2-女 |
| region | string | 否 | 地区 |
| description | string | 否 | 简介 |
| avatarFile | file | 否 | 头像图片 |

**响应示例**

```json
{
  "code": 200,
  "message": "添加成功",
  "data": { "artistId": "2050", "name": "新歌手" },
  "timestamp": 1721308800000
}
```

---

### 12. 更新歌手

| 项目 | 内容 |
|------|------|
| **接口路径** | `/artist/update/{artistId}` |
| **请求方式** | `PUT` |
| **认证要求** | 需要（管理员） |

---

### 13. 删除歌手

| 项目 | 内容 |
|------|------|
| **接口路径** | `/artist/delete/{artistId}` |
| **请求方式** | `DELETE` |
| **认证要求** | 需要（管理员） |

---

## 五、分类管理

### 14. 获取分类列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/category/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "categoryId": "1",
      "name": "流行",
      "parentId": null,
      "level": 1,
      "sort": 1,
      "status": 1,
      "songCount": 200
    },
    {
      "categoryId": "2",
      "name": "摇滚",
      "parentId": null,
      "level": 1,
      "sort": 2,
      "status": 1,
      "songCount": 150
    },
    { "categoryId": "3", "name": "民谣", "parentId": null, "level": 1, "sort": 3, "status": 1, "songCount": 120 },
    { "categoryId": "4", "name": "电子", "parentId": null, "level": 1, "sort": 4, "status": 1, "songCount": 80 },
    { "categoryId": "5", "name": "R&B", "parentId": null, "level": 1, "sort": 5, "status": 1, "songCount": 60 },
    { "categoryId": "6", "name": "嘻哈", "parentId": null, "level": 1, "sort": 6, "status": 1, "songCount": 50 }
  ],
  "timestamp": 1721308800000
}
```

---

### 15. 新增/更新/删除分类

| 接口 | 方法 | 路径 |
|------|------|------|
| 新增分类 | `POST` | `/admin/content/category/add` |
| 更新分类 | `PUT` | `/admin/content/category/update/{categoryId}` |
| 删除分类 | `DELETE` | `/admin/content/category/delete/{categoryId}` |

---

## 接口状态

| 接口 | 状态 |
|------|------|
| 获取音乐列表 | 待开发 |
| 获取音乐详情（管理端） | 待开发 |
| 新增音乐 | 待开发 |
| 更新音乐 | 待开发 |
| 批量操作音乐 | 待开发 |
| 获取歌单列表（管理端） | 待开发 |
| 删除歌单（管理端） | 待开发 |
| 获取专辑列表（管理端） | 待开发 |
| 删除专辑 | 待开发 |
| 获取歌手列表（管理端） | 待开发 |
| 新增歌手 | 待开发 |
| 更新歌手 | 待开发 |
| 删除歌手 | 待开发 |
| 获取分类列表 | 待开发 |
| 新增/更新/删除分类 | 待开发 |