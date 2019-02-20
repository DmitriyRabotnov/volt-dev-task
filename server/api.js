const {
  DBEntities: { Customer, Invoice, InvoiceItem, Product }
} = require('./db')
const _ = require('lodash')
const Err = require('./err')

const CUSTOMERS = '/api/customers'
const PRODUCTS = '/api/products'
const INVOICES = '/api/invoices'

module.exports = app => {
  // CUSTOMERS API

  app
    .route(CUSTOMERS)
    .get(async (req, res) => {
      res.json(await Customer.findAll().catch(Err))
    })
    .post(async ({ body }, res) => {
      res.json(
        await Customer.build(_.pick(body, ['name', 'address', 'phone']))
          .save()
          .catch(Err)
      )
    })

  app
    .route(`${CUSTOMERS}/:customer_id`)
    .get(async ({ params: { customer_id } }, res) => {
      res.json(await Customer.findById(customer_id).catch(Err))
    })
    .put(async ({ params: { customer_id }, body }, res) => {
      res.json(
        (await Customer.findById(customer_id).catch(Err)).update(
          _.pick(body, ['name', 'address', 'phone'])
        )
      )
    })
    .delete(async ({ params: { customer_id } }, res) => {
      res.json(
        await (await Customer.findById(customer_id).catch(Err))
          .destroy()
          .catch(Err)
      )
    })

  // PRODUCTS API

  app
    .route(PRODUCTS)
    .get(async (req, res) => {
      res.json(await Product.findAll().catch(Err))
    })
    .post(async ({ body }, res) => {
      res.json(
        await Product.build(_.pick(body, ['name', 'price']))
          .save()
          .catch(Err)
      )
    })

  app
    .route(`${PRODUCTS}/:product_id`)
    .get(async ({ params: { product_id } }, res) => {
      res.json(await Product.findById(product_id).catch(Err))
    })
    .put(async ({ params: { product_id }, body }, res) => {
      res.json(
        await (await Product.findById(product_id).catch(Err))
          .update(_.pick(body, ['name', 'price']))
          .catch(Err)
      )
    })
    .delete(async ({ params: { product_id } }, res) => {
      res.json(
        await (await Product.findById(product_id).catch(Err))
          .destroy()
          .catch(Err)
      )
    })

  // INVOICES API

  app
    .route(INVOICES)
    .get(async (req, res) => {
      res.json(await Invoice.findAll())
    })
    .post(async ({ body }, res) => {
      res.json(
        await Invoice.build(_.pick(body, ['customer_id', 'discount', 'total']))
          .save()
          .catch(Err)
      )
    })
  app
    .route(`${INVOICES}/:invoice_id`)
    .get(async (req, res) => {
      res.json(await Invoice.findById(req.params.invoice_id).catch(Err))
    })
    .put(async ({ params: { invoice_id }, body }, res) => {
      res.json(
        await (await Invoice.findById(invoice_id).catch(Err))
          .update(_.pick(body, ['customer_id', 'discount', 'total']))
          .catch(Err)
      )
    })
    .delete(async ({ params: { invoice_id } }, res) => {
      res.json(
        await (await Invoice.findById(invoice_id).catch(Err))
          .destroy()
          .catch(Err)
      )
    })

  // INVOICE ITEMS API

  app
    .route(`${INVOICES}/:invoice_id/items`)
    .get(async ({ params: { invoice_id } }, res) => {
      res.json(await InvoiceItem.findAll({ where: { invoice_id } }).catch(Err))
    })
    .post(async ({ params: { invoice_id }, body }, res) => {
      const invoice_item = InvoiceItem.build(
        _.pick(body, ['product_id', 'quantity'])
      )
      invoice_item.set('invoice_id', invoice_id)
      res.json(await invoice_item.save().catch(Err))
    })

  app
    .route(`${INVOICES}/:invoice_id/items/:id`)
    .get(async ({ params: { id } }, res) => {
      res.json(await InvoiceItem.findById(id).catch(Err))
    })
    .put(async ({ params: { id }, body }, res) => {
      res.json(
        await (await InvoiceItem.findById(id))
          .update(_.pick(body, ['product_id', 'quantity']))
          .catch(Err)
      )
    })
    .delete(async ({ params: { id } }, res) => {
      res.json(
        await (await InvoiceItem.findById(id).catch(Err)).destroy().catch(Err)
      )
    })

  return app
}
