import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RESTAURANT } from '../utils/queries';
import { SAVE_RESTAURANT } from '../utils/mutations';
import { useStoreContext } from '../utils/GlobalState';


const RestaurantPage = () => {
    const menu = localStorage.getItem('selectedRestaurant');
    const { loading, data } = useQuery(GET_RESTAURANT,
        {variables: {restaurantId: menu}});
        console.log(data);
    const menuData = data?.getRestaurant || {};
    const [saveRestaurant, { error }] = useMutation(SAVE_RESTAURANT);
    

    const handleSaveRestaurant = async () => {
        const userData = await saveRestaurant({
            variables: { restaurantId: menuData._id, name: menuData.restaurantName }
        });
        localStorage.setItem('saved_restaurants', menuData._id);
        return userData;
    };


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
                                    <Button type='button' value={restaurant.name} onClick={handleRestaurantSelect}>Add to Cart</Button>
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