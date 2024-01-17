const { Restaurant, Item, User, Order } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');

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
    getRestaurant: async (parent, { restaurantId }) => {
      return await Restaurant.findOne({_id: restaurantId});
      
    },
    menuItems: async (parent, { restaurantId }) => {
      return await Item.find({restaurantId});
      
    },
    item: async (parent, { itemId }) => {
      return await Item.findOne({_id: itemId});
    },
    getFood: async (parent, { value }) => {
      // console.log(value);
      // return await Restaurant.find({restaurantName: value});
      return await Restaurant.find({
        $or: [
          {restaurantName: value},
          {location: value},
          {items: {$elemMatch: {itemName: value}}},
          {cuisine: value}
        ]
      });
    },
    checkout: async (parent, args, context) => {
      console.log(args);
      console.log('XXXXXXXXXX')
      const url = new URL(context.headers.referer).origin;
      // We map through the list of products sent by the client to extract the _id of each item and create a new Order.
      await Order.create({ items: args.items.map(({ _id }) => _id) });
      const line_items = [];

      for (const item of args.items) {
        // console.log(item)
        line_items.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.purchaseQuantity,
        });
      }
      console.log(line_items);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`,
      });

      return { session: session.id };
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
