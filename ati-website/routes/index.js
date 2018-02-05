var express = require('express'),
	cookieParser = require('cookie-parser'),
	session = require('express-session');
var router = express.Router();


router.use(cookieParser());

//download option 1
router.use('/dl0', function(req, res){
  res.download('public/files/skala.pdf');
});
//download option 2
router.use('/dl1', function(req, res){
  res.download('public/files/skala.docx');
});
//download option 3
router.use('/dl2', function(req, res){
  res.download('public/files/skala.txt');
});
//download option 4
router.use('/dl3', function(req, res){
  res.download('public/files/limesurvey_en.lsq');
});
//download option 4
router.use('/dl4', function(req, res){
  res.download('public/files/limesurvey_de.lsq');
});
//download english import template
router.use('/dlXLSen', function(req, res){
  res.download('public/files/import_template_ati.xls');
});
//download german import template
router.use('/dlXLSde', function(req, res){
  res.download('public/files/import_vorlage_ati.xls');
});
router.use('/dlPoster', function(req, res){
  res.download('public/files/Attig_Wessel_Franke_2017_Assessing Personality Differences in HCI-1.pdf');
});

// //toogle the language
// router.use('/toggle', function (req, res) {
// 	if (req.cookies.locale == 'en') {
// 		res.cookie('locale', 'de');
// 	} else {
// 		res.cookie('locale', 'en');
// 	}
// 	res.redirect('/');
// 	//res.render('index', { title: 'ATI' });
// });

router.get('/about', function(req, res, next){
	res.render('about', { title: 'ATI' });
});

router.get('/logout', function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
		res.clearCookie('user_sid');
  }
	res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ATI' });
});

module.exports = router;
