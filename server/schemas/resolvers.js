const { Restaurant, Item, Cuisine } = require('../models');

const resolvers = {
  Query: {
    // Restaurant: async () => {
    //   return await Restaurant.find({}).populate('item').populate({
    //     path: 'item',
    //     populate: 'cuisine'
    //   });
    // },
    searchFood: async (parent, { value }) => {
      const restaurantData = await Restaurant.find({
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
