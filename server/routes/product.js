const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const routes = express.Router();

routes.get('/get-product', authenticate, async (req, resp) => {
    try{
        resp.status(200).json({
            message: 'Products fetched successfully',
            products: [
                { id: 1, name: 'Product 1', price: 100 },
                { id: 2, name: 'Product 2', price: 200 },
                { id: 3, name: 'Product 3', price: 300 },
            ],
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = routes;