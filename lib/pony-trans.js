var pony = {};

pony.split = function(text) {
    return text.split('\n');
};

pony.translateList = function(translation, termsList) {
    var cur = 0,
        output = [],
        term,
        termTranslation,
        i;

    for (i = 0; i < termsList.length; i++) {
        term = termsList[i];
        termTranslation = pony.translate(translation, term, cur);
        output.push(termTranslation);
        if (termTranslation) {
            cur = termTranslation.index + 1;
        }
        if (cur >= translation.length) {
            cur = translation.length - 1;
        }
    }

    return output;
};

pony.translate = function (translation, term, startIndex) {
    var distance = 0;
    var tr = translation;
    var cur;
    var minusCur;
    while (1) {
        cur = startIndex + distance;
        minusCur = startIndex - distance;
        if ((cur < 0 || cur >= tr.length) &&
            (minusCur < 0 || minusCur >= tr.length)) {
            // console.log(cur);
            return {
                value: term,
                source: term,
                index: cur,
                distance: distance,
                translated: false,
                found: false,
                isNew: false
            };
        }

        var termTranslation = translation[cur];
        if (termTranslation !== undefined) {
            if (pony.match(term, termTranslation)) {

                var translatedValue = termTranslation[1];
                var translated = true;

                var isNew = termTranslation[2] || false;
                if (!translatedValue) {
                    translatedValue = term;
                    translated = false;
                }

                return {
                    value: translatedValue,
                    source: term,
                    index: cur,
                    distance: distance,
                    translated: translated,
                    found: true,
                    isNew: isNew
                };
            }
        }


        if (distance > 0) {
            distance = -distance;
        } else {
            distance = -distance + 1;
        }
    }
};

pony.translatedListToText = function (list) {
    return list.map(function(item) {
        return item.value;
    }).join('\n');
};

pony.match = function (term, termTranslation) {
    var match = termTranslation[0] === term;
    return match;
};


module.exports = pony;