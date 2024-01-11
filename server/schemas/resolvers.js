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

  },
};

module.exports = resolvers;
