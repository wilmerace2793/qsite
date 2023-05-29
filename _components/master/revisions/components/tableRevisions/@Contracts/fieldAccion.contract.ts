export interface ActionItem {
    icon: string;
    color: string;
    label: string;
    action: (item: any) => Promise<void>;
}