var mongoose = require('mongoose');
var config = require('../config/config');
mongoose.connect(config.db, function (err) {
    if (err) {
        console.error('db connect failed');
        process.exit(1);
    }
});

exports.mongoose = mongoose;
