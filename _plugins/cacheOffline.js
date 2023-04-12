import cache from "@imagina/qsite/_plugins/cache";
import Vue from 'vue'

class cacheOffline {
  constructor() {}

  async addNewRecord(apiRoute, data = {}) {
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    cacheResponse.data.unshift({...data})
    cache.set(route, cacheResponse);
  }
}

const cacheOff = new cacheOffline()

export default cacheOff