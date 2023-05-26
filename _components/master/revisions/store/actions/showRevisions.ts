import baseService from '@imagina/qcrud/_services/baseService.js'
import store from '../index';

export default async function showRevisions(id: number) {
    try {
        const params = {
            params: {
                //include: "createdBy",
                filter: {
                    filterEntity: true
                },
            }
        }
        const response = await baseService.show('apiRoutes.qsite.revisions', id,params);
        console.log(response);
        
    } catch (error) {
      console.log(error, 'showRevisions');
    }
}