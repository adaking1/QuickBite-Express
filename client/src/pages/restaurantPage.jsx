import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeRestaurantId, saveRestaurantIds, getSavedRestaurants } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RESTAURANT } from '../utils/queries';
import { REMOVE_RESTAURANT, ADD_ } from '../utils/mutations';