import {
    ADD_TO_CART,
    UPDATE_CART_QUANTITY,
    REMOVE_FROM_CART,
    ADD_MULTIPLE_TO_CART,
    CLEAR_CART,
    TOGGLE_CART,
    SELECT_RESTAURANT,
    UPDATE_ITEMS
} from './actions';

export const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
        case UPDATE_ITEMS:
            return {
                ...state,
                items: [...action.items]
            }
        case ADD_TO_CART:
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, action.item]
            };
        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                cart: [...state.cart, ...action.items],
            };
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                cartOpen: true,
                cart: state.cart.map(item => {
                    if (action._id === item._id) {
                    item.purchaseQuantity = action.purchaseQuantity
                }
                return item;
                })
            };
        case REMOVE_FROM_CART:
            let newState = state.cart.filter((item) => {
                return item._id !== action._id;
            });
            return {
                ...state,
                cartOpen: newState.length > 0,
                cart: newState
            };
        case CLEAR_CART:
            return {
                ...state,
                cartOpen: false,
                cart: []
            };
        case TOGGLE_CART:
            return {
                ...state,
                cartOpen: !state.cartOpen
            };
        case SELECT_RESTAURANT:
            // console.log(action.value.restaurantId);
            return {
                ...state,
                selectedRestaurant: action.value.restaurantId
            }
        default: 
            return state;
    }
};