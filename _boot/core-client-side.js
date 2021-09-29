import {Notify, Loading} from 'quasar'
import helper from '@imagina/qsite/_plugins/helper'

export default async ({app, router, store, Vue}) => {
  //Loading
  if (!process.env.isExtension) Loading.show()

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

  //======= Load message Install as native APP(PWA)
  /*window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    console.warn('>>>>>>>>>',e)

    //Notify to install as Native APP
    Notify.create({
      message: 'Do you want install as native APP?',
      timeout: 0, // You can adjust this, use 0 for infinite
      closeBtn: 'Close',
      actions: [
        {
          label: 'Install',
          icon: 'get_app',
          color: 'white',
          handler () {
            e.prompt()
          }
        }
      ]
    })
  });*/
}
