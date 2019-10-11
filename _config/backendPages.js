export default {
  //Home Page
  index: {
    permission: 'isite.settings.manage',
    activated: true,
    path: '/site/index',
    name: 'app.site.index',
    page: () => import('@imagina/qsite/_layouts/admin/index'),
    layout: () => import('src/layouts/master'),
    title: 'qsite.sidebar.adminIndex',
    icon: 'fas fa-cog',
    authenticated: true,
  },
}
