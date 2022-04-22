<template>
  <div id="masterDrawers2">
    <!-- btn menu -->
    <q-btn v-if="appConfig.mode === 'iadmin'" id="buttonToogleMenu2" icon="fas fa-bars" unelevated :style="`color: ${contrast()}`"
      :class="`q-hide q-md-show`" @click="$eventBus.$emit('toggleMasterDrawer','menu')"/>
    <!-- MENU -->
    <q-drawer id="menuMaster2" class="no-shadow" v-model="drawer.menu" ref="menuMaster"
              :mini="miniState" @click.capture="miniState ? $eventBus.$emit('toggleMasterDrawer','menu') : null">
      <!--Logo-->
      <div id="logoSite2" class="relative-position">
        <q-img v-show="!miniState" contain :src="logo" style="height: 80px; min-height: 80px"/>
        <!--Version-->
        <div id="versionContent" class="absolute absolute-bottom-right text-white">
          <q-icon name="fas fa-code-branch" class="q-mr-xs"/>
          {{ versionText }}
        </div>
      </div>
      <!--List iadmin-->
      <q-scroll-area class="bg-primary" :style="`height: calc(100vh - 146px`">
        <!--Menu-->
        <menu-list ref="menuList" group :translatable="menuTranslatable" :menu="menuSelect"/>
      </q-scroll-area>
    </q-drawer>

    <!-- Config -->
    <q-drawer bordered id="configMaster" overlay v-model="drawer.config" side="right">
      <config-list/>
    </q-drawer>

    <!-- Chat -->
    <q-drawer bordered id="chatMaster" overlay v-model="drawer.chat" side="right"
              v-if="$auth.hasAccess('ichat.conversations.index')">
      <chat-list/>
    </q-drawer>

    <!--Master filter-->
    <q-drawer bordered id="drawerFilterMaster" v-model="drawer.filter" side="right" v-if="filter.load" :overlay="false">
      <master-filter/>
    </q-drawer>

    <!--Recommendation-->
    <q-drawer id="drawerRecommendationMaster" v-model="drawer.recommendation" side="right" :overlay="false"
              v-if="routeSubHeader.recommendations ? true : false">
      <master-recommendation/>
    </q-drawer>

    <!--Notification-->
    <q-drawer bordered id="dawerNotificatiosMaster" v-model="drawer.notification" side="right" overlay
              v-if="$auth.hasAccess('notification.notifications.manage')">
      <master-notifications/>
    </q-drawer>
  </div>
</template>
<script>
//mixins
import sidebarMixins from '@imagina/qsite/_mixins/sidebarMixins'
//Components
import configList from '@imagina/qsite/_components/master/configList'
import chatList from '@imagina/qchat/_components/drawerChatList'
import menuList from '@imagina/qsite/_components/master/recursiveItem'
import masterFilter from '@imagina/qsite/_components/master/masterFilter'
import checkin from '@imagina/qcheckin/_components/checkin'
import masterRecommendation from '@imagina/qsite/_components/master/masterRecommendations'
import masterNotifications from '@imagina/qnotification/_components/drawerNotifications'

export default {
  beforeDestroy() {
    this.$eventBus.$off('toggleMasterDrawer')
    this.$eventBus.$off('openMasterDrawer')
  },
  mixins:[sidebarMixins],
  props: {},
  components: {menuList, configList, chatList, masterFilter, checkin, masterRecommendation, masterNotifications},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWith: window.innerWidth,
      projectName: this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name'),
      logo: this.$store.state.qsiteApp.logo,
      miniState: this.windowSize == 'mobile' ? false : true,
      drawer: {
        menu: this.windowSize == 'mobile' ? false : true,
        config: false,
        chat: false,
        filter: false,
        checkin: false,
        recommendation: false,
        notification: false
      },
      appConfig: config('app'),
      filter: this.$filter
    }
  },
  computed: {
    windowSize() {
      return this.windowWith >= '992' ? 'desktop' : 'mobile'
    },
    primaryContrast() {
      return  this.$store.getters['qsiteApp/getSettingValueByName']('isite::primaryContrast')
    },
    secondaryContrast() {
      return  this.$store.getters['qsiteApp/getSettingValueByName']('isite::secondaryContrast')
    },
    routeSubHeader() {
      this.drawer.recommendation = false
      return this.$route.meta.subHeader || {}
    },
    //Version app text
    versionText() {
      return 'v' + config('app.version')
    },
  },
  methods: {
    //init
    init() {
      this.handlerEvent()
      this.contrast()
      //Watch window size
      window.addEventListener('resize', () => {
        this.windowHeight = window.innerHeight
        this.windowWith = window.innerWidth
      })
    },
    //contrast color alter
    contrast() {
      const master = document.querySelector('#masterDrawers2')
      if(!master) return '#000000';
      const bgColor = getComputedStyle(master).getPropertyValue('--q-color-primary')
      const contrast = this.$helper.pickTextColor(bgColor)
      const bgColor2 = getComputedStyle(master).getPropertyValue('--q-color-secondary')
      const contrast2 = this.$helper.pickTextColor(bgColor2)
      this.primaryContrast ? master.style.setProperty('--q-color-contrast',this.primaryContrast) : master.style.setProperty('--q-color-contrast',contrast)
      this.secondaryContrast ? master.style.setProperty('--q-color-contrast-two',this.secondaryContrast) : master.style.setProperty('--q-color-contrast-two',contrast2)
      return this.primaryContrast ? this.primaryContrast : contrast
    },
    handlerEvent() {
      //handler toggleMasterDrawer
      this.$eventBus.$on('toggleMasterDrawer', (drawerName) => this.toggleDrawer(drawerName))
      //handler openMasterDrawer
      this.$eventBus.$on('openMasterDrawer', (drawerName) => this.drawer[drawerName] = true)
    },
    //Show drawer specific
    toggleDrawer(drawerName) {
      //Hidden all drawers
      for (var drawer in this.drawer) {
        if (drawer != drawerName) {
          if ((drawer == 'menu') && (this.windowSize != 'mobile')) {
            this.miniState = true
          } else if (drawer == 'recommendation') {
            this.drawer[drawer] = (this.windowSize == 'mobile') ? false : true
          } else this.drawer[drawer] = false
        }
      }
      //Toogle drawer
      if (drawerName == 'menu') {
        if (this.windowSize == 'mobile') {
          this.miniState = false
          this.drawer.menu = !this.drawer.menu
        } else {
          this.drawer.menu = true
          this.miniState = !this.miniState
        }
      } else {
        this.drawer[drawerName] = !this.drawer[drawerName]
      }
    }
  }
}
</script>
<style lang="stylus">
#masterDrawers2
  background-color $primary
  #buttonToogleMenu2
    background var(--q-color-primary)
    position fixed
    z-index 6
    padding-top 1px
    border-radius 0%
    top 104px
    width 57px
  #drawerRecomendationMaster
    .q-drawer
      max-height max-content

    .q-drawer__content
      background white

  #menuMaster2
    aside
      background $primary
      z-index 5
    #logoSite2
      padding 20px 25px 26px 25px
      height 140px
      background-color #FFFFFF

    #versionContent
      padding 3px 15px
      font-size 13px

    .q-expansion-item
      background-color $grey-3

    .q-expansion-item__container
      .q-expansion-item__content
        padding 0px
        border-left 21px solid $primary
        #listMenu
          .content-item
            border-left 3px solid $secondary

    .q-item
      padding-left 0
      min-height 40px
      color var(--q-color-contrast)
      background $primary
      .q-item__section--side
        color var(--q-color-contrast)
      .q-item__section--avatar
        padding 0 18px !important

        .q-icon
          font-size 20px
          color var(--q-color-contrast)

      &:hover
        background-color $secondary
        color var(--q-color-contrast-two)
        border-radius 0%
        .q-icon
          color var(--q-color-contrast-two)
          font-size 22px

      &.item-is-active
        background-color $secondary
        border-radius 0%
        .q-item__section, .q-icon
          color var(--q-color-contrast-two)

    .expansion-selected
      background-color $primary

</style>
