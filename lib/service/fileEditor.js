const fs = require("fs");
const path = require("path");
const beautify = require('js-beautify').js;
const utils = require("../utils");

const beautifyConfig = { indent_size: 4, space_in_empty_paren: true };

function readFileAsToken(fileName, cb) {
    const filePath = path.join(__dirname, fileName);
    fs.readFile(filePath, {encoding: 'utf-8'}, function (err, fileData) {
        if(err) {
            console.log(err, '\nError while reading file');
            return cb(err);
        } else {
            return cb(null, fileData.split('\n'));
        }
    });
}

function writeFileData(fileName, fileData) {
    fileData = beautify(fileData, beautifyConfig);
    const filePath = path.join(__dirname, fileName);
    fs.writeFile(filePath, fileData, function(err) {
        if(err) {
            console.log('error in saving file');
        }
    });
}

function ReadLine(lineNum, cb) {
    readFileAsToken(utils.actionFile.getFileName(), function (err, fileDataArr) {
        if(err) {
            console.log('unable to read line');
            cb(err);
        } else {
            cb(null, fileDataArr[lineNum-1]);
        }
    });
}


function ReplaceLine(fileName, lineNum, textToReplace) {
    readFileAsToken(fileName, function (err, fileDataArr) {
        if(err) {
            return console.log('not replacing line');
        } else {
            fileDataArr[lineNum-1] = textToReplace;
            writeFileData(fileName, fileDataArr.join('\n'));
        }
    });
}

function AddLine(fileName, lineNum, textToAdd) {
    readFileAsToken(fileName, function (err, fileDataArr) {
        if(err) {
            return console.log('not adding line');
        } else {
            fileDataArr.splice(lineNum-1, 0, textToAdd);
            writeFileData(fileName, fileDataArr.join('\n'));
        }
    });
}

module.exports = {
    ReadLine,
    ReplaceLine,
    AddLine
}

//Testing Grounds

//AddLine('test.js', 1, 'for(i=0;i<20;i++){\nabcd;\n}');
//ReplaceLine('test.js', 2, 'console.log("hello: " + i);');
//AddLine('test.js', 1, 'if(true)\n\n');