export const getSavedOrders = () => {
    const savedOrderIds = localStorage.getItem('saved_orders')
    ? JSON.parse(localStorage.getItem('saved_orders'))
    : [];
    return savedOrderIds;
};
export const savedOrderIds = (orderIddArr) => {
    if (orderIddArr.length) {
        localStorage.setItem('saved_orders', JSON.stringify(orderIddArr));
    }
    else {
        localStorage.removeItem('saved_orders');
    }
};
export const removeOrderId = (orderId) => {
    const savedOrderIds = localStorage.getItem('saved_orders')
    ? JSON.parse(localStorage.getItem('saved_orders'))
    : null;
    if (!savedOrderIds) {
        return false;
    }
    const updatedSavedOrderIds = savedOrderIds?.filter((savedOrderId) => savedOrderId !== orderId);
    localStorage.setItem('saved_orders', JSON.stringify(updatedSavedOrderIds));
    return true;
}