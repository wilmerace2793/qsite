import kanbanStore from '@imagina/qsite/_components/master/kanban/store/kanbanStore.js';
import baseService from '@imagina/qcrud/_services/baseService.js';

export default async function getFunnel() {
    try {
        const response = await baseService.index('apiRoutes.qrequestable.categories');
        kanbanStore().setFunnelList(response.data);
        const funnel = response.data.shift();
        kanbanStore().setFunnelSelected(funnel.id);
    } catch (error) {
        console.log(error);
    }
}