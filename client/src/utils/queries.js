import { gql } from '@apollo/client';

export const GET_FOOD = gql `
query GetFood($value: String!) {
  getFood(value: $value) {
    _id
    restaurantId
    restaurantName
    location
    restaurantDescription
    restaurantImage
  }
}
`;

export const GET_RESTAURANT = gql `
query GetRestaurant($getRestaurantId: ID!) {
    getRestaurant(id: $getRestaurantId) {
      _id
      restaurantId
      name
      location
      image
      description
      Items {
        name
        description
        price
        image
      }
    }
  }
`;

export const GET_ME = gql `
query GetMe {
    getMe {
      _id
      email
      username
      savedRestaurants {
        _id
        restaurantId
        name
        location
        image
        description
      }
      Reviews {
        reviewText
        _id
      }
      restaurantCount
    }
  }
`;

