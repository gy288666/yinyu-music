# 音域 YINYU - 音乐平台演示（yinyu-web）

基于 `docs/UI-demo` 成品图实现的音乐平台演示工程：Vue 3 + Vite + TypeScript + Tailwind CSS v4（前台）+ Element Plus + ECharts（后台）。

## 启动

```bash
cd yinyu-web
npm install
npm run dev
```

- 前台用户端：<http://localhost:5173/>
- 后台管理系统：<http://localhost:5173/admin>

静态资源（歌手图片、封面、mp3）直接从本地资源库 `E:\yinyu-music\resource\static` 由 Vite `publicDir` 提供，无需拷贝。

## 与真实音乐网站的唯一区别（核心规则）

页面中所有歌曲的展示信息（歌名、歌手、封面、播放量等）均为正常数据；但点击播放时**不播放真实歌手音源**，而是播放资源库中为该歌手「指定」的一首本地 mp3（见 `src/data/db.ts` 中 `Artist.designatedAudio`，统一由 `designatedAudioOf(song)` 解析）。例如：

| 歌手 | 指定播放 |
| --- | --- |
| 王宇宙Leto | `/music/music_036_225800_45s.mp3` |
| 林俊杰 | `/music/music_043_231700_40s.mp3` |
| 许嵩 | `/music/music_044_231900_35s.mp3` |
| 告五人 | `/music/music_045_232100_60s.mp3` |
| 放松 · 治愈 · 钢琴 | `/music/music_050_232800_60s.mp3` |

## 功能范围

**前台（全部页面可点击跳转）**
- 发现页：Banner 轮播（点击可跳转配置链接）、快捷入口、为你推荐、热门歌单、排行榜（4 Tab）、新歌速递、我的歌单
- 排行榜 /rank：四大榜单 × 日/周/月榜切换、点赞、点播
- 歌单广场 /playlists：分类筛选；歌单详情 /playlists/:id：播放全部/收藏/下载全部/歌曲列表
- 歌手 /artists：性别+字母筛选；歌手详情 /artists/:id：热门歌曲、专辑列表、相似歌手
- 电台 /radio：分类电台点播；会员中心 /vip：权益展示 + 三档订阅 + 模拟支付开通
- 每日推荐 /recommend：不感兴趣反馈；搜索 /search?kw=：单曲/歌手/歌单/专辑四类结果
- 最近播放 /recent、我喜欢的音乐 /liked、下载管理 /downloads
- 全局底部播放器：播放/暂停/上下曲/进度拖拽/音量/播放模式/队列弹层/喜欢

**后台（20 个功能页面，全部可增删改查）**
- 首页看板：指标卡（实时来自数据仓库）、趋势图、渠道分布、实时动态、快捷操作（直达对应模块）、音乐审核（与版权管理联动）
- 内容管理：音乐 / 歌单 / 专辑 / 歌手 / 分类（树形）/ 版权（审核流）——CRUD、搜索、上架下架开关、批量操作
- 用户管理：用户列表（重置密码/禁用）、会员记录、等级规则、用户反馈（回复流程）
- 运营中心：轮播图、公告（置顶/下线）、活动、数据统计（4 张图表）
- 系统管理：管理员、角色（权限树配置）、权限资源、系统设置（保存生效）、操作日志（筛选 + CSV 导出）
- 所有写操作自动写入操作日志；数据改动即时同步前台（同一响应式仓库）

## 与真实音乐网站的唯一区别（核心规则）

页面中所有歌曲的展示信息（歌名、歌手、封面、播放量等）均为正常数据；但点击播放时**不播放真实歌手音源**，而是播放资源库中为该歌手「指定」的一首本地 mp3（见 `src/data/db.ts` 中 `Artist.designatedAudio`，统一由 `designatedAudioOf(song)` 解析）。例如：

| 歌手 | 指定播放 |
| --- | --- |
| 王宇宙Leto | `/music/music_036_225800_45s.mp3` |
| 林俊杰 | `/music/music_043_231700_40s.mp3` |
| 许嵩 | `/music/music_044_231900_35s.mp3` |
| 告五人 | `/music/music_045_232100_60s.mp3` |
| 放松 · 治愈 · 钢琴 | `/music/music_050_232800_60s.mp3` |

## 功能范围

**前台（发现页）**：Banner 轮播（自动播放/指示器/箭头）、快捷入口、为你推荐（悬浮播放）、热门歌单、排行榜（热歌/新歌/原创/飙升四个 Tab、点赞）、新歌速递（横向滚动）、全局底部播放器（播放/暂停/上下曲/进度拖拽/音量/静音/播放模式/播放队列弹层/喜欢）、搜索框、侧栏歌单点播、页脚。

**后台（首页看板）**：5 项核心指标卡、播放量趋势折线图（今日/近7日/近30日/自定义切换）、用户来源渠道环形图、实时动态（刷新）、快捷操作、音乐审核（待审核/通过/驳回三态流转，计数联动，查看更多展开）、热门歌曲 TOP5、系统公告、侧栏折叠。

## 歌手图片说明

`resource/static/images/artists/` 中 `{key}.jpg`（如 `xzj.jpg`、`ljj.jpg`）为通过浏览器搜索（Bing 图片）下载的歌手人像/官方封面，仅用于本地开发测试演示。加载失败时自动回退到占位风景图（`src/utils/img.ts`）。用户头像位于 `images/avatars/`。

## 主要目录

```
yinyu-web/
├── vite.config.ts          # publicDir 指向 resource/static
└── src/
    ├── data/db.ts          # 歌手/歌曲/歌单/榜单数据 + 指定音频映射（核心）
    ├── stores/player.ts    # 全局播放器（Pinia），window.__yyAudio 供自动化测试
    ├── views/DiscoverView.vue   # 前台发现页
    ├── views/AdminView.vue      # 后台管理首页
    └── components/PlayerBar.vue # 底部全局播放器
```
