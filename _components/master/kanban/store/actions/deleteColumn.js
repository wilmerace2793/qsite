import kanbanStore from '../kanbanStore.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function deleteColumn(columnId) {
    try {
        const kanbanColumn = kanbanStore().getKanbanColumn().filter((item) => item.id !== columnId);
        kanbanStore().setKanbanColumn(kanbanColumn);   
        if (!isNaN(columnId)) {
            await baseService.delete('apiRoutes.qrequestable.statuses', columnId)
        }
    } catch (error) {
        console.log(error);
    }
}