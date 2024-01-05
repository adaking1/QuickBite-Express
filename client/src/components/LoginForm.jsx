import { useState } from "react";
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [login, { error }] = useMutation(LOGIN_USER);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if(form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        try {
            const { data } = await login({
                variables: { ...formData }
            });
            Auth.login(data.login.token);
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
                    Login credentials incorrect!
                </Alert>
                <Form.Group className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='email'
                    name='email'
                    onChange={handleInputChange}
                    value={formData.email}
                    required
                    />
                    <Form.Control.Feedback type='invalid'>Email required</Form.Control.Feedback>
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
                    <Form.Control.Feedback type='invalid'>Email required</Form.Control.Feedback>
                </Form.Group>    
                <Button
                    disabled={!(formData.email && formData.password)}
                    type='submit'
                    variant='success'>
                    Submit
                </Button>            
            </Form>
        </>
    )
};

export default LoginForm;