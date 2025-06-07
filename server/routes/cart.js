const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const routes = express.Router();

// In-memory cart storage (in production, use a database)
let userCarts = {};

// Add item to cart
routes.post('/add-to-cart', authenticate, async (req, resp) => {
    try {
        const { productId, quantity = 1 } = req.body;
        const userId = req.user.id; // Assuming user ID is available from auth middleware

        if (!productId) {
            return resp.status(400).json({ message: 'Product ID is required' });
        }

        // Initialize user cart if it doesn't exist
        if (!userCarts[userId]) {
            userCarts[userId] = [];
        }

        // Check if product already exists in cart
        const existingItemIndex = userCarts[userId].findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            // Update quantity if product already exists
            userCarts[userId][existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            userCarts[userId].push({
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }

        resp.status(200).json({
            message: 'Item added to cart successfully',
            cartItems: userCarts[userId].length,
            cart: userCarts[userId]
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

// Get cart items
routes.get('/get-cart', authenticate, async (req, resp) => {
    try {
        const userId = req.user.id;
        const cart = userCarts[userId] || [];

        // Mock product data (in production, fetch from database)
        const products = [
            { id: 1, name: 'Product 1', price: 100, description: 'Description for Product 1' },
            { id: 2, name: 'Product 2', price: 200, description: 'Description for Product 2' },
            { id: 3, name: 'Product 3', price: 300, description: 'Description for Product 3' },
        ];

        // Combine cart items with product details
        const cartWithProducts = cart.map(cartItem => {
            const product = products.find(p => p.id === cartItem.productId);
            return {
                ...cartItem,
                product: product || null
            };
        }).filter(item => item.product); // Remove items where product was not found

        resp.status(200).json({
            message: 'Cart fetched successfully',
            cart: cartWithProducts,
            totalItems: cartWithProducts.reduce((sum, item) => sum + item.quantity, 0)
        });

    } catch (error) {
        console.error('Error fetching cart:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

// Remove item from cart
routes.delete('/remove-from-cart/:productId', authenticate, async (req, resp) => {
    try {
        const { productId } = req.params;
        const userId = req.user.id;

        if (!userCarts[userId]) {
            return resp.status(404).json({ message: 'Cart not found' });
        }

        userCarts[userId] = userCarts[userId].filter(item => item.productId !== parseInt(productId));

        resp.status(200).json({
            message: 'Item removed from cart successfully',
            cart: userCarts[userId]
        });

    } catch (error) {
        console.error('Error removing from cart:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

// Clear cart
routes.delete('/clear-cart', authenticate, async (req, resp) => {
    try {
        const userId = req.user.id;
        userCarts[userId] = [];

        resp.status(200).json({
            message: 'Cart cleared successfully',
            cart: []
        });

    } catch (error) {
        console.error('Error clearing cart:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = routes; 