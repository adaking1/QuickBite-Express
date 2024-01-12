// const { signToken, AuthenticationError } = require('../utils/auth');
// const { Restaurant, Item, User, Review, Order } = require('../models');
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
    getMe: async (parent, args, context) => {
      if (context.user) {
          const user = await User.findOne({_id: context.user._id});
          console.log(user);
          return user;
      }
      throw AuthenticationError('You need to be logged in!');
  }
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
