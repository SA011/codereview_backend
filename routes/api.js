const { Router } = require('express');
const router = Router();

router.use('/review', require('./review.js'));

module.exports = router;