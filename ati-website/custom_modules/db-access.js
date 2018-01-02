"use strict";

var mysql = require('mysql');
var path	= require('path');
var fs	= require('fs');

//chose the db to connect to
var con = mysql.createConnection({
	host: "localhost",
	user: "ich",
	password: "meinpw"
});
//connect to the db
con.connect(function(err) {
	if (err) throw err;
	console.log("Database Connected!");
});

//allow other moduls to make this connect to the db
exports.connectDB = function() {
	con.query("USE AtiDB;", function (err, result) {
		if (err) throw err;
		console.log("AtiDB wird genutzt.");
	});
};

//more or less a testing function, that selects all proband once
exports.selectAll = function (req, res) {	
	con.query("\
		(SELECT p.ProbandID, p.Age, p.ProbandToken, p.AtiScore\
		FROM (\
			SELECT ProbandToken, MAX(ProbandID) AS maxID\
			FROM Proband GROUP BY ProbandToken\
		) AS x INNER JOIN Proband AS p ON p.ProbandToken = x.ProbandToken AND p.ProbandID = x.maxID \
		WHERE p.ProbandToken IS NOT NULL\
		)\
		UNION (\
			SELECT ProbandID, Age, ProbandToken, AtiScore \
			FROM Proband p\
			WHERE ProbandToken IS NULL)\
		", function (err, result) {
				if (err) throw err;
				var string = JSON.stringify(result);
				let json =  JSON.parse(string);
				res.send(json);
		});
};


