import baseService from '@imagina/qcrud/_services/baseService.js'
import store from '../index';
import _ from 'lodash'

export default async function showRevisions(id: number): Promise<void> {
    try {
        const params = {
            refresh: true,
            params: {
                //include: "creator",
                filter: {
                    filterEntity: 'newValue'
                },
            }
        }
        const response = await baseService.show('apiRoutes.qsite.revisions', id,params);
        response.data.newValue = _.mapKeys(JSON.parse(response.data.newValue), (v, k) => _.camelCase(k));
        response.data.oldValue = _.mapKeys(JSON.parse(response.data.oldValue), (v, k) => _.camelCase(k));
        store.revision = response.data;
    } catch (error) {
      console.log(error, 'showRevisions');
    }
}