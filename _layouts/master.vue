<template>
  <q-layout id="layoutMaster" :view="(appConfig.mode == 'iadmin') ? 'lHh LpR lFf' : 'lHr LpR lFf'">
    <!-- HEADER -->
    <header-admin v-if="appState.loadPage && (appConfig.mode == 'iadmin')"/>
    <header-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>

    <!-- Drawers -->
    <drawers-admin v-if="appState.loadPage && (appConfig.mode == 'iadmin')"/>
    <drawers-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>


    <!-- ROUTER VIEW -->
    <q-page-container>
      <!--Page route-->
      <div id="routeInformationContent" v-if="appConfig.mode == 'iadmin'" class="q-hide q-md-show">
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
    <footer-admin v-if="appState.loadPage && (appConfig.mode == 'iadmin')"/>
    <footer-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>
  </q-layout>
</template>

<script>
import chat from '@imagina/qchat/_components/advancedChat'
//Components Admin
import headerAdmin from '@imagina/qsite/_components/admin/header'
import drawersAdmin from '@imagina/qsite/_components/admin/drawers'
import footerAdmin from '@imagina/qsite/_components/admin/footer'
//Components Panel
import headerPanel from '@imagina/qsite/_components/panel/header'
import drawersPanel from '@imagina/qsite/_components/panel/drawers'
import footerPanel from '@imagina/qsite/_components/panel/footer'
//Components
import cropperComponent from '@imagina/qsite/_components/master/cropper'

export default {
  meta() {
    let routeTitle = ((this.$route.meta && this.$route.meta.title) ? this.$route.meta.title : '')
    if (this.$route.meta && this.$route.meta.headerTitle) routeTitle = this.$route.meta.headerTitle
    let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
    let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
    let iconHref = this.$store.getters['qsiteApp/getSettingMediaByName']('isite::favicon').path

    return {
      title: `${routeTitle} | ${siteName}`,
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
    headerAdmin,
    drawersAdmin,
    footerAdmin,
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
      homePage: 'isite_cms_main_home'
    }
  },
  computed: {
    appState() {
      return this.$store.state.qsiteApp
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
      const pages = (this.$route.name.indexOf('app.home') == -1) ? [page, this.$route.meta] : [page]
      //Get page from breadcrum
      breadcrumbs.forEach((pageName) => {
        const base = this.pagesConfig.find(item => item.system_name.toLowerCase() == pageName.toLowerCase())
        pages.splice(1,0,base)
      })
      //Format all routes to breadcrum
      pages.forEach(page => {
        if(!page) return;
        const isActive = page.options ? page.options.activated : page.activated
        if (page && isActive && this.$auth.hasAccess(page.permission)) {
          response.push({
            label: page.title,
            icon: page.options ? page.options.icon : page.icon,
            to: page.options? page.options.name : page.name
          })
        }
      })
      //Response
      return response
    }
  },
  methods: {
    init() {
    }
  }
}
</script>

<style lang="stylus">
#layoutMaster
  background-color $custom-accent-color

  #routeInformationContent
    width 100%
    background-color $primary
    position fixed
    z-index 2

    #subContent
      padding 8px 10px 8px 16px
      border-radius $custom-radius 0 0 0
      background-color $custom-accent-color

  #fakeRouteInformationContent
    height 35px
    width 100%
</style>
