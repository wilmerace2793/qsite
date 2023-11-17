import cache from "@imagina/qsite/_plugins/cache";
import Vue from 'vue'

class cacheOffline {
  constructor() {}

  async addNewRecord(apiRoute=null, data = {}) {
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    await cache.remove(apiRoute);
    await cacheResponse.data.unshift({...data})
    await cache.set(route, cacheResponse);
    return true;
  }

  async updateRecord(apiRoute=null, data = {}){
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    const records = await cacheResponse.data.map(WO => WO.id === data.id ? {...WO, ...data} : WO);
    await cache.set(route, {data: records});
    return true;
  }

  async updateList(apiRoute=null, data){
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };

    const newDataInCache = structuredClone(cacheResponse)
    newDataInCache.data.push({ ...data })
    await cache.set(route, newDataInCache);
    return true;
  }

  async deleteItem(itemId, apiRoute=null){
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };

    const workOrders = structuredClone(cacheResponse)
    console.log({itemId})
    const index = workOrders.data.findIndex(workOrder => workOrder.id === itemId)
    console.log({index})
    const deleteAS = workOrders.data.splice(index, 1)
    console.log({deleteAS})
    await cache.set(route, { ...workOrders });
    return true;
  }

  async getAllWorkOrderList(apiRoute=null){
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    return await cache.get.item(route) || { data: [] };
  }

  async getItemById(itemId, apiRoute=null){
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };
    const record = await cacheResponse.data.find(WO => WO.id === itemId);
    return record;
  }
}

const cacheOff = new cacheOffline()

export default cacheOff