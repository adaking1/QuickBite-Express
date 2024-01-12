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

        await User.create(userSeeds);
        await Order.create(orderSeeds);
        
        // Seeding Restaurants
        const createdRestaurants = await Restaurant.create(restaurantSeeds);

    // Seeding items to Restaurants through restaurantId
        for (let i = 0; i < itemSeeds.length; i++) {
            const { restaurantIds, ...itemData } = itemSeeds[i];

    // Find the restaurants with the specified restaurantIds
            const existingRestaurants = await Restaurant.find({ restaurantId: { $in: restaurantIds } });

            if (!existingRestaurants || existingRestaurants.length === 0) {
            console.error(`No matching restaurants found for IDs ${restaurantIds}. Skipping item creation.`);
            continue;
            }

            const createdItem = await Item.create({
            ...itemData,
            restaurants: existingRestaurants.map(restaurant => restaurant._id),
        });

    // Update each restaurant to include the created item
            for (const restaurant of existingRestaurants) {
            await Restaurant.findByIdAndUpdate(
                restaurant._id,
            {
                $addToSet: { items: createdItem._id },
            }
        );
    }
}

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
            const { reviewText, reviewAuthor, restaurant: restaurantId } = reviewSeeds[i];
        
            // Find the restaurant with the specified restaurantId
            const existingRestaurant = await Restaurant.findOne({ restaurantId });
        
            if (!existingRestaurant) {
                console.error(`Restaurant with ID ${restaurantId} not found. Skipping review creation.`);
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