// tslint:disable:jsx-no-lambda
import * as React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Customers from './Customers'
import Products from './Products'
import Invoices from './Invoices'
import EditInvoice from './Invoices/Edit'
import Nav from 'react-bootstrap/Nav'
import './style.css'
import classNames from 'classnames'

class Main extends React.Component<{}> {
  public render() {
    return (
      <BrowserRouter>
        <div>
          <Nav>
            <div className="container">
              <Nav.Item className="nav-item">Invoice App</Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link href="/invoices">Invoices</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link href="/products">Products</Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item">
                <Nav.Link href="/customers">Customers</Nav.Link>
              </Nav.Item>
            </div>
          </Nav>
          <div className={classNames('container', 'content')}>
            <Route path="/customers" exact={true} component={Customers} />
            <Route path="/products" exact={true} component={Products} />
            <Route path="/invoices" exact={true} component={Invoices} />
            <Route path="/invoices/:id" exact={true} component={EditInvoice} />
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

export default Main
