var express = require('express');
var router = express.Router();
var controller = require('../controllers/singleController');

router.get('/statTotalRevisionOfArticle/:article', controller.statTotalRevisionOfArticle);
router.get('/findTop5RegUsersRevisedArticle/:article', controller.findTop5RegUsersRevisedArticle);
router.get('/statRevByYearByTypeOfArticle/:article', controller.statRevByYearByTypeOfArticle);
router.get('/statRevByTypeOfArticle/:article', controller.statRevByTypeOfArticle);
router.get('/statRevByYearByUserOfArticle/:user/:article', controller.statRevByYearByUserOfArticle);

module.exports = router;
