import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { useLazyQuery } from '@apollo/client';
import { GET_FOOD } from '../utils/queries';

const SearchPage = (searchInput) => {
    // const { getFood, loading, data } = useLazyQuery(GET_FOOD, {
    //     variables: { input: searchInput }
    // });
    // const []

    return (
        <>
        <Container>
        <h3 className='pt-5'>
            {searchedFood.length ? `${searchedFood.length} restaurants` : ''}
        </h3>
        <Row>
            {searchedFood.map((restaurant) => {
                return (
                    <Col md='4' key={restaurant.menuId}>
                        <Card border='dark'>
                            {restaurant.image ? (
                                <Card.Img src={restaurant.image} alt={`Image for ${restaurant.name}`} variant='top' />
                            ) : null}
                            <Card.Body>
                                <Card.Title>{restaurant.name}</Card.Title>
                                <Card.Text>{restaurant.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                );
            })}
        </Row>
    </Container>
</>
    )
};

export default SearchPage;