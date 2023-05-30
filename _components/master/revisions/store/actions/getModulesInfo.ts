import baseService from '@imagina/qcrud/_services/baseService.js'
import store from '../index';
import pluginsArray from '@imagina/qsite/_plugins/array.js';

export default async function getModulesInfo(moduleName: string): Promise<void> {
    try {
        const params = {
            refresh: true,
            params: {
                filter: {asSelect: true},
            }
        }
        const response = await baseService.index('apiRoutes.qsite.modulesInfo', params);
        store.modulesList = pluginsArray.tree(response.data);
    } catch (error) {
      console.log(error, 'getModulesInfo');
    }
}