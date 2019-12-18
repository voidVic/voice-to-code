let actionFile = {
    name: 'test.js',
    getFileName: function() {
        return this.name;
    },
    setFileName: function (name) {
        this.name = name;
    }
}

module.exports = {
    actionFile
}
