const cron = require('node-cron');
const Todo = require('../models/todo.model');

cron.schedule('*/2 * * * *', async () => {
    const pending = await Todo.find({ status: 'Pending' });
    console.log(`[${new Date().toISOString()}] Pending Todos:`, pending.length);
    pending.forEach(t => console.log(`- ${t.title}`));
});
