const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedRestaurant` array in User.js
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
    restaurantId: {
        type: String,
        required: true,
    }
});

module.exports = restaurantSchema