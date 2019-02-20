import * as React from 'react'
import { configData, deleteData, postData, putData } from '../../data'
import { err } from '../../data/helpers'
import { CREATE, DELETE, EDIT } from '../../consts'
import { Actions } from '../../data/interface'
import CommonBody from '../CommonBody'
import { TablesRowSetType } from '../commonInterface'

interface CommonPageProps {
  headData: string[]
  caption: string
  columnHeadInnerStyles: React.CSSProperties[]
  columnHeadOuterStyles: React.CSSProperties[]
  getData: () => Promise<void>
  rowsData: any[]
  handleChangeField: (name: string) => React.ChangeEventHandler<Element>
  endpoint: string
  state: Record<string, any>
  resetData: () => void
  setRow: (row: any) => void
  TablesRowSet: TablesRowSetType
  Edit: React.ComponentType<any>
}

interface CommonPageState {
  selected?: number
  progress: boolean
  action?: Actions
}

class CommonPage extends React.PureComponent<CommonPageProps, CommonPageState> {
  constructor(props: CommonPageProps) {
    super(props)
    configData()
    this.state = {
      progress: true
    }
  }

  public async componentDidMount() {
    await this.props.getData()
  }

  public handleClick = (event: React.MouseEvent, id: number) => {
    this.setState({ selected: id, progress: false })
  }

  public handleCreate = () => {
    this.setState({ action: CREATE })
  }

  public handleClose = () => {
    this.setState({ action: undefined })
  }

  public handleEdit = (row: any) => () => {
    this.props.setRow(row)
    this.setState({
      action: EDIT
    })
  }

  public handleDelete = (row: any) => () => {
    this.props.setRow(row)
    this.setState({ action: DELETE })
  }

  public handleSave = async () => {
    const { endpoint, getData, resetData, state } = this.props
    const { id } = state

    switch (this.state.action) {
      case CREATE: {
        await postData(endpoint, state).catch(err)
        break
      }
      case EDIT: {
        await putData(`${endpoint}/${id}`, state).catch(err)
        break
      }
      case DELETE: {
        await deleteData(`${endpoint}/${id}`).catch(err)
        break
      }
    }

    this.handleClose()
    await getData()
    resetData()
  }

  public render() {
    const { action, selected } = this.state
    const {
      caption,
      columnHeadInnerStyles,
      columnHeadOuterStyles,
      headData,
      Edit,
      TablesRowSet,
      handleChangeField,
      state
    } = this.props

    return (
      <CommonBody
        commonScrolledTableProps={{
          headData,
          TablesRowSet: TablesRowSet(
            this.handleClick,
            this.handleDelete,
            this.handleEdit,
            selected
          ),
          columnHeadInnerStyles,
          columnHeadOuterStyles
        }}
        {...{ action, caption, state }}
        Body={Edit}
        handleChangeField={handleChangeField}
        handleCreate={this.handleCreate}
        handleClose={this.handleClose}
        handleSave={this.handleSave}
      />
    )
  }
}

export default CommonPage
