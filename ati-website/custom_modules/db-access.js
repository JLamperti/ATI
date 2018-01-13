"use strict";

var mysql = require('mysql'); //used for the communication with mysql
var fs = require('fs');
var keys = JSON.parse(fs.readFileSync("keys.json"));

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

/**
* performs one sql-statement on the database and sends the result to the client
* 
* @param string a string that contains the sql-statement
*/
let manipulateDB = function (string, req, res) {
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
exports.manipulateDB;		//export the function

/**
* checks wether or not a password is valid and then either initiates the real db-manipulation
* or tells the client that the authentication failed.
* 
* @param autStatement sql-statement, that gets the relevant password (or such)
*	NOTE: the value must be selected "as comperator" (e.g. "SELECT probandToken AS comperator 
*		FROM allesOhneDuplikate WHERE probandId=11;")
* @param autString string to compare the thing selected with
* @param manStatement the sql-statement to perform after the successfull authentication
*/
exports.manipulateDBAfterAut = function (autStatement, autString, manStatement, req, res) {
	pool.getConnection(function (err, con) {			//get a connection from the pool
		con.query(autStatement, function (err, result) {			//perform the sql.statement that returns the authentication relevant information
			if (err) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
				res.status(500).send('Something went wrong with the authentication');
				//console.log(err);
				return console.log('ERR: Bad query. (db-acces.js:manipulateDBAfterAut)');	//for more detailed err-log de-comment the line above
			}
			var string = JSON.stringify(result);		//bring the value from the database
			var json = JSON.parse(string);				//into the right format
			if (new String(json[0].comperator).valueOf() == new String(autString).valueOf()) {		//compare the value from the db and the one handed over
				manipulateDB(manStatement, req, res);		//when matching, perform the manipulation on the db
			} else {
				res.status(420).send('authentication failed.');		//when failed, tell the client
			}
		});
		con.release();					//release the connection for futher uses
	});
};

/**
* performs two sql-statements on the database and send an ok to the client.
* only selects and updates make sense with this function.
* 
* @param stringOne the sql-statement performed first
* @param stringTwo the sql-statement performed second
*/
let manipulateDBTwice = function (stringOne, stringTwo, req, res) {
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
exports.manipulateDBTwice;		//export the function

/**
* checks wether or not a password is valid and then either initiates the real db-manipulation
* or tells the client that the authentication failed.
* 
* @param autStatement sql-statement, that gets the relevant password (or such)
*	NOTE: the value must be selected "as comperator" (e.g. "SELECT probandToken AS comperator 
*		FROM allesOhneDuplikate WHERE probandId=11;")
* @param autString string to compare the thing selected with
* @param manStatementOne the first sql-statement to perform after the successfull authentication
* @param manStatementTwo the second sql-statement to perform after the successfull authentication
*/
exports.manipulateDBTwiceAfterAut = function (autStatement, autString, manStatementOne, manStatementTwo, req, res) {
	pool.getConnection(function (err, con) {			//get a connection from the pool
		con.query(autStatement, function (err, result) {			//perform the sql.statement that returns the authentication relevant information
			if (err) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
				res.status(500).send('Something went wrong with the authentication');
				//console.log(err);
				return console.log('ERR: Bad query. (db-acces.js:manipulateDBAfterAut)');	//for more detailed err-log de-comment the line above
			}
			var string = JSON.stringify(result);		//bring the value from the database
			var json = JSON.parse(string);				//into the right format
			if (new String(json[0].comperator).valueOf() == new String(autString).valueOf()) {		//compare the value from the db and the one handed over
				manipulateDBTwice(manStatementOne, manStatementTwo, req, res);		//when matching, perform the manipulations on the db
			} else {
				res.status(420).send('authentication failed.');		//when failed, tell the client
			}
		});
		con.release();					//release the connection for futher uses
	});
};







