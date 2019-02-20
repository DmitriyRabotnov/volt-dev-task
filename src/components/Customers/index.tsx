import * as React from 'react'
import { configData, getData } from '../../data'
import { err } from '../../data/helpers'
import { ENDPOINT_CUSTOMERS } from '../../consts'
import { CustomersRow, CustomersRows } from '../../data/interface'
import classNames from 'classnames'
import {
  HEAD_DATA,
  NAME,
  columnHeadInnerStyles,
  columnHeadOuterStyles,
  columnBodyInnerStyles,
  columnBodyOuterStyles
} from './const'
import Edit from './Edit'
import ActionButtons from '../ActionButtons'
import CommonPage from '../CommonPage'
import { TablesRowSetType } from '../commonInterface'

interface CustomersState extends Partial<CustomersRow> {
  rowsData: CustomersRows
}

class Customers extends React.PureComponent<{}, CustomersState> {
  constructor(props: {}) {
    super(props)
    configData()
    this.state = {
      rowsData: []
    }
  }

  public getData = async () => {
    this.setState({
      rowsData: (await getData(ENDPOINT_CUSTOMERS).catch(err)).data
    })
  }

  public handleChangeField = (name: string) => ({
    target: { value }
  }: React.ChangeEvent<any>) => {
    this.setState({
      [name]: value
    } as any)
  }

  public resetData = () => {
    this.setState({
      id: undefined,
      name: undefined,
      address: undefined,
      phone: undefined
    })
  }

  public setRow = (row: CustomersRow) => {
    this.setState({
      ...row
    })
  }

  public render() {
    const { rowsData = [] } = this.state
    const TablesRowSet: TablesRowSetType = (
      handleClick,
      handleDelete,
      handleEdit,
      selected
    ) =>
      rowsData &&
      rowsData.map((row: CustomersRow) => {
        const { id, name, address, phone } = row
        const checked = selected && selected === id

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
              <div style={columnBodyInnerStyles[2]}>{address}</div>
            </td>
            <td style={columnBodyOuterStyles[3]}>
              <div style={columnBodyInnerStyles[3]}>{phone}</div>
            </td>
            <td style={columnBodyOuterStyles[4]}>
              <div style={columnBodyInnerStyles[4]}>
                <ActionButtons {...{ row, handleDelete, handleEdit }} />
              </div>
            </td>
          </tr>
        )
      })

    return (
      <CommonPage
        caption={NAME}
        headData={HEAD_DATA}
        {...{
          columnHeadInnerStyles,
          columnHeadOuterStyles,
          rowsData,
          Edit,
          TablesRowSet
        }}
        getData={this.getData}
        handleChangeField={this.handleChangeField}
        endpoint={ENDPOINT_CUSTOMERS}
        state={this.state}
        resetData={this.resetData}
        setRow={this.setRow}
      />
    )
  }
}

export default Customers
