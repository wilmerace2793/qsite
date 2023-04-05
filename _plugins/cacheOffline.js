import cache from "@imagina/qsite/_plugins/cache";
import Vue from 'vue'

class cacheOffline {
  constructor() {}

  async addNewRecord(apiRoute, data = {}) {
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    console.log(cacheResponse);
    data.id = Vue.prototype.$uid();
    cacheResponse.data.unshift({...data})
    console.log(cacheResponse);
    cache.set(route, cacheResponse);
  }
}

const cacheOff = new cacheOffline()

export default cacheOff