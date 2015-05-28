var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var DLTSchema = new Schema({
	no: String,
	r1: Number,
	r2: Number,
	r3: Number,
	r4: Number,
	r5: Number,
	b1: Number,
	b2: Number,
	date: Date
});
var DLTModel = mongodb.mongoose.model('dlt', DLTSchema);
var DLTDAO = function () { };

DLTDAO.prototype.save = function (obj, cb) {
	var instance = new DLTModel(obj);
	instance.save(cb);
};

DLTDAO.prototype.getData = function (query, opts, callback) {
    DLTModel.find(query, '', opts, callback).sort({'date':-1});
	//
};
module.exports = new DLTDAO();
