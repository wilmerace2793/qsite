import Vue, { reactive, computed, getCurrentInstance } from 'vue';

const state = reactive({
    dataTable: {
        data: [],
        meta: {
            page: {
                total: 1,
                lastPage: 1,
                perPage: 10,
                currentPage: 1
            }
        },
    },
    loading: false,
    revisionable: {
        type: '',
        id: 0,
    }
});

export default computed(() => ({
    get dataTable() {
        return state.dataTable;
    },
    set dataTable(value) {
        state.dataTable = value;
    },
    get loading(): boolean {
        return state.loading;
    },
    set loading(value: boolean) {
        state.loading = value;
    },
    get revisionableType(): string {
        return state.revisionable.type;
    },
    set revisionableType(value: string) {
        state.revisionable.type = value;
    },
    get revisionableId(): number {
        return state.revisionable.id;
    },
    set revisionableId(value: number) {
        state.revisionable.id = value;
    },
})).value;
