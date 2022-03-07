import appConfig from 'src/config/app'
//class
import ArrayMethods from '@imagina/qsite/_plugins/array'
//import pagesConfig from 'src/config/pages'

class AutoLoadSidebars {
  /* constructor() {
    this.sidebar = {}
    this.modules = appConfig.modules
  } */
  
  getMenu (menuItems, pages) {
    const menu = []
    if (menuItems && pages) {
      menuItems.map((items) => {
        let item = pages.find(({id}) => id === items.pageId)
        if(item) {
          menu.push({
            id: items.id,
            parentId: items.parentId,
            title: items.title,
            icon: items.icon,
            name: item.options.name,
            permission: item.options.permission,
            activated: item.options.activated
          })
        } else {
          menu.push({
            id: items.id,
            parentId: items.parentId,
            title: items.title,
            icon: items.icon,
          })
        } 
      });
    return ArrayMethods.builTree(menu)
    }
  }
  
 /* //Add perzonalization/settings page
  loadPerzonalizationSidebar(pagesConfig) {
    this.modules.forEach(moduleName => {
      if (pagesConfig[moduleName].personalization) {
        if (this.sidebar[moduleName] && this.sidebar[moduleName].children) {
          this.sidebar[moduleName].children.push(pagesConfig[moduleName].personalization)
        }
      }
    })
  } */
}

//Create Class
const autoLoadSidebar = new AutoLoadSidebars()
//Default export
export default autoLoadSidebar
