# 后台管理 - 运营管理接口（Admin Operation）

**Base URL**: `http://localhost:5090/api/admin/operation`

---

## 一、轮播图管理

### 1. 获取轮播图列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/banner/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |
| **优先级** | P2 |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| status | query | 否 | 状态：0-全部，1-启用，2-禁用，默认 0 |
| pageNum | query | 否 | 页码，默认 1 |
| pageSize | query | 否 | 每页数量，默认 20 |

**请求示例**

```bash
curl -X GET "http://localhost:5090/api/admin/operation/banner/list?status=1" \
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
        "bannerId": "1",
        "title": "夏日音乐节",
        "imageUrl": "http://localhost:5090/static/images/banners/banner_001.jpg",
        "linkUrl": "https://yinyu-music.com/activity/summer",
        "sort": 1,
        "status": 1,
        "startTime": 1717200000000,
        "endTime": 1722470400000,
        "createTime": 1717113600000
      },
      {
        "bannerId": "2",
        "title": "新歌首发",
        "imageUrl": "http://localhost:5090/static/images/banners/banner_002.jpg",
        "linkUrl": "https://yinyu-music.com/new-songs",
        "sort": 2,
        "status": 1,
        "startTime": 1717200000000,
        "endTime": null,
        "createTime": 1717113600000
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

---

### 2. 新增轮播图

| 项目 | 内容 |
|------|------|
| **接口路径** | `/banner/add` |
| **请求方式** | `POST` |
| **认证要求** | 需要（管理员） |

**请求参数（表单）**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 标题 |
| linkUrl | string | 否 | 跳转链接 |
| sort | number | 否 | 排序权重，数值越大越靠前，默认 0 |
| status | number | 否 | 状态：1-启用，2-禁用，默认 2 |
| startTime | number | 否 | 生效时间（时间戳） |
| endTime | number | 否 | 结束时间（时间戳，永不过期则不传） |
| imageFile | file | 是 | 图片文件 |

**响应示例**

```json
{ "code": 200, "message": "添加成功", "data": { "bannerId": "6" }, "timestamp": 1721308800000 }
```

---

### 3. 更新轮播图

| 项目 | 内容 |
|------|------|
| **接口路径** | `/banner/update/{bannerId}` |
| **请求方式** | `PUT` |
| **认证要求** | 需要（管理员） |

---

### 4. 删除轮播图

| 项目 | 内容 |
|------|------|
| **接口路径** | `/banner/delete/{bannerId}` |
| **请求方式** | `DELETE` |
| **认证要求** | 需要（管理员） |

---

## 二、公告管理

### 5. 获取公告列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/notice/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "noticeId": "1",
        "title": "系统维护通知",
        "type": "system",
        "typeName": "系统公告",
        "content": "平台将于 7 月 20 日凌晨 2:00-4:00 进行系统维护",
        "isTop": true,
        "status": 1,
        "publishTime": 1721222400000,
        "createTime": 1721136000000
      }
    ],
    "total": 10,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 1
  },
  "timestamp": 1721308800000
}
```

---

### 6. 新增/更新/删除公告

| 接口 | 方法 | 路径 |
|------|------|------|
| 新增公告 | `POST` | `/admin/operation/notice/add` |
| 更新公告 | `PUT` | `/admin/operation/notice/update/{noticeId}` |
| 删除公告 | `DELETE` | `/admin/operation/notice/delete/{noticeId}` |

**新增公告请求参数**

```json
{
  "title": "string, 必填，标题",
  "type": "string, 必填，类型：system/activity/update/maintenance",
  "content": "string, 必填，内容",
  "isTop": "boolean, 可选，是否置顶，默认 false"
}
```

---

## 三、活动管理

### 7. 获取活动列表

| 项目 | 内容 |
|------|------|
| **接口路径** | `/activity/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "activityId": "1",
        "name": "夏日音乐节",
        "description": "夏日音乐狂欢，限量好礼等你来拿",
        "coverUrl": "http://localhost:5090/static/images/banners/activity_001.jpg",
        "startTime": 1717200000000,
        "endTime": 1722470400000,
        "status": 1,
        "statusName": "进行中",
        "participantCount": 12345,
        "createTime": 1717113600000
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

---

### 8. 新增/更新/删除活动

| 接口 | 方法 | 路径 |
|------|------|------|
| 新增活动 | `POST` | `/admin/operation/activity/add` |
| 更新活动 | `PUT` | `/admin/operation/activity/update/{activityId}` |
| 删除活动 | `DELETE` | `/admin/operation/activity/delete/{activityId}` |

---

## 四、数据统计

### 9. 获取数据看板概览

| 项目 | 内容 |
|------|------|
| **接口路径** | `/statistics/dashboard` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "summary": {
      "musicCount": 10000,
      "musicCountChange": 2.5,
      "userCount": 100000,
      "userCountChange": 5.3,
      "todayPlayCount": 500000,
      "todayPlayChange": -1.2,
      "vipCount": 15000,
      "vipCountChange": 3.1,
      "revenue": 225000,
      "revenueChange": 8.7
    },
    "playTrend": [
      { "date": "2026-07-12", "count": 450000 },
      { "date": "2026-07-13", "count": 520000 },
      { "date": "2026-07-14", "count": 480000 },
      { "date": "2026-07-15", "count": 510000 },
      { "date": "2026-07-16", "count": 495000 },
      { "date": "2026-07-17", "count": 530000 },
      { "date": "2026-07-18", "count": 500000 }
    ],
    "sourceDistribution": [
      { "name": "iOS", "value": 35 },
      { "name": "Android", "value": 40 },
      { "name": "Web", "value": 15 },
      { "name": "小程序", "value": 8 },
      { "name": "其他", "value": 2 }
    ],
    "topSongs": [
      { "rank": 1, "title": "若月亮没来", "artist": "王宇宙 Leto", "playCount": 2345678 },
      { "rank": 2, "title": "还是会想你", "artist": "林达浪/h3R3", "playCount": 2123456 },
      { "rank": 3, "title": "可能", "artist": "李柏然同学", "playCount": 1987654 },
      { "rank": 4, "title": "起风了", "artist": "买辣椒也用券", "playCount": 1876543 },
      { "rank": 5, "title": "错位时空", "artist": "艾辰", "playCount": 1765432 }
    ],
    "realtimeLogs": [
      { "userId": "1001", "userName": "张三", "avatar": "...", "action": "购买了黄金会员", "time": 1721308800000 },
      { "userId": "1002", "userName": "李四", "avatar": "...", "action": "收藏了歌单「Chill 放松指南」", "time": 1721308740000 },
      { "userId": "1003", "userName": "王五", "avatar": "...", "action": "注册了新账号", "time": 1721308680000 }
    ],
    "recentNotices": [
      { "noticeId": "1", "title": "系统维护通知", "publishTime": 1721222400000 },
      { "noticeId": "2", "title": "夏日音乐节活动上线", "publishTime": 1717200000000 }
    ]
  },
  "timestamp": 1721308800000
}
```

---

### 10. 获取用户数据统计

| 项目 | 内容 |
|------|------|
| **接口路径** | `/statistics/user` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | query | 否 | 统计类型：register/active/retention，默认 register |
| startDate | query | 否 | 开始日期（YYYY-MM-DD） |
| endDate | query | 否 | 结束日期（YYYY-MM-DD） |

---

### 11. 获取内容数据统计

| 项目 | 内容 |
|------|------|
| **接口路径** | `/statistics/content` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | query | 否 | 统计类型：upload/play/like/share，默认 upload |

---

### 12. 获取收入数据统计

| 项目 | 内容 |
|------|------|
| **接口路径** | `/statistics/revenue` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | query | 否 | 统计类型：vip/single/overview，默认 overview |
| startDate | query | 否 | 开始日期（YYYY-MM-DD） |
| endDate | query | 否 | 结束日期（YYYY-MM-DD） |

---

### 13. 获取实时动态日志

| 项目 | 内容 |
|------|------|
| **接口路径** | `/statistics/realtime` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | query | 否 | 返回数量，默认 20，最大 50 |

---

## 五、系统管理

### 14. 管理员管理

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取管理员列表 | `GET` | `/admin/operation/system/admin/list` |
| 新增管理员 | `POST` | `/admin/operation/system/admin/add` |
| 更新管理员 | `PUT` | `/admin/operation/system/admin/update/{adminId}` |
| 删除管理员 | `DELETE` | `/admin/operation/system/admin/delete/{adminId}` |

**获取管理员列表响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [
      {
        "adminId": "1",
        "account": "admin",
        "name": "超级管理员",
        "roleId": "1",
        "roleName": "超级管理员",
        "status": 1,
        "lastLoginTime": 1721395200000,
        "lastLoginIp": "192.168.1.1",
        "createTime": 1609459200000
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

---

### 15. 角色管理

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取角色列表 | `GET` | `/admin/operation/system/role/list` |
| 新增角色 | `POST` | `/admin/operation/system/role/add` |
| 更新角色 | `PUT` | `/admin/operation/system/role/update/{roleId}` |
| 删除角色 | `DELETE` | `/admin/operation/system/role/delete/{roleId}` |

**获取角色列表响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "roleId": "1",
      "name": "超级管理员",
      "description": "拥有系统全部权限",
      "permissionCount": 100,
      "status": 1,
      "createTime": 1609459200000
    },
    {
      "roleId": "2",
      "name": "内容管理员",
      "description": "管理音乐内容审核",
      "permissionCount": 30,
      "status": 1,
      "createTime": 1609459200000
    },
    {
      "roleId": "3",
      "name": "运营人员",
      "description": "运营活动与公告",
      "permissionCount": 20,
      "status": 1,
      "createTime": 1609459200000
    }
  ],
  "timestamp": 1721308800000
}
```

---

### 16. 权限管理

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取权限列表（树形） | `GET` | `/admin/operation/system/permission/list` |
| 新增权限 | `POST` | `/admin/operation/system/permission/add` |
| 更新权限 | `PUT` | `/admin/operation/system/permission/update/{permissionId}` |
| 删除权限 | `DELETE` | `/admin/operation/system/permission/delete/{permissionId}` |

**获取权限列表响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "permissionId": "1",
      "name": "内容管理",
      "code": "content:manage",
      "type": "menu",
      "icon": "document",
      "children": [
        {
          "permissionId": "2",
          "name": "音乐列表",
          "code": "content:music:list",
          "type": "menu",
          "children": [
            { "permissionId": "3", "name": "新增音乐", "code": "content:music:add", "type": "button" },
            { "permissionId": "4", "name": "编辑音乐", "code": "content:music:edit", "type": "button" },
            { "permissionId": "5", "name": "删除音乐", "code": "content:music:delete", "type": "button" }
          ]
        },
        {
          "permissionId": "6",
          "name": "歌单管理",
          "code": "content:playlist:list",
          "type": "menu"
        }
      ]
    },
    {
      "permissionId": "7",
      "name": "用户管理",
      "code": "user:manage",
      "type": "menu",
      "children": [
        { "permissionId": "8", "name": "用户列表", "code": "user:list", "type": "menu" },
        { "permissionId": "9", "name": "会员管理", "code": "user:vip:list", "type": "menu" }
      ]
    }
  ],
  "timestamp": 1721308800000
}
```

---

### 17. 系统设置

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取系统设置 | `GET` | `/admin/operation/system/settings` |
| 更新系统设置 | `PUT` | `/admin/operation/system/settings` |

**响应示例**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "basic": {
      "siteName": "音域音乐",
      "logo": "http://localhost:5090/static/images/logo.png",
      "copyright": "© 2026 音域音乐 All Rights Reserved",
      "icpRecord": "京ICP备xxxxxxxx号"
    },
    "storage": {
      "musicMaxSize": 209715200,
      "imageMaxSize": 5242880,
      "avatarMaxSize": 2097152,
      "storagePath": "E:\\yinyu-music\\resource\\static",
      "allowedFormats": ["mp3", "flac", "wav", "jpg", "png", "gif"]
    },
    "audio": {
      "standardBitrate": 128,
      "highBitrate": 320,
      "losslessFormat": "flac",
      "ffmpegPath": "/usr/bin/ffmpeg"
    }
  },
  "timestamp": 1721308800000
}
```

---

### 18. 操作日志

| 项目 | 内容 |
|------|------|
| **接口路径** | `/system/log/list` |
| **请求方式** | `GET` |
| **认证要求** | 需要（管理员） |

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| module | query | 否 | 操作模块 |
| action | query | 否 | 操作类型 |
| operatorId | query | 否 | 操作人 ID |
| startTime | query | 否 | 开始时间（时间戳） |
| endTime | query | 否 | 结束时间（时间戳） |
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
        "logId": "1",
        "operatorId": "1",
        "operatorName": "超级管理员",
        "module": "音乐管理",
        "action": "新增",
        "description": "新增了歌曲《夏日限定》",
        "requestUrl": "/api/admin/content/music/add",
        "requestParams": "{\"title\":\"夏日限定\",\"artistId\":\"2001\"}",
        "ip": "192.168.1.1",
        "createTime": 1721308800000
      }
    ],
    "total": 500,
    "pageNum": 1,
    "pageSize": 20,
    "totalPages": 25
  },
  "timestamp": 1721308800000
}
```

---

## 接口状态

| 接口 | 状态 |
|------|------|
| 获取轮播图列表 | 待开发 |
| 新增轮播图 | 待开发 |
| 更新轮播图 | 待开发 |
| 删除轮播图 | 待开发 |
| 获取公告列表 | 待开发 |
| 新增/更新/删除公告 | 待开发 |
| 获取活动列表 | 待开发 |
| 新增/更新/删除活动 | 待开发 |
| 获取数据看板概览 | 待开发 |
| 获取用户数据统计 | 待开发 |
| 获取内容数据统计 | 待开发 |
| 获取收入数据统计 | 待开发 |
| 获取实时动态日志 | 待开发 |
| 管理员管理（CRUD） | 待开发 |
| 角色管理（CRUD） | 待开发 |
| 权限管理（CRUD） | 待开发 |
| 系统设置（查看/更新） | 待开发 |
| 操作日志列表 | 待开发 |