//class
import AutoLoadSidebars from '@imagina/qsite/_config/master/application/menu'

export default {
  data() {
    return {
      menu: []
    }
  },
  created() {
    this.menu = AutoLoadSidebars.getMenu(
      this.$clone(this.$store.getters['qsiteApp/getMenu']),
      this.$clone(this.$store.state.qsiteApp.pages)
    )
  },
}
