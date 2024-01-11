const { Restaurant, Item, Cuisine } = require('../models');

const resolvers = {
  Query: {
    getRestaurant: async (parent, { value }) => {
      return await Restaurant.findOne({id: value});
    },
    getFood: async (parent, { value }) => {
      return await Restaurant.find({
        $or: [
          {name: value},
          {location: value},
          {item: {$elemMatch: value}},
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
