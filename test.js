
var schedule = require("node-schedule");

//var date = new Date(2015, 4, 28, 09, 27, 0);

//var j = schedule.scheduleJob(date, function () {

//    　　　　console.log("执行任务");

//});


//
//var rule = new schedule.RecurrenceRule();
//rule.dayOfWeek = [new schedule.Range(0, 6)];
//rule.hour = 9;
//rule.minute = 47;
//
//var j = schedule.scheduleJob(rule, function () {
//    console.log('Today is recognized by Rebecca Black!');
//});



//var later = require('later');
//later.date.localTime();

//console.log("Now:"+new Date());

//var sched = later.parse.recur().every(5).second(),
//    t = later.setTimeout(function() {
//        test(5);
//    }, sched);

//function test(val) {
//   console.log(new Date());
//   console.log(val);
//}

var cpus=require('os').cpus();
console.log(cpus.length);

var cp=require('child_process');
cp.exec('node test.js',function (err,stdout,stderr) {
    console.log('finish');
})