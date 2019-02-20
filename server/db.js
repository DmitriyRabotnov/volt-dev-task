const path = require('path')
const { green, yellow } = require('chalk')
const Sequelize = require('sequelize')
const DBCreate = require('./models')
const Err = require('./err')

const sequelize = new Sequelize('invoices.sqlite', null, null, {
  dialect: 'sqlite',
  storage: path.join(__dirname, 'invoices.sqlite')
})

/** DB Entities  */
const DBEntities = {
  Customer: sequelize.define('customers', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    address: {
      type: Sequelize.STRING
    },
    phone: {
      type: Sequelize.STRING
    }
  }),
  Product: sequelize.define('products', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.DECIMAL
    }
  }),
  Invoice: sequelize.define('invoices', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    customer_id: {
      type: Sequelize.INTEGER
    },
    discount: {
      type: Sequelize.DECIMAL
    },
    total: {
      type: Sequelize.DECIMAL
    }
  }),
  InvoiceItem: sequelize.define('invoice_items', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    invoice_id: {
      type: Sequelize.INTEGER
    },
    product_id: {
      type: Sequelize.INTEGER
    },
    quantity: {
      type: Sequelize.DECIMAL
    }
  })
}

const Auth = async () => {
  try {
    await sequelize.authenticate()
    console.info(green('Connection has been established successfully.'))
  } catch (e) {
    console.err(yellow('Unable to connect to the database:'), e)
  }
}

const DBTruncate = async Items => {
  for (const el of Items) {
    await el.truncate().catch(Err)
  }
}

const DBSync = async () => {
  await sequelize.sync().catch(Err)
  await DBTruncate(Object.keys(DBEntities).map(key => DBEntities[key])).catch(
    Err
  )
  DBCreate(DBEntities)
}

const DBRun = () => {
  Auth()
  DBSync()
}

module.exports = { DBRun, DBEntities }
