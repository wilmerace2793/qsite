export default {
  //Home Page
  index: {
    permission: 'isite.settings.manage',
    activated: true,
    path: '/site/settings',
    name: 'app.site.settings',
    page: () => import('@imagina/qsite/_pages/admin/settings/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qsite.sidebar.adminIndex',
    icon: 'fas fa-cog',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  //Organization Page
  organization: {
    permission: 'isite.organizations.manageee',
    activated: true,
    path: '/site/organization',
    name: 'app.site.organization',
    page: () => import('@imagina/qsite/_pages/admin/organizations/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'qsite.sidebar.adminOrganization',
    icon: 'fas fa-crown',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  }
}
