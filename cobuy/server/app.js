// app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const notificationRoutes = require('./routes/notification');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', userRoutes);
app.use('/api', indexRoutes);
app.use('/api', notificationRoutes);

module.exports = app;
