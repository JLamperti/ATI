"use strict";

var mysql = require('mysql'); //used for the communication with mysql
var fs = require('fs');
var keys = JSON.parse(fs.readFileSync("keys.json"));
var csv_export = require('csv-export');


/**
* creates a pool for connections, so they do not have to be
* established new every time
*/
var pool = mysql.createPool({
	connectionLimit : 100,
	host: "localhost",
	user: keys.db.username,
	password: keys.db.password,
	database : "AtiDB"
});

exports.exportDataCSV = function(string, req, res) {
	pool.getConnection(function (err, con) {			//get a connection from the pool
		con.query(string, function (err, result) {		//perform the sql-statement
			if (err) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
				res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
				//console.log(err);
				return console.log('Err: Bad query. (db-acces.js:exportDataCSV)');	//for more detailed err-log de-comment the line above
			}
			var string = JSON.stringify(result);
			let json =  JSON.parse(string);
			csv_export.export(json, function(buffer) {
				
				res.setHeader('Content-disposition', 'attachement; filename=surveyData.zip');
				res.send(buffer);
			});
		});
		con.release();			//release the connection so it can be used for another query
	});
};

/**
* performs one sql-statement on the database and sends the result to the client
* 
* @param string a string that contains the sql-statement
*/
exports.manipulateDB = function (string, req, res) {
	pool.getConnection(function (err, con) {			//get a connection from the pool
		con.query(string, function (err, result) {		//perform the sql-statement
			if (err) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
				res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
				//console.log(err);
				return console.log('Err: Bad query. (db-acces.js:manipulateDB)');	//for more detailed err-log de-comment the line above
			}
			var string = JSON.stringify(result);
			let json =  JSON.parse(string);
			res.send(json);			//send the result of the query to the client (json formatted)
		});
		con.release();			//release the connection so it can be used for another query
	});
	


};

/**
* performs two sql-statements on the database and send an ok to the client.
* only selects and updates make sense with this function.
* 
* @param stringOne the sql-statement performed first
* @param stringTwo the sql-statement performed second
*/
exports.manipulateDBTwice = function (stringOne, stringTwo, req, res) {
	pool.getConnection(function (err, con) {			//get a connection from the pool
		con.beginTransaction(function(err) {			//begin a transaction to enable rollback
			if (err) return console.log(err);
			con.query(stringOne, function (err, result) {	//perform the first sql-statement
				if (err) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
					return con.rollback(function() {	//and rollback
						res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
						//console.log(err);
						return console.log('Err: Bad query. (db-acces.js:manipulateDBTwice:One)');	//for more detailed err-log de-comment the line above
					});
				} else {		//if the first statement was succesfull,
					con.query(stringTwo, function (err, result) {		//perform the second sql-statement
						if (err) {		//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
							return con.rollback(function() {		//and rollback (including the first statement)
								res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
								//console.log(err);
								return console.log('Err: Bad query. (db-acces.js:manipulateDBTwice:Two)');	//for more detailed err-log de-comment the line above
							});
						}
						con.commit(function(err) {					//after successfully doing both queries, commit them
							if (err) {
								return con.rollback(function() {	//in case of ann error, rollback
									console.log(err);
								});
							}
						});
						res.send('OK');		//if both queries were succesfull, send an ok
					});
				}
			});
		});
		con.release();			//release the connection so it can be used for another query
	});
};


