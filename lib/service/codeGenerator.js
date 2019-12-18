const fileEditor = require('./fileEditor');
const utils = require('../utils');


function createNewFor(lineNumber) {
    const forLoopStr = 'for(index=0;i<someLength;i++){\n\n}'
    fileEditor.AddLine(utils.actionFile.getFileName(), lineNumber, forLoopStr);
}

function createNewIf(lineNumber) {
    const ifStatementStr = 'if(true){\n}else{\n}'
    fileEditor.AddLine(utils.actionFile.getFileName(), lineNumber, ifStatementStr);
}

module.exports = {
    createNewFor,
    createNewIf
}
