import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = React.useState('');

  useEffect(() => {
    fetchProducts();
  },[])

  const fetchProducts = async () => {
    try {
      const resp = await fetch('http://localhost:3001/products/get-product',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies in the request
      });

      if (!resp) {
        console.error('Failed to fetch products');
        return;
      }
      if (resp.status === 200) {
        const data = await resp.json();
        setProducts(data);
      } else if (resp.status === 401) {
        // Unauthorized - redirect to signin
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  return (
    <div>
      <h1>Product</h1>
      <p>{products.message}</p>
      <div className="product-list">
        {products && products.products.map((product) => (
          <div key={product.id} className="product-item">
            <h2>{product.name}</h2>
            <p>Price: ${product.price}</p>
          </div>
        ))}
        </div>
    </div>
  );
}
export default Product;