const w2n = require('words-to-numbers').wordsToNumbers;
const codeGenerator = require('./codeGenerator');
const utils = require('../utils');

function lexicalTokenize(classification) {
    let what = classification.event.what;
    switch (what) {
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
        case 'remLine':
            removeLine_token(classification.lineNumber);
            break;
        case 'uncategorized':
            uncategorized_token(classification);
            break;
        case 'print': {
            print_token(classification);
            break;
        }
        default:
            console.log('No lexical token matched');
    }
    return false;
}

function for_token(cl) {
    if (cl.event.isNew) codeGenerator.createNewFor(cl.lineNumber);
    else {
        let pick = (cl.grammerObj.NNP && cl.grammerObj.NNP[0]) ||
                    (cl.grammerObj.DT && cl.grammerObj.DT[0]) ||
                    (cl.grammerObj.NN && cl.grammerObj.NN[0])
        switch (pick) {
            case 'A':
            case 'a':
                cl.text = cl.text.toLowerCase().split('part a')[1];
                codeGenerator.replaceFor(cl, 0);
                break;
            case 'B':
            case'b':
                cl.text = cl.text.toLowerCase().split('part b')[1];
                codeGenerator.replaceFor(cl, 1);
                break;
            case 'C':
            case 'c':
                let spltArr = cl.text.toLowerCase().split('pt c');
                if(spltArr.length<=1) {
                    spltArr = cl.text.toLowerCase().split('part c');
                    if(spltArr.length<=1) {
                        spltArr = cl.text.toLowerCase().split(' c ');
                    }
                }
                cl.text = spltArr[1];
                codeGenerator.replaceFor(cl, 2);
                break;
        }
    }
}

function if_token(cl) {
    if (cl.event.isNew) codeGenerator.createNewIf(cl.lineNumber);
    else {
        let txtArr = cl.text.split('condition');
        let conditionStr;
        if(txtArr.length > 1) {
            conditionStr = txtArr[1];
        }
        codeGenerator.editIf(cl.lineNumber, conditionStr);
    }
}

function var_token(cl) {
    if (cl.event.isNew) {
        const varName = utils.getVariableNameFromGrammerObj(cl.grammerObj, cl.tokenText, true);
        let equalTo = '';
        if (cl.grammerObj.JJ.indexOf('equal') > -1 || cl.grammerObj.JJ.indexOf('equals') > -1) {
            equalTo = utils.getNumberFromGrammerObj(cl.grammerObj);
            codeGenerator.createNewVar(cl.lineNumber, varName.toLowerCase(), equalTo);
        } else {
            codeGenerator.createNewVar(cl.lineNumber, varName.toLowerCase());
        }
    }
}

function goto_token(cl) {
    return {
        'lex': 'line#',
        'line': utils.getNumberFromGrammerObj(cl.grammerObj)
    };
}

function removeLine_token(ln) {
    codeGenerator.removeLine(ln);
}

function print_token(cl) {
    let toPrint = cl.text.split('print')[1];
    if(!toPrint) return;
    codeGenerator.print(cl.lineNumber, toPrint);
}

function uncategorized_token(cl) {
    let cmd = utils.tokenizeText(cl.text.toLowerCase());

    codeGenerator.addStatement(cl.lineNumber, cmd);
}



module.exports = {
    lexicalTokenize
}