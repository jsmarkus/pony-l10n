#!/usr/bin/env node
var optimist = require('optimist');
var fs = require('fs');
var pony = require('../lib/pony-trans');
var stm = require('../lib/stm');


var argv = optimist.argv;

var command = argv._[0];
if ('stm' === command) {
	commandStm.apply(null, argv._.slice(1));
} else if('translate' === command) {
	commandTranslate.apply(null, argv._.slice(1));
} else if('stat' === command) {
	commandStat.apply(null, argv._.slice(1));
}

function commandStat(sourceFile, stmFile) {
	var sourceStr = fs.readFileSync(sourceFile, 'utf8');
	var stmStr = fs.readFileSync(stmFile, 'utf8');
	var memo = stm.parseStr(stmStr);
	var terms = pony.split(sourceStr);
	var translatedList = pony.translateList(memo, terms);
	var translated = translatedList.reduce(function (translated, item) {
		if(!item.isNew) {
			return translated + 1;
		}
		return translated;
	}, 0);
	var total = translatedList.length;
	var percent = (translated / total * 100) | 0;
	console.log(sourceFile + ': ' + translated + '/' + total + ' (' + percent + '%)');
}

function commandStm(sourceFile, stmFile) {
	var sourceStr = fs.readFileSync(sourceFile, 'utf8');
	var memo = [];
	if(fs.existsSync(stmFile)) {
		var stmStr = fs.readFileSync(stmFile, 'utf8');
		memo = stm.parseStr(stmStr);
	}
	var terms = pony.split(sourceStr);
	var translatedList = pony.translateList(memo, terms);
	var translatedStm = stm.stringifyTranslatedList(translatedList);
	fs.writeFileSync(stmFile, translatedStm, 'utf8');
}

function commandTranslate(sourceFile, stmFile, translatedFile) {
	var sourceStr = fs.readFileSync(sourceFile, 'utf8');
	var stmStr = fs.readFileSync(stmFile, 'utf8');
	var memo = stm.parseStr(stmStr);
	var terms = pony.split(sourceStr);
	var translatedList = pony.translateList(memo, terms);
	var translatedStr = pony.translatedListToText(translatedList);
	fs.writeFileSync(translatedFile, translatedStr, 'utf8');
}