const fileEditor = require('./fileEditor');
const utils = require('../utils');


function createNewFor(lineNumber) {
    const forLoopStr = 'for(index=0;i<someLength;i++){\n\n}'
    fileEditor.AddLine(utils.actionFile.getFileName(), lineNumber, forLoopStr);
}

function createNewIf(lineNumber) {
    const ifStatementStr = 'if(true){\n//perform some action\n}else{\n//perform some other action \n}'
    fileEditor.AddLine(utils.actionFile.getFileName(), lineNumber, ifStatementStr);
}

function createNewVar(lineNumber, varName, assign) {
    const assignment = assign ? ' = ' + assign + ';' : ' ;';
    const varDeclareStr = 'let ' + varName + assignment;
    fileEditor.AddLine(utils.actionFile.getFileName(), lineNumber, varDeclareStr);
}

function addStatement(lineNumber, statement) {
    fileEditor.AddLine(utils.actionFile.getFileName(), lineNumber, statement);
}

function removeLine(lineNumber) {
    fileEditor.ReplaceLine(utils.actionFile.getFileName(), lineNumber, null);
}

function replaceFor (cl,  index) {
    fileEditor.ReadLine(cl.lineNumber, (err, lineStr) => {
        if(err || !lineStr || lineStr.indexOf('for') == -1) return;
        let arrL1 = lineStr.split('(');
        let arrL2 = arrL1[1].split(')');
        let arrL3 = arrL2[0].split(';');
        arrL3[index] = utils.tokenizeText(cl.text, true);
        lineStr = 'for('+ arrL3.join(';') + '){';

        fileEditor.ReplaceLine(utils.actionFile.getFileName(), cl.lineNumber, lineStr);
    });
}

function editIf (lineNumber, conditionStr) {
    fileEditor.ReadLine(lineNumber, (err, lineStr) => {
        if(err || !lineStr || lineStr.indexOf('if') == -1) return;
        let condition = utils.tokenizeText(conditionStr, true);
        lineStr = 'if('+ condition + '){';

        fileEditor.ReplaceLine(utils.actionFile.getFileName(), lineNumber, lineStr);
    });
}

function print(lineNumber, statement) {
    statement = 'console.log(' + utils.tokenizeText(statement, true) + ');';
    fileEditor.AddLine(utils.actionFile.getFileName(), lineNumber, statement);
}

module.exports = {
    createNewFor,
    createNewIf,
    createNewVar,
    addStatement,
    removeLine,
    replaceFor,
    editIf,
    print
}
