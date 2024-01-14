import { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { UPDATE_EMAIL } from '../utils/mutations';
import Auth from '../utils/auth';

const UpdateEmail = () => {
    const [formInput, setFormInput] = useState('');
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [update, { error }] = useMutation(UPDATE_EMAIL);

    const handleInputChange = (event) => {
        const { value } = event.target;
        setFormInput(value);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        try {
            const userData = await update({
                variables: { newEmail: formInput }
            });
            return userData;
        }
        catch (err) {
            console.error(err);
            setShowAlert(true);
        }
        setFormInput('');
    };

    return (
        <>
        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong!
        </Alert>
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='New email'
            name='email'
            onChange={handleInputChange}
            value={formInput}
            required
          />
          <Form.Control.Feedback type='invalid'>Input is required!</Form.Control.Feedback>
        </Form.Group>
            <Button
            disabled={!formInput}
            type='submit'
            variant='success'>
            Submit
            </Button>
        </Form>
        </>
    )
};

export default UpdateEmail;