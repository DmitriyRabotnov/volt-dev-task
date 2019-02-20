import * as React from 'react'
import Button from 'react-bootstrap/Button'
import CommonScrolledTable, {
  CommonScrolledTableProps
} from '../CommonScrolledTable'
import './styles.css'

export interface BodyWithTableProps {
  caption: string
  handleCreate: () => void
  commonScrolledTableProps: CommonScrolledTableProps
}

const BodyWithTable: React.SFC<BodyWithTableProps> = ({
  caption,
  commonScrolledTableProps,
  handleCreate
}: BodyWithTableProps) => (
  <div className="fullwidth">
    <div>
      <h1>{caption}</h1>
      <Button variant="primary" onClick={handleCreate} className="button">
        Create
      </Button>
    </div>

    <CommonScrolledTable {...commonScrolledTableProps} />
  </div>
)

export default BodyWithTable
