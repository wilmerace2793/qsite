import Vue, { reactive, computed, ComputedRef } from 'vue';
import {DataTable, State, Store} from './@contracts/store.contract'
const state = reactive<State>({
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
const store: Store = computed((): Store => ({
    get dataTable(): DataTable {
        return state.dataTable;
    },
    set dataTable(value: DataTable) {
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
    reset: (): void => {
        state.dataTable = {
            data: [],
            meta: {
                page: {
                    total: 1,
                    lastPage: 1,
                    perPage: 10,
                    currentPage: 1
                }
            },
        }
    }
})).value;

export default store;
