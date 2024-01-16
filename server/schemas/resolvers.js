const { signToken, AuthenticationError } = require('../utils/auth');
const { Restaurant, Item, User, Review, Order } = require('../models');

const resolvers = {
  Query: {
    getMe: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('reviews')
      }
      throw AuthenticationError;
    },
    users: async () => {
      return User.find(),select("-__v -password").populate("reviews");
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
    
  },

  Mutation: {
    loginUser: async (parent, { email, password}) => {
      const user = await User.findOne({ email });
      if(!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user  = await User.create(args);
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

    saveRestaurant: async (parent, { restaurantInput }, context) => {
      if (context.user) {
        const restaurant = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedRestaurants: restaurantInput } },
          { new: true }
        );
        return restaurant
      }
      throw AuthenticationError;
    },

    removeRestaurant: async (parent, args, context) => {
      if (context.user) {
        const restaurant = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRestaurants: args } },
          { new: true }
        );

        return restaurant;
      }
      throw AuthenticationError;
    },

    removeRestaurant: async (parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedRestaurants: {restaurantId: args.restaurantId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw AuthenticationError
    }

  },
};

module.exports = resolvers;
