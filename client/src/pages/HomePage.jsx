import { useState } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useLazyQuery } from '@apollo/client';
import { GET_FOOD } from '../utils/queries';


const SearchFood = () => {
    const [searchedFood, setSearchedFood] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [getFood,{ loading, data }] = useLazyQuery(GET_FOOD);
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        if (!searchInput) {
            return false;
        }
        const restaurant = await getFood({variables: {value: searchInput}});
        console.log(restaurant.data.getFood);
        const restaurantData = restaurant.data.getFood.map((restaurant) => ({
            id: restaurant._id,
            name: restaurant.restaurantName,
            description: restaurant.restaurantDescription,
            image: restaurant.restaurantImage,
            location: restaurant.location        
        }));
            setSearchedFood(restaurantData);
            setSearchInput('');
        if (loading) {
            return <h2>LOADING...</h2>
        }
        const restaurantDat = restaurant.data.getFood;
        console.log(restaurantData);
        return restaurantDat;
            
    };

    const handleRestaurantSelect = async (event) => {
        localStorage.setItem('selectedRestaurantName', event.target.value);
        localStorage.setItem('selectedRestaurantId', event.target.id);
        window.location.replace('/menu');

    };

    return (
        <>
        <div id='search' className='text-light bg-dark p-5'>
            <Container>
                <h2>Search for food!</h2>
                <Form onSubmit={handleFormSubmit}>
                    <Row>
                        <Col xs={12} md={8}>
                            <Form.Control
                                name='searchInput'
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                type='text'
                                size='lg'
                                placeholder='Search'
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Button type='submit' variant='success' size='lg'>
                                Search
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
        <Container>
            <h3 className='pt-5'>
                {searchedFood.length ? (searchedFood.length === 1 ? `${searchedFood.length} restaurant` : `${searchedFood.length} restaurants`) : ''}
            </h3>
            <Row>
                {searchedFood.map((restaurant) => {
                    return (
                        <Col id='searchedRestaurants' md='4' key={restaurant.id}>
                            <Card border='dark' bg='light'>
                                {restaurant.image ? (
                                    <Card.Img src={restaurant.image} alt={`Image for ${restaurant.name}`} variant='top' />
                                ) : null}
                                <Card.Body>
                                    <Card.Title>{restaurant.name}</Card.Title>
                                    <Card.Text>{restaurant.description}</Card.Text>
                                    <Button variant='success' type='button' value={restaurant.name} id={restaurant.id} onClick={handleRestaurantSelect}>Select</Button>
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

export default SearchFood;