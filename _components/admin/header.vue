<template>
  <div id="masterHeader">
    <!-- HEADER -->
    <q-header class="bg-white">
      <!-- Toolbar  -->
      <div :class="'q-hide q-md-show bg-primary'">
        <q-toolbar id="toolbarTop" color="primary">
          <!--Logo-->
          <div id="logoImage" :style="`background-image: url('${logo}')`" class="img-as-bg"></div>
          <!--Project name-->
          <q-toolbar-title>{{ projectName }}</q-toolbar-title>
          <!--Actions-->
          <div class="row q-gutter-x-sm items-center">
            <!--== Button User ==-->
            <q-no-ssr>
              <q-btn :to="{name: 'user.profile.me'}" flat v-if="quserState.authenticated" padding="5px" rounded no-caps>
                <div id="profileImage" class="img-as-bg"
                     :style="`background-image: url('${quserState.userData.mainImage}')`"></div>
                <div class="q-ml-xs">{{ quserState.userData.firstName }}</div>
              </q-btn>
            </q-no-ssr>
            <!--Site Actions-->
            <site-actions/>
          </div>
        </q-toolbar>
      </div>

      <!--Toolbar Sub header--->
      <div id="toolbarBottom">
        <q-toolbar id="contentSubHeader" class="q-pa-none row justify-between items-center">
          <!--Left content-->
          <div id="leftContent" class="row items-center">
            <!--== Menu Button ==-->
            <q-btn id="buttonToogleMenu" icon="fas fa-bars" unelevated flat color="primary"
                   class="q-mr-md q-hide q-md-show"
                   @click="$eventBus.$emit('toggleMasterDrawer','menu')"/>
            <!--== Back Button ==-->
            <q-btn icon="fas fa-arrow-left" unelevated round color="primary" class="btn-small q-mr-md"
                   @click="$helper.backHistory()">
              <q-tooltip>{{ $tr('ui.label.back') }}</q-tooltip>
            </q-btn>
            <!--Breadcrum-->
            <div id="breadCrumbContent" class="q-hide q-md-show">
              <q-breadcrumbs class="text-blue-grey">
                <q-breadcrumbs-el v-for="(item, key) in breadcrumbs" :key="key" :label="item.label" :icon="item.icon"
                                  :to="item.to ? {name : item.to} : false"/>
              </q-breadcrumbs>
            </div>
          </div>
        </q-toolbar>
      </div>
    </q-header>
  </div>
</template>
<script>
//Components
import siteActions from '@imagina/qsite/_components/master/siteActions'

export default {
  props: {},
  components: {siteActions},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      projectName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name'),
      logo: this.$store.getters['qsiteApp/getSettingMediaByName']('isite::logo1').path,
      appConfig: config('app'),
      loadHeaderIpanel: false
    }
  },
  computed: {
    //Quser state
    quserState() {
      return this.$store.state.quserAuth
    },
    //Current route
    currentRoute() {
      return this.$route
    },
    //Return all data in extra state store "subHeaderData" merged with currernt data
    subHeaderData() {
      return this.$clone(this.$store.getters['qsiteApp/getExtra']('subHeaderData') || {})
    },
    //Return params of subHeader
    params() {
      return this.currentRoute.meta.subHeader || {}
    },
    //Return data breadcrumd
    breadcrumbs() {
      let response = []
      //Get breadcrumbs from params
      let breadcrumbs = this.params.breadcrumb ? this.$clone(this.params.breadcrumb) : []
      breadcrumbs = this.$clone(breadcrumbs.reverse())

      //Set Home page and current page
      let pages = (this.currentRoute.name.indexOf('app.home') == -1) ?
          [config(`pages.mainqsite.home`), this.currentRoute.meta] : [config(`pages.mainqsite.home`)]

      //Get page from breadcrum
      breadcrumbs.forEach(pageName => pages.splice(1, 0, config(`pages.${pageName}`)))

      //Format all routes to breadcrum
      pages.forEach(page => {
        if (page && page.activated && this.$auth.hasAccess(page.permission))
          response.push({
            label: this.$tr(page.headerTitle || page.title),
            icon: page.icon,
            to: page.name
          })
      })

      //Response
      return response
    }
  },
  methods: {
    init() {
      //Get header ipanel
      //this.getHeaderIpanel()
    },
    //Get html header ipanel
    getHeaderIpanel() {
      if (config('app.mode') == 'ipanel') {
        this.$remember.async({
          key: 'headerIpanelHTML',
          seconds: (3600 * 3),
          refresh: false,
          callBack: () => {
            return new Promise((resolve, reject) => {
              let baseUrl = this.$store.state.qsiteApp.baseUrl
              this.$axios.get(baseUrl + '/isite/header').then(response => {
                resolve(response)
              }).catch(error => {
                console.error('[HEADER-IPANEL]', error.response)
                reject(error.response)
              })
            })
          }
        }).then(response => {
          //Define Template
          var template = document.createElement('template')
          template.innerHTML = response.data

          //Load weeb component
          window.customElements.define('embedded-header-ipanel', class EmbeddedWebview extends HTMLElement {
                connectedCallback() {
                  const shadow = this.attachShadow({mode: 'closed'});
                  shadow.appendChild(document.importNode(template.content, true))
                }
              }
          );

          //Allow load header web component
          this.loadHeaderIpanel = true
        }).catch(error => {
          console.error('[HEADER-IPANEL]', error)
        })
      }
    }
  }
}
</script>
<style lang="stylus">
#masterHeader
  #toolbarTop
    padding-left 8px
    padding-right 10px

    #logoImage
      height 40px
      width 40px
      border-radius 5px

    #profileImage
      height 30px
      width 30px
      border-radius 50%

  #headerIpanel
    background-color transparent
    border-bottom 1px solid $grey-4

    #webComponent
      all initial

  #toolbarBottom
    width 100%
    color $grey-9
    position relative

  #contentSubHeader
    padding 5px 10px 5px 70px
    border-bottom 1px solid $grey-4
    width 100%
    min-height 48px
    position relative
    background-color white

    @media screen and (max-width: $breakpoint-md)
      padding 5px 10px
      background-color $primary


    #buttonToogleMenu
      position absolute
      left 0
      top 0
      height 48px
      width 57px
      border-radius 0
      background-color white
      border-right 1px solid $grey-4

    .q-breadcrumbs
      .q-breadcrumbs__el
        font-size 14px

      .q-icon
        font-size 15px

    #messageFilter
      background white
      border 2px solid $warning
      border-top none
      border-radius 0 0 10px 10px
      padding 0 6px 1px 6px
      position absolute
      margin-right auto
      margin-left auto
      left 0
      right 0
      bottom -23px
      width max-content
</style>
