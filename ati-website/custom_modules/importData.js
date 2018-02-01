"use strict";

var dba;		//the db-access object that actually performs sql-statements
var fs = require('fs');
var parse = require('csv-parse');
var formidable = require('formidable');
var path = require('path');

/**
* sets the dba
* called by db.js after creating a dba
* 
* @param newDba the dba of the db.js
*/
exports.setDba = function(newDba) {
	dba=newDba;
};

/**
* imports data from a .csv file
* optional parameter (in query): SID
*/
exports.importCSV = function(req, res) {
	var csvData=[];
	var form = new formidable.IncomingForm();
	//parse the incoming file
	form.parse(req, function(err, fields, files) {
		var old_path = files.file.path;
		var file_size = files.file.size,
            file_ext = files.file.name.split('.').pop(),
            index = old_path.lastIndexOf('\\') + 1,
            file_name = old_path.substr(index);
		var new_path = path.join(__dirname, '../uploads/', file_name + '.' + file_ext);
			
		//read the file	
        fs.readFile(old_path, function(err, data) {
            fs.writeFile(new_path, data, function(err) {
                fs.unlink(old_path, function(err) {
					if (err) {
						res.status(500);
						res.json({'succes':false});
					} else {
						fs.createReadStream('./uploads/' + file_name + '.' + file_ext)
							.pipe(parse({deliniter: ','}))
							.on('data', function(csvrow) {
								csvData.push(csvrow);
							})
							.on('end', function() {
								//delete file after parsing
								fs.unlink('./uploads/' + file_name + '.' + file_ext, function(err) {
									if (err) return console.log(err);
								});
								
								//work on the data
								let ati1, ati2, ati3i, ati4, ati5, ati6i, ati7, ati8i, ati9, atiscore, sex, edu, age, date = false;
								let i = 0;
								//get the order (and existence) of the attributes in the file
								while (i<csvData[0].length) {
									switch (csvData[0][i]) {
										case "ati01":
											ati1 = i;
											break;
										case "ati02":
											ati2 = i;
											break;
										case "ati03i":
											ati3i = i;
											break;
										case "ati04":
											ati4 = i;
											break;
										case "ati05":
											ati5 = i;
											break;
										case "ati06i":
											ati6i = i;
											break;
										case "ati07":
											ati7 = i;
											break;
										case "ati08i":
											ati8i = i;
											break;
										case "ati09":
											ati9 = i;
											break;
										case "ati_mean":
											atiscore = i;
											break;
										case "sex":
											sex = i;
											break;
										case "age":
											age = i;
											break;
										case "education":
											edu = i;
											break;
										case "date":
											date = i;
											break;
									}
									i++;
								}
								//add every proband from the file to a query
								let tmpString = 'INSERT INTO proband (ati1, ati2, ati3i, ati4, ati5, ati6i, ati7, ati8i, ati9, atiScore';
								if (sex) tmpString += ', sex';
								if (edu) tmpString += ', education';
								if (age) tmpString += ', age';
								if (date) tmpString += ', probandDate';
								csvData[1][atiscore] = csvData[1][atiscore].replace(/,/, '.');
								tmpString += ') VALUES (' + csvData[1][ati1] + ', ' + csvData[1][ati2] + ', ' 
									+ csvData[1][ati3i] + ', ' + csvData[1][ati4] + ', ' + csvData[1][ati5] + ', ' 
									+ csvData[1][ati6i] + ', ' + csvData[1][ati7] + ', ' + csvData[1][ati8i] + ', ' 
									+ csvData[1][ati9] + ', ' + csvData[1][atiscore];
								//check for empty sex	
								if (sex) {
									if (csvData[1][sex].valueOf() == ''.valueOf()) {
										tmpString += ', null';
									} else {
										tmpString += ', ' + csvData[1][sex];
									}
								}
								//check for empty education
								if (edu) {
									if (csvData[1][edu].valueOf() == ''.valueOf()) {
										tmpString += ', null';
									} else {
										tmpString += ', ' + csvData[1][edu];
									}
								}
								//check for empty age
								if (age) {
									if (csvData[1][age].valueOf() == ''.valueOf()) {
										tmpString += ', null';
									} else {
										tmpString += ', ' + csvData[1][age];
									}
								}
								//check for empty date
								if (date) {
									if (csvData[1][date].valueOf() == ''.valueOf()) {
										tmpString += ', null';
									} else {
										//correct wrong date format
										csvData[1][date] = csvData[1][date].replace(/\./, '-');
										csvData[1][date] = csvData[1][date].replace(/\//, '-');
										if ((csvData[1][date].match(/-/g)||[]).length==2) {
											tmpString += ', \'' + csvData[1][date] + '\'';
										} else if ((csvData[1][date].match(/-/g)||[]).length==1) {
											csvData[1][date] = csvData[1][date].replace(/-/, '-00-');
											tmpString += ', \'' + csvData[1][date] + '\'';
										} else {
											csvData[1][date] += '-00-00';
											tmpString += ', \'' + csvData[1][date] + '\'';
										}	
									}
								}
								tmpString += ')';
								i = 2;
								while (i<csvData.length) {
									csvData[i][atiscore] = csvData[i][atiscore].replace(/,/, '.');
									tmpString += ', (' + csvData[i][ati1] + ', ' + csvData[i][ati2] + ', ' 
										+ csvData[i][ati3i] + ', ' + csvData[i][ati4] + ', ' + csvData[i][ati5] + ', ' 
										+ csvData[i][ati6i] + ', ' + csvData[i][ati7] + ', ' + csvData[i][ati8i] + ', ' 
										+ csvData[i][ati9] + ', ' + csvData[i][atiscore];
									if (sex) {
										if (csvData[i][sex].valueOf() == ''.valueOf()) {
											tmpString += ', null';
										} else {
											tmpString += ', ' + csvData[i][sex];
										}
									}
									if (edu) {
										if (csvData[i][edu].valueOf() == ''.valueOf()) {
										tmpString += ', null';
										} else {
											tmpString += ', ' + csvData[i][edu];
										}
									}
									if (age) {
										if (csvData[i][age].valueOf() == ''.valueOf()) {
											tmpString += ', null';
										} else {
											tmpString += ', ' + csvData[i][age];
										}
									}
									if (date) {
										if (csvData[i][date].valueOf() == ''.valueOf()) {
											tmpString += ', null';
										} else {
											csvData[i][date] = csvData[i][date].replace(/\./, '-');
											csvData[i][date] = csvData[i][date].replace(/\//, '-');
											if ((csvData[i][date].match(/-/g)||[]).length==2) {
												tmpString += ', \'' + csvData[i][date] + '\'';
											} else if ((csvData[i][date].match(/-/g)||[]).length==1) {
												csvData[i][date] += '-00';
												tmpString += ', \'' + csvData[i][date] + '\'';
											} else {
												csvData[i][date] += '-00-00';
												tmpString += ', \'' + csvData[i][date] + '\'';
											}	
										}
									}
									tmpString += ')';
									i++;
								}
								tmpString += ';';
								//if an SID is stated, insert all the probands into the survey
								if (req.query.SID) {
									let stringTwo = 'INSERT INTO partOf (PID, SID) VALUES (LAST_INSERT_ID(), ' + req.query.SID + ')';
									let j = 1;
									while (j<csvData.length-1) {
										stringTwo += ', (LAST_INSERT_ID()+' + j + ', ' + req.query.SID + ')';
										j++;
									}
									stringTwo += ';';
									dba.manipulateDBTwice(tmpString, stringTwo, req, res);
								//else just post them
								} else {
									dba.manipulateDB(tmpString, req, res);
								}
							});
					}
					
				});
			});
		});
	});
};
	








