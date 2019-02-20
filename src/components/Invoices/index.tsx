import * as React from 'react'
import { configData, getData, deleteData } from '../../data'
import { err } from '../../data/helpers'
import {
  ENDPOINT_CUSTOMERS,
  ENDPOINT_INVOICES,
  NEW_INVOICE_ID,
  URL_INVOICES
} from '../../consts'
import classNames from 'classnames'
import {
  HEAD_DATA,
  NAME,
  columnHeadInnerStyles,
  columnHeadOuterStyles,
  columnBodyInnerStyles,
  columnBodyOuterStyles
} from './const'
import ActionButtons from '../ActionButtons'
import CommonBody from '../CommonBody'
import { linkTo } from '../helpers'
import { TablesRowSetType } from '../commonInterface'
import { RouteComponentProps } from 'react-router'
import { InvoicesRow } from '../../data/interface'
import { Actions } from '../../data/interface'
import { DELETE } from '../../consts'

export interface InvoicesRowItem extends InvoicesRow {
  name: string
}

interface InvoicesState {
  action?: Actions
  selected?: number
  rowsData: InvoicesRowItem[]
  activeId?: number
}

class Invoices extends React.PureComponent<RouteComponentProps, InvoicesState> {
  constructor(props: RouteComponentProps) {
    super(props)
    configData()
    this.state = {
      rowsData: []
    }
  }

  public getName = async (customerId: number) => {
    const { name } = (await getData(
      `${ENDPOINT_CUSTOMERS}/${customerId}`
    ).catch(err)).data || { name: '' }
    return name
  }

  public getData = async () => {
    const temp = (await getData(ENDPOINT_INVOICES).catch(err)).data

    for (const el of temp) {
      el['name'] =
        (el && el.customer_id && (await this.getName(el.customer_id))) || ''
    }
    this.setState({ rowsData: temp })
  }

  public async componentDidMount() {
    await this.getData()
  }

  public handleChangeField = (name: string) => ({
    target: { value }
  }: React.ChangeEvent<any>) => {
    this.setState({
      [name]: value,
      somethingChanged: true
    } as any)
  }

  public handleClick = (event: React.MouseEvent, id: number) => {
    this.setState({ selected: id })
  }

  public handleCreate = () => {
    linkTo(this.props.history, `${URL_INVOICES}/${NEW_INVOICE_ID}`, true)
  }

  public resetAction = () => {
    this.setState({
      action: undefined
    })
  }

  public handleDelete = ({ id }: InvoicesRow) => () => {
    this.setState({
      activeId: id,
      action: DELETE
    })
  }

  public handleEdit = ({ id }: InvoicesRow) => () => {
    linkTo(this.props.history, `${URL_INVOICES}/${id}`, true)
  }

  public handleSave = async () => {
    const { action, activeId } = this.state

    switch (action) {
      case DELETE: {
        await deleteData(`${ENDPOINT_INVOICES}/${activeId}`).catch(err)
        break
      }
    }

    this.resetAction()
    await this.getData()
  }

  public render() {
    const { activeId, rowsData = [], selected } = this.state

    const TablesRowSet: TablesRowSetType = (
      handleClick,
      handleDelete,
      handleEdit,
      selected
    ) =>
      rowsData &&
      rowsData.map((row: InvoicesRowItem) => {
        const { id, name, discount, total } = row
        const checked = selected === id

        return (
          <tr
            key={id}
            className={classNames(checked && 'selectedRow')}
            onClick={(
              event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
            ) => handleClick(event, id)}
          >
            <td style={columnBodyOuterStyles[0]}>
              <div style={columnBodyInnerStyles[0]}>{id}</div>
            </td>
            <td style={columnBodyOuterStyles[1]}>
              <div style={columnBodyInnerStyles[1]}>{name}</div>
            </td>
            <td style={columnBodyOuterStyles[2]}>
              <div style={columnBodyInnerStyles[2]}>{discount}</div>
            </td>
            <td style={columnBodyOuterStyles[3]}>
              <div style={columnBodyInnerStyles[3]}>{total}</div>
            </td>
            <td style={columnBodyOuterStyles[4]}>
              <div style={columnBodyInnerStyles[4]}>
                <ActionButtons {...{ row, handleDelete, handleEdit }} />
              </div>
            </td>
          </tr>
        )
      })

    const Body = () => {
      const { rowsData } = this.state
      const { name } = rowsData.find(({ id }) => id === activeId) || {
        name: 'not found'
      }
      return (
        <div>
          Gonna remove Invoice #{activeId} ( Customer: {name} ), right?
        </div>
      )
    }
    return (
      <CommonBody
        caption={NAME}
        Body={Body}
        {...this.state}
        commonScrolledTableProps={{
          columnHeadInnerStyles,
          columnHeadOuterStyles,
          headData: HEAD_DATA,
          TablesRowSet: TablesRowSet(
            this.handleClick,
            this.handleDelete,
            this.handleEdit,
            selected
          )
        }}
        handleChangeField={this.handleChangeField}
        handleCreate={this.handleCreate}
        handleSave={this.handleSave}
        handleClose={this.resetAction}
      />
    )
  }
}

export default Invoices
