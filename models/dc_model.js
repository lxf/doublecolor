var mongodb=require('./mongodb');
var Schema=mongodb.mongoose.Schema;
var DCSchema=new Schema({
	no:String,
	r1:Number,
	r2:Number,
	r3:Number,
	r4:Number,
	r5:Number,
	r6:Number,
	b1:Number,
	date:Date
});
var DCModel = mongodb.mongoose.model('dc', DCSchema);
var DCDAO = function () { };

DCDAO.prototype.save=function (obj,cb) {
	var instance=new DCModel(obj);
	instance.save(cb);
};

DCDAO.prototype.getData= function (query, opts, callback) {
    DCModel.find(query, '', opts, callback).sort({'no':-1});
};


module.exports = new DCDAO();
