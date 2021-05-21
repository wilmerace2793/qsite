export default {
  //Home Page
  index: {
    permission: 'isite.settings.manage',
    activated: true,
    path: '/site/index',
    name: 'app.site.index',
    page: () => import('@imagina/qsite/_pages/admin/settings/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qsite.sidebar.adminIndex',
    icon: 'fas fa-cog',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  dynamicForm: {
    permission: null,
    activated: true,
    authenticated: true,
    path: '/site/dynamic/index',
    name: 'qsite.admin.dynamic/index',
    page: () => import('@imagina/qsite/_pages/admin/dynamic/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qsite.sidebar.adminDynamicForm',
    icon: 'far fa-newspaper',
    subHeader: {
      refresh: true,
    }
  },
}
