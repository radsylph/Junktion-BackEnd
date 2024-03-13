export interface PublicationInterface {
    title: string;
    content: string;
    images: [string];
    owner: string;
    isEdited: boolean;
    likes: number;
    isComment?: boolean;
    commentTo?: string;
    comments: number;
}