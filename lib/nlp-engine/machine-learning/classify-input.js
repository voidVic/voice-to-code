const bjc = require('natural-brain');
const data = require('./mlData.json');
const natural = require('natural');
const path = require("path");
const _ = require('lodash');
const eventHandler = require('../../service/eventHandler');


var tokenizer = new natural.WordTokenizer();

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';
var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

let lineNumber = 1;

let blockActionClassifier = new bjc();

let trainData = () => {
    const blockActionDataLength = data.blockAction.length;
    for (let i = 0; i < blockActionDataLength; i++) {
        blockActionClassifier.addDocument(data.blockAction[i].q, data.blockAction[i].a);
    }
    blockActionClassifier.train();
}


let classifyText = function (req, res) {
    res.send('ok');
    var statement = req.body.what;

    let classification = classifyGrammer(statement);
    if(!classification) return;
    let lexData = eventHandler.lexicalTokenize(classification);
    if(lexData) {
        if(lexData.lex == 'line#') {
            lineNumber = parseInt(lexData.line);
            if(lineNumber == NaN) lineNumber = 0;
        }
    }
}

var classifyGrammer = function (text) {
    let classification = {};
    if(text == undefined || !text) return false;
    classification.lineNumber = lineNumber;
    classification.text = text;
    classification.tokenText = tokenizer.tokenize(classification.text);
    classification.taggedTokens = tagger.tag(classification.tokenText);
    classification.grammerObj = getGrammers(classification.taggedTokens.taggedWords);
    try {
    classification.event = JSON.parse(blockActionClassifier.classify(classification.text));
    }
    catch (ex) {
        classification.event = {};
        console.log("/n/n/n*******************/n");
        console.log(ex, " /n******Uncaught******/n");
    }

    return classification;

}


let getGrammers = (tokenArr) => {
    let grammarObj = {}
    for(let i in tokenArr) {
        if(!grammarObj.hasOwnProperty(tokenArr[i].tag)){
            grammarObj[tokenArr[i].tag] = [];
        }
        grammarObj[tokenArr[i].tag].push(tokenArr[i].token);
    }
    return grammarObj;
}

trainData();


module.exports = {
    classifyText
}
