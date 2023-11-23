const { Router } = require('express');
const reviewController = require('../controller/review.js');
const router = Router();

router.get('/:id', reviewController.getDataByID);

module.exports = router;