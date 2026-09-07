# 歌单管理接口（Playlist）

**Base URL**: `http://localhost:5090/api/playlist`

---

## 1. 获取歌单详情

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/detail/{playlistId}` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| playlistId | path | 是 | 歌单 ID |

### 请求示例

```bash
curl -X GET http://localhost:5090/api/playlist/detail/1001
```

### 响应示例

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "playlistId": "1001",
    "name": "Chill 放松指南",
    "coverUrl": "http://localhost:5090/static/images/playlists/playlist_001.jpg",
    "description": "适合放松、冥想、阅读时听的轻柔音乐",
    "tags": ["放松", "治愈", "纯音乐"],
    "creator": {
      "userId": "1001",
      "nickname": "张三",
      "avatar": "http://localhost:5090/static/images/avatars/avatar_001.jpg"
    },
    "songCount": 50,
    "playCount": 256000,
    "likeCount": 12300,
    "shareCount": 560,
    "isPublic": true,
    "createTime": 1715616000000,
    "updateTime": 1721308800000,
    "songs": [
      {
        "musicId": "1001",
        "title": "若月亮没来（若月亮还没来来）",
        "artist": {
          "artistId": "2001",
          "name": "王宇宙 Leto"
        },
        "duration": 245,
        "addedTime": 1721308800000
      },
      {
        "musicId": "1002",
        "title": "还是会想你",
        "artist": {
          "artistId": "2002",
          "name": "林达浪/h3R3"
        },
        "duration": 230,
        "addedTime": 1721222400000
      }
    ]
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 60020 | 歌单不存在 |
| 60021 | 无权限查看（私密歌单） |

---

## 2. 创建歌单

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/create` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P1 |

### 请求参数

```json
{
  "name": "string, 必填，歌单名称，长度 1-50",
  "description": "string, 可选，歌单描述，长度 0-500",
  "tags": ["string, 可选，标签列表，最多 5 个"],
  "isPublic": "boolean, 可选，是否公开，默认 true",
  "coverFile": "file, 可选，封面图片文件（表单上传）"
}
```

### 请求示例

```bash
# JSON 方式（封面使用默认图）
curl -X POST http://localhost:5090/api/playlist/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "我的私藏歌单",
    "description": "个人收藏的好听音乐",
    "tags": ["流行", "华语"],
    "isPublic": false
  }'

# 表单上传（带封面）
curl -X POST http://localhost:5090/api/playlist/create \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "name=我的私藏歌单" \
  -F "description=个人收藏的好听音乐" \
  -F "tags=流行" \
  -F "tags=华语" \
  -F "isPublic=false" \
  -F "coverFile=@/path/to/cover.jpg"
```

### 响应示例

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "playlistId": "1002",
    "name": "我的私藏歌单",
    "coverUrl": "http://localhost:5090/static/images/playlists/playlist_018.jpg",
    "createTime": 1721308800000
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 40010 | 参数格式错误 |
| 40020 | 文件上传失败 |
| 40022 | 文件大小超限 |
| 60030 | 歌单数量已达上限 |

---

## 3. 更新歌单

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/update/{playlistId}` |
| **请求方式** | `PUT` |
| **认证要求** | 需要（仅限创建者） |
| **优先级** | P1 |

### 请求参数

```json
{
  "name": "string, 可选，歌单名称",
  "description": "string, 可选，歌单描述",
  "tags": ["string, 可选，标签列表"],
  "isPublic": "boolean, 可选，是否公开",
  "coverFile": "file, 可选，封面图片文件"
}
```

### 请求示例

```bash
curl -X PUT http://localhost:5090/api/playlist/update/1001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Chill 放松指南（更新版）",
    "description": "全新升级的放松歌单"
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "更新成功",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60020 | 歌单不存在 |
| 60021 | 无权限操作（非创建者） |

---

## 4. 删除歌单

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/delete/{playlistId}` |
| **请求方式** | `DELETE` |
| **认证要求** | 需要（仅限创建者） |
| **优先级** | P1 |

### 请求参数

无

### 请求示例

```bash
curl -X DELETE http://localhost:5090/api/playlist/delete/1001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60020 | 歌单不存在 |
| 60021 | 无权限操作 |

---

## 5. 添加歌曲到歌单

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/add-song` |
| **请求方式** | `POST` |
| **认证要求** | 需要（仅限创建者） |
| **优先级** | P1 |

### 请求参数

```json
{
  "playlistId": "string, 必填，歌单 ID",
  "musicIds": ["string, 必填，音乐 ID 列表"]
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/playlist/add-song \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "playlistId": "1001",
    "musicIds": ["1001", "1002", "1003"]
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "添加成功",
  "data": {
    "addedCount": 3,
    "skippedCount": 0
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 40011 | 必填参数缺失 |
| 60020 | 歌单不存在 |
| 60021 | 无权限操作 |
| 60010 | 音乐资源不存在 |

---

## 6. 从歌单移除歌曲

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/remove-song` |
| **请求方式** | `POST` |
| **认证要求** | 需要（仅限创建者） |
| **优先级** | P1 |

### 请求参数

```json
{
  "playlistId": "string, 必填，歌单 ID",
  "musicIds": ["string, 必填，音乐 ID 列表"]
}
```

### 请求示例

```bash
curl -X POST http://localhost:5090/api/playlist/remove-song \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "playlistId": "1001",
    "musicIds": ["1001"]
  }'
```

### 响应示例

```json
{
  "code": 200,
  "message": "移除成功",
  "data": null,
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60020 | 歌单不存在 |
| 60021 | 无权限操作 |

---

## 7. 收藏歌单

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/like/{playlistId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| playlistId | path | 是 | 歌单 ID |

### 请求示例

```bash
curl -X POST http://localhost:5090/api/playlist/like/1001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "收藏成功",
  "data": {
    "liked": true,
    "likeCount": 12301
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60020 | 歌单不存在 |
| 60031 | 已收藏过该歌单 |

---

## 8. 取消收藏歌单

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/unlike/{playlistId}` |
| **请求方式** | `POST` |
| **认证要求** | 需要 |
| **优先级** | P1 |

### 请求示例

```bash
curl -X POST http://localhost:5090/api/playlist/unlike/1001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 响应示例

```json
{
  "code": 200,
  "message": "取消成功",
  "data": {
    "liked": false,
    "likeCount": 12300
  },
  "timestamp": 1721308800000
}
```

### 错误码

| 错误码 | 说明 |
|--------|------|
| 40001 | Token 无效 |
| 60032 | 未收藏该歌单 |

---

## 9. 获取用户收藏歌单列表

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/user-liked` |
| **请求方式** | `GET` |
| **认证要求** | 需要 |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | query | 否 | 用户 ID，不传则获取当前登录用户 |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/playlist/user-liked?pageSize=20" \
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
        "playlistId": "1001",
        "name": "Chill 放松指南",
        "coverUrl": "http://localhost:5090/static/images/playlists/playlist_001.jpg",
        "creator": {
          "userId": "1001",
          "nickname": "张三",
          "avatar": "http://localhost:5090/static/images/avatars/avatar_001.jpg"
        },
        "songCount": 50,
        "playCount": 256000,
        "likedTime": 1721222400000
      }
    ],
    "total": 15,
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

## 10. 获取用户创建的歌单列表

### 接口信息

| 项目 | 内容 |
|------|------|
| **接口路径** | `/user-created` |
| **请求方式** | `GET` |
| **认证要求** | 不需要 |
| **优先级** | P1 |

### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | query | 是 | 用户 ID |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

### 请求示例

```bash
curl -X GET "http://localhost:5090/api/playlist/user-created?userId=1001&pageSize=20"
```

### 响应示例

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
        "songCount": 50,
        "playCount": 256000,
        "isPublic": true,
        "createTime": 1715616000000
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
| 40011 | 必填参数缺失 |
| 60001 | 用户不存在 |

---

## 接口状态

| 接口 | 状态 | 备注 |
|------|------|------|
| 获取歌单详情 | 待开发 | - |
| 创建歌单 | 待开发 | - |
| 更新歌单 | 待开发 | - |
| 删除歌单 | 待开发 | - |
| 添加歌曲到歌单 | 待开发 | - |
| 从歌单移除歌曲 | 待开发 | - |
| 收藏歌单 | 待开发 | - |
| 取消收藏歌单 | 待开发 | - |
| 获取用户收藏歌单 | 待开发 | - |
| 获取用户创建歌单 | 待开发 | - |
