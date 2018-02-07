var express = require('express');
var router = express.Router();
var dba = require('../custom_modules/db-access');
var gData = require('../custom_modules/getData');
var pData = require('../custom_modules/postData');
var uData = require('../custom_modules/updateData');
var dData = require('../custom_modules/deleteData');
var iData = require('../custom_modules/importData');
var eData = require('../custom_modules/exportData');
gData.setDba(dba);
pData.setDba(dba);
uData.setDba(dba);
dData.setDba(dba);
iData.setDba(dba);
eData.setDba(dba);


/*
* For info on what the routes do see the functions
*/


//get-requests

router.get('/ageAndAti', function(req, res) {
	gData.selectAgeAndAti(req, res);
});

/*
router.get('/all', function(req, res) {
	//fliegt raus
	gData.selectAll(req, res);
});*/

router.get('/avg', function(req, res) {
	gData.selectAvg(req, res);
});

router.get('/buckets', function(req, res) {
	gData.selectBuckets(req, res);
});

/*
router.get('/complex', function(req, res) {
	//fliegt raus
	gData.selectComplex(req, res);
});*/

router.get('/countProbandInSurvey', function(req, res) {
	gData.selectCountProbandInSurvey(req, res);
});

router.get('/sexAndAti', function(req, res) {
	gData.selectSexAndAti(req, res);
});

router.get('/exportCSV', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.query.SID + ';', function(err, result) {
					if (err || result == undefined) {
						res.status(500).send('Something went wrong');
						return console.log('db.js:exportCSV ' + err.toString());
					}
					let string = JSON.stringify(result);
					let json =  JSON.parse(string);
					if (json[0].b) {
						eData.exportCSV(req, res);
					} else {
						res.status(403).send('Not permitted for you.');
					}
				});
			} else {
				res.status(404).send('Survey not found');
			}
		});
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

router.get('/links', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				if (req.session.user && req.cookies.user_sid) {
					dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.query.SID + ';', function(err, result) {
						if (err || result == undefined) {
							res.status(500).send('Something went wrong');
							return console.log('db.js:get links ' + err.toString());
						}
						let string = JSON.stringify(result);
						let json =  JSON.parse(string);
						if (json[0].b) {
							gData.selectLinks(req, res);
						} else {
							res.status(403).send('Not permitted for you.');
						}
					});
				} else {
					res.status(401).send('You need to be logged in to do this.');
				}
			} else {
				res.status(404).send('Survey not found.');
			}
		});
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

router.get('/educationAndAti', function(req, res) {
	gData.selectEducationAndAti(req, res);
});

router.get('/survey', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				if (req.session.user && req.cookies.user_sid) {
					dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.query.SID + ';', function(err, result) {
						if (err || result == undefined) {
							res.status(500).send('Something went wrong');
							return console.log('db.js:get survey ' + err.toString());
						}
						let string = JSON.stringify(result);
						let json =  JSON.parse(string);
						if (json[0].b) {
							gData.selectSurvey(req, res);
						} else {
							res.status(403).send('Not permitted for you.');
						}
					});
				} else {
					res.status(401).send('You need to be logged in to do this.');
				}
			} else {
				res.status(404).send('Survey not found.');
			}
		});
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

router.get('/surveyAndLinkByUrl', function(req, res) {
	gData.selectSurveyAndLinkByUrl(req, res);
});

router.get('/surveyByUser', function(req, res) {
	gData.selectSurveyByUser(req, res);
});

router.get('/std', function(req, res) {
	gData.selectStd(req, res);
});

router.get('/user', function(req, res) {
	gData.selectUser(req, res);
});


//post-requests

router.post('/importCSV', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				if (req.session.user && req.cookies.user_sid) {
					dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.body.SID + ';', function(err, result) {
						if (err || result == undefined) {
							res.status(500).send('Something went wrong');
							return console.log('db.js:importCSV ' + err.toString());
						}
						let string = JSON.stringify(result);
						let json =  JSON.parse(string);
						if (json[0].b) {
							iData.importCSV(req, res);
						} else {
							res.status(403).send('Not permitted for you.');
						}
					});
				} else {
					res.status(401).send('You need to be logged in to do this.');
				}
			} else {
				res.status(404).send('Survey not found.');
			}
		});
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

router.post('/link', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				if (req.session.user && req.cookies.user_sid) {
					dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.body.SID + ';', function(err, result) {
						if (err || result == undefined) {
							res.status(500).send('Something went wrong');
							return console.log('db.js:post link ' + err.toString());
						}
						let string = JSON.stringify(result);
						let json =  JSON.parse(string);
						if (json[0].b) {
							pData.insertLink(req, res);
						} else {
							res.status(403).send('Not permitted for you.');
						}
					});
				} else {
					res.status(401).send('You need to be logged in to do this.');
				}
			} else {
				res.status(404).send('Survey not found.');
			}
		});
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

router.post('/proband', function(req, res) {
	pData.insertProband(req, res);
});

router.post('/probandLink', function(req, res) {
	pData.insertProbandLink(req, res);
});

/*
router.post('/probandUser', function(req, res) {
	//fliegt raus
	pData.insertProbandUser(req, res);
});*/

router.post('/survey', function(req, res) {
	pData.insertSurvey(req, res);
});

router.post('/user', function(req, res) {
	pData.insertUser(req, res);
});


//update-requests

router.put('/survey', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				if (req.session.user && req.cookies.user_sid) {
					dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.body.SID + ';', function(err, result) {
						if (err || result == undefined) {
							res.status(500).send('Something went wrong');
							return console.log('db.js:update survey ' + err.toString());
						}
						let string = JSON.stringify(result);
						let json =  JSON.parse(string);
						if (json[0].b) {
							uData.updateSurvey(req, res);
						} else {
							res.status(403).send('Not permitted for you.');
						}
					});
				} else {
					res.status(401).send('You need to be logged in to do this.');
				}
			} else {
				res.status(404).send('Survey not found.');
			}
		});
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

router.put('/user', function(req, res) {
	uData.updateUser(req, res);
});


//delete-requests

router.delete('/survey', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				if (req.session.user && req.cookies.user_sid) {
					dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.body.SID + ';', function(err, result) {
						if (err || result == undefined) {
							res.status(500).send('Something went wrong');
							return console.log('db.js:delete survey ' + err.toString());
						}
						let string = JSON.stringify(result);
						let json =  JSON.parse(string);
						if (json[0].b) {
							dData.deleteSurvey(req, res);
						} else {
							res.status(403).send('Not permitted for you.');
						}
					});
				} else {
					res.status(401).send('You need to be logged in to do this.');
				}
			} else {
				res.status(404).send('Survey not found.');
			}
		});
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

router.delete('/user', function(req, res) {
	dData.deleteUser(req, res);
});

router.delete('/link', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
		dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
			if (err) {
				res.status(404).send('Survey not found.');
				return console.log('Survey not found');
			}
			if (JSON.parse(JSON.stringify(result))[0].b==1) {
				if (req.session.user && req.cookies.user_sid) {
					dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID IN \
						(SELECT SID FROM Link WHERE url=\'' + req.body.url + '\');', function(err, result) {
						if (err || result == undefined) {
							res.status(500).send('Something went wrong');
							return console.log('db.js:delete link ' + err.toString());
						}
						let string = JSON.stringify(result);
						let json =  JSON.parse(string);
						if (json[0].b) {
							dData.deleteLink(req, res);
						} else {
							res.status(403).send('Not permitted for you.');
						}
					});
				} else {
					res.status(401).send('You need to be logged in to do this.');
				}
			} else {
				res.status(404).send('Survey not found.');
			}
		})
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
});

module.exports = router;