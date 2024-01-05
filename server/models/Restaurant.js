const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
    cuisine: {
        type: String,
        required: true,
    },
});

const restaurantSchema = new Schema({
    name: {
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
    categories: [categorySchema],
});

const Restaurant = model('Restaurant', restaurantSchema ); 

module.exports = Restaurant