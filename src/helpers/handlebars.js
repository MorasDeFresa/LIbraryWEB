const hbs = require("express-handlebars");

module.exports = {
  ifEquals: function (arg1, arg2, options) {
    return arg1 === arg2 ? options.fn(this) : options.inverse(this);
  },
};
