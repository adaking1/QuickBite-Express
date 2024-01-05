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
};

return (
    <>
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        

    </Form>
    </>
)
