var express = require('express'),
	cookieParser = require('cookie-parser');
var router = express.Router();


router.use(cookieParser());

//download the scale
router.use('/dl', function(req, res){
  res.download('public/files/skala.pdf');
});

// //toogle the language
router.use('/toggle', function (req, res) {
	console.log('triggered');
 	if (req.cookies.locale == 'en') {
 		res.cookie('locale', 'de');
 	} else {
 		res.cookie('locale', 'en');
 	}
	res.send('test');
//	res.render('index', { title: 'ATI' });
// 	res.redirect('/');
// 	//res.render('index', { title: 'ATI' });
 });

router.get('/about', function(req, res, next){
	res.render('about', { title: 'ATI' });
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ATI' });
});

module.exports = router;
