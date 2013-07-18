var SYMBOL_START_SOURCE = '@';
var SYMBOL_START_TRANSLATION = '#';
var SYMBOL_START_NEW = '!';

exports.parseStr = function (str)
{
	var lines = str.toString().split('\n');
	var currentSource = null;
	var currentTranslation = null;

	var list = [];

	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if(SYMBOL_START_SOURCE === line[0]) {
			if(currentSource !== null) {
				list.push([currentSource, null]);
				currentSource = null;
			}
			currentSource = line.substr(1);
		} else if(SYMBOL_START_TRANSLATION === line[0]) {
			if(currentSource == null) {
				throw new Error('E_NO_SOURCE');
			}
			currentTranslation = line.substr(1);

			list.push([currentSource, currentTranslation]);

			currentSource = null;
		} else if(SYMBOL_START_NEW === line[0]) {
			if(currentSource == null) {
				throw new Error('E_NO_SOURCE');
			}

			list.push([currentSource, null, true]);

			currentSource = null;
		}
	}

	if(currentSource) {
		list.push([currentSource, null]);
	}


	return list;

};

exports.stringifyTranslatedList = function (translatedList) {
	return translatedList.map(function (item) {
		var lines = [];
		lines.push('@' + item.source);
		if(item.translated) {
			if(Math.abs(item.distance) > 0) {
				lines.push('?' + item.value);
			} else {
				lines.push('#' + item.value);
			}
		}
		else
		{
			if(!item.found) {
				lines.push('!');
			}
		}

		return lines.join('\n');
	}).join('\n');
};