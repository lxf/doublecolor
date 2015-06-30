/// <reference path="../../typings/angularjs/angular.d.ts"/>
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份 
        "d+": this.getDate(),                    //日 
        "h+": this.getHours(),                   //小时 
        "m+": this.getMinutes(),                 //分 
        "s+": this.getSeconds(),                 //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1,(RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

var app = angular.module('dcapp', []);
app.controller('MainCtrl', function ($scope, $http, $q, DCDataFactory) {
    var deferred = $q.defer();
    //图表配置项
    $scope.defaultOptions = {
        title: {
            text: '图表标题',
            x: -20 //center
        },
        subtitle: {
            text: 'www.upsnail.com',
            x: -20
        },
        xAxis: {},
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
        series: []
    };
    //区间比
    $scope.showRange = function (dctype, limitnum) {
        var promise = DCDataFactory.showRangeData(dctype, limitnum);
        promise.then(
            function (data) {  // 调用承诺API获取数据 .resolve  
                var currentoption = {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '红球区间比统计图',
                        x: 0
                    },
                    xAxis: {
                        categories: data.x
                    },
                    yAxis: {
                        min: 0,
                        title: '每期区间'
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'percent'
                        }
                    },
                    series: data.y
                };
                var options = $.extend(true, {}, $scope.defaultOptions, currentoption || {});
                if (dctype == 1) {
                    $('#img4').highcharts(options);
                }
                else {
                    options.title.text = '大乐透区间比统计图';
                    $('#dlt_img4').highcharts(options);
                }

            },
            function (data) {  
                // 处理错误 .reject  
            });
    };
    //奇偶比
    $scope.showEvenOdd = function (dctype, limitnum) {
        var promise = DCDataFactory.showEvenOddData(dctype, limitnum); // 同步调用，获得承诺接口  
        promise.then(
            function (data) {  // 调用承诺API获取数据 .resolve  
                var currentoption = {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '红球奇偶比统计图',
                        x: 0
                    },
                    xAxis: {
                        categories: data.x
                    },
                    yAxis: {
                        min: 0,
                        title: '每期奇偶数'
                    },
                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br>',
                        shared: true
                    },
                    plotOptions: {
                        column: {
                            stacking: 'percent'
                        }
                    },
                    series: data.y
                };
                var options = $.extend(true, {}, $scope.defaultOptions, currentoption || {});
                if (dctype == 1) {
                    $('#img3').highcharts(options);
                }
                else {
                    options.title.text = '大乐透奇偶比统计图';
                    $('#dlt_img3').highcharts(options);
                }

            },
            function (data) {  
                // 处理错误 .reject  
            });
    };
    //折线，每一期的号码
    $scope.showPlot = function (dctype, limitnum) {
        var promise = DCDataFactory.showLimitData(dctype, limitnum); // 同步调用，获得承诺接口  
        promise.then(
            function (data) {  // 调用承诺API获取数据 .resolve  
                var currentoption = {
                    title: {
                        text: '红球与篮球走势图'
                    },
                    xAxis: {
                        categories: data.categories
                    },
                    series: data.series
                };
                var options = $.extend(true, {}, $scope.defaultOptions, currentoption || {});
                $('#container').highcharts(options);
            },
            function (data) {  
                // 处理错误 .reject  
            });
    };
    
    //柱状图，各个号码出现的频次统计
    $scope.showFrequency = function (dctype, limitnum) {
        var promisered = DCDataFactory.showSimpleRedData(dctype, limitnum),
            promiseblue = DCDataFactory.showSimpleBlueData(dctype, limitnum),
            currentoption = {
                chart: {
                    type: 'column',
                    margin: [50, 50, 100, 80]
                },
                title: {
                    text: '各个号码频次柱状统计图',
                    x: 0
                },
                xAxis: {
                    categories: [], //arr1.reverse(),
                    labels: {
                        rotation: -45,
                        align: 'right',
                        style: {
                            fontSize: '13px',
                            fontFamily: 'Verdana, sans-serif'
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    plotLines: []
                },
                legend: {
                    enabled: false
                },
                series: [
                    {
                        name: '号码',
                        data: [],//arr2.reverse(),
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: '#FFFFFF',
                            align: 'right',
                            x: 4,
                            y: 10,
                            style: {
                                fontSize: '13px',
                                fontFamily: 'Verdana, sans-serif',
                                textShadow: '0 0 3px black'
                            }
                        }
                    }]
            };

        var options = $.extend(true, {}, $scope.defaultOptions, currentoption || {});

        promisered.then(
            function (data) {  // 调用承诺API获取数据 .resolve  
                //按照从1到33球的出现的频次顺序依次排序
                var arr1 = [],
                    arr2 = [];
                _.each(_.sortBy(data, function (item) { return item.val; }),
                    function (item, index, list) {
                        arr1.push(item.key);
                        arr2.push(item.val);
                    });

                var tempoption = {
                    title: {
                        text: '双色球红球频次柱状统计图',
                    },
                    xAxis: {
                        categories: arr1.reverse()
                    },
                    series: [
                        {
                            data: arr2.reverse()
                        }
                    ]
                };
                var optionnow = $.extend(true, {}, currentoption, tempoption || {});
                if (dctype == 1) {
                    $('#img1').highcharts(optionnow);
                }
                else {
                    optionnow.title.text = '大乐透红球频次柱状统计图';
                    $('#dlt_img1').highcharts(optionnow);
                }
            },
            function (data) {  
                // 处理错误 .reject  
            });

        promiseblue.then(
            function (data) {
                var arr1 = [],
                    arr2 = [];
                _.each(_.sortBy(data, function (item) { return item.val; }),
                    function (item, index, list) {
                        arr1.push(item.key);
                        arr2.push(item.val);
                    });

                var tempoption = {
                    title: {
                        text: '双色球篮球频次柱状统计图',
                    },
                    xAxis: {
                        categories: arr1.reverse()
                    },
                    series: [
                        {
                            data: arr2.reverse()
                        }
                    ]
                };
                var optionnow = $.extend(true, {}, currentoption, tempoption || {});
                if (dctype == 1) {
                    $('#img2').highcharts(optionnow);
                }
                else {
                    optionnow.title.text = '大乐透篮球频次柱状统计图';
                    $('#dlt_img2').highcharts(optionnow);
                }
            }, function (data) {

            });
    };
});
app.factory('DCDataFactory', ['$http', '$q', function ($http, $q) {
    return {
        showRangeData: function (dctype, limitnum) {
            var deferred = $q.defer();
            if (dctype == 1) {
                //双色球
                $http.get('/ssq/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var res = {};
                        res.x = [];
                        res.y = [{ name: '小号区', data: [] }, { name: '中号区', data: [] }, { name: '大号区', data: [] }];

                        _.each(data, function (currentitem, index, list) {
                            res.x.push(currentitem.no);
                            var minnum = 0,
                                midnum = 0,
                                maxnum = 0;
                            for (var item in currentitem) {
                                if (item == 'r1' ||
                                    item == 'r2' ||
                                    item == 'r3' ||
                                    item == 'r4' ||
                                    item == 'r5' ||
                                    item == 'r6') {
                                    var num = parseInt(currentitem[item]);
                                    if (num <= 11) {
                                        minnum++;
                                    }
                                    else if (11 < num && num <= 22) {
                                        midnum++;
                                    }
                                    else {
                                        maxnum++;
                                    }
                                }
                            }
                            res.y[0].data.push(minnum);
                            res.y[1].data.push(midnum);
                            res.y[2].data.push(maxnum);
                        });
                        //反转下顺序
                        res.x.reverse();
                        res.y[0].data.reverse();
                        res.y[1].data.reverse();
                        res.y[2].data.reverse();
                        deferred.resolve(res);
                    }
                }).error(function (data, status, headers, config) {

                });
            }
            else {
                //大乐透
                $http.get('/dlt/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var res = {};
                        res.x = [];
                        res.y = [{ name: '小号区', data: [] }, { name: '中号区', data: [] }, { name: '大号区', data: [] }];

                        _.each(data, function (currentitem, index, list) {
                            res.x.push(currentitem.no);
                            var minnum = 0,
                                midnum = 0,
                                maxnum = 0;
                            for (var item in currentitem) {
                                if (item == 'r1' ||
                                    item == 'r2' ||
                                    item == 'r3' ||
                                    item == 'r4' ||
                                    item == 'r5') {
                                    var num = parseInt(currentitem[item]);
                                    if (num <= 12) {
                                        minnum++;
                                    }
                                    else if (12 < num && num <= 23) {
                                        midnum++;
                                    }
                                    else {
                                        maxnum++;
                                    }
                                }
                            }
                            res.y[0].data.push(minnum);
                            res.y[1].data.push(midnum);
                            res.y[2].data.push(maxnum);

                        });
                        //反转下顺序
                        res.x.reverse();
                        res.y[0].data.reverse();
                        res.y[1].data.reverse();
                        res.y[2].data.reverse();
                        deferred.resolve(res);
                    }
                }).error(function (data, status, headers, config) {

                });
            }
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
        },
        //显示奇偶比
        showEvenOddData: function (dctype, limitnum) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            if (dctype == 1) {
                //双色球
                $http.get('/ssq/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var res = {};
                        res.x = [];
                        res.y = [{ name: '奇数', data: [] }, { name: '偶数', data: [] }];

                        _.each(data, function (currentitem, index, list) {
                            res.x.push(currentitem.no);
                            var evencount = 0,
                                oddcount = 0;

                            for (var item in currentitem) {
                                if (item == 'r1' ||
                                    item == 'r2' ||
                                    item == 'r3' ||
                                    item == 'r4' ||
                                    item == 'r5' ||
                                    item == 'r6') {
                                    if (currentitem[item] % 2 == 0) {
                                        evencount++;
                                    }
                                    else {
                                        oddcount++;
                                    }
                                }
                            }
                            res.y[0].data.push(oddcount);
                            res.y[1].data.push(evencount);
                        });
                        //反转下顺序
                        res.x.reverse();
                        res.y[0].data.reverse();
                        res.y[1].data.reverse();
                        deferred.resolve(res);
                    }
                }).error(function (data, status, headers, config) {

                });
            }
            else {
                //大乐透
                $http.get('/dlt/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var res = {};
                        res.x = [];
                        res.y = [{ name: '奇数', data: [] }, { name: '偶数', data: [] }];

                        _.each(data, function (currentitem, index, list) {
                            res.x.push(currentitem.no);
                            var evencount = 0,
                                oddcount = 0;

                            for (var item in currentitem) {
                                if (item == 'r1' ||
                                    item == 'r2' ||
                                    item == 'r3' ||
                                    item == 'r4' ||
                                    item == 'r5') {
                                    if (currentitem[item] % 2 == 0) {
                                        evencount++;
                                    }
                                    else {
                                        oddcount++;
                                    }
                                }
                            }
                            res.y[0].data.push(oddcount);
                            res.y[1].data.push(evencount);
                        });
                        //反转下顺序
                        res.x.reverse();
                        res.y[0].data.reverse();
                        res.y[1].data.reverse();
                        deferred.resolve(res);
                    }
                }).error(function (data, status, headers, config) {

                });
            }
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
        },
        //显示所有篮球出现频次的数据
        showSimpleBlueData: function (dctype, limitnum) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            if (dctype == 1) {
                //双色球
                $http.get('/ssq/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
                        var values = [];
                        _.each(data, function (currentitem, index, list) {
                            for (var item in currentitem) {
                                if (item == 'b1') {
                                    values.push(currentitem[item]);
                                }
                            }
                        });
                        var temarr = [];
                        _.each(key, function (item, index, list) {
                            var someitem = {};
                            someitem.key = item;
                            var res = _.countBy(values, function (num) {
                                return num == item ? 'YES' : 'NO';
                            });
                            someitem.val = res.YES == undefined ? 0 : res.YES;
                            temarr.push(someitem);
                        });
                        deferred.resolve(temarr);
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
                        var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
                        var values = [];
                        _.each(data, function (currentitem, index, list) {
                            for (var item in currentitem) {
                                if (item == 'b1' || item == 'b2') {
                                    values.push(currentitem[item]);
                                }
                            }
                        });
                        var temarr = [];
                        _.each(key, function (item, index, list) {
                            var someitem = {};
                            someitem.key = item;
                            var res = _.countBy(values, function (num) {
                                return num == item ? 'YES' : 'NO';
                            });
                            someitem.val = res.YES == undefined ? 0 : res.YES;
                            temarr.push(someitem);
                        });
                        deferred.resolve(temarr);
                    }
                }).error(function (data, status, headers, config) {
                    deferred.reject(null);   // 声明执行失败，即服务器返回错误  
                });
            }
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
        },
        //显示所有红球出现频次的数据
        showSimpleRedData: function (dctype, limitnum) {
            var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
            if (dctype == 1) {
                //双色球
                $http.get('/ssq/' + limitnum, { cache: true })
                    .success(function (data, status, headers, config) {
                    if (status == 200) {
                        var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33];
                        var values = [];
                        _.each(data, function (currentitem, index, list) {
                            for (var item in currentitem) {
                                if (item == 'r1' ||
                                    item == 'r2' ||
                                    item == 'r3' ||
                                    item == 'r4' ||
                                    item == 'r5' ||
                                    item == 'r6') {
                                    values.push(currentitem[item]);
                                }
                            }
                        });
                        var temarr = [];
                        //step1 找出所有按照出现的频次高低降序列出球号
                        //step2 得出所有的频次
                        _.each(key, function (item, index, list) {
                            var someitem = {};
                            someitem.key = item;
                            var res = _.countBy(values, function (num) {
                                return num == item ? 'YES' : 'NO';
                            });
                            someitem.val = res.YES == undefined ? 0 : res.YES;
                            temarr.push(someitem);
                        });
                        deferred.resolve(temarr);
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
                        var key = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
                        var values = [];
                        _.each(data, function (currentitem, index, list) {
                            for (var item in currentitem) {
                                if (item == 'r1' ||
                                    item == 'r2' ||
                                    item == 'r3' ||
                                    item == 'r4' ||
                                    item == 'r5') {
                                    values.push(currentitem[item]);
                                }
                            }
                        });
                        var temarr = [];
                        //step1 找出所有按照出现的频次高低降序列出球号
                        //step2 得出所有的频次
                        _.each(key, function (item, index, list) {
                            var someitem = {};
                            someitem.key = item;
                            var res = _.countBy(values, function (num) {
                                return num == item ? 'YES' : 'NO';
                            });
                            someitem.val = res.YES == undefined ? 0 : res.YES;
                            temarr.push(someitem);
                        });
                        deferred.resolve(temarr);
                    }
                }).error(function (data, status, headers, config) {
                    deferred.reject(null);   // 声明执行失败，即服务器返回错误  
                });
            }
            return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API  
        },
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
