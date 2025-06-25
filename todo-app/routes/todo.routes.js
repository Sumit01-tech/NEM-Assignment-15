const express = require('express');
const Todo = require('../models/todo.model');
const auth = require('../middleware/auth.middleware');
const { redisClient } = require('../utils/redisClient');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
    const todo = await Todo.create({ ...req.body, userId: req.userId });
    await redisClient.del(`todos:${req.userId}`);
    res.send(todo);
});

router.get('/', async (req, res) => {
    const cacheKey = `todos:${req.userId}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return res.send(JSON.parse(cached));

    const todos = await Todo.find({ userId: req.userId });
    await redisClient.setEx(cacheKey, 180, JSON.stringify(todos)); // 3 min
    res.send(todos);
});

router.patch('/:id', async (req, res) => {
    const todo = await Todo.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        { new: true }
    );
    await redisClient.del(`todos:${req.userId}`);
    res.send(todo);
});

router.delete('/:id', async (req, res) => {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    await redisClient.del(`todos:${req.userId}`);
    res.send({ msg: 'Deleted' });
});

module.exports = router;
