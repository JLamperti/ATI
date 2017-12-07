var express = require('express');
var router = express.Router();

/*
router.get('/dl', function(req, res){
  res.send(./public/files/skala.pdf);
});*/
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ATI' });
});

module.exports = router;
