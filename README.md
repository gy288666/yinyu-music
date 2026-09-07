# 音域 YINYU 音乐平台

> 一站式在线音乐流媒体平台演示项目 —— 深色沉浸式用户端 + 全功能管理后台

**在线预览（本地启动后）**

| 端 | 地址 |
| --- | --- |
| 🎧 前台用户端 | http://localhost:5173/ |
| 🗂️ 管理后台 | http://localhost:5173/admin |

## 项目简介

音域（YINYU）是一款面向音乐爱好者的在线音乐流媒体平台，提供音乐发现、播放、收藏与管理体验：

- **前台用户端**：发现页（Banner 轮播 / 每日推荐 / 热门歌单 / 排行榜 / 新歌速递）、歌单广场与详情、歌手库与歌手详情、电台、会员中心、搜索、最近播放 / 我喜欢的音乐 / 下载管理，以及全局底部播放器（进度拖拽 / 播放模式 / 队列）
- **管理后台（20 个功能页）**：数据看板、内容管理（音乐 / 歌单 / 专辑 / 歌手 / 分类 / 版权审核流）、用户管理（用户 / 会员 / 等级 / 反馈）、运营中心（轮播图 / 公告 / 活动 / 数据统计）、系统管理（管理员 / 角色权限树 / 权限 / 系统设置 / 操作日志），全部支持增删改查，改动即时同步前台
- **页脚信息页（12 页）**：关于音域、加入我们、媒体报道、联系我们、常见问题、使用指南、意见反馈、版权声明、用户协议、隐私政策、会员协议、未成年人保护

## ⭐ 与真实音乐网站的唯一区别

页面中的歌曲信息（歌名、歌手、封面、播放量）均正常展示，但**点击播放时不播放真实歌手音源**，而是播放 `resource/static/music` 中为该歌手**指定**的一首本地 mp3（见 `yinyu-web/src/data/db.ts` 的 `Artist.designatedAudio`）。例如播放林俊杰的歌，实际加载的是为他指定的 `music_043_231700_40s.mp3`。

## 快速开始

```bash
git clone https://github.com/gy288666/yinyu-music.git
cd yinyu-music/yinyu-web
npm install
npm run dev
```

浏览器访问 http://localhost:5173/ （前台）与 http://localhost:5173/admin （后台）。

静态资源（音乐、图片）由 Vite `publicDir` 直接指向 `E:\yinyu-music\resource\static`，请保持项目目录结构不变；其他磁盘路径可在 `yinyu-web/vite.config.ts` 中调整。

## 目录结构

```
yinyu-music/
├── docs/               # 需求文档、项目介绍、UI 成品图
├── resource/static/    # 静态资源库
│   ├── music/          # 165 首本地音频（播放指定源）
│   └── images/         # 歌手图 168 张（artists/avatars/albums/banners/playlists）
└── yinyu-web/          # 平台源码（前台 + 后台单页应用）
    └── src/
        ├── data/       # db.ts 前台种子数据 / adminStore.ts 统一数据仓库 / infoPages.ts 信息页
        ├── stores/     # 全局播放器（指定音频规则在此收敛）
        ├── views/front/# 前台 16 个页面
        └── views/admin/# 后台布局 + 看板 + 通用 CRUD + 20 个模块
```

## 技术栈

Vue 3 · Vite · TypeScript · Pinia · Vue Router · Tailwind CSS v4 · Element Plus · ECharts · Lucide Icons

## 说明

- 数据为内存态演示数据（用户提交的反馈持久化在浏览器 localStorage），整页刷新后重置为种子数据
- 歌手人像 / 图片来自公开网络搜索，音频为本地示例资源，仅用于学习与开发测试
- 仓库约 610MB，主要来自音频资源

## 联系方式

- QQ：**2855629937**
- 邮箱：**2855629937@qq.com**

---

更多实现细节见 [yinyu-web/README.md](./yinyu-web/README.md)。
