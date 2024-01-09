import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { removeOrderId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { UPDATE_EMAIL, UPDATE_PASSWORD, UPDATE_USERNAME, REMOVE_RESTAURANT } from '../utils/mutations';

const Profile = () => {
    const { loading, data } = useQuery(GET_ME);
    const [deleteRestaurant, { error }] = useMutation(REMOVE_RESTAURANT);
    const [updateEmail, { error }] = useMutation(UPDATE_EMAIL);
    const [updateUsername, { error }] = useMutation(UPDATE_USERNAME);
    const [updatePassword, { error }] = useMutation(UPDATE_PASSWORD);

    const userData = data?.me || {};
    if (userData.savedRestaurants) {
        const restaurantIds = [];
        userData.savedRestaurants.map((restaurant) => restaurantIds.push(restaurant.restaurantId));
        localStorage.setItem('saved_restaurants', JSON.stringify(restaurantIds));
    }

    const handleDeleteRestaurant = async (restaurantId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
            return false;
        }
        try {
            const { data } = await deleteRestaurant({
                variables: { restaurantId }
            });
            remove
        }
        catch (err) {
            console.error(err);
        }
    };
};

export default Profile;