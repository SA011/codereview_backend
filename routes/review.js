const { Router } = require('express');
const reviewController = require('../controller/review.js');
const router = Router();

router.get('/:lang', reviewController.getDataByLang);

// router.get('/:id', reviewController.getDataByID);

router.post('/', reviewController.addReviewComment);

module.exports = router;