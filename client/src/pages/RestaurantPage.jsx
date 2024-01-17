import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_RESTAURANT, GET_ITEM, MENU_ITEMS, GET_ME } from '../utils/queries';
import { SAVE_RESTAURANT } from '../utils/mutations';
import { useStoreContext } from '../utils/GlobalState';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../utils/actions';
import { idbPromise } from '../utils/helpers';
import FoodItem from '../components/MenuItem';


const RestaurantPage = () => {
    const menuName = localStorage.getItem('selectedRestaurantName');
    const menuId = localStorage.getItem('selectedRestaurantId');
    const { loading, data } = useQuery(MENU_ITEMS,
        {variables: {restaurantId: menuId}});
    const menuData = data?.menuItems || {};
    const [saveRestaurant, { error }] = useMutation(SAVE_RESTAURANT);
    const [state, dispatch] = useStoreContext();
    const { cart } = state;  
    const [getItem, { itemData, itemLoading }] = useLazyQuery(GET_ITEM); 
    const savedRestaurants = () => {
        const saved = JSON.parse(localStorage.getItem('saved_restaurants'));
        console.log(saved)
        console.log(saved.length);
        if (!saved.length) {
            console.log('XXX')
            return false;
        }
        else {
            for (let i=0; i<saved.length; i++) {
                console.log(saved[i]._id);
                console.log(menuId);
                if (menuId === saved[i]._id) {
                    return true;
                }
            }
            return false;
        }
    };
    console.log(savedRestaurants());

    const handleSaveRestaurant = async () => {
        const userData = await saveRestaurant({
            variables: { restaurantId: menuId, name: menuName }
        });
        console.log(userData.data.saveRestaurant.savedRestaurants);
        const ids = userData.data.saveRestaurant.savedRestaurants;
        // const savedArray = localStorage.getItem('saved_restaurants');
        // console.log(savedArray.push(menuId))
        localStorage.setItem('saved_restaurants', JSON.stringify(ids));
        // window.location.reload();
        return userData;
    };


    if (loading) {
        return <h2> Loading...</h2>;
    }

    return (
        <>
        <Container>
            <h2>{menuName}</h2>
            {Auth.loggedIn() && (savedRestaurants() === false) ?
            <Button variant='dark' type='button' value={menuId} onClick={(e) => handleSaveRestaurant(e)}>Save</Button>
            : null}
            <Row>
                {menuData.map((item) => (
                    <FoodItem
                    key={item._id} 
                    _id={item._id}
                    name={item.name}
                    price={item.price}
                    description={item.description}
                    />
                ))}
            </Row>
        </Container>
        </>
    );
};

export default RestaurantPage;