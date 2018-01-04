"use strict";

var dba;

exports.setDba = function(newDba) {
	dba=newDba;
};

exports.selectAll = function(req, res) {
	dba.manipulateDB("SELECT * FROM allesOhneDuplikate;", req, res);
};

exports.selectBuckets = function(req, res) {
	dba.manipulateDB("SELECT * FROM bucketsOhneDuplikate", req, res);
};

exports.selectAgeAndAti = function(req, res) {
	dba.manipulateDB("SELECT Age, AtiScore FROM allesOhneDuplikate;", req, res);
};

exports.selectComplex = function(req, res) {
	let tmpString = 'SELECT *';
	let temp = req.query;
	if (temp.sel != null) {
		temp.sel[0] = temp.sel[0].replace(/\s+/g, '');
		tmpString = 'SELECT ' + temp.sel[0];
		let i = 1;
		while (i<temp.sel.length) {
			temp.sel[i] = temp.sel[i].replace(/\s+/g, '');
			tmpString = tmpString + ', ' + temp.sel[i];
			i++;
		}
	}
	if (temp.fromSurv == null) {
		tmpString = tmpString + ' FROM allesOhneDuplikate';
	} else {
		tmpString = tmpString + ' FROM Proband';
	}
	if (temp.crit != null) {
		temp.crit[0] = temp.crit[0].replace(/\s+/g, '');
		tmpString = tmpString + ' WHERE ' + temp.crit[0];
		let i = 1;
		while (i<temp.crit.length) {
		temp.crit[i] = temp.crit[i].replace(/\s+/g, '');
			tmpString = tmpString + ' AND ' + temp.crit[i];
			i++
		}
	}
	if (temp.fromSurv != null) {
		temp.fromSurv = temp.fromSurv.replace(/\s+/g, '');
		if (temp.crit == null) {
			tmpString = tmpString + ' WHERE probandId IN (\
				SELECT PID \
				FROM partOf \
				WHERE SID=' + temp.fromSurv + ')';
		} else {
			tmpString = tmpString + ' AND probandId IN (\
				SELECT PID \
				FROM partOf \
				WHERE SID=' + temp.fromSurv +')';
		}
	}
	tmpString = tmpString + ';';
	dba.manipulateDB(tmpString, req, res);
};












