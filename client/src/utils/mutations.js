import { gql } from '@apollo/client';

export const SAVE_RESTAURANT = gql `
mutation SaveRestaurant($restaurantId: ID!, $name: String!) {
  saveRestaurant(restaurantId: $restaurantId, name: $name) {
    _id
    username
    restaurantCount
    savedRestaurants {
      _id
      restaurantName
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
        restaurantName
      }
    }
  }
`;

export const UPDATE_EMAIL = gql `
mutation UpdateEmail($newEmail: String!) {
  updateEmail(newEmail: $newEmail) {
    user {
      _id
      username
      email
    }
  }
}
`;

export const UPDATE_USERNAME = gql `
mutation UpdateUsername($newUsername: String!) {
  updateUsername(newUsername: $newUsername) {
    user {
      _id
      username
      email
    }
  }
}
`;

export const LOGIN_USER = gql `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
      email
      restaurantCount
      savedRestaurants {
        _id
        restaurantName
      }
      Reviews {
        _id
        reviewText
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

export const REMOVE_USER = gql `
mutation RemoveUser {
  removeUser {
    _id
    username
    email
  }
}

`;

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