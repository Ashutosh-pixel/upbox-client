export type Setter<Type> =  React.Dispatch<React.SetStateAction<Type>>
export interface searching {
  _id:string,
  name?: string,
  filename?:string,
  parentID: string,
  type:string
}