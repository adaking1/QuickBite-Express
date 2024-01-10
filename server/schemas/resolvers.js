const { Restaurant, Item, Cuisine } = require('../models');

const resolvers = {
  Query: {
    Restaurant: async (parent, args) => {
      return await Restaurant.find({
        $or: [
          {_id: args._id},
          {name: args.name},
          {restaurantId: args.restaurantId},
          {cuisine: args.cuisine}
        ]}).populate('item').populate({
        path: 'item',
        populate: 'cuisine'
      });
    },
    allRestaurants: async () => {
      return Restaurant.find({});
    },
    searchFood: async (parent, args) => {
      const restaurantResponse = await Restaurant.find({
        $or: [
          {_id: args._id},
          {name: args.name},
          {restaurantId: args.restaurantId},
          {item: {$in: [args.items]}},
        ]
      });
      if (!restaurantResponse) {
        const itemResponse = await Item.find({
          $or: [
            {cuisine: args.cuisine},
            {name: args.name}
          ]
        });
        return itemResponse;
      }
      return restaurantResponse;
    },
    Items: async () => {
      return await Item.find({}).populate('item');
    },
    // Cuisine: async () => {
    //   return await Cuisine.find({}).populate('cuisine');
    // }
  }
};

module.exports = resolvers;
