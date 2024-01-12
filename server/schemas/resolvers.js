const { Restaurant, Item, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    getRestaurant: async (parent, { id }) => {
      console.log(id);
      return await Restaurant.findOne({restaurantId: id});
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
    getMe: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOne({_id: context.user._id});
        return user;
      }
      throw new AuthenticationError('You need to be logged in!');
    }
    // Items: async () => {
    //   return await Item.find({}).populate('item');
    // },
    // Cuisine: async () => {
    //   return await Cuisine.find({}).populate('cuisine');
    // }
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError;
            }
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw AuthenticationError;
            }
            const token = signToken(user);

            return { token, user };
    },
  }
};

module.exports = resolvers;
