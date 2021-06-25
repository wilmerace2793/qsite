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
            <q-btn v-for="(btn, keyAction) in siteActions" :key="keyAction" v-bind="btn.props"
                   v-if="btn.vIf != undefined ? btn.vIf : true" @click="btn.action != undefined ? btn.action() : null">
              <q-tooltip>{{ btn.label }}</q-tooltip>
            </q-btn>
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
            <q-btn icon="fas fa-arrow-left" unelevated round color="primary" class="btn-action q-mr-md"
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
          <!--Right content-->
          <div id="rightContent" class="row items-center q-gutter-x-sm">
            <!--== Button export ==-->
            <master-export/>
            <!--Page Actions-->
            <q-btn v-for="(btn, keyAction) in pageActions" :key="keyAction" v-bind="btn.props"
                   v-if="btn.vIf != undefined ? btn.vIf : true" @click="btn.action != undefined ? btn.action() : null">
              <q-tooltip>{{ btn.label }}</q-tooltip>
            </q-btn>
          </div>
          <!--Message if page has filter-->
          <div id="messageFilter" class="cursor-pointer text-caption" v-if="filter.hasValues"
               @click="$eventBus.$emit('toggleMasterDrawer','filter')">
            <q-icon name="fas fa-exclamation" size="12px" color="warning"/>
            {{ $tr('ui.message.pageDataWithFilter') }}
          </div>
        </q-toolbar>
      </div>
    </q-header>
  </div>
</template>
<script>
//Components
import masterExport from "@imagina/qsite/_components/master/masterExport"

export default {
  beforeDestroy() {
    this.$eventBus.$off('header.badge.manage')
  },
  props: {},
  components: {masterExport},
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
      filter: this.$filter,
      appConfig: config('app'),
      badge: {
        chat: false,
        notification: false
      },
      loadHeaderIpanel: false
    }
  },
  computed: {
    //Site Actions
    siteActions() {
      //Default buttons props
      let defaultButtonProps = {
        round: true,
        dense: true,
        color: "white",
        unelevated: true,
        class: "btn-action",
        textColor: "primary"
      }

      return {
        //Go To Site
        goToSite: {
          label: this.$tr('ui.configList.goToSite'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-eye',
            type: 'a',
            href: this.$store.state.qsiteApp.baseUrl,
            target: '_blank'
          }
        },
        //Chat
        chat: {
          label: 'Chat',
          vIf: this.$auth.hasAccess('ichat.conversations.index'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-comment-alt',
            class: `btn-action ${this.badge.chat ? 'active-badge' : ''}`
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'chat')
        },
        //Notifications
        notifications: {
          label: this.$trp('ui.label.notification'),
          vIf: this.$auth.hasAccess('notification.notifications.manage'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-bell',
            class: `btn-action ${this.badge.notification ? 'active-badge' : ''}`
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'notification')
        },
        //Settings
        settings: {
          label: this.$trp('ui.label.setting'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-cog'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'config')
        }
      }
    },
    //Page Actions
    pageActions() {
      //Default buttons props
      let defaultButtonProps = {
        round: true,
        dense: true,
        unelevated: true,
        color: "primary",
        class: "btn-action",
        textColor: "white"
      }

      return {
        //recommendations
        recommendations: {
          label: this.$trp('ui.label.recommendation'),
          vIf: this.params.recommendations ? true : false,
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-hat-wizard'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'recommendation')
        },
        //Filter
        filter: {
          label: this.$tr('ui.label.filter'),
          vIf: this.filter.load,
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-filter'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'filter')
        },
        //Refresh
        refresh: {
          label: this.$trp('ui.label.refresh'),
          vIf: this.params.refresh,
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-redo'
          },
          action: () => {
            this.$root.$emit('page.data.refresh')
            this.$root.$emit('crud.data.refresh')
            this.$root.$emit('export.data.refresh')
          }
        },
      }
    },
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
      //Manage badges to button actions
      this.$eventBus.$on('header.badge.manage', (response) => {
        Object.keys(response).forEach(name => this.badge[name] = response[name])
      })
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

  .btn-action
    .q-btn__wrapper
      min-height 30px !important
      min-width 30px !important
      padding 5px

      .q-icon
        font-size 16px !important

    &.active-badge
      &:after
        position absolute
        content ''
        height 12px
        width 12px
        background red
        border-radius 50%
        right -2px
        top -2px
</style>
