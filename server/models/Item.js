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
      type: Float,
      required: true,
      min: 0.99
    },
    restaurant: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
        }
    ],
    cuisine: {
      type: String,
      required: true,
    },   
  });

  const Item = model('Item', itemSchema);

  module.exports = Item;