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
      this.$store.getters['qsiteApp/getMenu'], 
      this.$store.state.qsiteApp.pages
    )
  },
}
