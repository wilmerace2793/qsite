import Vue, { reactive, computed, ComputedRef } from 'vue';
import { DataTable, State, Store } from './@contracts/store.contract'
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
    },
    revision: {
        oldValue: {},
        newValue: {},
    },
    modulesList: [],
    fields: {},
    modalFieldComparison: false,
    loadingModal: false,
    drawerModel: false,
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
    get revision(): any {
        return state.revision;
    },
    set revision(value: any) {
        state.revision = value;
    },
    get modulesList(): any {
        return state.modulesList;
    },
    set modulesList(value: any) {
        state.modulesList = value;
    },
    get fields(): any {
        return state.fields;
    },
    set fields(value: any) {
        if (value) {
            for (const key in value) {
                if (value[key].type !== 'crud' 
                    && value.hasOwnProperty(key) 
                    && value[key].hasOwnProperty("props")) {
                    value[key].props.readonly = true;
                } else if(value.hasOwnProperty(key) 
                    && value[key].hasOwnProperty("props") 
                    && value[key].props.hasOwnProperty("crudProps")) {
                        value[key].props.crudProps.readonly = true;
                }
            }
            state.fields = value;
        }
    },
    get modalFieldComparison(): boolean {
        return state.modalFieldComparison;
    },
    set modalFieldComparison(value: boolean) {
        state.modalFieldComparison = value;
    },
    get loadingModal(): boolean {
        return state.loadingModal;
    },
    set loadingModal(value: boolean) {
        state.loadingModal = value;
    },
    get drawerModel(): boolean {
        return state.drawerModel;
    },
    set drawerModel(value: boolean) {
        state.drawerModel = value;
    },
    reset: (): void => {
        state.revision = {
            oldValue: {},
            newValue: {},
        };
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
        };
        state.modalFieldComparison = false;
    }
})).value;

export default store;
