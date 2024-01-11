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
        getMe: User 
        users: [User]
        user(username: String!): User 
        reviews(username: String!):[Review]
        review(reviewId: ID!): Review
        getFood(restaurantInput: RestaurantInput): [Restaurant]
        getRestaurant(id: ID!): Restaurant
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
        description: String 
        image: String!
        location: String
        cuisine: String!
    }

    type Item {
        name: String!
        description: String
        image: String! 
        price: Float!
        Restaurants: [Restaurant]
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
        loginUser(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveRestaurant(restaurantinput: RestaurantInput): User
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