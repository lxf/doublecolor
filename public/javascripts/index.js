/// <reference path="../../typings/angularjs/angular.d.ts"/>
// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

var app = angular.module('dcapp', []);
app.controller('MainCtrl', function ($scope, $http, $q, DCDataFactory) {
    var deferred = $q.defer();

    $scope.showPlot = function (dctype, limitnum) {
        var promise = DCDataFactory.showLimitData(dctype, limitnum); // 同步调用，获得承诺接口  
        promise.then(
            function (data) {  // 调用承诺API获取数据 .resolve  
                $('#container').highcharts({
                    title: {
                        text: '红球与篮球走势图',
                        x: -20 //center
                    },
                    subtitle: {
                        text: 'www.upsnail.com',
                        x: -20
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    yAxis: {
                        title: {
                            text: '数值'
                        },
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]
                    },
                    tooltip: {
                        valueSuffix: ''
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        borderWidth: 0
                    },
                    series:
                    data.series

                })
            },
            function (data) {  // 处理错误 .reject  
            
            });
    }

});

app.factory('DCDataFactory', ['$http', '$q', function ($http, $q) {
    return {
        showLimitData: function (dctype, limitnum) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            if (dctype == 1) {
                //双色球
                $http.get('/ssq/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var res = {};
                        res.categories = [],
                        res.series = [];

                        var r1 = { name: '红球1', data: [] },
                            r2 = { name: '红球2', data: [] },
                            r3 = { name: '红球3', data: [] },
                            r4 = { name: '红球4', data: [] },
                            r5 = { name: '红球5', data: [] },
                            r6 = { name: '红球6', data: [] },
                            b1 = { name: '篮球', data: [] };

                        _.each(data, function (item, index, list) {
                            res.categories.push(item.no);
                            r1.data.push(item.r1);
                            r2.data.push(item.r2);
                            r3.data.push(item.r3);
                            r4.data.push(item.r4);
                            r5.data.push(item.r5);
                            r6.data.push(item.r6);
                            b1.data.push(item.b1);
                        });
                        
                        res.series.push(r1);
                        res.series.push(r2);
                        res.series.push(r3);
                        res.series.push(r4);
                        res.series.push(r5);
                        res.series.push(r6);
                        res.series.push(b1);
                        
                        res.categories.reverse();
                        deferred.resolve(res);  // 声明执行成功，即http请求数据成功，可以返回数据了 
                    }
                }).error(function (data, status, headers, config) {
                    deferred.reject(null);   // 声明执行失败，即服务器返回错误  
                });
            }
            else {
                //大乐透
                $http.get('/dlt/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var res = {};
                        res.categories = [],
                        res.series = [];

                        var r1 = { name: '红球1', data: [] },
                            r2 = { name: '红球2', data: [] },
                            r3 = { name: '红球3', data: [] },
                            r4 = { name: '红球4', data: [] },
                            r5 = { name: '红球5', data: [] },
                            b1 = { name: '篮球1', data: [] },
                            b2 = { name: '篮球2', data: [] };

                        _.each(data, function (item, index, list) {
                            res.categories.push((new Date(item.date)).Format('MM-dd'));
                            r1.data.push(item.r1);
                            r2.data.push(item.r2);
                            r3.data.push(item.r3);
                            r4.data.push(item.r4);
                            r5.data.push(item.r5);
                            b1.data.push(item.b1);
                            b2.data.push(item.b2);
                        });
                        
                        res.series.push(r1);
                        res.series.push(r2);
                        res.series.push(r3);
                        res.series.push(r4);
                        res.series.push(r5);
                        res.series.push(b1);
                        res.series.push(b2);
                        
                        res.categories.reverse();
                        deferred.resolve(res);  // 声明执行成功，即http请求数据成功，可以返回数据了 
                    }
                }).error(function (data, status, headers, config) {
                    deferred.reject(null);   // 声明执行失败，即服务器返回错误  
                });
            }
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
        }
    };
}]);
