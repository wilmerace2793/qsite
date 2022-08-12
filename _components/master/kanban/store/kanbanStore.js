import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js'
const state = reactive({
    kanbanColumn: [],
    funnelList: [],
    funnelSelected: '1',
    loading: false,
});

export default function kanbanStore() {
    function getKanbanColumn() {
        return state.kanbanColumn;
    }
    function addColumn(column) {
        const counter = state.kanbanColumn.length + 1;
        state.kanbanColumn.push({
            id: counter,
            name: column.name + counter,
            icon: column.icon,
            data: column.data,
        })
    }
    function deleteColumn(columnId) {
        state.kanbanColumn = state.kanbanColumn.filter((item) => item.id !== columnId);
    }
    function addKanbanCard(columnId, data) {
        const column = state.kanbanColumn.find(item => item.id === columnId);
        if (column) {
            column.data.push({ ...data });
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
            const kanbanColumn = response.data.map((item) => {
                return { id: item.id, name: item.title, color: item.color, data: [] }
            })
            kanbanColumn.forEach(async (column) => {
                column.data = await getKanbanCard(column)
                column.loading = false;
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
    async function getKanbanCard(column) {
        try {
            column.loading = true;
            let parameters = {
                params: {
                    include: 'category,status,fields,files,comments,creator,requestedBy',
                    filter: { statusId: column.id },
                    page: 1,
                    take: 10
                },
                refresh: true,
            }
            const response = await baseService.index('apiRoutes.qrequestable.requestables', parameters)
            return response.data.map(card => ({
                id: card.id,
                title: `${card.creator.firstName} ${card.creator.lastName}`,
                type: card.type,
                createdAt: card.createdAt,
                fields: card.fields,
                category: column.category
            }));
        } catch (error) {
            column.loading = false;
            console.log(error);
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
    }
}