var express = require('express');
var router = express.Router();
var controller = require('../controllers/wholeController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  controller.fun1(req, res)
});

module.exports = router;
