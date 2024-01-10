const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        restaurantCount: Int
        savedRestaurants: [Restaurant]
        Reviews: [Review]
    }

    type Query {
        me: User 
        users: [User]
        user(username: String!): User 
        reviews(username: String!):[Review]
        review(reviewId: ID!): Review
        Restaurant(restaurantId: ID!): Restaurant
        Items(itemId: ID!): [Item]
        allRestaurants: [Restaurant]
        searchFood(restaurantInput: RestaurantInput): [Restaurant]
    }

    type Restaurant {
        _id: ID
        restaurantId: ID
        name: String
        description: String
        image: String
        location: String
        Items: [Item]    
    }

    input RestaurantInput {
        restaurantId: String!
        name: String!
        item: String!
        location: String
    }

    type Item {
        name: String!
        description: String
        image: String! 
        price: Float!
        Restaurants: [Restaurant]
        cuisine: String!
    }

    type Cuisine {
        Restaurant:[Restaurant]
        class(id: ID!): Restaurant
    }

    type Review {
        _id: ID
        reviewText: String!
        reviewAuthor: String
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveRestaurant(restaurantId: ID!): User
        removeRestaurant(restaurantId: ID!): User
        addReview(reviewText: String!): Review
        removeReview(reviewId: ID!): Review

    }

    type Auth {
        token: ID!
        user: User
    }

`

module.exports = typeDefs;