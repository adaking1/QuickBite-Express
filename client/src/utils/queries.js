import { gql } from '@apollo/client';

// export const GET_FOOD = gql `
// query GetFood($value: String!) {
//   getFood(value: $value) {
//     _id
//     restaurantId
//     restaurantName
//     location
//     restaurantDescription
//     restaurantImage
//   }
// }
// `;

export const GET_FOOD = gql `
query GetFood($value: String!) {
  getFood(value: $value) {
    _id
    location
    restaurantDescription
    restaurantId
    restaurantImage
    restaurantName
    tags
  }
}
`;

export const GET_RESTAURANT = gql `
query GetRestaurant($restaurantId: ID!) {
    getRestaurant(restaurantId: $restaurantId) {
      _id
      restaurantId
      restaurantName
      location
      restaurantImage
      restaurantDescription
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
        restaurantName
        location
        restaurantImage
        restaurantDescription
      }
      Reviews {
        reviewText
        _id
      }
      restaurantCount
    }
  }
`;

export const QUERY_CHECKOUT = gql`
query Checkout($items: [ItemInput]) {
  checkout(items: $items) {
    session
  }
}
`;

export const GET_ITEM = gql `
query Item($itemId: ID!) {
  item(itemId: $itemId) {
    name
    price
    description
    image
  }
}
`;

export const MENU_ITEMS = gql `
query MenuItems($restaurantId: ID!) {
  menuItems(restaurantId: $restaurantId) {
    _id
    itemId
    name
    price
    description
  }
}
`;