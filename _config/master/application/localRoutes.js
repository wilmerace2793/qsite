import appConfig from 'src/config/app'
import pagesConfig from 'src/config/pages'

class LocalRoutes {
  constructor() {
    this.availablesLanguages = appConfig.languages.availables
    this.defaultLanguage = appConfig.languages.default
    this.pages = pagesConfig
  }

  //Return object of routes
  getRoutes(router) {
    this.loadRoutes(router)
    this.addExtraRoutes(router)
    return router.getRoutes()
  }

  //Load main routes
  loadRoutes(router) {
    for (var nameGroupPage in this.pages) {
      let groupPages = this.pages[nameGroupPage]//Get group pages
      //Loop group pages
      if (Object.keys(groupPages).length) {
        for (var namePage in groupPages) {
          let page = groupPages[namePage]//Get page

          //Create Route if is active
          if (page.activated) {
            //Get localization paths
            let pagePath = this.getPathPage(page)
            //Create main route
            const route = {
              path: pagePath.default,
              component: page.layout,
              children: [
                {
                  path: '',
                  component: page.page,
                  ...this.getOptionsPage(page)
                }
              ]
            }

            router.addRoute(route)
            // Create localization routes
            this.availablesLanguages.forEach(locale => {
              const localeRoute = {
                path: pagePath[locale],
                component: page.layout,
                children: [
                  {
                    path: '/',
                    component: page.page,
                    ...this.getOptionsPage(page, locale)
                  }
                ]
              }
              router.addRoute(localeRoute)
            })
          }
        }
      }
    }
  }

  //Get localization page path
  getPathPage(page) {
    //Default language
    let response = {default: page.path[this.defaultLanguage] || page.path}
    //Add localizations path
    this.availablesLanguages.forEach(locale => {
      response[locale] = `/${locale}${(page.path[locale] || page.path)}`
    })
    //Response
    return response
  }

  //Return meta data to route
  getOptionsPage(page, locale = false) {
    let middlewares = (page.middleware || [])
    let routeName = locale ? `${locale}.${page.name}` : page.name

    return {
      name: routeName,
      meta: {
        ...page,
        permission: (page.permission ? page.permission : null),
        activated: page.activated,
        path: locale ? `${locale}.${page.path}` : page.path,
        name: routeName,
        title: page.title,
        headerTitle: page.headerTitle || false,
        icon: page.icon,
        authenticated: page.authenticated,
        subHeader: page.subHeader || {}
      },
      props: page.props || true,
      beforeEnter: middlewares,
    }
  }

  //Add extra routes
  addExtraRoutes(router) {
    // Add not found page
    const notFound = '/:catchAll(.*)'
    if (process.env.MODE !== 'ssr') {
      const notFoundRoute = {
        path: notFound,
        component: () => import('@imagina/qsite/_layouts/blank.vue'),
        children: [
          {
            path: '',
            component: () => import('@imagina/qsite/_pages/master/404'),
            name: 'app.not.found',
            meta: {
              permission: null,
              activated: true,
              path: notFound,
              name: 'app.not.found',
              title: 'sidebar.pageNotFound',
              headerTitle: false,
              icon: 'fas fa-chart-bar',
              authenticated: false,
              subHeader: {}
            },
            props: true,
            beforeEnter: [],
          }
        ]
      }
      router.addRoute(notFoundRoute)
    }
  }
}


//Create new clase
const localRoutes = new LocalRoutes()

//Response
export default localRoutes
