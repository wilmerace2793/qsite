import kanbanStore from '../kanbanStore.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function saveColumn(data) {
    try {
        const payloadStatus = kanbanStore().getPayloadStatus();
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus.categoryId = kanbanStore().getFunnelSelected();
        return await baseService.create('apiRoutes.qrequestable.statuses', payloadStatus)
    } catch (error) {
        console.log(error);
        kanbanStore().setPayloadStatus();
    }
}