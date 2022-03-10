import appConfig from 'src/config/app'
import ArrayMethods from '@imagina/qsite/_plugins/array'

class AutoLoadSidebars {
  getMenu(menuItems, pages) {
    const menu = []
    if (menuItems && pages) {
      menuItems.map((menuItem) => {
        //Search menu item page
        let itemPage = pages.find(({id}) => id == menuItem.pageId)
        //Add menuItem to response
        menu.push({
          id: menuItem.id,
          parentId: menuItem.parentId,
          title: menuItem.title,
          icon: menuItem.icon,
          name: itemPage ? itemPage.options.name : null,
          permission: itemPage ? itemPage.options.permission : null,
          activated: itemPage ? itemPage.status : true
        })
      });
<<<<<<< HEAD
=======
      //Response
>>>>>>> e6635da01e6790cf1951b1da1d21c43797c1a13c
      return ArrayMethods.builTree(menu)
    }
  }
}

//Create Class
const autoLoadSidebar = new AutoLoadSidebars()
//Default export
export default autoLoadSidebar
