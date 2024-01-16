import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_RESTAURANT, GET_ITEM } from '../utils/queries';
import { SAVE_RESTAURANT } from '../utils/mutations';
import { useStoreContext } from '../utils/GlobalState';
import { ADD_TO_CART, UPDATE_CART_QUANTITY } from '../utils/actions';
import { idbPromise } from '../utils/helpers';


const RestaurantPage = () => {
    const menu = localStorage.getItem('selectedRestaurant');
    const { loading, data } = useQuery(GET_RESTAURANT,
        {variables: {restaurantId: menu}});
        console.log(data);
    const menuData = data?.getRestaurant || {};
    const [saveRestaurant, { error }] = useMutation(SAVE_RESTAURANT);
    const [state, dispatch] = useStoreContext();
    const { cart } = state;  
    const [getItem, { itemData, itemLoading }] = useLazyQuery(GET_ITEM); 
    console.log(menuData);
    
    // useEffect((e) => {
    //     const { data, loading } = useQuery(GET_ITEM,
    //         {variables: {id: e.target.value}})
    // }, [addToCart]);

    const handleSaveRestaurant = async () => {
        const userData = await saveRestaurant({
            variables: { restaurantId: menuData._id, name: menuData.restaurantName }
        });
        localStorage.setItem('saved_restaurants', menuData._id);
        return userData;
    };

    const addToCart = async (e) => {
        const item = await getItem({variables: {id: e.target.value}});
        const { _id } = item;
        const itemInCart = cart.find((cartItem) => cartItem._id === _id)
        if (itemInCart) {
          dispatch({
            type: UPDATE_CART_QUANTITY,
            _id: _id,
            purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
          });
          idbPromise('cart', 'put', {
            ...itemInCart,
            purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
          });
        } else {
          dispatch({
            type: ADD_TO_CART,
            product: { ...item, purchaseQuantity: 1 }
          });
          idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
        }
      }


    if (loading) {
        return <h2> Loading...</h2>;
    }

    return (
        <>
        <Container>
            <h2>{menuData.restaurantName}</h2>
            {Auth.loggedIn() ?
            <Button type='button' value={menuData._id} onClick={(e) => handleSaveRestaurant(e)}>Save</Button>
            : null}
            {/* <Row>
                {menuData.items.map((item) => {
                    return (
                        <Col md='4' key={item._id}>
                            <Card border='dark'>
                                <Card.Body>
                                    <Card.Title>{item.itemName}</Card.Title>
                                    <Card.Text>{item.price}</Card.Text>
                                    <Card.Text>{item.itemDescription}</Card.Text>
                                    <Button type='button' value={item._id} onClick={addToCart}>Add to Cart</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row> */}
        </Container>
        </>
    );
};

export default RestaurantPage;