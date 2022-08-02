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
    function getColumns() {
        showLoading();
        let parameters = {
            params: {
              filter: {categoryId: state.funnelSelected},
            },
            refresh: true,
        }
        baseService.index('apiRoutes.qrequestable.statuses',parameters)
            .then((item) => {
                const kanbanColumn = item.data.map(item => {
                    const data = getKanbanCard(item)
                    return { id: item.id, name: item.title, data }
                })
                setKanbanColumn(kanbanColumn);
                hideLoading();
            }).catch((err) => {
                hideLoading();
                console.log(err);
            });

    }
    function setKanbanColumn(data) {
        state.kanbanColumn = data;
    }
    function getKanbanCard(column) {
        return column.data.map(card => {
            if (card.statusId === column.id) {
                return {
                    id: card.id,
                    title: card.title,
                    date: card.createdAt
                }
            }
        }) || [];
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