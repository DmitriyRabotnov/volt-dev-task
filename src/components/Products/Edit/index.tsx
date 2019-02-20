import * as React from 'react'
import Form from 'react-bootstrap/Form'
import { ProductsRow } from '../../../data/interface'

interface ProductsEditProps extends Partial<ProductsRow> {
  handleChangeField: (name: string) => (event: React.ChangeEvent<any>) => void
}

const ProductsEdit: React.SFC<ProductsEditProps> = ({
  name,
  price = 0,
  handleChangeField
}: ProductsEditProps) => (
  <Form>
    <Form.Group controlId="formNameProduct">
      <Form.Label>Name</Form.Label>
      <Form.Control
        type="name"
        value={name}
        placeholder="Enter name"
        onChange={handleChangeField('name')}
      />
      <Form.Text className="text-muted">Enter the Name of customer</Form.Text>
    </Form.Group>

    <Form.Group controlId="formPriceProduct">
      <Form.Label>Price</Form.Label>
      <Form.Control
        type="number"
        value={(price && price.toString()) || undefined}
        onChange={handleChangeField('price')}
        placeholder="Price"
      />
    </Form.Group>
  </Form>
)
export default ProductsEdit
