import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { removeOrderId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_ORDER, UPDATE_EMAIL, UPDATE_PASSWORD, UPDATE_USERNAME, REMOVE_RESTAURANT } from '../utils/mutations';

const Profile = () => {
    const { loading, data } = useQuery(GET_ME);
    const [deleteOrder, { error }] = useMutation(REMOVE_ORDER);
    const [deleteRestaurant, { error }] = useMutation(REMOVE_RESTAURANT);
    const [updateEmail, { error }] = useMutation(UPDATE_EMAIL);
    const [updateEmail, { error }] = useMutation(UPDATE_EMAIL);

};

export default Profile;