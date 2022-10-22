const pages = config('pages') // Get Pages from config

//Places
export default [
  {
    title: 'isite.cms.sidebar.adminGroup',
    icon: 'fal fa-chess-rook',
    children: [
      pages.qsite.organizations,//organizations
      pages.qsite.categories,//organization categories
      pages.qsite.icruds,//Cruds
      pages.qsite.blocks//Blocks
    ]
  },
  pages.qsite.index,//setup
  pages.qsite.auditLog,
]
