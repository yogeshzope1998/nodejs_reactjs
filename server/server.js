const express = require('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const signInRoutes = require('./routes/signin_signup');
const productRoutes = require('./routes/product');
const db = require('./models/index');
const app = express();
app.use(cors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies to be sent with requests
}));
app.use(cookieParser()); // Add cookie parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', signInRoutes);
app.use('/products', productRoutes);
app.use('/categories', require('./routes/categories'));
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Optionally, exit the process:
    // process.exit(1);
});
db.sequelize.sync({force: false})
.then(() => {
    console.log('Database synced');
})
.catch((err) => {
    console.error('Error syncing database:', err);
});
app.get('/get-resp', (req, res) => {
    res.send('Hello World!');
});

// const server = https.createServer(options, app);
const HTTPS_PORT = 3001 // Common port for HTTPS

app.listen(HTTPS_PORT, () => {
    console.log(` HTTPSn Server is running on port ${HTTPS_PORT}`);
});