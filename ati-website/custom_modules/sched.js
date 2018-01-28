"use strict";

var schedule = require('node-schedule');
var dba = require('../custom_modules/db-access');


/**
* performs some actions every day at 0:01 am
* the actions are: delete expired (pw-/bestaetigungs-)links, close expired surveys, open survey thats start date is hit,
* 	close surveys with maxProbands hit, delet links with no uses left
*/
var sched = schedule.scheduleJob('1 0 * * *', function() {
	let d = new Date().getFullYear() + '-' + new Date().getMonth()+1 + '-' + new Date().getDate();
	dba.performQuery('DELETE FROM link WHERE ExpirationDate <= \'' + d + '\';', function (err, result) {
		if (err || result == undefined) {
			return console.log('Err: Bad query. (app.js:sched)');
		}
	});
	dba.performQuery('DELETE FROM link WHERE UsesLeft=0;', function (err, result) {
		if (err || result == undefined) {
			return console.log('Err: Bad query. (app.js:sched)');
		}
	});
	dba.performQuery('UPDATE Survey SET surveyStatus = \'closed\' WHERE (SELECT COUNT(PID) >= MaxProbands FROM partOf WHERE SID = SurveyID);', function (err, result) {
		if (err || result == undefined) {
			return console.log('Err: Bad query. (app.js:sched)');
		}
	});
	dba.performQuery('UPDATE Survey SET surveyStatus = \'closed\' WHERE surveyEnd = \'' + d + '\';', function (err, result) {
		if (err || result == undefined) {
			return console.log('Err: Bad query. (app.js:sched)');
		}
	});
	dba.performQuery('UPDATE Survey SET surveyStatus = \'open\' WHERE surveyBegin = \'' + d + '\';', function (err, result) {
		if (err || result == undefined) {
			return console.log('Err: Bad query. (app.js:sched)');
		}
	});
	dba.performQuery('DELETE FROM bestaetigungslinks WHERE ExpirationDate <= \'' + d + '\';', function (err, result) {
		if (err || result == undefined) {
			return console.log('Err: Bad query. (app.js:sched)');
		}
	});
	dba.performQuery('DELETE FROM pwlinks WHERE ExpirtionDate <= \'' + d + '\';', function (err, result) {
		if (err || result == undefined) {
			return console.log('Err: Bad query. (app.js:sched)');
		}
	});
});