require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');
const { redisClient } = require('./utils/redisClient');
require('./utils/cronJob');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, async () => {
            await redisClient.connect();
            console.log('Redis connected');
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.log('DB error:', err));
