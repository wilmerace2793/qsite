import kanbanStore from '../kanbanStore.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function saveStatusOrdering() {
    try {
        const statusId = kanbanStore().getKanbanColumn().map(item => ({ id: item.id }));
        await baseService.create('apiRoutes.qrequestable.orderStatus', { category: statusId })
    } catch (error) {
        console.log(error);
    }
}