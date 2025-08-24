export interface selectedFiles {
    name: string;
    parent: string | null;
    path: string;
    size: string;
    type: string;
    file: any;
}

export interface selectedFolders {
    name: string;
    parent: string | null;
    path: string;
}