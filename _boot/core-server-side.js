import AutoLoadRoutes from '@imagina/qsite/_config/master/application/routes'
export default async ({app, router, store, Vue}) => {
  await Promise.all([
    store.dispatch('qsiteApp/GET_PAGES'),
    store.dispatch('qsiteApp/GET_MENU_SIDEBAR'),
    store.dispatch('qsiteApp/GET_SITE_SETTINGS'),
    store.dispatch('qsiteApp/GET_MODULE_CONFIGS'),
    store.dispatch('qsiteApp/GET_SITE_HOOKS'),
  ])
  //add all route from backend in router method later resolve all promise
  router.addRoutes(AutoLoadRoutes.getRoutes(store.state.qsiteApp.pages || []))
}
