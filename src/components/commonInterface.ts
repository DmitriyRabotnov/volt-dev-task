export type HandleEditDeleteType = (row: any) => () => void

export type TablesRowSetType = (
  handleClick: (event: React.MouseEvent, id: number) => void,
  handleDelete: HandleEditDeleteType,
  handleEdit: HandleEditDeleteType,
  selected?: number
) => JSX.Element[]
