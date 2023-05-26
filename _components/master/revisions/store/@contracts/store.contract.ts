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

export interface State {
    dataTable: DataTable;
    loading: boolean;
    revisionable: Revisionable;
    revision: any;
}

export interface Store {
    dataTable: DataTable;
    loading: boolean;
    revisionableType: string;
    revisionableId: number;
    revision: any;
    reset: () => void;
}  