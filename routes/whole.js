var express = require('express');
var router = express.Router();
var controller = require('../controllers/wholeController');

router.get('/findMostRevisedArticle', controller.findMostRevisedArticle);
router.get('/findLeastRevisedArticle', controller.findLeastRevisedArticle);
router.get('/findMostPopularArticle', controller.findMostPopularArticle);
router.get('/findLeastPopularArticle', controller.findLeastPopularArticle);
router.get('/findLongestHistoryArticle', controller.findLongestHistoryArticle);
router.get('/findLeastHistoryArticle', controller.findLeastHistoryArticle);
router.get('/statRevByYearByType', controller.statRevByYearByType);
router.get('/statRevByType', controller.statRevByType);

module.exports = router;
