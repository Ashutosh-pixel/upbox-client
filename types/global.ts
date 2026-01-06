export type Setter<Type> = React.Dispatch<React.SetStateAction<Type>>
export interface searching {
  _id: string,
  name?: string,
  filename?: string,
  parentID: string,
  type: string
}

export interface afterRename {
  uploadId: string;
  fileName: string;
  parentID: string | null;
  fileID: string;
  userID: string;
  storagePath: string;
  file: File | null
}