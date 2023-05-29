import { Column } from './columns.contract'
import { ActionItem } from './fieldAccion.contract';
import { ComputedRef, Ref } from 'vue';
export interface TableRevisions {
    tableColumns: ComputedRef<Column[]>;
    rows: ComputedRef<any>;
    filter: Ref<string>;
    fieldAccion: ComputedRef<ActionItem[]>;
    maxPagination: ComputedRef<number>;
    handlePagination: (page: any) => Promise<void>;
    loading: ComputedRef<boolean>;
}