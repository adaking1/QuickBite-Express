import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col, Tab, Modal, Nav } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { removeRestaurantId } from '../utils/localStorage';
import { GET_ME } from '../utils/queries';
import { REMOVE_RESTAURANT, REMOVE_USER } from '../utils/mutations';
import UpdateUsername from '../components/UpdateUsername';
import UpdateEmail from '../components/UpdateEmail';

const Profile = () => {
    const { loading, data } = useQuery(GET_ME);
    const [deleteRestaurant, { deleteRestError }] = useMutation(REMOVE_RESTAURANT);
    const [deleteUser, { deleteUserError }] = useMutation(REMOVE_USER);
    const [showModal, setShowModal] = useState(false);

    const userData = data?.getMe || {};
    console.log(userData);
    if (userData.savedRestaurants) {
        const restaurantIds = [];
        userData.savedRestaurants.map((restaurant) => restaurantIds.push(restaurant._id));
        localStorage.setItem('saved_restaurants', JSON.stringify(restaurantIds));
    }

    const handleDeleteRestaurant = async (restaurantId) => {
        console.log(restaurantId)
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
            return false;
        }
        try {
            const data = await deleteRestaurant({
                variables: { restaurantId }
            });
            removeRestaurantId(restaurantId);
            localStorage.setItem('saved_restaurants', restaurantId);
        }
        catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async () => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;
        if (!token) {
            return false;
        }
        try {
            const data = await deleteUser();
            Auth.logout();
            return data;
        }
        catch (err) {
            console.error(err);
        }
    }

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <div fluid="true" id='profileName' className="text-light bg-dark p-5">
                <Container>
                <h2>{userData.username}'s Profile</h2>
                </Container>
            </div>
            <div id='profileInfo'>
            <Container>
                <h3>
                {userData.savedRestaurants.length
                ? `${userData.savedRestaurants.length} saved ${userData.savedRestaurants.length === 1 ? 'restaurant' : 'restaurants'}:`
                : 'No saved restaurants'}
                </h3>
                <Row id='profileSaved'>
                    {userData.savedRestaurants.map((restaurant) => {
                        return (
                            <Col key={restaurant._id} md='4'>
                                <h4>{restaurant.restaurantName}</h4>
                                <Button className='btn-block btn-dark' onClick={() => handleDeleteRestaurant(restaurant._id)}>
                                Remove
                                </Button>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
            <Container id='accountInfo'>
                <h3>Account Information</h3>
                <Row>
                    <div>
                        <h4>Username: {userData.username}</h4>
                        <h4>Email: {userData.email}</h4>
                        <Button className='btn-block btn-dark' onClick={() => setShowModal(true)}>
                            Update Account Information
                        </Button>
                    </div>
                </Row>
            </Container>
            </div>
            <Button id='deleteAccount' className='btn-block btn-danger' onClick={() => handleDeleteUser()}>
                    Delete Account
                </Button>
            <Modal
            size='lg'
            show={showModal}
            onHide={() => setShowModal(false)}
            aria-labelledby='update-modal'>
            <Tab.Container defaultActiveKey='username'>
                <Modal.Header closeButton>
                </Modal.Header>
                    <Modal.Title id='updateUserInfo'>
                        <Nav variant='pills'>                    
                            <Nav.Item>
                                <Nav.Link eventKey='username'>Username</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey='email'>Email</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Modal.Title>
                <Modal.Body>
                <Tab.Content>
                    <Tab.Pane eventKey='username'>
                    <UpdateUsername handleModalClose={() => setShowModal(false)} />
                    </Tab.Pane>
                    <Tab.Pane eventKey='email'>
                    <UpdateEmail handleModalClose={() => setShowModal(false)} />
                    </Tab.Pane>
                </Tab.Content>
                </Modal.Body>
            </Tab.Container>
            </Modal>
        </>
    );
};

export default Profile;