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