import * as React from 'react'
import Form from 'react-bootstrap/Form'
import { CustomersRow } from '../../../data/interface'

interface CustomersEditProps extends Partial<CustomersRow> {
  handleChangeField: (name: string) => (event: React.ChangeEvent<any>) => void
}

const CustomersEdit: React.SFC<CustomersEditProps> = ({
  name,
  address,
  phone,
  handleChangeField
}: CustomersEditProps) => (
  <Form>
    <Form.Group controlId="formNameCustomer">
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="name"
        value={name}
        placeholder="Enter name"
        onChange={handleChangeField('name')}
      />
      <Form.Text className="text-muted">Enter the Name of customer</Form.Text>
    </Form.Group>

    <Form.Group controlId="formAddressCustomer">
      <Form.Label>Address</Form.Label>
      <Form.Control
        as="textarea"
        value={address}
        onChange={handleChangeField('address')}
        placeholder="Address"
      />
    </Form.Group>
    <Form.Group controlId="formPhoneCustomer">
      <Form.Label>Phone</Form.Label>
      <Form.Control
        type="phone"
        value={phone}
        onChange={handleChangeField('phone')}
        placeholder="Phone"
      />
    </Form.Group>
  </Form>
)
export default CustomersEdit
