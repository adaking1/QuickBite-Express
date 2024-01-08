const { Schema, model } = require('mongoose');



const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    restaurantId: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
    },
    image: {
        type: String,
        required: true, 
    },
    location: {
        type: String,
    },
    cuisine: {
        type: String
    },
});

const Restaurant = model('Restaurant', restaurantSchema);

module.exports = Restaurant