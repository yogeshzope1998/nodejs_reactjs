import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../stylesheets/product.sass';

function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const resp = await fetch('http://localhost:3001/products/get-product', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (resp.status === 200) {
        const data = await resp.json();
        setProducts(data);
      } else if (resp.status === 401) {
        navigate('/signin');
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      setAddingToCart(true);
      setError('');
      
      const response = await fetch('http://localhost:3001/cart/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: productId,
          quantity: 1
        })
      });

      if (response.status === 200) {
        const data = await response.json();
        setSuccessMessage(`Item added to cart! (${data.cartItems} items in cart)`);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
      } else if (response.status === 401) {
        navigate('/signin');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Network error occurred while adding to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleViewDetails = (productId) => {
    // TODO: Navigate to product details page
    console.log('View details:', productId);
  };

  const getProductInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  if (loading) {
    return (
      <div className="product-container">
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-container">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <h2 className="empty-title">Error Loading Products</h2>
          <p className="empty-description">{error}</p>
          <button className="btn btn-primary" onClick={fetchProducts}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <div className="product-header">
        <h1>Our Products</h1>
        <p className="product-subtitle">Discover amazing products crafted just for you</p>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {products && products.products && products.products.length > 0 ? (
        <div className="product-list">
          {products.products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-placeholder">
                {getProductInitial(product.name)}
              </div>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">${product.price}</p>
                <p className="product-description">
                  {product.description || 'No description available for this product.'}
                </p>
                <div className="product-actions">
                  <button 
                    className={`btn btn-primary ${addingToCart ? 'loading' : ''}`}
                    onClick={() => handleAddToCart(product.id)}
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleViewDetails(product.id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2 className="empty-title">No Products Available</h2>
          <p className="empty-description">
            We're currently updating our inventory. Please check back soon!
          </p>
        </div>
      )}
    </div>
  );
}

export default Product;