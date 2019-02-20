import * as React from 'react'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import {
  configData,
  deleteData,
  getData,
  postData,
  putData
} from '../../../data'
import {
  ENDPOINT_CUSTOMERS,
  ENDPOINT_PRODUCTS,
  ENDPOINT_INVOICES,
  NEW_INVOICE_ID,
  URL_INVOICES
} from '../../../consts'
import { err } from '../../../data/helpers'
import '../../BodyWithTable/styles.css'
import './styles.css'
import {
  CustomersRow,
  CustomersRows,
  InvoiceItem,
  ProductsRow,
  ProductsRows
} from '../../../data/interface'
import { InvoicesRowItem } from '..'
import { RouteComponentProps, match } from 'react-router'
import './styles.css'
import { linkTo } from '../../helpers'

const DISCOUNT = 'discount'
const CUSTOMER_ID = 'customerId'

interface InvoiceItemWithNamePrice extends InvoiceItem {
  name: string
  price: number
}
interface InvoiceEditState extends Partial<InvoicesRowItem> {
  somethingChanged: boolean
  customers: CustomersRows
  productId?: number
  products: ProductsRows
  items: InvoiceItemWithNamePrice[]
  invoiceId: number
  total: number
}

class InvoiceEdit extends React.Component<
  RouteComponentProps,
  InvoiceEditState
> {
  constructor(props: RouteComponentProps) {
    super(props)
    configData()
    const { match } = props

    this.state = {
      customers: [],
      discount: 0,
      items: [],
      invoiceId: parseInt((match as match<{ id: string }>).params['id'], 10),
      name: '',
      products: [],
      somethingChanged: false,
      total: 0
    }
  }

  public getProductNamePrice = async (productId: number) =>
    (await getData(`${ENDPOINT_PRODUCTS}/${productId}`).catch(err)).data || {
      name: '',
      price: 0
    }

  public evaluateTotal = (
    items: InvoiceItemWithNamePrice[],
    discount: number
  ): number =>
    Math.round(
      items.reduce(
        (acc: number, { price, quantity }: InvoiceItemWithNamePrice) =>
          acc + price * quantity,
        0
      ) *
        (1 - discount / 100) *
        100
    ) / 100

  public async componentDidMount() {
    const { invoiceId } = this.state
    const [invoice, customers, products, ...items]: any = await Promise.all([
      (await getData(`${ENDPOINT_INVOICES}/${invoiceId}`).catch(err)).data,
      (await getData(ENDPOINT_CUSTOMERS).catch(err)).data,
      (await getData(ENDPOINT_PRODUCTS).catch(err)).data,
      (await getData(`${ENDPOINT_INVOICES}/${invoiceId}/items`).catch(err)).data
    ]).catch(err)

    const { customer_id = 0, discount = 0 } = invoice || {
      customer_id: 0,
      discount: 0
    }
    for (const el of items[0]) {
      const { name, price } = (el &&
        el.product_id &&
        (await this.getProductNamePrice(el.product_id))) || {
        name: '',
        price: 0
      }

      el['name'] = name
      el['price'] = price
    }

    const total = this.evaluateTotal(items[0] || [], discount || 0)
    const customerId =
      customer_id ||
      ((customers && customers.length && customers[0].id) || undefined)

    if (invoiceId) {
      await putData(`${ENDPOINT_INVOICES}/${invoiceId}`, {
        customer_id: customerId,
        discount,
        total
      }).catch(err)
    }

    this.setState({
      customers,
      customerId,
      discount,
      products: [
        {
          id: 0,
          name: '---- Select a product',
          price: 0
        }
      ].concat(products),
      items: items[0] || [],
      total
    })
  }

  public handleChangeField = (
    name: string,
    isNumber: boolean = false
  ) => async ({ target: { value } }: React.ChangeEvent<any>) => {
    this.setState({
      [name]: isNumber ? Math.abs(parseInt(value, 10)) : value,
      somethingChanged: true
    } as any)
    if (name === DISCOUNT || name === CUSTOMER_ID) {
      const {
        invoiceId,
        customerId: currentCustomerId,
        discount: currentDiscount
      } = this.state
      let customerId
      let discount
      if (name === CUSTOMER_ID) {
        customerId = isNumber ? Math.abs(parseInt(value, 10)) : value
      } else {
        customerId = currentCustomerId
      }
      if (name === DISCOUNT) {
        discount = isNumber ? Math.abs(parseInt(value, 10)) : value
      } else {
        discount = currentDiscount
      }

      await putData(`${ENDPOINT_INVOICES}/${invoiceId}`, {
        customer_id: customerId,
        discount,
        total: 0
      }).catch(err)
    }
    await this.componentDidMount()
  }

  public handleAddButton = async () => {
    const { invoiceId, items, productId } = this.state
    if (productId) {
      const foundedItem = items.find(
        ({ product_id }: InvoiceItemWithNamePrice) => product_id === productId
      )
      if (!foundedItem) {
        await postData(`${ENDPOINT_INVOICES}/${invoiceId}/items`, {
          product_id: productId,
          quantity: 1
        }).catch(err)
      } else {
        const { id, product_id, quantity } = foundedItem
        await putData(`${ENDPOINT_INVOICES}/${invoiceId}/items/${id}`, {
          product_id,
          quantity: quantity + 1
        }).catch(err)
      }
    }
    await this.componentDidMount()
  }

  public handleCreate = async () => {
    const { customerId: customer_id, ...rest } = this.state
    await postData(`${ENDPOINT_INVOICES}`, {
      customer_id,
      ...rest
    }).catch(err)

    this.handleCancel()
  }

  public handleCancel = () => {
    linkTo(this.props.history, `${URL_INVOICES}`, true)
  }

  public handleUpdateItem = (id: number) => async ({
    target: { value }
  }: React.ChangeEvent<any>) => {
    const { invoiceId, items } = this.state
    const foundedItem = items.find(
      ({ id: itemId }: InvoiceItemWithNamePrice) => itemId === id
    )
    if (foundedItem) {
      const { id, product_id } = foundedItem
      const quantity = Math.abs(parseInt(value, 10))
      if (quantity) {
        await putData(`${ENDPOINT_INVOICES}/${invoiceId}/items/${id}`, {
          product_id,
          quantity
        }).catch(err)
      } else {
        await deleteData(`${ENDPOINT_INVOICES}/${invoiceId}/items/${id}`).catch(
          err
        )
      }
      await this.componentDidMount()
    }
  }

  public render() {
    const {
      customerId,
      customers,
      discount = 0,
      invoiceId,
      products,
      items,
      total
    } = this.state

    return (
      <div className="fullwidth">
        <div>
          <h1>
            {invoiceId === NEW_INVOICE_ID ? 'Create ' : 'Edit '}
            Invoice
          </h1>
        </div>

        <Form>
          <Form.Group controlId="formNameDiscount">
            <Form.Label>Discount (%)</Form.Label>
            <Form.Control
              type="number"
              value={discount.toString()}
              placeholder="Enter discount"
              onChange={this.handleChangeField(DISCOUNT, true)}
            />
            <Form.Text className="text-muted">
              Select the customer's discount (%)
            </Form.Text>
          </Form.Group>
          <Form.Group controlId="formNameCustomer">
            <Form.Label>Customer Select</Form.Label>
            <Form.Control
              as="select"
              onChange={this.handleChangeField(CUSTOMER_ID, true)}
              value={(customerId && customerId.toString()) || undefined}
            >
              {customers &&
                customers.map(({ id, name }: CustomersRow) => (
                  <option key={`customers${id}`} value={id}>
                    {name}
                  </option>
                ))}
            </Form.Control>
            <Form.Text className="text-muted">Select the customer</Form.Text>
          </Form.Group>
          {invoiceId !== NEW_INVOICE_ID ? (
            <>
              <Form.Group controlId="formNameProduct">
                <Form.Label>Add Product</Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleChangeField('productId', true)}
                >
                  {products &&
                    products.map(({ id, name }: ProductsRow) => (
                      <option key={`customers${id}`} value={id}>
                        {name}
                      </option>
                    ))}
                </Form.Control>
                <Form.Text className="text-muted">Add product</Form.Text>
                <Button
                  disabled={!this.state.productId}
                  onClick={this.handleAddButton}
                >
                  Add
                </Button>
              </Form.Group>

              <Form.Group controlId="formProductList">
                <Form.Row key="formProductListItemHead">
                  <Col>
                    <Form.Text>Name</Form.Text>
                  </Col>
                  <Col>
                    <Form.Text>Price</Form.Text>
                  </Col>
                  <Col>
                    <Form.Text>Qty</Form.Text>
                  </Col>
                </Form.Row>
                {items &&
                  items.map(
                    ({
                      id,
                      name,
                      price,
                      quantity = 0
                    }: InvoiceItemWithNamePrice) =>
                      name !== '' && (
                        <Form.Row key={`formProductListItem${id}`}>
                          <Col>
                            <Form.Text>{name}</Form.Text>
                          </Col>
                          <Col>
                            <Form.Text>{price}</Form.Text>
                          </Col>
                          <Col>
                            <Form.Control
                              placeholder="Qty"
                              type="number"
                              value={quantity.toString()}
                              onChange={this.handleUpdateItem(id)}
                            />
                          </Col>
                        </Form.Row>
                      )
                  )}
              </Form.Group>
            </>
          ) : (
            <>
              <Button onClick={this.handleCreate}>Create</Button>
              <Button className="secondbutton" onClick={this.handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </Form>
        <div>
          <h2>Total: {total}</h2>
        </div>
      </div>
    )
  }
}

export default InvoiceEdit
