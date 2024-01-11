import { gql } from '@apollo/client';

export const GET_FOOD = gql `
query getFood($restaurantInput: RestaurantInput) {
    getFood(restaurantInput: $restaurantInput) {
      _id
      restaurantId
      name
      location
      description
      image
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

