const { Schema, model } = require('mongoose')

const itemSchema = new Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    image: {
      type: String
    },
    price: {
      type: Number,
      required: true,
      min: 0.99
    },
    restaurant: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
        }
    ], 
  });

  const Item = model('Item', itemSchema);

  module.exports = Item;