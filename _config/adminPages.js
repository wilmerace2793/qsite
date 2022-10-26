export default {
  //Home Page
  index: {
    permission: 'isite.settings.manage',
    activated: true,
    path: '/site/settings',
    name: 'app.site.settings',
    page: () => import('@imagina/qsite/_pages/admin/settings/index'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isite.cms.sidebar.adminIndex',
    icon: 'fal fa-cog',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  //Organization Page
  organizations: {
    permission: 'isite.organizations.manage',
    activated: true,
    path: '/site/organizations',
    name: 'qsite.admin.organizations.index',
    crud: import('@imagina/qsite/_crud/organizations'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isite.cms.sidebar.adminOrganization',
    icon: 'fal fa-crown',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  //Organization Page
  organizationForm: {
    permission: 'isite.organizations.edit',
    activated: true,
    path: '/site/organizations/:id',
    name: 'qsite.admin.organizations.update',
    page: () => import('@imagina/qsite/_pages/admin/organizations/form'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isite.cms.sidebar.adminOrganizationForm',
    icon: 'fal fa-pen',
    authenticated: true,
    subHeader: {
      refresh: true,
      breadcrumb: ['qsite.organizations']
    }
  },
  //Organization Page
  categories: {
    permission: 'isite.categories.manage',
    activated: true,
    path: '/site/categories',
    name: 'qsite.admin.catgeories.index',
    crud: import('@imagina/qsite/_crud/categories'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isite.cms.sidebar.adminCategories',
    icon: 'fal fa-layer-group',
    authenticated: true,
    subHeader: {
      refresh: true,
    }
  },
  //Icruds
  icruds: {
    permission: 'isite.icruds.manage',
    activated: true,
    path: '/site/icruds',
    name: 'qsite.admin.icruds.index',
    crud: import('@imagina/qsite/_crud/icruds'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isite.cms.sidebar.adminIcruds',
    icon: 'fal fa-code',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  },
  //Logs
  auditLog: {
    permission: 'isite.logs.manage',
    activated: true,
    path: '/auditLog/index',
    name: 'qsite.admin.auditLog.index',
    crud: import('@imagina/qsite/_crud/auditLog'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    title: 'isite.cms.sidebar.adminAuditLog',
    icon: 'fal fa-file-code',
    authenticated: true,
    subHeader: {
      refresh: true
    }
  }
}
