const pages = config('pages') // Get Pages from config

//Places
export default [
  {
    title: 'qsite.sidebar.adminGroupOrganizations',
    icon: 'fas fa-chess',
    children: [
      pages.qsite.organizations,//organizations
      pages.qsite.categories//organization categories
    ]
  },
  pages.qsite.icruds,//Cruds
  pages.qsite.index,//setup
]
