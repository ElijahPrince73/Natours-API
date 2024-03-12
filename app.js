const express  = require('express');
const morgan = require('morgan');

const toursRouter = require('./routes/toursRoutes')
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1/tours', toursRouter)
app.use('/api/v1/users', userRouter)

module.exports = app;