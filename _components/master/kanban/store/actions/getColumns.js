import kanbanStore from '../kanbanStore.js';
import getKanbanColumns from './getKanbanColumns.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function getColumns() {
    try {
        kanbanStore().showLoading();
        const parameters = {params: {},refresh: true}
        parameters.params.include = 'category';
        parameters.params.filter = {categoryId: kanbanStore().getFunnelSelected() };
        const response = await baseService.index('apiRoutes.qrequestable.statuses', parameters)
        const kanbanColumn = getKanbanColumns(response.data);
        kanbanStore().setKanbanColumn(kanbanColumn);
        kanbanStore().hideLoading();
    } catch (error) {
        kanbanStore().hideLoading();
        kanbanStore().setKanbanColumn([]);
        console.log(error);
    }
}