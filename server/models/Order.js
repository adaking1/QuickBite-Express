const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    items: [
      {
          itemId: {
              type: String
          }
      }
  ],
    restaurant: [
      {
          type: [String],
          ref: 'Restaurant'
      }
  ], 
  });
  
  const Order = model('Order', orderSchema);
  
  module.exports = Order;