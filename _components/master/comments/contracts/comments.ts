export const apiRouteDefault: string = 'apiRoutes.qrequestable.comments';
export const commentableTypeDefault: string = 'Modules\\Requestable\\Entities\\Requestable';
export const commentModelConst: CommentModelContract = {
    text: "",
    textEdit: "",
    active: false,
    user: "",
    loading: false,
    avatar:
        "https://dev-gestionhc.ozonohosting.com/modules/iprofile/img/default.jpg",
}
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

export interface commentsContract {
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
