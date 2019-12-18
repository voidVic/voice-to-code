const w2n = require('words-to-numbers').wordsToNumbers;
const codeGenerator = require('./codeGenerator');

function lexicalTokenize(classification) {
    let what = classification.event.what;
    switch(what) {
        case 'for':
            for_token(classification);
            break;
        case 'if':
            if_token(classification);
            break;
        case 'var':
            var_token(classification);
            break;
        case 'goto':
                return goto_token(classification);
        default:
            console.log('No lexical token matched');
    }
    return false;
}

function for_token(cl) {
    if(cl.event.isNew) codeGenerator.createNewFor(cl.lineNumber);
}

function if_token(cl) {
    if(cl.event.isNew) codeGenerator.createNewIf(cl.lineNumber);
}

function var_token(cl) {
    if(cl.event.isNew) {
        
    }
}

function goto_token(cl) {
    const text = cl.text;
    let textArr = text.split('line number ');
    if(text.length < 2) {
        textArr = text.split('line ');
    }
    const numberStr = textArr[2];
    return { 'lex': 'line#', 'line': w2n(numberStr) }
}


module.exports = {
    lexicalTokenize
}