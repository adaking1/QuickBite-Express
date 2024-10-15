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

    type Checkout {
        session: ID
      }

    type Query {
        getMe: User 
        users: [User]
        user(username: String!): User 
        reviews(username: String!):[Review]
        review(reviewId: ID!): Review
        getFood(value: String!): [Restaurant]
        getRestaurant(restaurantId: ID!): Restaurant
        order(_id: ID!): Order
        checkout(items: [ItemInput]): Checkout
        item(itemId: ID!): Item
        menuItems(restaurantId: ID!): [Item]
    }

    input ItemInput {
        _id: ID
        purchaseQuantity: Int
        name: String
        price: Float
        description: String
      }

    type Restaurant {
        _id: ID
        restaurantId: ID
        restaurantName: String
        restaurantDescription: String
        restaurantImage: String
        location: String
        tags: [String]
        Items: [Item]    
    }

    input RestaurantInput {
        _id: ID
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
        restaurantId: String!
        itemId: String
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
        saveRestaurant(restaurantId: ID!, name: String!): User
        removeRestaurant(restaurantId: ID!): User
        addRestaurant(restaurantID: ID!): User
        addReview(reviewText: String!): Review
        removeReview(reviewId: ID!): Review
        removeUser: User
        updateEmail(newEmail: String!): Auth
        updateUsername(newUsername: String!): Auth
        addOrder(items: [ID]!): Order

    }

    type Auth {
        token: ID
        user: User
    }

    type Order {
        _id: ID
        purchaseDate: String
        items: [Item]
      }
`

module.exports = typeDefs;