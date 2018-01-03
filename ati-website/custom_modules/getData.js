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