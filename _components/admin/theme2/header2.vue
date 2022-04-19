<template>
  <div id="masterAdminHeader">
    <!-- HEADER -->
    <q-header>
      <!-- Toolbar  -->
      <div :class="'q-hide q-md-show bg-white'">
        <q-toolbar id="toolbarTop" color="dark">
          <q-btn id="buttonToogleMenu" icon="fas fa-bars" unelevated color="bg-white"
            :style="`${btnPosition}`" @click="handlerBtn()"/>
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
      position: false
    }
  },
  computed: {
    //Quser state
    quserState() {
      return this.$store.state.quserAuth
    },
    btnPosition () {
      return this.position ? 'left: -280px' : 'left: -45px'
    }
  },
  methods: {
    init() {
      //Get header ipanel
      //this.getHeaderIpanel()
    },
    handlerBtn(){
      this.$eventBus.$emit('toggleMasterDrawer','menu')
      this.position = !this.position
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

  #toolbarTop
    position relative
    padding-left 0
    padding-right 10px

    #buttonToogleMenu
      position absolute
      top 45px
      height 36px
      width 36px
      border-radius 50%

      .q-icon
        font-size 16px
        color #000 !important

    .q-breadcrumbs
      .q-breadcrumbs__el
        font-size 14px

      .q-breadcrumbs__separator
        font-size 14px
        padding 0 3px    
</style>
