const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authenticate = require('../middleware/authMiddleware');
require('dotenv').config();
const routes = express.Router();

//=============================
// Sign In
//=============================
routes.post('/signin', (req, res) => {
    try {
        const { email, password } = req.body;
        User.findOne({ where: { email } })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ message: 'Invalid email or password' });
                }
                bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) {
                            return res.status(401).json({ message: 'Invalid email or password' });
                        }
                        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                        
                        // Set token as HTTP-only cookie
                        res.cookie('token', token, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production', // Use secure in production
                            sameSite: 'strict',
                            maxAge: 3600000 // 1 hour in milliseconds
                        });
                        
                        res.status(200).json({ 
                            message: 'Sign-in successful',
                            user : {
                                id: user.id,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                            }
                        });
                    })
                    .catch(err => {
                        console.error('Error comparing passwords:', err);
                        res.status(500).json({ message: 'Internal server error' });
                    });
            })
            .catch(err => {
                console.error('Error finding user:', err);
                res.status(500).json({ message: 'Internal server error' });
            });
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//=============================

routes.post('/signup', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        console.log(req.body);
        const existingUser = await User.findOne({where: {email}});

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPass,
        });

        if (!newUser) {
            return res.status(500).json({ message: 'Error creating user' });
        }

        res.status(200).json({ message: 'Sign-up successful', newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' , error: error.message });
        
    }
});

routes.get('/dashboard', authenticate, (req, res) => {
    res.status(200).send({
        content: 'Welcome to the dashboard! This is a protected route.'
    });
});

// Get current user info (for checking auth status)
routes.get('/me', authenticate, async (req, res) => {
    try {
        const user = await User.findByPk(req.user, {
            attributes: ['id', 'firstName', 'lastName', 'email'] // Don't return password
        });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ 
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout route to clear the cookie
routes.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = routes