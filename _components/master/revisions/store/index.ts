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
});

export default computed(() => ({
    get dataTable() {
        return state.dataTable;
    },
    set dataTable(value) {
        state.dataTable = value;
    },
    get loading() {
        return state.loading;
    },
    set loading(value) {
        state.loading = value;
    },
})).value;
