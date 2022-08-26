import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js'
const modelPayload = {
    id: null,
    title: null,
    color: null,
    value: 1,
    categoryId: null,
}
const state = reactive({
    kanbanColumn: [],
    funnelList: [],
    funnelSelected: '4',
    loading: false,
    inputDynamicField: {
        value: null,
        type: 'input',
        isFakeField: true,
        props: {
            clearable: true,
        },
    },
    payloadStatus: { ...modelPayload },
});

export default function kanbanStore() {
    function getKanbanColumn() {
        return state.kanbanColumn;
    }
    function addColumn(index) {
        const counter = `kanban-${state.kanbanColumn.length + 1}`;
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        state.kanbanColumn.splice(index + 1, 0, {
            id: counter,
            title: null,
            color: `#${randomColor}`,
            data: [],
            loading: false,
            page: 1,
            total: 0,
            new: true,
        })
    }
    async function deleteColumn(columnId) {
        try {
            state.kanbanColumn = state.kanbanColumn.filter((item) => item.id !== columnId);
            if(!isNaN(columnId)) {
                await baseService.delete('apiRoutes.qrequestable.statuses', columnId)
            }
        } catch (error) {
            console.log(error);
        }
    }
    function deleteKanbanCard(columnId, cardId) {
        const column = state.kanbanColumn.find(item => item.id === columnId);
        if (column) {
            column.data = column.data.filter(item => item.id !== cardId);
        }
    }
    async function getColumns() {
        try {
            showLoading();
            let parameters = {
                params: {
                    include: 'category',
                    filter: { categoryId: state.funnelSelected },
                },
                refresh: true,
            }
            const response = await baseService.index('apiRoutes.qrequestable.statuses', parameters)
            const kanbanColumn = response.data.map((item, index) => {
                return {
                    id: item.id,
                    title: item.title,
                    color: item.color,
                    data: [],
                    page: 1,
                    total: 0,
                    loading: false,
                    new: false,
                    position: index
                }
            })
            kanbanColumn.forEach(async (column) => {
                const kanbanCard = await getKanbanCard(column);
                column.data = kanbanCard.data;
                column.loading = false;
                column.total = kanbanCard.total;
            });
            setKanbanColumn(kanbanColumn);
            hideLoading();
        } catch (error) {
            hideLoading();
            setKanbanColumn([]);
            console.log(error);
        }

    }
    function setKanbanColumn(data) {
        state.kanbanColumn = data;
    }
    async function getKanbanCard(column, page = 1) {
        try {
            column.loading = true;
            return getKanbanCardList(column, page);
        } catch (error) {
            column.loading = false;
            console.log(error);
        }
    }
    async function addKanbanCard(column, page) {
        const kanbancolumn = state.kanbanColumn.find(item => item.id === column.id);
        if (kanbancolumn) {
            const kanbanCard = await getKanbanCardList(column, page);
            if (kanbanCard.data.length > 0) {
                kanbancolumn.data.push(...kanbanCard.data);
            }
        }
    }
    function setFunnelList(data) {
        state.funnelList = data;
    }
    function getFunnelList() {
        return state.funnelList;
    }
    function getFunnelSelected() {
        return state.funnelSelected;
    }
    function setFunnelSelected(value) {
        state.funnelSelected = value;
    }
    function getLoading() {
        return state.loading;
    }
    function hideLoading() {
        state.loading = false;
    }
    function showLoading() {
        state.loading = true;
    }
    async function getKanbanCardList(column, page) {
        try {
            let parameters = {
                params: {
                    include: 'category,status,fields,files,comments,creator,requestedBy',
                    filter: { statusId: column.id },
                    page,
                    take: 10
                },
                refresh: true,
            }
            const response = await baseService.index('apiRoutes.qrequestable.requestables', parameters)
            return {
                total: response.meta.page.total,
                data: response.data.map(card => ({
                    id: card.id,
                    title: `${card.creator.firstName} ${card.creator.lastName}`,
                    type: card.type,
                    createdAt: card.createdAt,
                    fields: card.fields,
                    category: card.category
                }))
            }
        } catch (error) {
            console.log(error);
        }
    }
    function setResetPage() {
        state.kanbanColumn.forEach((item) => {
            item.page = 1;
        })
    }
    function getInputDynamicField() {
        return state.inputDynamicField;
    }
    function reorder(type) {
        state[type].forEach((item, index) => {
            item.position = index;
        });
    }
    async function saveStatusOrdering() {
        try {
            const statusId = state.kanbanColumn.map(item => ({ id: item.id }));
            await baseService.create('apiRoutes.qrequestable.orderStatus', { category: statusId })
        } catch (error) {
            console.log(error);
        }
    }
    async function saveColumn(data) {
        try {
            state.payloadStatus.title = data.title;
            state.payloadStatus.color = data.color;
            state.payloadStatus.categoryId = state.funnelSelected;
            return await baseService.create('apiRoutes.qrequestable.statuses', state.payloadStatus)
        } catch (error) {
            console.log(error);
            setPayloadStatus();
        }
    }
    async function updateColumn(data) {
        try {
            state.payloadStatus.id = data.id;
            state.payloadStatus.title = data.title;
            state.payloadStatus.color = data.color;
            state.payloadStatus.categoryId = state.funnelSelected;
            await baseService.update('apiRoutes.qrequestable.statuses', data.id, state.payloadStatus)
        } catch (error) {
            console.log(error);
            setPayloadStatus();
        }
    }
    function setPayloadStatus() {
        state.payloadStatus = { ...modelPayload };
    }
    return {
        getKanbanColumn,
        addColumn,
        deleteColumn,
        addKanbanCard,
        deleteKanbanCard,
        getColumns,
        getFunnelList,
        setFunnelList,
        setFunnelSelected,
        getFunnelSelected,
        getLoading,
        hideLoading,
        showLoading,
        getKanbanCardList,
        setResetPage,
        getInputDynamicField,
        reorder,
        saveStatusOrdering,
        saveColumn,
        updateColumn,
        setPayloadStatus,
    }
}