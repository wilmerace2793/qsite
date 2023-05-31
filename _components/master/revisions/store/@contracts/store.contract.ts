export interface DataTable {
    data: any[];
    meta: {
        page: {
            total: number;
            lastPage: number;
            perPage: number;
            currentPage: number;
        };
    };
}

export interface Revisionable {
    type: string;
    id: number;
}

export interface Revision {
    createdAt: string;
    createdBy: number;
    deletedAt: null;
    deletedBy: null;
    id: number;
    key: string;
    newValue: any;
    oldValue: any;
    organizationId: null;
    revisionableId: number;
    revisionableType: string;
    updatedAt: string;
    updatedBy: number;
}

export interface State {
    dataTable: DataTable;
    loading: boolean;
    revisionable: Revisionable;
    revision: Revision;
    modulesList: any;
    fields: any;
    modalFieldComparison: boolean;
    loadingModal: boolean;
    drawerModel: boolean;
}

export interface Store {
    dataTable: DataTable;
    loading: boolean;
    revisionableType: string;
    revisionableId: number;
    revision: Revision;
    modulesList: any;
    fields: any;
    modalFieldComparison: boolean;
    loadingModal: boolean;
    drawerModel: boolean;
    reset: () => void;
} 