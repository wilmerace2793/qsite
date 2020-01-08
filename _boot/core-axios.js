import axios from 'axios'

export default function ({app, router, store, Vue, ssrContext}) {
  //=========== Set base url to axios
  let tagsToParceHost = ['http://', 'https://', ':8080', ':3000', 'www.']
  //Get base url
  let host = env('BASE_URL') || (ssrContext ? ssrContext.req.get('host') : window.location.host)
  //Parse host
  tagsToParceHost.forEach(tagToReplace => host = host.replace(tagToReplace, ''))
  if(env('SET_PREFIX_HOST')) host = `${env('SET_PREFIX_HOST')}.${host}`//Add prefix to baseURl
  store.commit('app/SET_BASE_URL', `https://${host}`) //Set base Url in store
  axios.defaults.baseURL = `https://${host}/api`// Set base url in axios
  console.log(`[AXIOS] Registered Host: ${host}`)

  //========== Set default params: setting
  axios.defaults.params = {setting: {}}

  //========== Response interceptor
  axios.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response) {
      let status = error.response.status;
      switch (status) {
        case 401:
          let routeName = router.currentRoute.name
          //Logout
          if ((routeName != 'auth.login') && (routeName != 'auth.change.password'))
            router.push({name: 'auth.logout'})
          break;
      }
    }
    return Promise.reject(error);//Return response error
  })

  //============ Set ignore SSL
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  //axios.defaults.httpsAgent = new https.Agent({rejectUnauthorized: false})

  //============= Set as global
  Vue.prototype.$axios = axios
}
