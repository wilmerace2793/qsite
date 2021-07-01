<template>
  <q-layout id="layoutMaster" :view="(appConfig.mode == 'iadmin') ? 'hHh LpR lFf' : 'lHh LpR lFf'">
    <!-- HEADER -->
    <header-admin v-if="appState.loadPage && (appConfig.mode == 'iadmin')"/>
    <header-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>

    <!-- Drawers -->
    <drawers-admin v-if="appState.loadPage && (appConfig.mode == 'iadmin')"/>
    <drawers-panel v-if="appState.loadPage && (appConfig.mode == 'ipanel')"/>


    <!-- ROUTER VIEW -->
    <q-page-container>
      <router-view v-if="appState.loadPage" class="layout-padding"/>
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
      title: `${this.$tr(routeTitle)} | ${siteName}`,
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
    }
  },
  computed: {
    appState() {
      return this.$store.state.qsiteApp
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
</style>
