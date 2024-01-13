const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        password: String
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
        getFood(value: String!): [Restaurant]
        getRestaurant(id: ID!): Restaurant
    }

    type Restaurant {
        _id: ID
        restaurantId: ID
        restaurantName: String
        restaurantDescription: String
        restaurantImage: String
        location: String
        Items: [Item]    
    }

    input RestaurantInput {
        restaurantId: String
        restaurantName: String
        item: String
        location: String
        cuisine: String
    }

    type Item {
        _id: ID
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
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveRestaurant(restaurantId: ID!): User
        removeRestaurant(restaurantId: ID!): User
        addReview(reviewText: String!): Review
        removeReview(reviewId: ID!): Review
        removeUser: User
        updateEmail(newEmail: String!): Auth

    }

    type Auth {
        token: ID!
        user: User
    }
`

module.exports = typeDefs;