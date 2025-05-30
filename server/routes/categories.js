const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const routes = express.Router();

routes.get('/get-categories', authenticate, async (req, resp) => {
    try {
        resp.status(200).json({
            message: 'Categories fetched successfully',
            categories: [
                { id: 1, name: 'Category 1' },
                { id: 2, name: 'Category 2' },
                { id: 3, name: 'Category 3' },
            ],
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
}
);
module.exports = routes;