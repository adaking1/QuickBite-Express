import { useState } from "react";
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [addUser, { error, data }] = useMutation(ADD_USER);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        try {
            const { data } = await addUser({
                variables: { ...formData }
            });
            Auth.login(data.addUser.token);
        }
        catch (err) {
            console.error(err);
            setShowAlert(true);
        }
        setFormData({ username: '', email: '', password: '' });
    };

return (
    <>
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
        Unable to signup!
        </Alert>
        <Form.Group className='mb-3'>
            <Form.Label htmlFor='username'>Username</Form.Label>
            <Form.Control
                type='text'
                placeholder='username'
                name='username'
                onChange={handleInputChange}
                value={formData.username}
                required
            />
            <Form.Control.Feedback type='invalid'>Username required!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mb-3'>
            <Form.Label htmlFor='email'>Email</Form.Label>
            <Form.Control
                type='email'
                placeholder='email address'
                name='email'
                onChange={handleInputChange}
                value={formData.email}
                required
            />
            <Form.Control.Feedback type='invalid'>Email required!</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className='mb-3'>
            <Form.Label htmlFor='password'>Password</Form.Label>
            <Form.Control
                type='password'
                placeholder='password'
                name='password'
                onChange={handleInputChange}
                value={formData.password}
                required
            />
            <Form.Control.Feedback type='invalid'>Username required!</Form.Control.Feedback>
        </Form.Group>
        <Button
        disabled={!(formData.username && formData.email && formData.password)}
        type='submit'
        variant='success'>
        Submit
        </Button>
    </Form>
    </>
    );
};

export default SignupForm;
