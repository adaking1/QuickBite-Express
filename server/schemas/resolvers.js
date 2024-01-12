const { signToken, AuthenticationError } = require('../utils/auth');
const { Restaurant, Item, User, Review, Order } = require('../models');
const { Restaurant, Item, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    getRestaurant: async (parent, { value }) => {
      return await Restaurant.findOne({id: value});
    },
    getFood: async (parent, { value }) => {
      // console.log(value);
      // return await Restaurant.find({restaurantName: value});
      return await Restaurant.find({
        $or: [
          {restaurantName: value},
          {location: value},
          {item: {$elemMatch: {itemName: value}}},
          {cuisine: value}
        ]
      });
    },
    // Items: async () => {
    //   return await Item.find({}).populate('item');
    // },
    // Cuisine: async () => {
    //   return await Cuisine.find({}).populate('cuisine');
    // }
  }
};

module.exports = resolvers;
