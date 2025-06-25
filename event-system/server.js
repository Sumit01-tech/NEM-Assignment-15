require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');
const { redisClient } = require('./utils/redisClient');
require('./utils/cronJob');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT, async () => {
            await redisClient.connect();
            console.log(`Server running on ${process.env.PORT}`);
        });
    })
    .catch(err => console.log('Mongo Error:', err));
