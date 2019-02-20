import * as React from 'react'
import Button from 'react-bootstrap/Button'
import './styles.css'
import { HandleEditDeleteType } from '../commonInterface'

interface ActionButtonsProps {
  row: any
  handleDelete: HandleEditDeleteType
  handleEdit: HandleEditDeleteType
}

const ActionButtons: React.SFC<ActionButtonsProps> = ({
  row,
  handleDelete,
  handleEdit
}: ActionButtonsProps) => (
  <>
    <Button
      variant="outline-secondary"
      size="sm"
      className="smallbuttons"
      onClick={handleEdit(row)}
    >
      Edit
    </Button>
    <Button
      variant="outline-danger"
      size="sm"
      className="smallbuttons"
      onClick={handleDelete(row)}
    >
      Delete
    </Button>
  </>
)

export default ActionButtons
