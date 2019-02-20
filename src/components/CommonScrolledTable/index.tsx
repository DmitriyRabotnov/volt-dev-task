import ProgressBar from 'react-bootstrap/ProgressBar'
import Table from 'react-bootstrap/Table'
import classNames from 'classnames'
import * as React from 'react'
import './styles.css'

export interface CommonScrolledTableProps {
  columnHeadInnerStyles: React.CSSProperties[]
  columnHeadOuterStyles: React.CSSProperties[]
  TablesRowSet: JSX.Element[]
  headData: string[]
  progress?: boolean
}

const CommonScrolledTable: React.SFC<CommonScrolledTableProps> = ({
  columnHeadInnerStyles,
  columnHeadOuterStyles,
  TablesRowSet,
  headData,
  progress
}: CommonScrolledTableProps) => (
  <>
    {progress && <ProgressBar color="primary" className="progress" />}
    <div className="containertable">
      <div className={classNames('tableMinWidth', 'tableBody')}>
        <Table
          className={classNames('table', !progress && 'marginTopOfProgressBar')}
        >
          <thead>
            <tr>
              {headData.map((el, index) => (
                <td key={index} style={columnHeadOuterStyles[index]}>
                  <div style={columnHeadInnerStyles[index]}>{el}</div>
                </td>
              ))}
            </tr>
          </thead>
        </Table>
      </div>
      <div className={classNames('tableMinWidth', 'tableBody')}>
        <Table>
          <tbody>{TablesRowSet}</tbody>
        </Table>
      </div>
    </div>
  </>
)

export default CommonScrolledTable
