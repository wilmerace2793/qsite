import helper from '@imagina/qsite/_plugins/helper'

export default async ({app, router, store, Vue}) => {
  //====== Reset Service Worker
  if (navigator && navigator.serviceWorker && navigator.serviceWorker.controller
    && navigator.serviceWorker.controller.postMessage) {//Reset Service Worker
    navigator.serviceWorker.controller.postMessage({
      msg: "clearCache"
    });
  }

  //====== Load colors
  store.dispatch('qsiteApp/SET_SITE_COLORS')
  //====== Load extra state in store
  store.dispatch('qsiteApp/SET_EXTRA')

  //====== laod cdn google maps
  let apiKey = store.getters['qsiteApp/getSettingValueByName']('isite::api-maps')
  if (apiKey) helper.loadCDN(`https://maps.googleapis.com/maps/api/js?offset=5&key=${apiKey}&libraries=places`)
}
