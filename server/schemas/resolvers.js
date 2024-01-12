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
    getItems: async (parent, { restaurantId }) => {
      try {
        // Find the restaurant with the specified ID
        const restaurant = await Restaurant.findOne({ _id: restaurantId });

        if (!restaurant) {
          throw new Error('Restaurant not found');
        }

        // Find the items associated with the restaurant
        const items = await Item.find({ _id: { $in: restaurant.items } });

        return items;
      } catch (error) {
        throw error;
      }
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

  },
};

module.exports = resolvers;
