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
    },
    users : async () => {
      const users = await User.find();
      return users;
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
    removeUser: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOneAndRemove({_id: context.user._id});
        return user;
      }
      throw AuthenticationError;
      
    },
    removeRestaurant: async (parent, { restaurantID }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          {_id: context.user._id},
          {$pull: {savedRestaurants: {restaurantID}}},
          {new: true}
        );
      }
      throw AuthenticationError;
    },
    updateEmail: async (parent, { newEmail }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate({_id: context.user._id}, {email: newEmail});
        return user;
      }
      throw AuthenticationError;
    },
    updateUsername: async (parent, { newUsername }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate({_id: context.user._id}, {username: newUsername})
        return user;
      }
      throw AuthenticationError;
    }
  }
};

module.exports = resolvers;
