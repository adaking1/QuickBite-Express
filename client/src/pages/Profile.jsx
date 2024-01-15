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
    // const [updateEmail, { emailError }] = useMutation(UPDATE_EMAIL);
    // const [updateUsername, { usernameError }] = useMutation(UPDATE_USERNAME);
    const [showModal, setShowModal] = useState(false);

    const userData = data?.getMe || {};
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

    // const handleUpdateEmail = async (event) => {
    //     event.preventDefault();
    //     const newEmail = event.target.value;
    //     const token = Auth.loggedIn() ? Auth.getToken() : null;
    //     if (!token) {
    //         return false;
    //     }
    //     try {
    //         const { data } = await updateEmail({
    //             variables: { newEmail }
    //         });
            
    //     }
    //     catch (err) {
    //         console.err(err);
    //     }
    // };

    // const handleUpdateUsername = async (event) => {
    //     event.preventDefault();
    //     const newUsername = event.target.value;
    //     const token = Auth.loggedIn ? Auth.getToken() : null;
    //     if (!token) {
    //         return false;
    //     }
    //     try {
    //         const { data } = await updateUsername({
    //             variables: { newUsername }
    //         });
    //     }
    //     catch (err) {
    //         console.error(err);
    //     }
    // };

    // const handleUpdatePassword = async (event) => {
    //     event.preventDefault();
    //     const newPassword = event.target.value;
    //     const token = Auth.loggedIn ? Auth.getToken() : null;
    //     if (!token) {
    //         return false;
    //     }
    //     try {
    //         const { data } = await updatePassword({
    //             variables: { newPassword }
    //         });
    //     }
    //     catch (err) {
    //         console.error(err);
    //     }
    // };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return (
        <>
            <div fluid="true" className="text-light bg-dark p-5">
                <Container>
                <h2>{userData.username}'s Profile</h2>
                </Container>
            </div>
            <Container>
                <h3>
                {userData.savedRestaurants.length
                ? `${userData.savedRestaurants.length} saved ${userData.savedRestaurants.length === 1 ? 'restaurant' : 'restaurants'}:`
                : 'No saved restaurants'}
                </h3>
                <Row>
                    {userData.savedRestaurants.map((restaurant) => {
                        return (
                            <Col key={restaurant.restaurantId} md='4'>
                                <h4>{restaurant.restaurantName}</h4>
                                <Button className='btn-block btn-danger' onClick={() => handleDeleteRestaurant(restaurant.restaurantId)}>
                                Remove from saved
                                </Button>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
            <Container>
                <h3>Account Information</h3>
                <Row>
                    <div>
                        <h4>Username: {userData.username}</h4>
                        <h4>Email: {userData.email}</h4>
                        <Button className='btn-block btn-danger' onClick={() => setShowModal(true)}>
                            Update Account Information
                        </Button>
                    </div>
                </Row>
                <Button className='btn-block btn-danger' onClick={() => handleDeleteUser()}>
                    Delete Account
                </Button>
            </Container>
            <Modal
            size='lg'
            show={showModal}
            onHide={() => setShowModal(false)}
            aria-labelledby='update-modal'>
            {/* tab container to do either signup or login component */}
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