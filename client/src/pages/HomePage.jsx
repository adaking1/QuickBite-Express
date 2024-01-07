import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveOrderIds, getSavedOrders } from '../utils/localStorage';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_ORDER } from '../utils/mutations';
import { GET_FOOD } from '../utils/queries';

const SearchFood = () => {
    const [searchedFood, setSearchedFood] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [savedOrderIds, setSavedOrderIds] = useState(getSavedOrders());
    const [saveOrder, { error }] = useMutation(SAVE_ORDER);
    const [getFood, { error, data }] = useQuery(GET_FOOD);

    useEffect(() => {
        return () => saveOrder(savedOrderIds);
    });

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!searchInput) {
            return false;
        }
        try {
            const { data } = await getFood({
                variables: { input: searchInput }
            });
            const restaurantData = data.map((menu) => {
                // put restaurant info here 
                // click to go to menu
            });
            setSearchedFood(restaurantData);
            setSearchInput('');
            
        }
        catch (err) {
            console.error(err);
        }
    };
};