module.exports = {

    toList: function toList() {
        let values = Array.isArray(arguments[0]) ? arguments[0] : arguments;
        return values.filter(this.notEmpty).join(', ');
    },

    notEmpty: function notEmpty(v) {
        return v !== '';
    },

    strChunk: function strChunk(str, n, max) {
        let chunk = str.split(' ')[n];
        return max ? chunk.substring(0, max) : chunk;
    },

    capitalFirstLetter: function capitalFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

};
