const cron = require('node-cron');
const { redisClient } = require('./redisClient');

cron.schedule('*/5 * * * *', async () => {
    const deletedEvents = await redisClient.hGetAll('deletedEvents');

    for (const [id, data] of Object.entries(deletedEvents)) {
        const event = JSON.parse(data);
        if (new Date(event.eventDate) < new Date()) {
            await redisClient.hDel('deletedEvents', id);
            console.log(`Cleaned expired event: ${event.title}`);
        }
    }
});
