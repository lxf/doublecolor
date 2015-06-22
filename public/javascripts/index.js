/// <reference path="../../typings/angularjs/angular.d.ts"/>
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
                        
                        deferred.resolve(res);  // 声明执行成功，即http请求数据成功，可以返回数据了 
                    }
                }).error(function (data, status, headers, config) {
                    deferred.reject(null);   // 声明执行失败，即服务器返回错误  
                });
            }
            else {
                //大乐透
            }
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
        }
    };
}]);
