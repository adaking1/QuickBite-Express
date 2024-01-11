const { Schema, model } = require('mongoose');



const restaurantSchema = new Schema({
    restaurantName: {
        type: String,
        required: true,
    },
    restaurantId: {
        type: String,
        required: true, 
    },
    restaurantDescription: {
        type: String,
    },
    restaurantImage: {
        type: String,
        required: true, 
    },
    location: {
        type: String,
    },
    cuisine: {
        type: String,
        required: true
    },
    items: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Item'
        }
    ]
});

const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant;