const { Restaurant, Item, Cuisine } = require('../models');

const resolvers = {
  Query: {
    Restaurant: async () => {
      return await Restaurant.find({}).populate('item').populate({
        path: 'item',
        populate: 'cuisine'
      });
    },
    Items: async () => {
      return await Item.find({}).populate('item');
    },
    Cuisine: async () => {
      return await Cuisine.find({}).populate('cuisine');
    }
  }
};

module.exports = resolvers;
