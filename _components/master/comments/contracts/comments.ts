export interface CommentModelContract {
    text: string | null;
    textEdit: string;
    active: boolean;
    user: string;
    loading: boolean;
    avatar: string;
}
export interface EditorConfigContract {
    height: number;
}
export default interface commentsContract {
    approved: boolean;
    comment: string;
    commentableId: number;
    commentableType: string;
    createdAt: string;
    createdBy: number;
    deletedAt?: any | Date;
    deletedBy?: any;
    id: number;
    is_internal: number;
    options?: any;
    updatedAt: string;
    updatedBy: number;
    userId: number;
    userProfile: any;
}