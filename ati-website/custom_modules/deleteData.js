"use strict";

var dba;		//the db-acces object that actually performs sql-statements

/**
* sets the dba
* called by db.js after creating a dba
* 
* @param newDba the dba of the db.js
*/
exports.setDba = function(newDba) {
	dba=newDba;
};

exports.deleteUser = function (req, res) {
	dba.manipulateDB('DELETE FROM user WHERE UserID = ' + req.body.UID + ';', req, res);
};










