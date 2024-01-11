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
        await cleanDB('Review','reviews');
        await cleanDB('Restaurant','restaurants');
        await cleanDB('Order','orders');
        await cleanDB('Item','item');

        await User.create(userSeeds);

        for (let i = 0; i < reviewSeeds.length; i++) {
            const { _id, reviewAuthor } = await Review.create(reviewSeeds[i]);
            const user = await User.findOneAndUpdate(
                { username: reviewAuthor },
                {
                    $addToSet: {
                        reviews: _id,
                    },
                }
            );
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('All Done With Seeders');
    process.exit(0);
});