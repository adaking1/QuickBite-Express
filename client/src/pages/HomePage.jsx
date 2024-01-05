import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import Auth from '../utils/auth';
import { saveOrderIds, getSavedOrders } from '../utils/localStorage';
import { useMutation } from '@apollo/client';
import { SAVE_ORDER } from '../utils/mutations';