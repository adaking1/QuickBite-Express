import { Card, Button } from 'react-bootstrap';
import { useStoreContext } from '../../utils/GlobalState';
import { idbPromise } from '../../utils/helpers';
import { UPDATE_CART_QUANTITY, ADD_TO_CART } from '../../utils/actions';

function FoodItem(item) {
    const [state, dispatch] = useStoreContext();

    const { name, _id, price} = item;

    const { cart } = state;

    const addToCart = () => {
        const itemInCart = cart.find((cartItem) => cartItem._id === _id)
        if (itemInCart) {
          dispatch({
            type: UPDATE_CART_QUANTITY,
            _id: _id,
            purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
          });
          idbPromise('cart', 'put', {
            ...itemInCart,
            purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
          });
        } else {
          dispatch({
            type: ADD_TO_CART,
            item: { ...item, purchaseQuantity: 1 }
          });
          idbPromise('cart', 'put', { ...item, purchaseQuantity: 1 });
        }
    }

    return (
        <Card border='dark'>
            <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>{item.price}</Card.Text>
                <Card.Text>{item.description}</Card.Text>
                <Button variant='success' type='button' onClick={addToCart}>Add to Cart</Button>
            </Card.Body>
        </Card>
    );
}

export default FoodItem;