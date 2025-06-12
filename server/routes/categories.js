const express = require('express');
const authenticate = require('../middleware/authMiddleware');
const {Category} = require('../models');
const routes = express.Router();

routes.get('/get-categories', authenticate, async (req, resp) => {
    try {
        const userID = req.user;
        const categories = await Category.findAll({
            where: {user_id: userID},
        });
        if (categories.length > 0) {
            resp.status(200).json({ message: 'Categories fetched successfully', categories });
        } else {
            resp.status(200).json({ error: 'No categories found for this user' , categories: []});
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

routes.post("/create-category", authenticate, async(req,resp) => {
    try {
        const {categoryName, categoryDescription, categoryImage} = req.body;
        const userId = req.user;
        Category.create({
            category_name: categoryName,
            category_description: categoryDescription,
            category_image: categoryImage,
            user_id: userId,
        }).then((category) => {
            if(category) {
                resp.status(201).json({ message: 'Category created successfully', category });
            } else {
                resp.status(400).json({ message: 'Category creation failed' });
            }
        }).catch((error) => {
            console.error('Error creating category:', error);
            resp.status(500).json({ message: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error creating category:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

routes.put("/update-category/:id", authenticate, async(req, resp) => {
    try {
        const {categoryName, categoryDescription, categoryImage='test.jpg'} = req.body;
        const categoryID = req.params.id;
        const userID = req.user;
        Category.update({
            category_name: categoryName,
            category_description: categoryDescription,
            category_image: categoryImage,
        }, {
            where: {
                id: categoryID,
                user_id: userID,
            }
        }).then((category) => {
            if(category.length > 0) {
                resp.status(200).json({ message: 'Category updated successfully', category });
            } else {
                resp.status(400).json({ message: 'Category update failed' });
            }
        }).catch((error) => {
            console.error('Error updating category:', error);
            resp.status(500).json({ message: 'Internal server error' });
        });
    } catch (error) {
        console.error('Error updating category:', error);
        resp.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = routes;