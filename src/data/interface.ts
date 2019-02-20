export interface CustomersRow {
  id: number
  name: string
  address: string
  phone: string
}

export type CustomersRows = CustomersRow[]

export interface ProductsRow {
  id: number
  name: string
  price: number
}

export type ProductsRows = ProductsRow[]

export interface InvoicesRow {
  id: number
  customerId: number
  discount: number
  total: number
}

export type InvoicesRows = InvoicesRow[]

export interface InvoiceItem {
  id: number
  invoice_id: number
  product_id: number
  quantity: number
}

export type Actions = 'create' | 'edit' | 'delete'
