import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/cart.sass';

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/cart/get-cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        const data = await response.json();
        setCartItems(data.cart || []);
      } else if (response.status === 401) {
        navigate('/signin');
      } else {
        setError('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      setRemoving(true);
      const response = await fetch(`http://localhost:3001/cart/remove-from-cart/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        // Remove item from local state
        setCartItems(cartItems.filter(item => item.productId !== productId));
      } else if (response.status === 401) {
        navigate('/signin');
      } else {
        setError('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Network error occurred');
    } finally {
      setRemoving(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <p className="cart-subtitle">
          {cartItems.length > 0 
            ? `${getTotalItems()} item${getTotalItems() !== 1 ? 's' : ''} in your cart`
            : 'Your cart is empty'
          }
        </p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {cartItems.length > 0 ? (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="item-image-placeholder">
                  {item.product?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.product?.name || 'Unknown Product'}</h3>
                  <p className="item-description">
                    {item.product?.description || 'No description available'}
                  </p>
                  <div className="item-quantity">
                    <span>Quantity: {item.quantity}</span>
                  </div>
                </div>
                <div className="item-price">
                  <span className="price">${item.product?.price || 0}</span>
                  <span className="total">
                    Total: ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="item-actions">
                  <button
                    className="btn btn-remove"
                    onClick={() => handleRemoveFromCart(item.productId)}
                    disabled={removing}
                  >
                    {removing ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="summary-content">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Total Items:</span>
                <span>{getTotalItems()}</span>
              </div>
              <div className="summary-row total">
                <span>Total Price:</span>
                <span>${getTotalPrice()}</span>
              </div>
              <button className="btn btn-checkout">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-cart">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/user/product')}
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart; 