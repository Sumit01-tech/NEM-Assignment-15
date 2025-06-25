const Event = require('../models/event.model');
const { redisClient } = require('../utils/redisClient');

exports.createEvent = async (req, res) => {
    const event = await Event.create({ ...req.body, createdBy: req.userId });
    await redisClient.del('events');
    res.send(event);
};

exports.getEvents = async (req, res) => {
    const cached = await redisClient.get('events');
    if (cached) return res.send(JSON.parse(cached));

    const events = req.role === 'admin'
        ? await Event.find()
        : await Event.find({ createdBy: req.userId });

    await redisClient.setEx('events', 180, JSON.stringify(events));
    res.send(events);
};

exports.updateEvent = async (req, res) => {
    const filter = req.role === 'admin' ? { _id: req.params.id } : { _id: req.params.id, createdBy: req.userId };
    const updated = await Event.findOneAndUpdate(filter, req.body, { new: true });
    await redisClient.del('events');
    res.send(updated);
};

exports.deleteEvent = async (req, res) => {
    const event = await Event.findOne({
        _id: req.params.id,
        ...(req.role === 'user' && { createdBy: req.userId })
    });

    if (!event) return res.status(404).send('Event not found');

    const timeLeft = new Date(event.eventDate) - new Date();
    if (timeLeft <= 24 * 60 * 60 * 1000) {
        await redisClient.hSet('deletedEvents', event._id.toString(), JSON.stringify(event));
        return res.send({ msg: 'Soft deleted to Redis' });
    }

    await Event.deleteOne({ _id: event._id });
    await redisClient.del('events');
    res.send({ msg: 'Deleted from DB' });
};
