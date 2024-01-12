import { gql } from '@apollo/client';

export const SAVE_RESTAURANT = gql `
mutation SaveRestaurant($restaurantinput: RestaurantInput) {
    saveRestaurant(restaurantinput: $restaurantinput) {
      _id
      username
      email
      savedRestaurants {
        _id
        restaurantId
        name
      }
    }
  }
`;

export const REMOVE_RESTAURANT = gql `
mutation RemoveRestaurant($restaurantId: ID!) {
    removeRestaurant(restaurantId: $restaurantId) {
      _id
      username
      email
      restaurantCount
      savedRestaurants {
        _id
        restaurantId
        name
      }
    }
  }
`;

// export const UPDATE_EMAIL = gql `

// `;

// export const UPDATE_USERNAME = gql `

// `;

export const LOGIN_USER = gql `
mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        restaurantCount
        email
        savedRestaurants {
          _id
          restaurantId
          name
        }
        Reviews {
          _id
        }
      }
    }
  }
`;

export const ADD_USER = gql `
mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        restaurantCount
      }
    }
  }
`;

// export const DELETE_USER = gql `

// `;

export const ADD_REVIEW = gql `
mutation AddReview($reviewText: String!) {
    addReview(reviewText: $reviewText) {
      _id
      reviewText
      reviewAuthor
    }
  }
`;

export const REMOVE_REVIEW = gql `
mutation RemoveReview($reviewId: ID!) {
    removeReview(reviewId: $reviewId) {
      _id
      reviewAuthor
      reviewText
    }
  }
`;