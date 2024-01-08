const typeDefs = `
    type User {
        _id: ID
        username: String
        email: String
        restaurantCount: Int
        savedRestaurants: [Restaurant]
    }
    type Restaurant {
        restaurantId: ID
        name: String
        description: String
        image: String
        location: String
        
    }




`