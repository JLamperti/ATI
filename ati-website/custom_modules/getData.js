"use strict";

var dba;

exports.setDba = function(newDba) {
	dba=newDba;
};

exports.selectAll = function(req, res) {
	dba.selectAll(req, res);
};