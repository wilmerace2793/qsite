export interface Column {
    name: string;
    required?: boolean;
    label: string | any;
    field?: string;
    align: 'left' | 'center' | 'right';
    format?: (val: any) => string;
}