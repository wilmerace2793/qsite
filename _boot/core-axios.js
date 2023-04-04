import axios from 'axios'
import alert from '@imagina/qsite/_plugins/alert'
import cache from '@imagina/qsite/_plugins/cache'

export default function ({app, router, store, Vue, ssrContext}) {
  //=========== Set base url to axios
  let baseUrl = config('app.baseUrl')
  let tagsToParceHost = ['http://', 'https://', ':8080', ':3000', 'www.']
  //Get base url
  let rootHost = baseUrl || (ssrContext ? ssrContext.req.get('host') : window.location.host)
  let host = rootHost
  //Parse host if not exist in .env
  if (!baseUrl) {
    tagsToParceHost.forEach(tagToReplace => host = host.replace(tagToReplace, ''))
    if (rootHost.indexOf('www') != -1) host = `www.${host}`//Set again WWW
    host = `https://${host}` //Add protocol
  }
  store.commit('qsiteApp/SET_BASE_URL', host) //Set base Url in store
  store.commit('qsiteApp/SET_ORIGIN_URL', (ssrContext ? ssrContext.req.get('origin') : window.location.origin)) //Set origin Url in store
  axios.defaults.baseURL = `${host}/api`// Set base url in axios
  console.log(`[AXIOS] Registered Host: ${host}`)

  //========== Set default params: setting
  axios.defaults.params = {setting: {}}

  //========== Show alert from interceptor
  function showMessages(messages = []) {
    messages.forEach(item => {
      if(item.message !== '') { 
        alert[item.type || 'info'](item)
      }
    })
  }
  async function addRequestDB(request) {
    const objReq = {
        _id: new Date().toISOString(),
        ...request
    };
    const allRequests = await cache.get.item('requests') || [];
    allRequests.push(objReq);
    cache.set('requests', allRequests)
}
  //========== Request interceptor
  axios.interceptors.request.use(async function (config) {
    // Do something before request is sent
    if (!navigator.onLine){
      const titleOffline = config.data.titleOffline || config.params.titleOffline;
      const user = await cache.get.item('sessionData');
      const request = {
        url: config.baseURL + config.url,
        headers: config.headers,
        method: config.method,
        body: JSON.stringify(config.data),
        createdAt: new Date().getTime(),
        userId: user.userData.id,
        status: 'pending',
        httpStatus: 0,
        errorLog: '',
        params: config.params,
        titleOffline,
      };
      addRequestDB(request);
    }

    store.dispatch('quserAuth/REFRESH_TOKEN');
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  //========== Response interceptor
  axios.interceptors.response.use((response) => {
    //Show messages
    if (response.data && response.data.messages) showMessages(response.data.messages)
    //Response
    return response;
  }, (error) => {
    //Show messages
    if (error.response.data && error.response.data.messages) showMessages(error.response.data.messages)
    //Response
    if (error.response) {
      let status = error.response.status;
      switch (status) {
        case 401:
          let routeName = router.currentRoute.name
          //Logout
          if ((routeName != 'auth.login') && (routeName != 'auth.change.password'))
            router.push({name: 'auth.logout'})
          break;
        case 400://Intercep request errors to show alert message
          if (error.response.data && error.response.data.errors) {
            //Get messages
            let errorsRequest = JSON.parse(error.response.data.errors)
            //Instance alert message
            if (Object.keys(errorsRequest).length) {
              showMessages([{
                type: 'error',
                message: Object.values(errorsRequest).map(item => `<div>• ${item.join(',')}</div>`).join('')
              }])
            }
          }
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
