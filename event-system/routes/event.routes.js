const express = require('express');
const {
    createEvent, getEvents, updateEvent, deleteEvent
} = require('../controllers/event.controller');

const auth = require('../middleware/auth.middleware');
const allowRoles = require('../middleware/role.middleware');

const router = express.Router();

router.use(auth);

router.post('/', allowRoles('admin', 'user'), createEvent);
router.get('/', allowRoles('admin', 'user'), getEvents);
router.patch('/:id', allowRoles('admin', 'user'), updateEvent);
router.delete('/:id', allowRoles('admin', 'user'), deleteEvent);

module.exports = router;
