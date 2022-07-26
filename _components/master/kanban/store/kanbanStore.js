import { reactive } from '@vue/composition-api';

const state = reactive({
    kanbanColumn: [
        {
            id: 1,
            name: 'column1',
            icon: null,
            data: [
                {
                    id: 1,
                    title: "Card 1",
                    date: "2022-04-01",
                },
                {
                    id: 2,
                    title: "Card 2",
                    date: "2022-04-04"
                },
                {
                    id: 3,
                    title: "Card 3",
                    date: "2022-04-04"
                },
                {
                    id: 4,
                    title: "Card 4",
                    date: "2022-04-04"
                },
                {
                    id: 5,
                    title: "Card 5",
                    date: "2022-04-04"
                },
                {
                    id: 6,
                    title: "Card 6",
                    date: "2022-04-04"
                },
                {
                    id: 7,
                    title: "Card 7",
                    date: "2022-04-04"
                },
                {
                    id: 8,
                    title: "Card 8",
                    date: "2022-04-04"
                },
                {
                    id: 9,
                    title: "card 9",
                    date: "2022-04-04"
                },
            ],
        },
        {
            id: 2,
            name: 'column2',
            icon: null,
            data: [],
        },
        {
            id: 3,
            name: 'column3',
            icon: null,
            data: [],
        },
        {
            id: 4,
            name: 'column4',
            icon: null,
            data: [],
        },
        {
            id: 5,
            name: 'column5',
            icon: null,
            data: [],
        },
    ],
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
        if(column) {
            column.data.push({...data});
        }
    }
    function deleteKanbanCard(columnId, cardId) {
        const column = state.kanbanColumn.find(item => item.id === columnId);
        if(column) {
            column.data = column.data.filter(item => item.id !== cardId);
        }   
    }
    return {
        getKanbanColumn,
        addColumn,
        deleteColumn,
        addKanbanCard,
        deleteKanbanCard,
    }
}