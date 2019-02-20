import * as React from 'react'
import BodyWithTable, { BodyWithTableProps } from '../BodyWithTable'
import ModalDialog, { ModalDialogProps } from '../ModalDialog'

interface CommonBodyProps extends BodyWithTableProps, ModalDialogProps {}

const CommonBody: React.SFC<CommonBodyProps> = ({
  caption,
  commonScrolledTableProps,
  handleCreate,
  ...rest
}: CommonBodyProps) => (
  <>
    <BodyWithTable {...{ caption, commonScrolledTableProps, handleCreate }} />
    <ModalDialog {...rest} />
  </>
)

export default CommonBody
