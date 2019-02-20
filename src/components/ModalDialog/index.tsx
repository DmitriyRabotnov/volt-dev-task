import * as React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { Actions } from '../../data/interface'
import { DELETE } from '../../consts'

export interface ModalDialogProps {
  Body: React.ComponentType<any>
  action?: Actions
  state?: any
  handleChangeField: (name: string) => React.ChangeEventHandler
  handleClose?: () => void
  handleSave?: () => void
}

const ModalDialog: React.SFC<ModalDialogProps> = ({
  Body,
  action,
  state,
  handleChangeField,
  handleClose,
  handleSave
}: ModalDialogProps) => (
  <Modal show={!!action}>
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>
          <span className="caption">{action}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Body {...state} {...{ handleChangeField }} />
      </Modal.Body>
      <Modal.Footer>
        <>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={handleSave}>
            {action && action === DELETE ? `Delete` : `Save`}
          </Button>
        </>
      </Modal.Footer>
    </Modal.Dialog>
  </Modal>
)

export default ModalDialog
