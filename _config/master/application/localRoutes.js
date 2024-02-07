import appConfig from 'src/config/app'
import pagesConfig from 'src/config/pages'

class LocalRoutes {
  constructor() {
    this.availablesLanguages = appConfig.languages.availables
    this.defaultLanguage = appConfig.languages.default
    this.pages = pagesConfig
  }

  getRoutes(router) {
    this.loadRoutes(router)
    this.addExtraRoutes(router)
    return router.getRoutes()
  }

  loadRoutes(router) {
    for (const [nameGroupPage, groupPages] of Object.entries(this.pages)) {
      if (Object.keys(groupPages).length === 0) {
        continue;
      }

      for (const [namePage, page] of Object.entries(groupPages)) {
        if (page.activated) {
          this.createAndAddRoute(router, page);
          this.createAndAddLocalizationRoutes(router, page);
        }
      }
    }
  }

  createAndAddRoute(router, page) {
    const pagePath = this.getPathPage(page);
    const route = {
      path: pagePath.default,
      component: page.layout,
      children: [
        {
          path: '',
          component: page.page,
          ...this.getOptionsPage(page),
        },
      ],
    };

    router.addRoute(route);
  }

  createAndAddLocalizationRoutes(router, page) {
    this.availablesLanguages.forEach(locale => {
      const pagePath = this.getPathPage(page);
      const localeRoute = {
        path: pagePath[locale],
        component: page.layout,
        children: [
          {
            path: '',
            component: page.page,
            ...this.getOptionsPage(page, locale),
          },
        ],
      };

      router.addRoute(localeRoute);
    });
  }

  getPathPage(page) {
    let response = { default: page.path[this.defaultLanguage] || page.path };

    this.availablesLanguages.forEach(locale => {
      response[locale] = `/${locale}${page.path[locale] || page.path}`;
    });

    return response;
  }

  getOptionsPage(page, locale = false) {
    let middlewares = page.middleware || [];
    let routeName = locale ? `${locale}.${page.name}` : page.name;

    return {
      name: routeName,
      meta: {
        ...page,
        permission: page.permission || null,
        activated: page.activated,
        path: locale ? `${locale}.${page.path}` : page.path,
        title: page.title,
        headerTitle: page.headerTitle || false,
        icon: page.icon,
        authenticated: page.authenticated,
        subHeader: page.subHeader || {},
      },
      props: page.props || true,
      beforeEnter: middlewares,
    };
  }

  addExtraRoutes(router) {
    const notFound = '/:catchAll(.*)';
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
              subHeader: {},
            },
            props: true,
            beforeEnter: [],
          },
        ],
      };
      router.addRoute(notFoundRoute);
    }
  }
}

const localRoutes = new LocalRoutes();

export default localRoutes;
