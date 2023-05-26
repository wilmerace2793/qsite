import baseService from '@imagina/qcrud/_services/baseService.js'
import store from '../index';

export default async function getRevisions(page = 1) {
    try {
        store.loading = true;
        const params = {
            params: {
                include: "creator",
                filter: {
                    revisionableType: store.revisionableType,
                    revisionableId: store.revisionableId
                },
                page,
                take: 10,
            }
        }
        const response = await baseService.index('apiRoutes.qsite.revisions', params);
        store.dataTable = response;
        store.loading = false;
    } catch (error) {
      console.log(error, 'getRevisions');
    }
}
