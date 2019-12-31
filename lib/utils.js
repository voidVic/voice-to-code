const w2n = require('words-to-numbers').wordsToNumbers;

let actionFile = {
    name: 'test.js',
    getFileName: function() {
        return this.name;
    },
    setFileName: function (name) {
        this.name = name;
    }
}

function getNumberFromGrammerObj(gObj) {
    if(Array.isArray(gObj.N)) {
        return w2n(gObj.N.join(' '));
    }
    return false;
}

function getVariableNameFromGrammerObj(gObj, tt, isDeclareVar) {
    if(isDeclareVar){
        let trigger = false,
            name = [];
        for(let i in tt) {
            if(tt[i] == 'variable') {
                trigger = true;
                continue;
            }
            if(tt[i].indexOf('equal') > -1) {
                break;
            }
            if(trigger) {
                name.push(tt[i]);
                let ind = gObj.N
            }
        }
        name = name.join('_');
        return name;
    }


    if(Array.isArray(gObj.NN)) {
        return gObj.NN[0];
    } else {
        if(Array.isArray(gObj.N)) {
            let retName = gObj.N[0];
            gObj.N.splice(0,1);
            return retName;
        } 
    }
    return false;
}

function tokenizeText(cmd, removeSC) {
    let cmdSplit = cmd.split(' ');
    for(let i in cmdSplit) {
        cmdSplit[i] = w2n(cmdSplit[i]);
    }
    cmd = cmdSplit.join(' ');
    cmd = cmd.replace(/ equal/g, '=');
    cmd = cmd.replace(/ equals/g, '=');
    cmd = cmd.replace(/equal/g, '=');
    cmd = cmd.replace(/equals/g, '=');
    cmd = cmd.replace(/ plus/g, '+');
    cmd = cmd.replace(/ minus/g, '-');
    cmd = cmd.replace(/plus/g, '+');
    cmd = cmd.replace(/minus/g, '-');
    cmd = cmd.replace(/subtract/g, '-');
    cmd = cmd.replace('multiply', '*');
    cmd = cmd.replace('divide by', '/');
    cmd = cmd.replace('divide', '/');
    cmd = cmd.replace('less than', '<');
    cmd = cmd.replace('less then', '<');
    cmd = cmd.replace('greater than', '>');
    cmd = cmd.replace('greater then', '>');
    cmd = cmd.replace('percent', '%');

    cmd += removeSC ? '' : ';';
    return cmd;
}

module.exports = {
    actionFile,
    getNumberFromGrammerObj,
    getVariableNameFromGrammerObj,
    tokenizeText
}
