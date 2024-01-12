const { Schema, model } = require('mongoose')

const itemSchema = new Schema({
    itemName: {
      type: String,
      required: true,
      trim: true
    },
    itemDescription: {
      type: String
    },
    itemImage: {
      type: String
    },
    price: {
      type: Number,
      required: true,
      min: 0.99
    },
    restaurantId:  {
        type: String,
        ref: 'Restaurant',
        }, 
  });

  const Item = model('Item', itemSchema);

  module.exports = Item;