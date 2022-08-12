import { reactive } from '@vue/composition-api';
import baseService from '@imagina/qcrud/_services/baseService.js'
const state = reactive({
    kanbanColumn: [],
    funnelList: [],
    funnelSelected: '4',
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
                return { id: item.id, name: item.title, color: item.color, data: [], page: 1, total: 0 }
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
    }
}