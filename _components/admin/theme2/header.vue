<template>
  <div id="masterAdminHeader">
    <!-- HEADER -->
    <q-header>
      <!-- Toolbar  -->
      <div :class="'q-hide q-md-show'">
        <q-toolbar id="toolbarTop">
          <q-btn v-if="appConfig.mode === 'iadmin'" :class="this.miniState ? 'buttonToogleMenuClose' : 'buttonToogleMenuOpen'" icon="fas fa-bars" unelevated 
            class="text-primary" @click="$eventBus.$emit('toggleMasterDrawer','menu')"/>
          <q-toolbar-title/>
          <!--Site Actions-->
          <site-actions/>
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
      logo: this.$store.state.qsiteApp.logo,
      appConfig: config('app'),
      loadHeaderIpanel: false,
      miniState: this.windowSize == 'mobile' ? false : true,
      drawer: {
        menu: this.windowSize == 'mobile' ? false : true,
        config: false,
        chat: false,
        filter: false,
        checkin: false,
        recommendation: false,
        notification: false
      }
    }
  },
  computed: {
    //Quser state
    quserState() {
      return this.$store.state.quserAuth
    }
  },
  methods: {
    init() {
      this.handlerEvent()
      //Get header ipanel
      //this.getHeaderIpanel()
    },
    handlerEvent() {
      //handler toggleMasterDrawer
      this.$eventBus.$on('toggleMasterDrawer', (drawerName) => this.toggleDrawer(drawerName))
      //handler openMasterDrawer
      this.$eventBus.$on('openMasterDrawer', (drawerName) => this.drawer[drawerName] = true)
    },
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
#masterAdminHeader
  .q-header
    background-color white
    .buttonToogleMenuClose
      position absolute
      top 8px
      left 5px
    .buttonToogleMenuOpen
      position absolute
      left -290px
      top 40px
  #toolbarTop
    position relative
</style>
