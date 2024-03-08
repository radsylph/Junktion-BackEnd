export interface PublicationInterface {
    title: string;
    content: string;
    images: [string];
    owner: string;
    isEdited: boolean;
    bookMark: boolean;
    likes: number;
    comments: number;

}