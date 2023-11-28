import cache from "@imagina/qsite/_plugins/cache";

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

    const dataInCache = structuredClone(cacheResponse)
    const records = await dataInCache.data.map(item => 
      String(item.id) === String(data.id) ? {...item, ...data} : item
    );
    const newData = {
      ...dataInCache,
      data: records
    }
    await cache.set(route, { ...newData });
    return true;
  }

  async updateList(apiRoute=null, data){
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };

    const dataInCache = structuredClone(cacheResponse)
    dataInCache.data.push({ ...data })
    await cache.set(route, dataInCache);
    return true;
  }

  async deleteItem(itemId, apiRoute=null){
    if (!apiRoute) return []
    const route = `${apiRoute}::offline`;
    const cacheResponse = await cache.get.item(route) || { data: [] };

    const dataInCache = structuredClone(cacheResponse)
    const index = dataInCache.data.findIndex(
      item =>  String(item.id) === String(itemId)
    )
    if (index < 0) return null
    dataInCache.data.splice(index, 1)
    await cache.set(route, { ...dataInCache });
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
    const record = await cacheResponse.data.find(
      item => item.id === itemId
      );
    return record;
  }
}

const cacheOff = new cacheOffline()

export default cacheOff