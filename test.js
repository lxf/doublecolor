//
//var schedule = require("node-schedule");
//
//var date = new Date(2015, 5, 27, 22, 32, 0);
//
//var j = schedule.scheduleJob(date, function () {
//
//    　　　　console.log("执行任务");
//
//});
//



var later = require('later');
later.date.localTime();

console.log("Now:"+new Date());

var sched = later.parse.recur().every(5).second(),
    t = later.setTimeout(function() {
        test(5);
    }, sched);

function test(val) {
   console.log(new Date());
   console.log(val);
}