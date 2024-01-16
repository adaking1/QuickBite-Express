const db = require('../config/connection');
const { User, Review, Restaurant, Order, Item } = require('../models');
const userSeeds = require('./userSeeds.json');
const reviewSeeds = require('./reviewSeeds.json');
const restaurantSeeds = require('./restaurantSeeds.json');
const orderSeeds = require('./orderSeeds.json');
const itemSeeds = require('./itemSeeds.json');
const cleanDB = require('./cleanDB')

db.once('open', async () => {
    try {
        await cleanDB('User', 'users');
        await cleanDB('Review', 'reviews');
        await cleanDB('Restaurant', 'restaurants');
        await cleanDB('Order', 'orders');
        await cleanDB('Item', 'items');
        
        // Seeding Users
        await User.create(userSeeds);

        // Seeding Orders
        await Order.create(orderSeeds);

        // Seeding Restaurants
        await Restaurant.create(restaurantSeeds);

        // Seeding items to Restaurants through restaurantId
        for (let i = 0; i < itemSeeds.length; i++) {
            const { restaurantId, ...itemData } = itemSeeds[i];

            const existingRestaurant = await Restaurant.findOne({ restaurantId });

            if (!existingRestaurant) {
                console.error(`Restaurant with ID ${restaurantId} not found. Skipping item creation.`);
                continue;
            }

            const { _id: itemId } = await Item.create({
                ...itemData,
                restaurant: existingRestaurant._id,
            });

            const restaurant = await Restaurant.findOneAndUpdate(
                { _id: existingRestaurant._id },
                {
                    $addToSet: {
                        items: itemId,
                    },
                }
            );
        }

        for (let i = 0; i < reviewSeeds.length; i++) {
            const { reviewText, reviewAuthor, restaurant } = reviewSeeds[i];
        
            // Find the restaurant with the specified restaurantId
            const existingRestaurant = await Restaurant.findOne({ restaurantName: restaurant });
        
            if (!existingRestaurant) {
                console.error(`Restaurant with name ${restaurant} not found. Skipping review creation.`);
                continue;
            }

            // Create the review with the associated restaurant
            const { _id } = await Review.create({
                reviewText,
                reviewAuthor,
                restaurant: existingRestaurant._id,
            });

            // Find the user and update their reviews
            const user = await User.findOneAndUpdate(
                { username: reviewAuthor },
                {
                    $addToSet: {
                        reviews: _id,
                    },
                }
            );
        }

        console.log('All Done With Seeders');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
});