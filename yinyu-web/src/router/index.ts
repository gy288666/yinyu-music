import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ===== 前台（共用 FrontLayout，全局播放器） =====
    {
      path: '/',
      component: () => import('../layouts/FrontLayout.vue'),
      children: [
        { path: '', name: 'discover', component: () => import('../views/front/DiscoverView.vue'), meta: { player: true, nav: '发现', side: '发现', title: '发现' } },
        { path: 'recommend', name: 'recommend', component: () => import('../views/front/RecommendView.vue'), meta: { player: true, nav: '推荐', side: '为你推荐', title: '每日推荐' } },
        { path: 'rank', name: 'rank', component: () => import('../views/front/RankView.vue'), meta: { player: true, nav: '排行榜', side: '', title: '排行榜' } },
        { path: 'playlists', name: 'playlists', component: () => import('../views/front/PlaylistSquareView.vue'), meta: { player: true, nav: '歌单', side: '', title: '歌单广场' } },
        { path: 'playlists/:id', name: 'playlistDetail', component: () => import('../views/front/PlaylistDetailView.vue'), meta: { player: true, nav: '歌单', side: '', title: '歌单详情' } },
        { path: 'artists', name: 'artists', component: () => import('../views/front/ArtistListView.vue'), meta: { player: true, nav: '歌手', side: '', title: '歌手' } },
        { path: 'artists/:id', name: 'artistDetail', component: () => import('../views/front/ArtistDetailView.vue'), meta: { player: true, nav: '歌手', side: '', title: '歌手详情' } },
        { path: 'radio', name: 'radio', component: () => import('../views/front/RadioView.vue'), meta: { player: true, nav: '电台', side: '私人FM', title: '电台' } },
        { path: 'vip', name: 'vip', component: () => import('../views/front/VipView.vue'), meta: { player: true, nav: '会员', side: '', title: '会员中心' } },
        { path: 'search', name: 'search', component: () => import('../views/front/SearchView.vue'), meta: { player: true, nav: '', side: '', title: '搜索' } },
        { path: 'recent', name: 'recent', component: () => import('../views/front/LibraryView.vue'), props: { mode: 'recent' }, meta: { player: true, nav: '', side: '最近播放', title: '最近播放' } },
        { path: 'liked', name: 'liked', component: () => import('../views/front/LibraryView.vue'), props: { mode: 'liked' }, meta: { player: true, nav: '', side: '我喜欢的音乐', title: '我喜欢的音乐' } },
        { path: 'downloads', name: 'downloads', component: () => import('../views/front/LibraryView.vue'), props: { mode: 'downloads' }, meta: { player: true, nav: '', side: '下载管理', title: '下载管理' } },
        { path: 'info/:slug', name: 'info', component: () => import('../views/front/InfoPageView.vue'), meta: { player: true, nav: '', side: '', title: '信息页' } },
      ],
    },
    // ===== 后台 =====
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', component: () => import('../views/admin/DashboardView.vue'), meta: { title: '首页' } },
        { path: 'music', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'music' }, meta: { title: '音乐管理' } },
        { path: 'playlists', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'playlist' }, meta: { title: '歌单管理' } },
        { path: 'albums', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'album' }, meta: { title: '专辑管理' } },
        { path: 'artists', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'artist' }, meta: { title: '歌手管理' } },
        { path: 'categories', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'category' }, meta: { title: '分类管理' } },
        { path: 'copyright', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'copyright' }, meta: { title: '版权管理' } },
        { path: 'users', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'user' }, meta: { title: '用户列表' } },
        { path: 'vip', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'vip' }, meta: { title: '会员管理' } },
        { path: 'levels', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'level' }, meta: { title: '用户等级' } },
        { path: 'feedback', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'feedback' }, meta: { title: '用户反馈' } },
        { path: 'banners', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'banner' }, meta: { title: '轮播图管理' } },
        { path: 'notices', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'notice' }, meta: { title: '公告管理' } },
        { path: 'activities', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'activity' }, meta: { title: '活动管理' } },
        { path: 'stats', component: () => import('../views/admin/StatsView.vue'), meta: { title: '数据统计' } },
        { path: 'admins', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'admin' }, meta: { title: '管理员管理' } },
        { path: 'roles', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'role' }, meta: { title: '角色管理' } },
        { path: 'permissions', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'permission' }, meta: { title: '权限管理' } },
        { path: 'settings', component: () => import('../views/admin/SettingsView.vue'), meta: { title: '系统设置' } },
        { path: 'logs', component: () => import('../views/admin/GenericCrud.vue'), props: { module: 'log' }, meta: { title: '操作日志' } },
      ],
    },
  ],
})

export default router
