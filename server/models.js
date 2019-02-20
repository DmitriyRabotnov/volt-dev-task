module.exports = ({ Customer, Product }) => {
  ;[
    {
      name: 'Mark Benson',
      address: '353 Rochester St, Rialto FL 43250',
      phone: '555-534-2342'
    },
    {
      name: 'Bob Smith',
      address: '215 Market St, Dansville CA 94325',
      phone: '555-534-2342'
    },
    {
      name: 'John Draper',
      address: '890 Main St, Fontana IL 31450',
      phone: '555-534-2342'
    }
  ].forEach(el => Customer.create(el))
  ;[
    {
      name: 'Parachute Pants',
      price: 29.99
    },
    {
      name: 'Phone Holder',
      price: 9.99
    },
    {
      name: 'Pet Rock',
      price: 5.99
    },
    {
      name: 'Egg Timer',
      price: 15.99
    },
    {
      name: 'Neon Green Hat',
      price: 21.99
    }
  ].forEach(el => Product.create(el))
}
