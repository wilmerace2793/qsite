import getCardList from './getCardList.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function getKanbanCardList(column, page) {
    try {
        const parameters = {params: {},refresh: true}
        parameters.params.include = 'category,status,fields,files,comments,creator,requestedBy';
        parameters.params.filter = { statusId: column.id };
        parameters.params.page = page;
        parameters.params.take = 10;
        const response = await baseService.index('apiRoutes.qrequestable.requestables', parameters);
        return getCardList(response);
    } catch (error) {
        console.log(error);
    }
}