module.exports = {

    toList: function toList() {
        var values = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        return values.filter(this.notEmpty).join(', ');
    },

    notEmpty: function notEmpty(v) {
        return v !== '';
    },

    strSplit: function strSplit(str, n) {
        return str.split(' ')[n];
    }

};
