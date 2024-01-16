// const { signToken, AuthenticationError } = require('../utils/auth');
// const { Restaurant, Item, User, Review, Order } = require('../models');
const { Restaurant, Item, User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
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
    },
    user: async(parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("reviews")
    },
    reviews: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Review.find(params).sort({ createdAt: -1 });
    },
    review: async (parent, { reviewId }) => {
      return Review.findOne({ _id: reviewId });
    }, 
    getRestaurant: async (parent, { value }) => {
      return await Restaurant.findOne({id: value});
    },
    getRestaurant: async (parent, { restaurantId }) => {
      return await Restaurant.findOne({_id: restaurantId});
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

    addReview: async (parent, { reviewText }, context) => {
      if (context.user) {
        const review = await Review.create({
          reviewText,
          reviewAuthor: context.user.username,
        });

        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { reviews: review._id } }
        );

        return review;
      }
      throw AuthenticationError;
      ('You need to be logged in!!!');
    },
    removeReview: async (parent, { reviewId }, context) => {
      if (context.user) {
        const review = await Review.findOneAndDelete({
          _id: context.user._id,
          reviewAuthor: context.user.username,
        });
        
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { reviews: review._id } }
        );
        
        return review;
      }
      throw AuthenticatorError
    }, 
      
    removeUser: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findOneAndRemove({_id: context.user._id});
        return user;
      }
      throw AuthenticationError;
      
    },
    saveRestaurant: async (parent, { restaurantId, name }, context) => {
      if (context.user) { 
        const user = await User.findOneAndUpdate(
          {_id: context.user._id},
          {$addToSet: {savedRestaurants: { _id: restaurantId, restaurantName: name }}},
          {new: true}
        );
        return user;
      }
      throw AuthenticationError;
    },
    removeRestaurant: async (parent, { restaurantId }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          {_id: context.user._id},
          {$pull: {savedRestaurants: {_id: restaurantId}}},
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
