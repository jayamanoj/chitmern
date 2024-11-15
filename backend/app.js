const express = require('express');
const app = express();
const cors = require('cors');
const errorMiddlewares = require('./middlewares/error');
const products = require('./routes/product');
const cookieParser =require('cookie-parser')

const auth =require('./routes/auth')
const Bill =require('./routes/bill');
const customer =require('./routes/customer')
const chit =require('./routes/chit');
const ChitMaster = require('./routes/chitMaster');
const vouchar = require('./routes/vouchar');

// Middleware to parse incoming JSON requests
app.use(express.json());

app.use(cookieParser())
// Enable CORS
app.use(cors());

// Mounting product routes under '/api/v1'
app.use('/api/v1', products);

app.use('/api/v1', auth);
app.use('/api/v1', Bill);
app.use('/api/v1', customer);
app.use('/api/v1', chit);
app.use('/api/v1', vouchar);
// Register the chitMaster route
app.use('/api/v1', ChitMaster); // Ensure this line is correct

// Error handling middleware
app.use(errorMiddlewares);

module.exports = app;
