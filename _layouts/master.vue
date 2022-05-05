<template>
  <q-layout :id="appConfig.mode == 'ipanel' ? 'layoutMasterPanel' : 'layoutMaster'" :view="(appConfig.mode == 'iadmin') ? 'lHh LpR lFf' : 'lHr LpR lFf'">
    <!-- HEADER -->
    <header-admin-main-theme v-if="theme === 1"/>
    <header-admin-second-theme v-if="theme === 2"/>
    <header-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>

    <!-- Drawers -->
    <drawers-admin-main-theme v-if="theme === 1"/>
    <drawers-admin-second-theme v-if="theme === 2"/>
    <drawers-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>


    <!-- ROUTER VIEW -->
    <q-page-container>
      <!--Page route-->
      <div id="routeInformationContent" v-if="appConfig.mode == 'iadmin'" :style="`${backColorContent}`" 
      class="q-hide q-md-show">
        <div id="subContent" class="row items-center">
          <!-- Back Button -->
          <q-btn icon="fas fa-arrow-left" unelevated round color="primary" class="btn-small q-mr-md"
                 @click="$helper.backHistory()">
            <q-tooltip>{{ $tr('isite.cms.label.back') }}</q-tooltip>
          </q-btn>
          <!--Breadcrumb-->
          <q-breadcrumbs class="text-blue-grey">
            <q-breadcrumbs-el v-for="(item, key) in breadcrumbs" :key="key" :label="item.label" :icon="item.icon"
                              :to="item.to ? {name : item.to} : false"/>
          </q-breadcrumbs>
        </div>
      </div>
      <div id="fakeRouteInformationContent" class="q-hide q-md-show" v-if="appConfig.mode == 'iadmin'"></div>
      <!--Router view-->
      <div id="routerPageContent" class="layout-padding">
        <router-view v-if="appState.loadPage"/>
      </div>
    </q-page-container>

    <!---Cropper-->
    <cropper-component ref="cropperComponent"/>

    <!-- FOOTER -->
    <footer-admin-main-theme v-if="theme === 1"/>
    <footer-admin-second-theme v-if="theme === 2"/>
    <footer-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>
  </q-layout>
</template>

<script>
import chat from '@imagina/qchat/_components/advancedChat'
//Components Admin
import headerAdminMainTheme from '@imagina/qsite/_components/admin/theme1/header'
import headerAdminSecondTheme from '@imagina/qsite/_components/admin/theme2/header'
import drawersAdminMainTheme from '@imagina/qsite/_components/admin/theme1/drawers'
import drawersAdminSecondTheme from '@imagina/qsite/_components/admin/theme2/drawers'
import footerAdminMainTheme from '@imagina/qsite/_components/admin/theme1/footer'
import footerAdminSecondTheme from '@imagina/qsite/_components/admin/theme2/footer'
//Components Panel
import headerPanel from '@imagina/qsite/_components/panel/header'
import drawersPanel from '@imagina/qsite/_components/panel/drawers'
import footerPanel from '@imagina/qsite/_components/panel/footer'
//Components
import cropperComponent from '@imagina/qsite/_components/master/cropper'

export default {
  name:"MasterLayout",
  meta() {
    let routeTitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
    if (this.$route.meta && this.$route.meta.headerTitle) routeTitle = this.$route.meta.headerTitle
    let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
    let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
    let iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon').path

    return {
      title: `${this.useLegacyStructure ? this.$tr(routeTitle) : routeTitle} | ${siteName}`,
      meta: {
        description: {name: 'description', content: siteDescription || siteName},
      },
      link: [{rel: 'icon', href: iconHref, id: 'icon'}],
    }
  },
  components: {
    chat,
    cropperComponent,
    //Admin
    headerAdminMainTheme,
    headerAdminSecondTheme,
    drawersAdminMainTheme,
    drawersAdminSecondTheme,
    footerAdminMainTheme,
    footerAdminSecondTheme,
    //Panel
    headerPanel,
    drawersPanel,
    footerPanel
  },
  mounted() {
    this.$nextTick(async function () {
      this.init()
    })
  },
  data() {
    return {
      appConfig: config('app'),
      homePage: 'isite_cms_main_home',
      modalForce:{
        shouldChangePassword:false
      }
    }
  },
  computed: {
    appState() {
      return this.$store.state.qsiteApp
    },
    useLegacyStructure() {
      const legacyStructure = parseInt(this.$store.getters["qsiteApp/getSettingValueByName"]("isite::legacyStructureCMS") || 0)
      return legacyStructure === 1 || false
      
    },
    backColorContent (){
      switch (this.theme) {
        case 1:
          return 'background-color: var(--q-color-primary)'
          break;
      
        case 2:
          return 'background-color: #fff'
          break;
      
        default:
          return 'background-color: var(--q-color-primary)'
          break;
      }
    },
    //get Theme
    theme () {
      if (!this.$store.getters['qsiteApp/getSettingValueByName']('isite::iadminTheme')) return 1;
      return this.appState.loadPage && (this.appConfig.mode == 'iadmin') && (this.$store.getters['qsiteApp/getSettingValueByName']('isite::iadminTheme') == 1) ? 1 : 2
    },
    pagesConfig() {
      return this.$store.state.qsiteApp.pages
    },
    //Return data breadcrumd
    breadcrumbs() {
      let response = []
      //Get breadcrumbs from params
      let breadcrumbs = (this.$route.meta?.subHeader?.breadcrumb || []).reverse()
      //find Homepage
      const page = this.pagesConfig.find(item => item.system_name.toLowerCase() === this.homePage)
      //Set Home page and current page
      const pages = this.useLegacyStructure ? this.$route.name.indexOf("app.home") == -1 ? [config(`pages.mainqsite.home`), this.$route.meta] : [config(`pages.mainqsite.home`)] 
        : this.$route.name.indexOf("app.home") == -1 ? [page, this.$route.meta] : [page]
      //Get page from breadcrum
      breadcrumbs.forEach((pageName) =>{
        if (this.useLegacyStructure) {
          pages.splice(1, 0, config(`pages.${pageName}`))
        } else {
          const base = this.pagesConfig.find(
            (item) => item.system_name.toLowerCase() == pageName.toLowerCase()
          );
          pages.splice(1, 0, base)
        }
      });
      //Format all routes to breadcrum
      pages.forEach((page) => {
        if (!page) return;
        const isActive = page.options ? page.options.activated : page.activated;
        if (page && isActive && this.$auth.hasAccess(page.permission)) {
          response.push({
            label: this.useLegacyStructure ? this.$tr(page.title) : page.title,
            icon: this.useLegacyStructure ? page.icon : (page.options ? page.options.icon : page.icon),
            to: this.useLegacyStructure ? page.name : (page.options ? page.options.name : page.name),
          })
        }
      })
      //Response
      return response
    }
  },
  methods: {
    init() {}
  }
}
</script>

<style lang="stylus">
#layoutMaster {
  background-color: #FFFFFF
  #routeInformationContent {
    width: 100%;
    position: fixed;
    z-index: 2;

    #subContent {
      padding: 8px 10px 8px 16px;
      border-radius: $custom-radius 0 0 0;
      background: linear-gradient(180deg, #F1F4FA 0%, #FFFFFF 100%)
    }
  }

  #fakeRouteInformationContent {
    height: 35px;
    width: 100%;
  }
}
#layoutMasterPanel {
  background-color: $custom-accent-color;

  #routeInformationContent {
    width: 100%;
    position: fixed;
    z-index: 2;

    #subContent {
      padding: 8px 10px 8px 16px;
      border-radius: $custom-radius 0 0 0;
      background: linear-gradient(180deg, #F1F4FA 0%, #FFFFFF 100%)
    }
  }

  #fakeRouteInformationContent {
    height: 35px;
    width: 100%;
  }
}
</style>
