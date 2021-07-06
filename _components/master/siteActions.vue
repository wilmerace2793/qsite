<template>
  <div id="siteActionscomponent">
    <div :class="`row q-gutter-${gutter}`">
      <!--Actions-->
      <q-btn v-for="(btn, keyAction) in actions" :key="keyAction" v-bind="btn.props"
             v-if="btn.vIf != undefined ? btn.vIf : true" @click="btn.action != undefined ? btn.action() : null">
        <q-tooltip>{{ btn.label }}</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
<script>
export default {
  beforeDestroy() {
    this.$eventBus.$off('header.badge.manage')
  },
  props: {
    gutter: {type: String, default: 'sm'},
    size: {type: String, default: 'small'},
  },
  components: {},
  watch: {},
  mounted() {
    this.$nextTick(function () {
      this.init()
    })
  },
  data() {
    return {
      badge: {
        chat: false,
        notification: false
      }
    }
  },
  computed: {
    //Return params of subHeader
    params() {
      return this.$clone(this.$route.meta.subHeader || {})
    },
    //Site Actions
    actions() {
      //Default buttons props
      let defaultButtonProps = {
        round: true,
        dense: true,
        color: "white",
        unelevated: true,
        class: "btn-small",
        textColor: "primary"
      }

      return [
        //Go To Site
        {
          name: 'goToSite',
          label: this.$tr('ui.configList.goToSite'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-eye',
            type: 'a',
            href: this.$store.state.qsiteApp.baseUrl,
            target: '_blank'
          }
        },
        //checking
        {
          name: 'checking',
          label: this.$tr('qcheckin.sidebar.checkin'),
          vIf: (config('app.mode') == 'ipanel') && this.$auth.hasAccess('icheckin.shifts.create'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-stopwatch'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'checkin')
        },
        //Chat
        {
          name: 'chat',
          label: 'Chat',
          vIf: (config('app.mode') == 'iadmin') && this.$auth.hasAccess('ichat.conversations.index'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-comment-alt',
            class: `btn-small ${this.badge.chat ? 'active-badge' : ''}`
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'chat')
        },
        //Notifications
        {
          name: 'notifications',
          label: this.$trp('ui.label.notification'),
          vIf: this.$auth.hasAccess('notification.notifications.manage'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-bell',
            class: `btn-small ${this.badge.notification ? 'active-badge' : ''}`
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'notification')
        },
        //Settings
        {
          name: 'settings',
          label: this.$trp('ui.label.setting'),
          vIf: (config('app.mode') == 'iadmin'),
          props: {
            ...defaultButtonProps,
            icon: 'fas fa-cog'
          },
          action: () => this.$eventBus.$emit('toggleMasterDrawer', 'config')
        }
      ]
    },
  },
  methods: {
    init() {
      //Manage badges to button actions
      this.$eventBus.$on('header.badge.manage', (response) => {
        Object.keys(response).forEach(name => this.badge[name] = response[name])
      })
    }
  }
}
</script>
<style lang="stylus">
</style>
