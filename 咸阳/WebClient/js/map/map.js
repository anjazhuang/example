var devicestation_layer = "";
var warntt0, warnrh, warnrf, warnreh, warnref, warnrain, map_Waterlevelstation_data, map_Rainlstation_data,
    map_Soilstation_data, map_Hydrologystation_data2,
    map_Hydrologystation_data,
    map_floodData = [];
var mint, maxt;
var jobId;
var detectiondeviceregime_data = [];
var userdata = $.cookie("userdata");
var soilapi = $.cookie("soilapi");
var stationList;
//树形插件初始化设置
var setting = {
    check: {
        enable: true,
        chkboxType: { "Y": "ps", "N": "ps" },
        //chkboxType: { "Y": "ps", "N": "ps" },
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "id", // id编号命名
            pIdKey: "pId", // 父id编号命名
            rootPId: 0
        }
    },
    view: {
        showIcon: true
    }
};

if (screen.height <= 768) {
    rainLayerHeight = '550px';
    operationLayerHeight = '550px';
} else {
    rainLayerHeight = '650px';
    operationLayerHeight = '750px';
}

//时间格式化函数
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

//按钮权限
function btnAuthority(selector, btnName, className) {
    if (userdata.indexOf(selector) == -1) {
        $("#" + btnName).attr("disabled", true);
        $("#" + btnName).removeClass(className);
        $("#" + btnName).addClass("btn-disabled");
    }
}

//显示按钮权限
function showBtnAuthority() {
    btnAuthority("mapRain-menu", "rainfall_btn", "rainBtn");
    btnAuthority("mapWater-menu", "waterregime_btn", "waterBtn");
    btnAuthority("mapSoil-menu", "soilmoisture_btn", "soilBtn");
    btnAuthority("mapStation-menu", "detectiondevice_btn", "ywBtn");
    btnAuthority("mapWarning-menu", "alarm_btn", "warnBtn");
    btnAuthority("mapAnalysis-menu", "analysis_btn", "analysisBtn");
}


//设置图表参数
function setEcharts_option(data, typename, unit, color, stationtype) {
    var datamax1 = [], datamax = [], datamax2 = [], y_axis_data = [], y_axis_data1 = [], y_axis_data2 = [];
    //console.log(data);
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            //开始时间设置为0点
            if (key === 0) {
                var mydate = new Date(obj.Time.replace("T", " ").replace("-", "/"));
                mydate.setDate(mydate.getDate() - 1);
                mydate.setHours(0);
                var d = new Date(mydate);
                mint = d.format("yyyy-MM-ddThh:mm:ss");
            } else if (key == data.length - 1) {
                //结束时间设置为第二天0点
                var mydate = new Date(obj.Time.replace("T", " ").replace("-", "/"));
                mydate.setDate(mydate.getDate() + 1);
                mydate.setHours(0);
                var d = new Date(mydate);
                maxt = d.format("yyyy-MM-ddThh:mm:ss");
            }
            //图表y轴数据
            var dd = {
                name: obj.Time,
                value: [obj.Time, obj.Value === null ? "0" : obj.Value]
            };
            //图表y轴数据
            y_axis_data.push(dd);
            //console.log(y_axis_data);
            //设置最大值
            datamax.push(obj.Value);
            //console.log("y:" + Math.max.apply(null, datamax) * 1.2);
        });
    } else {
        mint = "";
        maxt = "";
    }

    //console.log(mint + maxt);

    var echarts_option;
    //雨量站
    if (stationtype == '雨量站') {
        echarts_option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    animation: false,
                    label: {
                        backgroundColor: '#505765'
                    }
                }
            },
            legend: {
                data: typename
            },
            grid: {
                bottom: '5%',
                containLabel: true,
                left: 35,
                right: 45,
                top: "10%"
            },
            xAxis: [
                {
                    type: 'time',
                    splitLine: {
                        show: false
                    },
                    min: mint,
                    max: maxt
                    // boundaryGap:['20%', '20%']
                }
            ],
            yAxis: [
                {
                    name: unit,
                    nameLocation: 'start',
                    type: 'value',
                    inverse: true,
                    max: (Math.max.apply(null, datamax) * 1.2).toFixed(2) ? (Math.max.apply(null, datamax) * 1.2).toFixed(2) : ""
                }
            ],
            series: [
                {
                    name: typename,
                    type: 'bar',
                    barWidth: '5px',
                    itemStyle: {
                        normal: {
                            color: color,
                            lineStyle: {
                                //color: '#009d89'
                                color: color,
                            }
                        }
                    },
                    data: y_axis_data
                }
            ]
        };
    }
    //水文站
    else if (stationtype == '河道水文站') {
        // var arraystations = ["雨量", "水位"], chartsData = [];
        // for (var i = 0; i < arraystations.length; i++) {
        //     var tt = $.grep(data, function (d) {
        //         return d.Name == arraystations[i];
        //     });
        //     if (tt.length !== 0) {
        //         var stationdata = [];
        //         // //console.log("找到的站点编码:" + powers[i]);
        //         $.each(tt, function (key, obj) {
        //             var aa = {
        //                 name: obj.Time,
        //                 value: [obj.Time, obj.Value === null ? "0" : obj.Value]
        //             }
        //             stationdata.push(aa);
        //         });
        //         var chartsobj = {
        //             name: typename[i],
        //             type: 'bar',
        //             barWidth: "15px",
        //             stack: typename[i],
        //             itemStyle: {
        //                 normal: {
        //                     //color:'#009d89',
        //                     color: color[i],
        //                     lineStyle: {
        //                         color: color[i]
        //                     }
        //                 }
        //             },
        //             data: stationdata
        //         };
        //         chartsData.push(chartsobj);
        //     }
        // }
        // //console.log(chartsData);
        var a0 = $.grep(data2, function (d) {
            return d.Name == "水位";
        });
        $.each(a0, function (key, obj) {
            // y_axis_data2.push(obj.Value);
            // x_axis_data2.push(obj.Time.split("T")[1].split(":", 2).join(":"));
            ////console.log(Math.max.apply(null, y_axis_data2)+1);
            var dd1 = {
                name: obj.Time,
                value: [obj.Time, obj.Value === null ? "0" : obj.Value]
            };
            y_axis_data2.push(dd1);
            datamax1.push(obj.Value);
        });
        var a1 = $.grep(data, function (d) {
            return d.Name == "雨量";
        });
        $.each(a1, function (key, obj) {
            var dd2 = {
                name: obj.Time,
                value: [obj.Time, obj.Value === null ? "0" : obj.Value]
            };
            y_axis_data1.push(dd2);
            datamax2.push(obj.Value);
        });
        //console.log(Math.max.apply(null, datamax1));
        echarts_option = {
            tooltip: {
                trigger: 'axis',
                // formatter: typename + ": {c}  ( 时间：{b} )"
            },
            legend: {
                data: typename
            },
            grid: [{
                top: '12%',
                left: 60,
                right: 50,
                height: '100px'
            }, {
                left: 60,
                right: 50,
                top: '60%',
                height: '100px'
            }],
            xAxis: [{
                type: 'time',
                splitLine: {
                    show: false
                },
                min: mint,
                max: maxt
            }, {
                gridIndex: 1,
                type: 'time',
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: unit[0],
                nameLocation: "start",
                inverse: true,
                max: (Math.max.apply(null, datamax2) * 1.2).toFixed(2) ? (Math.max.apply(null, datamax2) * 1.2).toFixed(2) : ""
            }, {
                gridIndex: 1,
                type: 'value',
                name: unit[1],
                max: "1200"
            }],
            series: [
                {
                    name: typename[0],
                    type: 'bar',
                    barWidth: '5px',
                    stack: typename[0],
                    itemStyle: {
                        normal: {
                            //color:'#009d89',
                            color: color[0],
                            lineStyle: {
                                color: color[0]
                            }
                        }
                    },
                    data: y_axis_data1
                },
                {
                    name: typename[1],
                    type: 'line',
                    stack: typename[1],
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            //color:'#009d89',
                            color: color[1],
                            lineStyle: {
                                color: color[1]
                            }
                        }
                    },
                    data: y_axis_data2
                }
            ]
            // series:chartsData
        }
    }
    else if (stationtype == '墒情站') {
        var arraystations = ["10cm相对湿度", "20cm相对湿度", "40cm相对湿度", "10-40cm相对湿度均值"], chartsData = [];
        for (var i = 0; i < arraystations.length; i++) {
            var tt = $.grep(data, function (d) {
                return d.Name == arraystations[i];
            });
            if (tt.length !== 0) {
                var stationdata = [];
                // //console.log("找到的站点编码:" + powers[i]);
                $.each(tt, function (key, obj) {
                    var aa = {
                        name: obj.Time,
                        value: [obj.Time, obj.Value === null ? "0" : obj.Value]
                    }
                    stationdata.push(aa);
                });
                var chartsobj = {
                    name: typename[i],
                    type: 'line',
                    symbolSize: 6,
                    symbol: 'circle',
                    stack: typename[i],
                    itemStyle: {
                        normal: {
                            color: color[i],
                            lineStyle: {
                                color: color[i]
                            }
                        }
                    },
                    data: stationdata
                };
                chartsData.push(chartsobj);
            } else {
                var chartsobj = {
                    name: typename[i],
                    type: 'line',
                    symbolSize: 6,
                    symbol: 'circle',
                    stack: typename[i],
                    itemStyle: {
                        normal: {
                            color: color[i],
                            lineStyle: {
                                color: color[i]
                            }
                        }
                    },
                    data: null
                };
                chartsData.push(chartsobj);
            }
        }
        //console.log(chartsData);
        // var a0 = $.grep(data, function (d) {
        //     return d.Name == "10cm含水量";
        // });
        // $.each(a0, function (key, obj) {
        //     var dd = {
        //         name: obj.Time,
        //         value: [obj.Time, obj.Value===null?"0":obj.Value]
        //     };
        //     y_axis_data1.push(dd);
        // });
        // var a1 = $.grep(data, function (d) {
        //     return d.Name == "20cm含水量";
        // });
        // $.each(a1, function (key, obj) {
        //     var dd1 = {
        //         name: obj.Time,
        //         value: [obj.Time, obj.Value===null?"0":obj.Value]
        //     };
        //     y_axis_data2.push(dd1);
        // });
        // ////console.log(y_axis_data2);
        // var a2 = $.grep(data, function (d) {
        //     return d.Name == "40cm含水量";
        // });
        // $.each(a2, function (key, obj) {
        //     var dd2 = {
        //         name: obj.Time,
        //         value: [obj.Time, obj.Value===null?"0":obj.Value]
        //     };
        //     y_axis_data3.push(dd2);
        // });
        // var a3 = $.grep(data, function (d) {
        //     return d.Name == "含水量均值";
        // });
        // $.each(a3, function (key, obj) {
        //     var dd3 = {
        //         name: obj.Time,
        //         value: [obj.Time,obj.Value===null?"0":obj.Value]
        //     };
        //     y_axis_data4.push(dd3);
        // });
        echarts_option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: typename
            },
            grid: {
                bottom: '5%',
                containLabel: true,
                left: 35,
                right: 45,
                top: "20%"
            },
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: unit
            },
            // series: [
            //     {
            //         name: typename[0],
            //         type: 'line',
            //         stack: typename[0],
            //         itemStyle: {
            //             normal: {
            //                 //color:'#009d89',
            //                 color: color[0],
            //                 lineStyle: {
            //                     color: color[0]
            //                 }
            //             }
            //         },
            //         data: y_axis_data1
            //     },
            //     {
            //         name: typename[1],
            //         type: 'line',
            //         stack: typename[1],
            //         itemStyle: {
            //             normal: {
            //                 //color:'#009d89',
            //                 color: color[1],
            //                 lineStyle: {
            //                     color: color[1]
            //                 }
            //             }
            //         },
            //         data: y_axis_data2
            //     },
            //     {
            //         name: typename[2],
            //         type: 'line',
            //         stack: typename[2],
            //         itemStyle: {
            //             normal: {
            //                 //color:'#009d89',
            //                 color: color[2],
            //                 lineStyle: {
            //                     color: color[2]
            //                 }
            //             }
            //         },
            //         data: y_axis_data3
            //     },
            //     {
            //         name: typename[3],
            //         type: 'line',
            //         stack: typename[3],
            //         itemStyle: {
            //             normal: {
            //                 //color:'#009d89',
            //                 color: color[3],
            //                 lineStyle: {
            //                     color: color[3]
            //                 }
            //             }
            //         },
            //         data: y_axis_data4
            //     }
            // ]
            series: chartsData
        }
    }
    //河道水位站
    else if (stationtype == "河道水位站") {
        var a0 = $.grep(data, function (d) {
            return d.Name == "水位";
        });
        $.each(a0, function (key, obj) {
            // y_axis_data2.push(obj.Value);
            // x_axis_data2.push(obj.Time.split("T")[1].split(":", 2).join(":"));
            ////console.log(Math.max.apply(null, y_axis_data2)+1);
            var dd1 = {
                name: obj.Time,
                value: [obj.Time, obj.Value === null ? "0" : obj.Value]
            };
            y_axis_data2.push(dd1);
            datamax1.push(obj.Value);
        });
        var a1 = $.grep(data, function (d) {
            return d.Name == "雨量";
        });
        $.each(a1, function (key, obj) {
            var dd2 = {
                name: obj.Time,
                value: [obj.Time, obj.Value === null ? "0" : obj.Value]
            };
            y_axis_data1.push(dd2);
            datamax2.push(obj.Value);
        });
        //console.log(Math.max.apply(null, datamax1));
        echarts_option = {
            tooltip: {
                trigger: 'axis',
                // formatter: typename + ": {c}  ( 时间：{b} )"
            },
            legend: {
                data: typename
            },
            grid: [{
                top: '12%',
                left: 60,
                right: 50,
                height: '100px'
            }, {
                left: 60,
                right: 50,
                top: '60%',
                height: '100px'
            }],
            xAxis: [{
                type: 'time',
                splitLine: {
                    show: false
                },
                min: mint,
                max: maxt
            }, {
                gridIndex: 1,
                type: 'time',
                splitLine: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                name: unit[0],
                nameLocation: "start",
                inverse: true,
                max: (Math.max.apply(null, datamax2) * 1.2).toFixed(2) ? (Math.max.apply(null, datamax2) * 1.2).toFixed(2) : ""
            }, {
                gridIndex: 1,
                type: 'value',
                name: unit[1],
                max: "1200"
            }],
            series: [
                {
                    name: typename[0],
                    type: 'bar',
                    barWidth: '5px',
                    stack: typename[0],
                    itemStyle: {
                        normal: {
                            //color:'#009d89',
                            color: color[0],
                            lineStyle: {
                                color: color[0]
                            }
                        }
                    },
                    data: y_axis_data1
                },
                {
                    name: typename[1],
                    type: 'line',
                    stack: typename[1],
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            //color:'#009d89',
                            color: color[1],
                            lineStyle: {
                                color: color[1]
                            }
                        }
                    },
                    data: y_axis_data2
                }
            ]
            // series:chartsData
        }
    }
    //返回数据
    return echarts_option;
}

function setEcharts_option2(data, typename, unit, color, stationtype, data2) {
    var datamax1 = [], datamax = [], datamax2 = [], y_axis_data = [], y_axis_data1 = [], y_axis_data2 = [];
    //console.log(data);
    if (data.length > 0) {
        $.each(data, function (key, obj) {
            //开始时间设置为0点
            if (key === 0) {
                var mydate = new Date(obj.Time.replace("T", " ").replace("-", "/"));
                mydate.setDate(mydate.getDate() - 1);
                mydate.setHours(0);
                var d = new Date(mydate);
                mint = d.format("yyyy-MM-ddThh:mm:ss");
            } else if (key == data.length - 1) {
                //结束时间设置为第二天0点
                var mydate = new Date(obj.Time.replace("T", " ").replace("-", "/"));
                mydate.setDate(mydate.getDate() + 1);
                mydate.setHours(0);
                var d = new Date(mydate);
                maxt = d.format("yyyy-MM-ddThh:mm:ss");
            }
            //图表y轴数据
            var dd = {
                name: obj.Time,
                value: [obj.Time, obj.Value === null ? "0" : obj.Value]
            };
            //图表y轴数据
            y_axis_data.push(dd);
            //console.log(y_axis_data);
            //设置最大值
            datamax.push(obj.Value);
            //console.log("y:" + Math.max.apply(null, datamax) * 1.2);
        });
    } else {
        mint = "";
        maxt = "";
    }

    //console.log(mint + maxt);

    var echarts_option;
    //雨量站
    // if (stationtype == '雨量站') {
    //     echarts_option = {
    //         tooltip: {
    //             trigger: 'axis',
    //             axisPointer: {
    //                 type: 'cross',
    //                 animation: false,
    //                 label: {
    //                     backgroundColor: '#505765'
    //                 }
    //             }
    //         },
    //         legend: {
    //             data: typename
    //         },
    //         grid: {
    //             bottom: '5%',
    //             containLabel: true,
    //             left: 35,
    //             right: 45,
    //             top: "10%"
    //         },
    //         xAxis: [
    //             {
    //                 type: 'time',
    //                 splitLine: {
    //                     show: false
    //                 },
    //                 min: mint,
    //                 max: maxt
    //                 // boundaryGap:['20%', '20%']
    //             }
    //         ],
    //         yAxis: [
    //             {
    //                 name: unit,
    //                 nameLocation: 'start',
    //                 type: 'value',
    //                 inverse: true,
    //                 max: (Math.max.apply(null, datamax) * 1.2).toFixed(2) ? (Math.max.apply(null, datamax) * 1.2).toFixed(2) : ""
    //             }
    //         ],
    //         series: [
    //             {
    //                 name: typename,
    //                 type: 'bar',
    //                 barWidth: '5px',
    //                 itemStyle: {
    //                     normal: {
    //                         color: color,
    //                         lineStyle: {
    //                             //color: '#009d89'
    //                             color: color,
    //                         }
    //                     }
    //                 },
    //                 data: y_axis_data
    //             }
    //         ]
    //     };
    // }
    // //水文站
    // else if (stationtype == '河道水文站') {
    //     // var arraystations = ["雨量", "水位"], chartsData = [];
    //     // for (var i = 0; i < arraystations.length; i++) {
    //     //     var tt = $.grep(data, function (d) {
    //     //         return d.Name == arraystations[i];
    //     //     });
    //     //     if (tt.length !== 0) {
    //     //         var stationdata = [];
    //     //         // //console.log("找到的站点编码:" + powers[i]);
    //     //         $.each(tt, function (key, obj) {
    //     //             var aa = {
    //     //                 name: obj.Time,
    //     //                 value: [obj.Time, obj.Value === null ? "0" : obj.Value]
    //     //             }
    //     //             stationdata.push(aa);
    //     //         });
    //     //         var chartsobj = {
    //     //             name: typename[i],
    //     //             type: 'bar',
    //     //             barWidth: "15px",
    //     //             stack: typename[i],
    //     //             itemStyle: {
    //     //                 normal: {
    //     //                     //color:'#009d89',
    //     //                     color: color[i],
    //     //                     lineStyle: {
    //     //                         color: color[i]
    //     //                     }
    //     //                 }
    //     //             },
    //     //             data: stationdata
    //     //         };
    //     //         chartsData.push(chartsobj);
    //     //     }
    //     // }
    //     // //console.log(chartsData);
    //     var a0 = $.grep(data2, function (d) {
    //         return d.Name == "水位";
    //     });
    //     $.each(a0, function (key, obj) {
    //         // y_axis_data2.push(obj.Value);
    //         // x_axis_data2.push(obj.Time.split("T")[1].split(":", 2).join(":"));
    //         ////console.log(Math.max.apply(null, y_axis_data2)+1);
    //         var dd1 = {
    //             name: obj.Time,
    //             value: [obj.Time, obj.Value === null ? "0" : obj.Value]
    //         };
    //         y_axis_data2.push(dd1);
    //         datamax1.push(obj.Value);
    //     });
    //     var a1 = $.grep(data, function (d) {
    //         return d.Name == "雨量";
    //     });
    //     $.each(a1, function (key, obj) {
    //         var dd2 = {
    //             name: obj.Time,
    //             value: [obj.Time, obj.Value === null ? "0" : obj.Value]
    //         };
    //         y_axis_data1.push(dd2);
    //         datamax2.push(obj.Value);
    //     });
    //     //console.log(Math.max.apply(null, datamax1));
    //     echarts_option = {
    //         tooltip: {
    //             trigger: 'axis',
    //             // formatter: typename + ": {c}  ( 时间：{b} )"
    //         },
    //         legend: {
    //             data: typename
    //         },
    //         grid: [{
    //             top: '12%',
    //             left: 60,
    //             right: 50,
    //             height: '100px'
    //         }, {
    //             left: 60,
    //             right: 50,
    //             top: '60%',
    //             height: '100px'
    //         }],
    //         xAxis: [{
    //             type: 'time',
    //             splitLine: {
    //                 show: false
    //             },
    //             min: mint,
    //             max: maxt
    //         }, {
    //             gridIndex: 1,
    //             type: 'time',
    //             splitLine: {
    //                 show: false
    //             }
    //         }],
    //         yAxis: [{
    //             type: 'value',
    //             name: unit[0],
    //             nameLocation: "start",
    //             inverse: true,
    //             max: (Math.max.apply(null, datamax2) * 1.2).toFixed(2) ? (Math.max.apply(null, datamax2) * 1.2).toFixed(2) : ""
    //         }, {
    //             gridIndex: 1,
    //             type: 'value',
    //             name: unit[1],
    //             max: "1200"
    //         }],
    //         series: [
    //             {
    //                 name: typename[0],
    //                 type: 'bar',
    //                 barWidth: '5px',
    //                 stack: typename[0],
    //                 itemStyle: {
    //                     normal: {
    //                         //color:'#009d89',
    //                         color: color[0],
    //                         lineStyle: {
    //                             color: color[0]
    //                         }
    //                     }
    //                 },
    //                 data: y_axis_data1
    //             },
    //             {
    //                 name: typename[1],
    //                 type: 'line',
    //                 stack: typename[1],
    //                 xAxisIndex: 1,
    //                 yAxisIndex: 1,
    //                 itemStyle: {
    //                     normal: {
    //                         //color:'#009d89',
    //                         color: color[1],
    //                         lineStyle: {
    //                             color: color[1]
    //                         }
    //                     }
    //                 },
    //                 data: y_axis_data2
    //             }
    //         ]
    //         // series:chartsData
    //     }
    // }
    // //墒情站
    // else if (stationtype == '墒情站') {
    //     var arraystations = ["10cm相对湿度", "20cm相对湿度", "40cm相对湿度", "10-40cm相对湿度均值"], chartsData = [];
    //     for (var i = 0; i < arraystations.length; i++) {
    //         var tt = $.grep(data, function (d) {
    //             return d.Name == arraystations[i];
    //         });
    //         if (tt.length !== 0) {
    //             var stationdata = [];
    //             // //console.log("找到的站点编码:" + powers[i]);
    //             $.each(tt, function (key, obj) {
    //                 var aa = {
    //                     name: obj.Time,
    //                     value: [obj.Time, obj.Value === null ? "0" : obj.Value]
    //                 }
    //                 stationdata.push(aa);
    //             });
    //             var chartsobj = {
    //                 name: typename[i],
    //                 type: 'line',
    //                 symbolSize: 6,
    //                 symbol: 'circle',
    //                 stack: typename[i],
    //                 itemStyle: {
    //                     normal: {
    //                         color: color[i],
    //                         lineStyle: {
    //                             color: color[i]
    //                         }
    //                     }
    //                 },
    //                 data: stationdata
    //             };
    //             chartsData.push(chartsobj);
    //         } else {
    //             var chartsobj = {
    //                 name: typename[i],
    //                 type: 'line',
    //                 symbolSize: 6,
    //                 symbol: 'circle',
    //                 stack: typename[i],
    //                 itemStyle: {
    //                     normal: {
    //                         color: color[i],
    //                         lineStyle: {
    //                             color: color[i]
    //                         }
    //                     }
    //                 },
    //                 data: null
    //             };
    //             chartsData.push(chartsobj);
    //         }
    //     }
    //     //console.log(chartsData);
    //     // var a0 = $.grep(data, function (d) {
    //     //     return d.Name == "10cm含水量";
    //     // });
    //     // $.each(a0, function (key, obj) {
    //     //     var dd = {
    //     //         name: obj.Time,
    //     //         value: [obj.Time, obj.Value===null?"0":obj.Value]
    //     //     };
    //     //     y_axis_data1.push(dd);
    //     // });
    //     // var a1 = $.grep(data, function (d) {
    //     //     return d.Name == "20cm含水量";
    //     // });
    //     // $.each(a1, function (key, obj) {
    //     //     var dd1 = {
    //     //         name: obj.Time,
    //     //         value: [obj.Time, obj.Value===null?"0":obj.Value]
    //     //     };
    //     //     y_axis_data2.push(dd1);
    //     // });
    //     // ////console.log(y_axis_data2);
    //     // var a2 = $.grep(data, function (d) {
    //     //     return d.Name == "40cm含水量";
    //     // });
    //     // $.each(a2, function (key, obj) {
    //     //     var dd2 = {
    //     //         name: obj.Time,
    //     //         value: [obj.Time, obj.Value===null?"0":obj.Value]
    //     //     };
    //     //     y_axis_data3.push(dd2);
    //     // });
    //     // var a3 = $.grep(data, function (d) {
    //     //     return d.Name == "含水量均值";
    //     // });
    //     // $.each(a3, function (key, obj) {
    //     //     var dd3 = {
    //     //         name: obj.Time,
    //     //         value: [obj.Time,obj.Value===null?"0":obj.Value]
    //     //     };
    //     //     y_axis_data4.push(dd3);
    //     // });
    //     echarts_option = {
    //         tooltip: {
    //             trigger: 'axis'
    //         },
    //         legend: {
    //             data: typename
    //         },
    //         grid: {
    //             bottom: '5%',
    //             containLabel: true,
    //             left: 35,
    //             right: 45,
    //             top: "20%"
    //         },
    //         xAxis: {
    //             type: 'time',
    //             splitLine: {
    //                 show: false
    //             }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             name: unit
    //         },
    //         // series: [
    //         //     {
    //         //         name: typename[0],
    //         //         type: 'line',
    //         //         stack: typename[0],
    //         //         itemStyle: {
    //         //             normal: {
    //         //                 //color:'#009d89',
    //         //                 color: color[0],
    //         //                 lineStyle: {
    //         //                     color: color[0]
    //         //                 }
    //         //             }
    //         //         },
    //         //         data: y_axis_data1
    //         //     },
    //         //     {
    //         //         name: typename[1],
    //         //         type: 'line',
    //         //         stack: typename[1],
    //         //         itemStyle: {
    //         //             normal: {
    //         //                 //color:'#009d89',
    //         //                 color: color[1],
    //         //                 lineStyle: {
    //         //                     color: color[1]
    //         //                 }
    //         //             }
    //         //         },
    //         //         data: y_axis_data2
    //         //     },
    //         //     {
    //         //         name: typename[2],
    //         //         type: 'line',
    //         //         stack: typename[2],
    //         //         itemStyle: {
    //         //             normal: {
    //         //                 //color:'#009d89',
    //         //                 color: color[2],
    //         //                 lineStyle: {
    //         //                     color: color[2]
    //         //                 }
    //         //             }
    //         //         },
    //         //         data: y_axis_data3
    //         //     },
    //         //     {
    //         //         name: typename[3],
    //         //         type: 'line',
    //         //         stack: typename[3],
    //         //         itemStyle: {
    //         //             normal: {
    //         //                 //color:'#009d89',
    //         //                 color: color[3],
    //         //                 lineStyle: {
    //         //                     color: color[3]
    //         //                 }
    //         //             }
    //         //         },
    //         //         data: y_axis_data4
    //         //     }
    //         // ]
    //         series: chartsData
    //     }
    // }
    //河道水位站
    // else {
    var a0 = $.grep(data, function (d) {
        return d.Name == "水位";
    });
    $.each(a0, function (key, obj) {
        // y_axis_data2.push(obj.Value);
        // x_axis_data2.push(obj.Time.split("T")[1].split(":", 2).join(":"));
        ////console.log(Math.max.apply(null, y_axis_data2)+1);
        var dd1 = {
            name: obj.Time,
            value: [obj.Time, obj.Value === null ? "0" : obj.Value]
        };
        y_axis_data2.push(dd1);
        datamax1.push(obj.Value);
    });
    var a1 = $.grep(data2, function (d) {
        return d.Name == "雨量";
    });
    $.each(a1, function (key, obj) {
        var dd2 = {
            name: obj.Time,
            value: [obj.Time, obj.Value === null ? "0" : obj.Value]
        };
        y_axis_data1.push(dd2);
        datamax2.push(obj.Value);
    });
    //console.log(Math.max.apply(null, datamax1));
    echarts_option = {
        tooltip: {
            trigger: 'axis',
            // formatter: typename + ": {c}  ( 时间：{b} )"
        },
        legend: {
            data: typename
        },
        grid: [{
            top: '12%',
            left: 60,
            right: 50,
            height: '100px'
        }, {
            left: 60,
            right: 50,
            top: '60%',
            height: '100px'
        }],
        xAxis: [{
            type: 'time',
            splitLine: {
                show: false
            },
            min: mint,
            max: maxt
        }, {
            gridIndex: 1,
            type: 'time',
            splitLine: {
                show: false
            }
        }],
        yAxis: [{
            type: 'value',
            name: unit[0],
            nameLocation: "start",
            inverse: true,
            max: (Math.max.apply(null, datamax2) * 1.2).toFixed(2) ? (Math.max.apply(null, datamax2) * 1.2).toFixed(2) : ""
        }, {
            gridIndex: 1,
            type: 'value',
            name: unit[1],
            // max: "1200"
            max: (Math.max.apply(null, datamax1) + 1).toFixed(2),
            min: (Math.min.apply(null, datamax1) - 1).toFixed(2)
        }],
        series: [
            {
                name: typename[0],
                type: 'bar',
                barWidth: '5px',
                stack: typename[0],
                itemStyle: {
                    normal: {
                        //color:'#009d89',
                        color: color[0],
                        lineStyle: {
                            color: color[0]
                        }
                    }
                },
                data: y_axis_data1
            },
            {
                name: typename[1],
                type: 'line',
                stack: typename[1],
                xAxisIndex: 1,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        //color:'#009d89',
                        color: color[1],
                        lineStyle: {
                            color: color[1]
                        }
                    }
                },
                data: y_axis_data2
            }
        ]
        // series:chartsData
    }
    // }
    //返回数据
    return echarts_option;
}

//显示报警按钮
function showWarnbtn(wstate, wtype) {
    if (wstate) {
        //报警状态
        return "<button type='button' class='btn btn-sm btn-warnning' onclick=showWarning('" + outRepeat(wtype) + "')>报警</button>";
    } else {
        //正常状态
        return "正常";
    }
}

//显示报警信息
function showWarning(data) {
    var wdata = "";
    var wdataarray = data.split(",");
    $.each(wdataarray, function (key, vlaue) {
        if (key == 0) {
            //显示报警状态
            wdata = vlaue;
        } else {
            //显示多个报警状态
            wdata = wdata + '</br>' + vlaue;
        }
    });
    if (true) {
        //显示报警状态
        $('.btn-warnning').popover('destroy');
        //显示报警状态位置
        $('.btn-warnning').popover({
            'placement': 'top',
            'html': true,
            'content': '<div style="margin: 10px;">' + wdata + '</div>'
        });
        $('.btn-warnning').popover('show');
    } else {
        $('.btn-warnning').popover('destroy');
    }
}

var map, element, map2;

//判断经纬度合法性，不可为空
function CheckLatLong2(lon, lat) {
    var flag1 = false, flag2 = false;
    if (lat != null && lat != "") {
        var intlat = parseFloat(lat);
        if (intlat >= -90 && intlat <= 90)
            flag1 = true;
    }
    if (lon != null && lon != "") {
        var intlon = parseFloat(lon);
        if (intlon >= -180 && intlon <= 180)
            flag2 = true;
    }
    return (flag1 && flag2);
}


//地图初始化
function initGisMap(lon, lat) {
//添加图层
    var imageExtent = [ol.proj.fromLonLat([108.21607668816489, 35.4357332922735])[0], ol.proj.fromLonLat([108.35202556272164, 35.408828346410004])[1], ol.proj.fromLonLat([108.34619918238347, 35.34865539649964])[0], ol.proj.fromLonLat([108.21996094172366, 35.34707129189964])[1]];

    var layers = [
        new ol.layer.Tile({
            zIndex: 1,
            source: new ol.source.TileWMS({
                crossOrigin: true,
                url: serverConfig.gisMapUrl,
                params: { LAYERS: 'xianyangmap:xianyangmap', VERSION: '1.1.1' }
                //各图层layers参数
                //地形 xianyangmap:xianyangdem
                //水系 xianyangmap:shuixi
                //河流 xianyangmap:hydln
                //公路 xianyangmap:road
                //村庄 xianyangmap:village
                //乡镇 xianyangmap:countypt
                //区县 xianyangmap:respt0
                //底图 xianyangmap:xianyangmap
            })
        }),
        //水系图层
        new ol.layer.Tile({
            zIndex: 2,
            source: new ol.source.TileWMS({
                crossOrigin: true,
                url: serverConfig.gisMapUrl,
                params: { LAYERS: "xianyangmap:shuixi", VERSION: '1.1.1' }
            })
        }),
        //河流图层
        new ol.layer.Tile({
            zIndex: 5,
            source: new ol.source.TileWMS({
                crossOrigin: true,
                url: serverConfig.gisMapUrl,
                params: { LAYERS: "xianyangmap:hydln", VERSION: '1.1.1' }
            })
        }),
        //设置地市图层
        new ol.layer.Tile({
            zIndex: 4,
            source: new ol.source.TileWMS({
                crossOrigin: true,
                url: serverConfig.gisMapUrl,
                params: { LAYERS: "xianyangmap:shuixi", VERSION: '1.1.1' }
            })
        }),
        //设置区县图层
        new ol.layer.Tile({
            zIndex: 6,
            source: new ol.source.TileWMS({
                crossOrigin: true,
                url: serverConfig.gisMapUrl,
                params: { LAYERS: "xianyangmap:respt0", VERSION: '1.1.1' }
            })
        }),
        //设置乡镇图层
        new ol.layer.Tile({
            zIndex: 7,
            source: new ol.source.TileWMS({
                crossOrigin: true,
                url: serverConfig.gisMapUrl,
                params: { LAYERS: "xianyangmap:countypt", VERSION: '1.1.1' }
            })
        }),
        new ol.layer.Image({
            source: new ol.source.ImageStatic({
                url: '../../img/compass.png',
                // crossOrigin: '',
                projection: 'EPSG:28993',
                imageExtent: imageExtent,
                // projection: 'EPSG:3857',
                // imageExtent: ol.proj.fromLonLat([108.42, 34.88]),
            })
        })
    ];
    var controls = [
        new ol.control.Zoom()/*,
         new ol.control.ScaleLine({
         units: "metric" //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
         })*/
    ];
    var zoom = 19;
    if (window.screen.width <= 1366) {
        zoom -= 1;
    }
//创建地图
    map = new ol.Map({
        interactions: ol.interaction.defaults({
            doubleClickZoom: false,
            pinchRotate: false
        }),
        controls: controls,
        target: "map",
        layers: layers,
        view: new ol.View({
            center: ol.proj.fromLonLat([lon ? lon : 108.42, lat ? lat : 34.88]),
            zoom: zoom,
            zoomFactor: Math.SQRT2
        })
    });
//点击地图站点弹窗
    map.on('click', function (evt) {
        //alert(evt.pixel);
        console.log(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'));
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function (feature, layer) {
                return feature;
            });
        showPopover(feature);
    });

//点击地图站点弹窗
    map.on('pointermove', function (e) {
        if (e.dragging) {
            return;
        }

        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        if (hit) {
            document.body.style.cursor = "pointer";
        } else {
            document.body.style.cursor = "default";
        }
    });

//鼠标滚动地图缩放触发事件
    map.getView().on('change:resolution', function () {
        console.log(map.getView().getZoom());
        var zoom = map.getView().getZoom();
        // map.getOverlays().clear();
        // console.log(map.getLayers().length);
        map.getLayers().forEach(function (layer) {
            if (layer.getZIndex() > 10) {
                map.removeLayer(layer);
            }
        });
        // map.getLayers().forEach(function (layer) {
        //     if (layer.getZIndex() >10) {
        //         map.removeLayer(layer);
        //     }
        // });
        setWarningShow(warning_visable);
        // if(zoom>19.000000000000004&&zoom<=20.000000000000004){
        //     initStation(user,1);
        //     // map.getLayers().forEach(function (layer) {
        //     //     try {
        //     //         layer.getSource().forEachFeature(function (f) {
        //     //             if (f) {
        //     //                 f.setStyle(mousewheelMap(f, 10, 2))
        //     //             }
        //     //         });
        //     //     } catch (e) {
        //     //     }
        //     // });
        // }else {
        //     initStation(user,0);
        // }
        if (zoom <= 19.000000000000004) {
            $("#zoomSet i").text("中央报汛站");
            wheelData(0);
        }
        else if (zoom === 20.000000000000004) {
            $("#zoomSet i").text("中央报汛站/省级重点报汛站");
            wheelData(1);
            // setWarningShow(warning_visable);
            // showlayer($("#rainlstation_btn"), rainlstation_visable, 12);
            // showlayer($("#waterstation_btn"), waterstation_visable, 11);
            // showlayer($("#hydrologystation_btn"), hydrology_visable, 14);
            // showlayer($("#reservoirhydrology_btn"), hydrology_visable2, 15);
            // showlayer($("#soilstation_btn"), soilstation_visable, 13);
            // showlayer($("#floodstation_btn"), floodstation_visable, 16);
        } else if (zoom === 21.000000000000004) {
            $("#zoomSet i").text("中央报汛站/省级重点报汛站/省级一般报汛站");
            wheelData(2);
            // setWarningShow(warning_visable);
            // showlayer($("#rainlstation_btn"), rainlstation_visable, 12);
            // showlayer($("#waterstation_btn"), waterstation_visable, 11);
            // showlayer($("#hydrologystation_btn"), hydrology_visable, 14);
            // showlayer($("#reservoirhydrology_btn"), hydrology_visable2, 15);
            // showlayer($("#soilstation_btn"), soilstation_visable, 13);
            // showlayer($("#floodstation_btn"), floodstation_visable, 16);
        } else if (zoom === 22.000000000000004) {
            $("#zoomSet i").text("中央报汛站/省级重点报汛站/省级一般报汛站/其他报汛站");
            wheelData(3);
            // setWarningShow(warning_visable);
            // showlayer($("#rainlstation_btn"), rainlstation_visable, 12);
            // showlayer($("#waterstation_btn"), waterstation_visable, 11);
            // showlayer($("#hydrologystation_btn"), hydrology_visable, 14);
            // showlayer($("#reservoirhydrology_btn"), hydrology_visable2, 15);
            // showlayer($("#soilstation_btn"), soilstation_visable, 13);
            // showlayer($("#floodstation_btn"), floodstation_visable, 16);
        } else if (zoom >= 23.000000000000004) {
            $("#zoomSet i").text("中央报汛站/省级重点报汛站/省级一般报汛站/其他报汛站/山洪站");
            wheelData(4);
            // setWarningShow(warning_visable);
            // showlayer($("#rainlstation_btn"), rainlstation_visable, 12);
            // showlayer($("#waterstation_btn"), waterstation_visable, 11);
            // showlayer($("#hydrologystation_btn"), hydrology_visable, 14);
            // showlayer($("#reservoirhydrology_btn"), hydrology_visable2, 15);
            // showlayer($("#soilstation_btn"), soilstation_visable, 13);
            // showlayer($("#floodstation_btn"), floodstation_visable, 16);
        }
        // if (map.getView().getZoom() < 21.000000000000004) {
        //     map.getLayers().forEach(function (layer) {
        //         try {
        //             layer.getSource().forEachFeature(function (f) {
        //                 if (f) {
        //                     f.setStyle(mousewheelMap(f, 10, 2))
        //                 }
        //             });
        //         } catch (e) {
        //         }
        //     });
        // } else {
        //     map.getLayers().forEach(function (layer) {
        //         try {
        //             layer.getSource().forEachFeature(function (f) {
        //                 if (f) {
        //                     f.setStyle(mousewheelMap(f, 15, 1))
        //                 }
        //             });
        //         } catch (e) {
        //         }
        //     });
        // }
    });
    initzoom = map.getView().getZoom();
    initcenter = map.getView().getCenter();
}

//等值地图初始化
function initGisMap2() {
//添加图层
    var layer2s = [
        new ol.layer.Tile({
            zIndex: -1,
            source: new ol.source.TileWMS({
                crossOrigin: true,
                url: serverConfig.gisMapUrl,
                params: { LAYERS: "xianyangmap:isopolygon", VERSION: '1.1.1' }
            })
        })
    ];

    var control2s = [
        new ol.control.Zoom()
    ];

    //创建等值分析初始地图
    map2 = new ol.Map({
        target: "anlymap",
        controls: control2s,
        layers: layer2s,
        view: new ol.View({
            center: ol.proj.fromLonLat([108.82, 34.88]),
            zoom: 17,
            zoomFactor: Math.SQRT2
        })
    });


}


function mousewheelMap(f, ss, ss0) {
    var styles = [];
    var icon = "";
    var color = '#000';
    if (f.get("Type") === "雨量站") {
        icon = "rain"
    } else if (f.get("Type") === "河道水位站") {
        icon = "water";
    } else if (f.get("Type") === "河道水文站") {
        icon = "hydrology";
    } else if (f.get("Type") === "水库水文站") {
        icon = "hydrology";
    } else if (f.get("Type") === "墒情站") {
        color = '#f00';
        icon = "soil";
    }
    if (ss0 == 1) {
        var iconStyle = new ol.style.Icon({
            src: "../../img/" + icon + ".png",
        });
        var textStyle = new ol.style.Text({
            offsetY: 15,
            font: ss + 'px 微软雅黑',
            text: f.get("Name") + f.get("Remark"),
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        });

        styles.push(new ol.style.Style({
            image: iconStyle,
            text: textStyle
        }));
        return styles;
    } else if (ss0 == 2) {
        var iconStyle = new ol.style.Icon({
            src: "../../img/" + icon + "_s.png",
        });
        var textStyle = new ol.style.Text({
            offsetY: 15,
            font: ss + 'px 微软雅黑',
            text: f.get("Name") + f.get("Remark"),
            fill: new ol.style.Fill({
                color: color
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 3
            })
        });
        styles.push(new ol.style.Style({
            image: iconStyle,
            text: textStyle
        }));
        return styles;
    }
}

//获取前天当天和明天时间函数
function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    return y + "-" + m + "-" + d;
}

//实时墒情数据表格加载
function initSoilTab(areaCode) {
    var st, et = "";
    var nowtt = new Date();
    if (nowtt.getHours() < 8) {
        st = GetDateStr(-1);
        et = GetDateStr(0)
        //alert(st);
    } else if (nowtt.getHours() >= 8) {
        st = GetDateStr(0);
        et = GetDateStr(1);
        //alert(et);
    }
    $("#d_soil .load-wrapp").removeClass("hidden");
    var obj = {
        Type: 'get',
        Uri: '/data/getmapdata',
        Parameter: {
            areaCode: areaCode,
            startTime: st + " 08:00:00",
            endTime: et + " 08:00:00"
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        console.log(data);
        if (data.success) {
            $("#d_soil .load-wrapp").addClass("hidden");
            var soilData = $.grep(data.data, function (d) {
                return (d.Datas != "" && d.Datas != null);
            });
            //console.log(data.data);
            var ttall = [];
            var filter = ["411A3100", "411A9050", "412A1100", "412A5200"];
            for (var i = 0; i < country.length; i++) {
                var tt = $.grep(soilData, function (d) {
                    return d.Station.AreaName == country[i] && d.Station.AreaName !== "杨陵示范区" && d.Station.AreaName !== "宝鸡市渭滨区"
                });
                for (var a = 0; a < tt.length; a++) {
                    if (filter.indexOf(tt[a]["Station.Code"]) > -1) {
                        ttall.push(tt[a]);
                    }
                }
            }
            //加载墒情表格数据
            var soilmoisturetable = $('#soilmoisture_table').DataTable({
                language: reportLanguage1,
                lengthChange: false,
                "bDestroy": true,
                "aaData": ttall,
                "bAutoWidth": false,
                "bSort": false,
                "paging": false,
                "searching": true,//是否显示搜索框
                "aaSorting": [[0, "asc"]],
                "columns": [
                    { "data": "Station.AreaName" },
                    { "data": "Station.Code" },
                    { "data": "Station.Name" },
                    {
                        "data": "Datas",
                        "render": function (data, type, row, meta) {
                            if (data.length > 0) {
                                return data[4].Time.replace('T', " ");
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "data": "Datas",
                        "render": function (data, type, row, meta) {
                            if (data.length > 0) {
                                return data[4].Value;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "data": "Datas",
                        "render": function (data, type, row, meta) {
                            if (data.length > 0) {
                                return data[5].Value;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "data": "Datas",
                        "render": function (data, type, row, meta) {
                            if (data.length > 0) {
                                return data[6].Value;
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "data": "Datas",
                        "render": function (data, type, row, meta) {
                            if (data.length > 0) {
                                return data[7].Value;
                            } else {
                                return "";
                            }
                        }
                    }
                ]
            });
        } else {
            //显示错误信息
            layer.msg(data.message, { time: 3000 });
            $("#d_soil .load-wrapp").addClass("hidden");
        }
    });


    //实时墒情
    var objSoil = {
        Type: 'post',
        Uri: '/data/getsoilreport',
        Parameter: {
            "AreaCode": areaCode,
            "StartTime": st + " 08:00:00",
            "EndTime": et + " 08:00:00"
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(objSoil)
    }).done(function (data) {
        if (data.success) {
            //console.log("m"+data);
            var l1 = [], l2 = [], l3 = [], l4 = [], l5 = [], nulldata = [];
            var filter = ["411A3100", "411A9095", "412A1100", "412A5200"];
            if (data.data.Level1Data.length > 0) {
                $.each(data.data.Level1Data, function (i, v) {
                    if (filter.indexOf(v.Code) > -1) {
                        l1.push(v)
                    }
                })
            }
            if (data.data.Level2Data.length > 0) {
                $.each(data.data.Level2Data, function (i, v) {
                    if (filter.indexOf(v.Code) > -1) {
                        l2.push(v)
                    }
                })
            }
            if (data.data.Level3Data.length > 0) {
                $.each(data.data.Level3Data, function (i, v) {
                    if (filter.indexOf(v.Code) > -1) {
                        l3.push(v)
                    }
                })
            }
            if (data.data.Level4Data.length > 0) {
                $.each(data.data.Level4Data, function (i, v) {
                    if (filter.indexOf(v.Code) > -1) {
                        l4.push(v)
                    }
                })
            }
            if (data.data.Level5Data.length > 0) {
                $.each(data.data.Level5Data, function (i, v) {
                    if (filter.indexOf(v.Code) > -1) {
                        l5.push(v)
                    }
                })
            }
            if (data.data.NullData.length > 0) {
                $.each(data.data.NullData, function (i, v) {
                    if (filter.indexOf(v.Code) > -1) {
                        nulldata.push(v)
                    }
                })
            }
            var soil_data = [
                {
                    "id": 1,
                    "magnitude": "相对湿度均值（%）大于60的测站数量",
                    "amount": l1.length,
                    "content": l1
                },
                {
                    "id": 2,
                    "magnitude": "相对湿度均值（%）在50 - 60之间的测站数量",
                    "amount": l2.length,
                    "content": l2
                },
                {
                    "id": 3,
                    "magnitude": "相对湿度均值（%）在40 - 50之间的测站数量",
                    "amount": l3.length,
                    "content": l3
                },
                {
                    "id": 4,
                    "magnitude": "相对湿度均值（%）在30 - 40之间的测站数量",
                    "amount": l4.length,
                    "content": l4
                },
                {
                    "id": 5,
                    "magnitude": "相对湿度均值（%）小于30的测站数量",
                    "amount": l5.length,
                    "content": l5
                },
                {
                    "id": 6,
                    "magnitude": "未上报数据的测站数量",
                    "amount": nulldata.length,
                    "content": nulldata
                }
            ];
            //实时墒情旱级统计
            var droughtstatisticstable = $('#drought_statistics_table').DataTable({
                language: reportLanguage,
                lengthChange: false,
                "paging": false,
                //"iDisplayLength": 5,
                // "aaData": drought_statistics_data,
                "aaData": soil_data,
                "bAutoWidth": false,
                "bSort": false,
                "bDestroy": true,
                "searching": false,//是否显示搜索框
                "columns": [
                    {
                        "class": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    { "data": "magnitude" },
                    { "data": "amount" }
                ]
            });
            //实时墒情旱级统计点击展示子表格
            $('#drought_statistics_table tbody').on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = droughtstatisticstable.row(tr);
                if (row.child.isShown()) {
                    // This row is already open - close it
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    if (row.data().id == 6) {
                        row.child(formatNull(row.data(), 'soil')).show();
                    } else {
                        row.child(format(row.data(), 'soil')).show();
                    }
                    tr.addClass('shown');
                }
            });
        } else {
            layer.msg(data.message);
        }
    });
}


//实时雨情（雨情）数据表格加载
function initRainTab(areaCode) {
    // $("#rianfall_table").addClass("hidden");
    var st, et = "";
    var nowtt = new Date();
    if (nowtt.getHours() < 8) {
        st = GetDateStr(-1);
        et = GetDateStr(0)
        //alert(st);
    } else if (nowtt.getHours() >= 8) {
        st = GetDateStr(0);
        et = GetDateStr(1);
        //alert(et);
    }
    //加载条显示
    $("#d_rain .load-wrapp").removeClass("hidden");
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainControl/loadNowRainData',
        Parameter: {
            "rainCount.adcd": areaCode,
            // "rainCount.startTm": "2017-05-11 08:00:00",
            // "rainCount.endTm": "2017-10-11 08:00:00"
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj),
        beforeSend: function (request) {
            $("#d_rain .load-wrapp").removeClass("hidden");
        }
    }).done(function (data) {
        //实时雨情
        //console.log(data);
        if (data.data !== null) {
            if (data.success) {
                if (data.data.length !== 0) {
                    var rianfallData = $.grep(data.data, function (d) {
                        return (d.tm != "" && d.tm != null );
                    });
                    var rainfallData2 = $.grep(rianfallData, function (d) {
                        return d.frgrd == "1" || d.frgrd == "2" || d.frgrd == "3"
                    })
                    //加载条隐藏
                    $("#d_rain .load-wrapp").addClass("hidden");
                    // $("#rianfall_table").removeClass("hidden");
                    //雨情数据表格
                    var ttall = [];
                    for (var i = 0; i < country.length; i++) {
                        var tt = $.grep(rainfallData2, function (d) {
                            return d.addvnm == country[i]
                        });
                        for (var a = 0; a < tt.length; a++) {
                            if (tt[a].stcd == "41101100" || tt[a].stcd == "41101000" || tt[a].stcd == "411A3100") {
                                ttall.push(tt[a]);
                            }
                        }
                    }
                    // var ttttt=allArray.sort(function(a, b) {
                    //     return b.drp - a.drp;
                    // });
                    var rianfall_table = $('#rianfall_table').DataTable({
                        language: reportLanguage1,
                        lengthChange: false,
                        "bDestroy": true,
                        "aaData": default2(ttall),
                        "bAutoWidth": false,
                        "paging": false,
                        "bSort": false,
                        "searching": true,//是否显示搜索框
                        "aaSorting": [[5, "desc"]],
                        "columns": [
                            { "data": "addvnm" },
                            { "data": "stcd" },
                            { "data": "stnm" },
                            { "data": "hnnm" },
                            { "data": "rvnm" },
                            { "data": "tm" },
                            {
                                "data": "drp",
                                // "render": function (data, type, row, meta) {
                                //     if (data.length > 0) {
                                //         return data
                                //     } else {
                                //         return 0
                                //     }
                                // }
                                "render": function (data, type, row, meta) {
                                    return rainData(data);
                                }
                            },
                            {
                                "data": "top1",
                                "render": function (data, type, row, meta) {
                                    return rainData(data);
                                }
                            }
                        ]
                    });
                } else {
                    layer.msg("无数据！");
                }
            } else {
                //显示报错信息
                layer.msg(data.message, { time: 3000 });
                $("#d_rain .load-wrapp").addClass("hidden");
                $("#rianfall_table").removeClass("hidden");
            }
        } else {
            layer.msg("查不到相关雨情数据！", { time: 3000 });
            $("#d_rain .load-wrapp").addClass("hidden");
            $("#rianfall_table").removeClass("hidden");
        }

    });
    //实时雨情量级统计
    var objRain = {
        Type: 'get',
        Uri: '/aControl/RainReportControl/getRainCountReport',
        Parameter: {
            "rainCount.adcd": areaCode,
            "rainCount.startTm": st + " 08:00:00",
            "rainCount.endTm": et + " 08:00:00"
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(objRain)
    }).done(function (data) {
        if (data.success) {
            console.log(data);
            var obj = {
                Type: 'get',
                Uri: '/station/getmapstation',
                Parameter: {
                    areaCode: user.AreaCode
                }
            };
            $.ajax({
                url: serverConfig.soilApi,
                data: JSON.stringify(obj)
            }).done(function (data1) {
                var bcm250 = [], cm250 = [], cm100 = [], cm50 = [], cm25 = [], cm10 = [], nullData = [];
                stationListRainstatics = $.grep(data1.data, function (d) {
                    return (d.Level !== "其它报汛站" && d.Level !== "山洪站" && (d.Type === "雨量站" || d.Type === "河道水文站" || d.Type === "河道水位站" || d.Type === "水库水文站"))
                });
                $.each(stationListRainstatics, function (i, v) {
                    stationListRainstatics_s.push(v.Code)
                });
                for (var i = 0; i < data.data.bcm250.length; i++) {
                    if (stationListRainstatics_s.indexOf(data.data.bcm250[i].stcd) > -1) {
                        // if (data.data.bcm250[i].stcd == "41101100" || data.data.bcm250[i].stcd == "41101000" || data.data.bcm250[i].stcd == "411A3100") {
                        bcm250.push(data.data.bcm250[i]);
                        // }
                    }
                }
                for (var i = 0; i < data.data.cm250.length; i++) {
                    if (stationListRainstatics_s.indexOf(data.data.cm250[i].stcd) > -1) {
                        //if (data.data.cm250[i].stcd == "41101100" || data.data.cm250[i].stcd == "41101000" || data.data.cm250[i].stcd == "411A3100") {
                        cm250.push(data.data.cm250[i]);
                        // }
                    }
                }
                for (var i = 0; i < data.data.cm100.length; i++) {
                    if (stationListRainstatics_s.indexOf(data.data.cm100[i].stcd) > -1) {
                        //if (data.data.cm100[i].stcd == "41101100" || data.data.cm100[i].stcd == "41101000" || data.data.cm100[i].stcd == "411A3100") {
                        cm100.push(data.data.cm100[i]);
                        // }
                    }
                }
                for (var i = 0; i < data.data.cm50.length; i++) {
                    if (stationListRainstatics_s.indexOf(data.data.cm50[i].stcd) > -1) {
                        //if (data.data.cm50[i].stcd == "41101100" || data.data.cm50[i].stcd == "41101000" || data.data.cm50[i].stcd == "411A3100") {
                        cm50.push(data.data.cm50[i]);
                        ///}
                    }
                }
                for (var i = 0; i < data.data.cm25.length; i++) {
                    if (stationListRainstatics_s.indexOf(data.data.cm25[i].stcd) > -1) {
                        // if (data.data.cm25[i].stcd == "41101100" || data.data.cm25[i].stcd == "41101000" || data.data.cm25[i].stcd == "411A3100") {
                        cm25.push(data.data.cm25[i]);
                        //}
                    }
                }
                for (var i = 0; i < data.data.cm10.length; i++) {
                    if (stationListRainstatics_s.indexOf(data.data.cm10[i].stcd) > -1) {
                        //if (data.data.cm10[i].stcd == "41101100" || data.data.cm10[i].stcd == "41101000" || data.data.cm10[i].stcd == "411A3100") {
                        cm10.push(data.data.cm10[i]);
                        //}
                    }
                }
                for (var i = 0; i < data.data.nullData.length; i++) {
                    if (stationListRainstatics_s.indexOf(data.data.nullData[i].stcd) > -1) {
                        //if (data.data.nullData[i].stcd == "41101100" || data.data.nullData[i].stcd == "41101000" || data.data.nullData[i].stcd == "411A3100") {
                        nullData.push(data.data.nullData[i]);
                        //}
                    }
                }

                //实时雨情量级统计数据
                var statistics_data = [
                    {
                        "id": 1,
                        "magnitude": "日累计降雨量大于250mm的测站数量",
                        "amount": bcm250.length,
                        "content": bcm250
                    },
                    {
                        "id": 2,
                        "magnitude": "日累计降雨量在100 - 250mm之间的测站数量",
                        "amount": cm250.length,
                        "content": cm250
                    },
                    {
                        "id": 3,
                        "magnitude": "日累计降雨量在50- 100mm之间的测站数量",
                        "amount": cm100.length,
                        "content": cm100
                    },
                    {
                        "id": 4,
                        "magnitude": "日累计降雨量在25 - 50mm之间的测站数量",
                        "amount": cm50.length,
                        "content": cm50
                    },
                    {
                        "id": 5,
                        "magnitude": "日累计降雨量在10 - 25mm之间的测站数量",
                        "amount": cm25.length,
                        "content": cm25
                    },
                    {
                        "id": 6,
                        "magnitude": "日累计降雨量小于10mm的测站数量",
                        "amount": cm10.length,
                        "content": cm10
                    },
                    {
                        "id": 7,
                        "magnitude": "未上报数据的测站数量",
                        "amount": nullData.length,
                        "content": nullData
                    }
                ];
                //实时雨情量级统计数据表
                var statistics_table = $('#statistics_table').DataTable({
                    language: reportLanguage1,
                    lengthChange: false,
                    "bPaginate": false,
                    // "iDisplayLength": 5,
                    "paging": false,
                    "aaData": statistics_data,
                    "bAutoWidth": false,
                    "bSort": false,
                    "bInfo": false,
                    "bDestroy": true,
                    "searching": false,//是否显示搜索框
                    //"aaSorting": [[2, "asc"]],
                    "columns": [
                        {
                            "class": 'details-control',
                            "orderable": false,
                            "data": null,
                            "defaultContent": ''
                        },
                        { "data": "magnitude" },
                        { "data": "amount" }
                    ]
                });
                //实时雨情量级统计数据表点击方法
                $('#statistics_table tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = statistics_table.row(tr);
                    if (row.child.isShown()) {
                        row.child.hide();
                        tr.removeClass('shown');
                    }
                    else {
                        if (row.data().id == 9) {
                            row.child(formatNull(row.data(), 'rain')).show();
                        } else {
                            row.child(format(row.data(), 'rain')).show();
                        }
                        tr.addClass('shown');
                    }
                });
            })
        } else {
            layer.msg(data.message);
        }
    });

    //实时雨情统计
    // var objRainSit = {
    //     Type: 'get',
    //     Uri: '/aControl/RainControl/countDataByAdcdType',
    //     Parameter: {
    //         "rainCount.adcd": areaCode,
    //         "rainCount.startTm": "2018-10-01 08:00:00",
    //         "rainCount.endTm": "2018-10-17 08:00:00",
    //         // "rainCount.startTm": st + " 08:00:00",
    //         // "rainCount.endTm": et + " 08:00:00"
    //     }
    // };
    // $.ajax({
    //     url: serverConfig.rainfallfloodApi,
    //     data: JSON.stringify(objRainSit)
    // }).done(function (data) {
    //     if (data.success) {
    //         console.log(data.data);
    //         var newData = [];
    //         var isNotNullDrp;
    //         $.each(data.data, function (key, obj) {
    //             isNotNullDrp = false;
    //             $.each(obj.stationList, function (key2, obj2) {
    //                 if (obj2.drp !== '') {
    //                     isNotNullDrp = true;
    //                     return;
    //                 }
    //                 ;
    //             });
    //             if (isNotNullDrp) {
    //                 newData.push(obj);
    //             }
    //         });
    //         console.log(newData);
    //
    //         var water_regimen = $('#water_regimen').DataTable({
    //             language: reportLanguage1,
    //             lengthChange: false,
    //             "bDestroy": true,
    //             "aaData": newData,
    //             "bAutoWidth": false,
    //             "bSort": false,
    //             "paging": false, // 取消分页
    //             "searching": false,//是否显示搜索框
    //             "aaSorting": [[0, "asc"]],
    //             "columns": [
    //                 {
    //                     "data": "addvnm",
    //                     // "class": 'df'
    //                 },
    //                 {
    //                     "class": 'avg',
    //                     render: function (data, type, row) {
    //                         var source = JSON.stringify(row).replace(/\"/g, "'");
    //                         console.log(data);
    //                         var showNull = false;
    //                         var drpAll = 0;
    //                         var drpCount = 0;
    //                         $.each(row.stationList, function (key, obj) {
    //
    //                             if (obj.drp !== '') {
    //                                 showNull = true;
    //                                 drpAll += Math.floor(obj.drp) / 10;
    //                                 drpCount += 1;
    //                             }
    //                         });
    //                         if (showNull) {
    //                             var showValue;
    //                             if (drpAll == 0) {
    //                                 return "0";
    //                             } else if (drpAll < 1 && drpAll > 0) {
    //                                 return "0.1";
    //                             } else {
    //                                 return (drpAll / drpCount).toFixed(1);
    //                             }
    //                         } else {
    //                             return "";
    //                         }
    //                     }
    //                 },
    //                 {
    //
    //                     render: function (data, type, row) {
    //                         // var source = JSON.stringify(row).replace(/\"/g, "'");
    //                         if (row.addvnm !== "咸阳市") {
    //                             return row.stationList[0].stnm
    //                         } else {
    //                             return row.stationList[0].addvnm
    //                         }
    //
    //                     }
    //                 },
    //                 {
    //                     "class": 'avg',
    //                     render: function (data, type, row) {
    //                         // var source = JSON.stringify(row).replace(/\"/g, "'");
    //                         return row.stationList[0].drp
    //                     }
    //                 },
    //                 {
    //                     render: function (data, type, row) {
    //                         // var source = JSON.stringify(row).replace(/\"/g, "'");
    //                         if (row.stationList.length == 1) {
    //                             return ""
    //                         } else {
    //                             if (row.stationList[1].drp !== "") {
    //                                 if (row.addvnm !== "咸阳市") {
    //                                     return row.stationList[1].stnm;
    //                                 } else {
    //                                     return row.stationList[1].addvnm;
    //                                 }
    //                             } else {
    //                                 return "";
    //                             }
    //                         }
    //                     }
    //                 },
    //                 {
    //                     "class": 'avg',
    //                     render: function (data, type, row) {
    //                         // var source = JSON.stringify(row).replace(/\"/g, "'");
    //                         if (row.stationList.length == 1) {
    //                             return ""
    //                         } else {
    //                             return row.stationList[1].drp
    //                         }
    //                     }
    //                 }
    //             ]
    //         });
    //     }
    // })

}

function raintongji(areaCode) {
    var st, et = "";
    var nowtt = new Date();
    if (nowtt.getHours() < 8) {
        st = GetDateStr(-1);
        et = GetDateStr(0)
        //alert(st);
    } else if (nowtt.getHours() >= 8) {
        st = GetDateStr(0);
        et = GetDateStr(1);
        //alert(et);
    }
    $("#d_rain .load-wrapp").removeClass("hidden");
    var objRainSit = {
        Type: 'get',
        Uri: '/aControl/RainControl/countDataByAdcdType',
        Parameter: {
            "rainCount.adcd": areaCode,
            // "rainCount.startTm": "2018-01-01 08:00:00",
            // "rainCount.endTm": "2018-10-17 08:00:00",
            "rainCount.startTm": st + " 08:00:00",
            "rainCount.endTm": et + " 08:00:00"
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(objRainSit)
    }).done(function (data) {
        if (data.success) {
            console.log(data.data);
            $("#d_rain .load-wrapp").addClass("hidden");
            var newData = [];
            var isNotNullDrp;
            $.each(data.data, function (key, obj) {
                isNotNullDrp = false;
                $.each(obj.stationList, function (key2, obj2) {
                    if (obj2.drp !== '') {
                        isNotNullDrp = true;
                        return;
                    }
                    ;
                });
                if (isNotNullDrp) {
                    newData.push(obj);
                }
            });
            console.log(newData);

            var water_regimen = $('#water_regimen').DataTable({
                language: reportLanguage1,
                lengthChange: false,
                "bDestroy": true,
                "aaData": newData,
                "bAutoWidth": false,
                "bSort": false,
                "paging": false, // 取消分页
                "searching": false,//是否显示搜索框
                "aaSorting": [[0, "asc"]],
                "columns": [
                    {
                        "data": "addvnm",
                        // "class": 'df'
                    },
                    {
                        "class": 'avg',
                        render: function (data, type, row) {
                            var source = JSON.stringify(row).replace(/\"/g, "'");
                            console.log(data);
                            var showNull = false;
                            var drpAll = 0;
                            var drpCount = 0;
                            $.each(row.stationList, function (key, obj) {

                                if (obj.drp !== '') {
                                    showNull = true;
                                    drpAll += Math.floor(obj.drp) / 10;
                                    drpCount += 1;
                                }
                            });
                            if (showNull) {
                                var showValue;
                                if (drpAll == 0) {
                                    return "0";
                                } else if (drpAll < 1 && drpAll > 0) {
                                    return "0.1";
                                } else {
                                    return (drpAll / drpCount).toFixed(1);
                                }
                            } else {
                                return "";
                            }
                        }
                    },
                    {

                        render: function (data, type, row) {
                            // var source = JSON.stringify(row).replace(/\"/g, "'");
                            if (row.addvnm !== "咸阳市") {
                                return row.stationList[0].stnm
                            } else {
                                return row.stationList[0].addvnm
                            }

                        }
                    },
                    {
                        "class": 'avg',
                        render: function (data, type, row) {
                            // var source = JSON.stringify(row).replace(/\"/g, "'");
                            return row.stationList[0].drp
                        }
                    },
                    {
                        render: function (data, type, row) {
                            // var source = JSON.stringify(row).replace(/\"/g, "'");
                            if (row.stationList.length == 1) {
                                return ""
                            } else {
                                if (row.stationList[1].drp !== "") {
                                    if (row.addvnm !== "咸阳市") {
                                        return row.stationList[1].stnm;
                                    } else {
                                        return row.stationList[1].addvnm;
                                    }
                                } else {
                                    return "";
                                }
                            }
                        }
                    },
                    {
                        "class": 'avg',
                        render: function (data, type, row) {
                            // var source = JSON.stringify(row).replace(/\"/g, "'");
                            if (row.stationList.length == 1) {
                                return ""
                            } else {
                                return row.stationList[1].drp
                            }
                        }
                    }
                ]
            });
        }
    })
}

//实时水情(河道水情)数据表格加载
function initWaterTab(areaCode) {
    // $("#river_table").addClass("hidden");
    //加载条显示
    $("#d_water .load-wrapp").removeClass("hidden");
    var obj = {
        Type: 'get',
        Uri: '/aControl/RiverControl/riverWaterNow',
        Parameter: {
            "waterInfo.adcd": areaCode,
            "waterInfo.startTm": GetDateStr(0) + " 00:00:00",
            "waterInfo.endTm": GetDateStr(1) + " 23:59:59"
            // "waterInfo.startTm": "2017-06-04 00:00:00",
            // "waterInfo.endTm": "2018-06-04 23:59:59"
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            //加载条隐藏
            var data0 = $.grep(data.data, function (d) {
                return d.code !== "610303" && d.code !== "610304" && d.code !== "610326"
            })
            $("#d_water .load-wrapp").addClass("hidden");
            var riverfallData = $.grep(data0, function (d) {
                return (d.tm != "" && d.tm != null);
            });
            var ttall = [];
            for (var i = 0; i < country.length; i++) {
                var tt = $.grep(riverfallData, function (d) {
                    return d.name == country[i]
                });
                for (var a = 0; a < tt.length; a++) {
                    if (tt[a].stcd == "41101100" || tt[a].stcd == "41101000" || tt[a].stcd == "411A3100") {
                        ttall.push(tt[a]);
                    }
                }
            }
            // ttall.sort(function (a,b) {
            //
            // });
            // $("#river_table").removeClass("hidden");
            //水情表格数据加载
            var river_table = $('#river_table').DataTable({
                language: reportLanguage1,
                lengthChange: false,
                "bDestroy": true,
                "aaData": default2(ttall),
                "bAutoWidth": false,
                "bSort": false,
                "paging": false, // 取消分页
                "searching": true,//是否显示搜索框
                "aaSorting": [[0, "asc"]],
                "columns": [
                    { "data": "name" },
                    { "data": "stcd" },
                    { "data": "stnm" },
                    { "data": "hnnm" },
                    { "data": "rvnm" },
                    {
                        "data": "tm",
                        "render": function (data, type, row, meta) {
                            if (!(data == null || data == undefined || data == '')) {
                                return data.substring(0, data.length - 2);
                            } else {
                                return "";
                            }
                        }
                    },
                    {
                        "data": "z",
                        "render": function (data, type, row, meta) {
                            return waterLevelData(data);
                        }
                    },
                    {
                        "data": "q",
                        "render": function (data, type, row, meta) {
                            return formatFlow(data);
                        }
                    },
                    {
                        "data": "wptn",
                        "render": function (data, type, row, meta) {
                            return showFlow(data);
                        }
                    },
                    {
                        "data": "wrq",
                        "render": function (data, type, row, meta) {
                            return flowDataw(data);
                        }
                    }
                    /* {
                     "data": "drp",
                     "render": function (data, type, row, meta) {
                     if (data.length > 0) {
                     return data
                     } else {
                     return 0
                     }
                     }
                     }*/
                ],
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                    if (aData.wrz !== "" && aData.wrz != null) {
                        if (aData.z > aData.wrz) {
                            $('td', nRow).css("color", "red");
                            return nRow;
                        }
                    }
                    // //console.log(aData);
                }
            });
        } else {
            //显示错误提示
            layer.msg(data.message, { time: 3000 });
            //加载条隐藏
            $("#d_water .load-wrapp").addClass("hidden");
            $("#river_table").removeClass("hidden");
        }
    })
}

//实时水情(水库水情)数据表格加载
function initReservoirTab(areaCode) {
    //实时水情(水库水情)数据表格加载条显示
    // $("#reservoir_table").addClass("hidden");
    $("#d_water .load-wrapp").removeClass("hidden");
    //中间服务接口参数
    var obj = {
        Type: 'get',
        Uri: '/aControl/RsvrControl/rsvrWaterNow',
        Parameter: {
            "waterInfo.adcd": areaCode,
            "waterInfo.startTm": GetDateStr(0) + " 00:00:00",
            "waterInfo.endTm": GetDateStr(1) + " 23:59:59"
            // "waterInfo.startTm": "2017-01-01 00:00:00",
            // "waterInfo.endTm":"2018-10-01 23:59:59"
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            //加载条消失
            //console.log(data.data);
            $("#d_water .load-wrapp").addClass("hidden");
            // $("#reservoir_table").removeClass("hidden");
            var reservoirData = $.grep(data.data, function (d) {
                return (d.tm != "" && d.tm != null);
            });
            //水库水情报个加载
            var ttall = [];
            for (var i = 0; i < country.length; i++) {
                var tt = $.grep(reservoirData, function (d) {
                    return d.name == country[i]
                });
                for (var a = 0; a < tt.length; a++) {
                    ttall.push(tt[a]);
                }
            }
            var reservoir_table = $('#reservoir_table').DataTable({
                language: reportLanguage1,
                lengthChange: false,
                "bDestroy": true,
                "aaData": default2(ttall),
                "bAutoWidth": false,
                "bPaginate": false,
                "bSort": false,
                "searching": true,//是否显示搜索框
                "aaSorting": [[5, "desc"]],
                "columns": [
                    { "data": "name" },
                    { "data": "stcd" },
                    { "data": "stnm" },
                    { "data": "hnnm" },
                    { "data": "rvnm" },
                    {
                        "data": "tm",
                        "render": function (data, type, row, meta) {
                            if (!(data == null || data == undefined || data == '')) {
                                return data.substring(0, data.length - 2);
                            } else {
                                return "";
                            }
                        }
                    },
                    { "data": "rz" },
                    {
                        "data": "inq",
                        "render": function (data, type, row, meta) {
                            return formatFlow(data);
                        }
                    },
                    {
                        "data": "otq",
                        "render": function (data, type, row, meta) {
                            return formatFlow(data);
                        }
                    },
                    { "data": "w" },
                    { "data": "fsltdz" }
                ],
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                    if (aData.wrz !== "" && aData.wrz != null) {
                        if (aData.z > aData.wrz) {
                            $('td', nRow).css("color", "red");
                            return nRow;
                        }
                    }
                    // //console.log(aData);
                }
            });
        } else {
            //显示数据加载错误信息
            layer.msg(data.message, { time: 3000 });
            $("#d_water .load-wrapp").addClass("hidden");
            // $("#reservoir_table").removeClass("hidden");
        }
    });

    //关注河道水情最新数据
    var obj2 = {
        Type: 'get',
        Uri: '/aControl/RiverControl/riverWaterNow',
        Parameter: {
            "waterInfo.stcd": "41106300,41110100,41200900,41205200,41201100"
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj2)
    }).done(function (data) {
        if (data.success) {
            console.log(data.data);
            var water_situation_table = $('#water_situation_table').DataTable({
                language: reportLanguage1,
                lengthChange: false,
                "bDestroy": true,
                "aaData": data.data,
                "bAutoWidth": false,
                "bSort": false,
                "paging": false, // 取消分页
                "searching": false,//是否显示搜索框
                "aaSorting": [[0, "asc"]],
                "columns": [
                    { "data": "stnm" },
                    { "data": "tm" },
                    {
                        "data": "z",
                        "render": function (data, type, row, meta) {
                            return waterLevelData(data);
                        }
                    },
                    {
                        "data": "q",
                        "render": function (data, type, row, meta) {
                            return formatFlow(data);
                        }
                    },
                    {
                        "data": "wptn",
                        "render": function (data, type, row, meta) {
                            return showFlow(data);
                        }
                    },
                ]
            });
        }
    })
}

//判断站点类型
function getStationtype(data) {
    var stationtype_data;
    switch (data) {
        //水文站
        case '河道水位站':
            stationtype_data = {
                typename: ['雨量', '水位', '流量', '水势'],
                dataunit: ['雨量（mm）', '水位（m）', '流量（m³/s）', '水势'],
                color: ['#00b4cf', '#e75816'],
                icon: 'water',
                zindex: 11,
                datasource: map_Waterlevelstation_data
            };
            break;
        //雨量站
        case '雨量站':
            stationtype_data = {
                typename: ['雨量'],
                dataunit: ['累计雨量（mm）'],
                color: '#00b4cf',
                icon: 'rain',
                zindex: 12,
                datasource: map_Rainlstation_data
            };
            break;
        //墒情站
        case '墒情站':
            stationtype_data = {
                typename: ['10cm', '20cm', '40cm', '均值'],
                dataunit: ['相对湿度（%）'],
                color: ['#f8b500', '#e8c76d', '#c9b88b', '#745500'],
                icon: 'soil',
                zindex: 13,
                datasource: map_Soilstation_data
            };
            break;
        //水文站
        case '河道水文站':
            stationtype_data = {
                typename: ['雨量', '水位', '流量', '水势'],
                dataunit: ['雨量（mm）', '水位（m）', '流量（m³/s）', '水势'],
                color: ['#00b4cf', '#e75816'],
                icon: 'hydrology',
                zindex: 14,
                datasource: map_Hydrologystation_data
            };
            break;
        case '水库水文站':
            stationtype_data = {
                typename: ['雨量', '水位'],
                dataunit: ['雨量（mm）', '水位（m）'],
                color: ['#00b4cf', '#e75816'],
                icon: 'water',
                zindex: 11,
                datasource: map_Hydrologystation_data2
            };
            break;
    }
    return stationtype_data;
}

//设置点击站点弹窗
var showPopover = function (feature) {
    if (feature) {
        //获取站点编码
        var s, e = "";
        var nowt = new Date();
        if (nowt.getHours() < 8) {
            s = GetDateStr(-1);
            e = GetDateStr(0)
            //alert(st);
        } else if (nowt.getHours() >= 8) {
            s = GetDateStr(0);
            e = GetDateStr(1);
            //alert(et);
        }
        var deviceid = feature.get("Code"),
            deviceTp = feature.get("Type"),
            obj, obj2;
        if (deviceTp == "河道水文站" || deviceTp == "河道水位站" || deviceTp == "水库水文站") {
            //水位数据
            var rry, rr;
            obj = {
                Type: 'get',
                Uri: '/data/getdata',
                Parameter: {
                    code: deviceid,
                    startTime: GetDateStr(0) + " 00:00:00",
                    endTime: GetDateStr(1) + " 23:59:59"
                    // startTime: "2016-04-01 08:00:00",
                    // endTime: "2019-01-01 08:00:00"
                }
            };
            //根据编码获取相关站点的信息
            $.ajax({
                url: serverConfig.soilApi,
                data: JSON.stringify(obj)
            }).done(function (data) {
                if (data.success) {
                    console.log(data);
                    //弹窗表格方法
                    rr = data;
                    obj2 = {
                        Type: 'get',
                        Uri: '/data/getdata',
                        Parameter: {
                            code: deviceid,
                            startTime: s + " 08:00:00",
                            endTime: e + " 08:00:00"
                            // startTime: "2016-04-01 08:00:00",
                            // endTime: "2019-01-01 08:00:00"
                        }
                    };
                    //根据编码获取相关站点的信息
                    $.ajax({
                        url: serverConfig.soilApi,
                        data: JSON.stringify(obj2)
                    }).done(function (data2) {
                        if (data2.success) {
                            console.log(data2);
                            //弹窗表格方法
                            rry = data2;//水位的数据
                            getLayer2(rr, feature, rry);
                        } else {
                            //显示数据错误信息
                            layer.msg(data.message, { time: 3000 });
                        }
                    });
                } else {
                    //显示数据错误信息
                    layer.msg(data.message, { time: 3000 });
                }
            });
            //雨量数据
        } else if (deviceTp == "雨量站") {
            obj = {
                Type: 'get',
                Uri: '/data/getdata',
                Parameter: {
                    code: deviceid,
                    startTime: s + " 08:00:00",
                    endTime: e + " 08:00:00"
                }
            };
            //根据编码获取相关站点的信息
            $.ajax({
                url: serverConfig.soilApi,
                data: JSON.stringify(obj)
            }).done(function (data) {
                if (data.success) {
                    console.log(data);
                    //弹窗表格方法
                    getLayer(data, feature);
                } else {
                    //显示数据错误信息
                    layer.msg(data.message, { time: 3000 });
                }
            });
        }
        // else if (deviceTp == "河道水位站") {
        //     obj = {
        //         Type: 'get',
        //         Uri: '/data/getdata',
        //         Parameter: {
        //             code: deviceid,
        //             startTime: GetDateStr(0) + " 00:00:00",
        //             endTime: GetDateStr(1) + " 23:59:59"
        //         }
        //     };
        //     //根据编码获取相关站点的信息
        //     $.ajax({
        //         url: serverConfig.soilApi,
        //         data: JSON.stringify(obj)
        //     }).done(function (data) {
        //         if (data.success) {
        //             console.log(data);
        //             //弹窗表格方法
        //             getLayer(data, feature);
        //         } else {
        //             //显示数据错误信息
        //             layer.msg(data.message, { time: 3000 });
        //         }
        //     });
        // } else if (deviceTp == "水库水文站") {
        //     obj = {
        //         Type: 'get',
        //         Uri: '/data/getdata',
        //         Parameter: {
        //             code: deviceid,
        //             startTime: GetDateStr(0) + " 00:00:00",
        //             endTime: GetDateStr(1) + " 23:59:59"
        //         }
        //     };
        //     //根据编码获取相关站点的信息
        //     $.ajax({
        //         url: serverConfig.soilApi,
        //         data: JSON.stringify(obj)
        //     }).done(function (data) {
        //         if (data.success) {
        //             console.log(data);
        //             //弹窗表格方法
        //             getLayer(data, feature);
        //         } else {
        //             //显示数据错误信息
        //             layer.msg(data.message, { time: 3000 });
        //         }
        //     });
        // }
        else if (deviceTp == "墒情站") {
            obj = {
                Type: 'get',
                Uri: '/data/getdata',
                Parameter: {
                    code: deviceid,
                    startTime: s + " 08:00:00",
                    endTime: e + " 08:00:00"
                }
            };
            //根据编码获取相关站点的信息
            $.ajax({
                url: serverConfig.soilApi,
                data: JSON.stringify(obj)
            }).done(function (data) {
                if (data.success) {
                    console.log(data);
                    //弹窗表格方法
                    getLayer(data, feature);
                } else {
                    //显示数据错误信息
                    layer.msg(data.message, { time: 3000 });
                }
            });
        }
    } else {
        //关闭弹窗
        $(element).popover('destroy');
    }
};
//获取点击站点弹窗数据
var getLayer = function (database, feature) {
    // var data1 = JSON.parse(database);
    var data1 = database.data;
    ////console.log(data1);
    //alert(JSON.stringify(data1.Datas));
    $(element).popover('destroy');
    element = document.createElement('div');
    var popup = new ol.Overlay({
        element: element
    });
    map.addOverlay(popup);
    //聚焦位置中心
    popup.setPosition(ol.proj.fromLonLat([feature.get("Longitude"), feature.get("Latitude")]));
    //弹窗内容位置信息
    $(element).popover({
        'placement': 'left',
        'html': true,
        'title': '今日实时数据',
        'content': getInfoWindowView(feature)
    });
    //显示弹窗
    $(element).popover('show');
    var newData = [],
        newTime;
    var newData1 = [],
        newTime1;

    if (feature.get("Type") == "墒情站") {
        if (data1.Datas.length > 0) {
            //墒情站10cm相对湿度数据分类
            var r1 = $.grep(data1.Datas, function (d) {
                return d.Name == "10cm相对湿度"
            });
            //墒情站20cm相对湿度数据分类
            var r2 = $.grep(data1.Datas, function (d) {
                return d.Name == "20cm相对湿度";
            });
            //墒情站40cm相对湿度数据分类
            var r3 = $.grep(data1.Datas, function (d) {
                return d.Name == "40cm相对湿度";
            });
            //墒情站相对湿度均值数据分类
            var r4 = $.grep(data1.Datas, function (d) {
                return d.Name == "10-40cm相对湿度均值";
            });
            ////console.log(r1[0].Value);
            //墒情站数据报表
            stationinfo_table_option = {
                "bInfo": false,
                "aaSorting": [[0, "asc"]],
                "searching": false,
                "bDestroy": true,
                columns: [
                    { "data": "Time" },
                    { "data": "Value0" },
                    { "data": "Value1" },
                    { "data": "Value2" },
                    { "data": "Value3" }
                ]
            };
            //墒情站数据报表时间分类
            for (var i = 0; i < r1.length; i++) {
                newTime = {
                    "Time": r1[i].Time.replace("T", " "),
                    "Value0": r1[i].Value === null ? "0" : r1[i].Value,
                    "Value1": r2[i].Value === null ? "0" : r2[i].Value,
                    "Value2": r3[i].Value === null ? "0" : r3[i].Value,
                    "Value3": r4[i].Value === null ? "0" : r4[i].Value
                };
                newData.push(newTime);
            }
            //console.log(newData);
        } else {
            stationinfo_table_option = {
                "bInfo": false,
                "aaSorting": [[0, "asc"]],
                "searching": false,
                "bDestroy": true,
                columns: [
                    { "data": "Time" },
                    { "data": "Value0" },
                    { "data": "Value1" },
                    { "data": "Value2" },
                    { "data": "Value3" }
                ]
            };
            //墒情站数据报表时间分类

            newData = null;
        }
    }
    else if (feature.get("Type") == "雨量站") {
        //雨量站数据分类
        if (data1.Datas.length > 0) {
            $.each(data1.Datas, function (key, obj) {
                if ((obj.Name == "水位") || (obj.Name == "雨量")) {
                    newTime = {
                        "Name": feature.get("Name"),
                        "Time": obj.Time.replace("T", " "),
                        "Value": rainData(obj.Value === null ? "" : obj.Value)
                    };
                    newData.push(newTime);
                }
            });
        } else {
            newTime = {
                "Name": feature.get("Name"),
                "Time": null,
                "Value": null
            };
            newData = null;
        }

        stationinfo_table_option = {
            "bInfo": false,
            "aaSorting": [[0, "asc"]],
            "searching": false,
            "bDestroy": true,
            columns: [
                { "data": "Name" },
                { "data": "Time" },
                { "data": "Value" }
            ]
        }
    }
    // else {
    //     //水文站雨量数据分类
    //     var r1 = $.grep(data1.Datas, function (d) {
    //         return d.Name == "雨量"
    //     });
    //     //水文站雨量数据筛选
    //     $.each(r1, function (key, obj) {
    //         newTime = {
    //             "Time": obj.Time.replace("T", " "),
    //             "Value": rainData(obj.Value === null ? "" : obj.Value)
    //         };
    //         newData.push(newTime);
    //     });
    //     //水文站水位数据分类
    //     var r2 = $.grep(data1.Datas, function (d) {
    //         return d.Name == "水位";
    //     });
    //     //水文站水位数据筛选
    //     $.each(r2, function (key, obj) {
    //         newTime1 = {
    //             "Time": obj.Time.replace("T", " "),
    //             "Value": waterLevelData(obj.Value === null ? "" : obj.Value)
    //         };
    //         newData1.push(newTime1);
    //     });
    //     //水文站数据报表option
    //     stationinfo_table_option = {
    //         "bInfo": false,
    //         "aaSorting": [[0, "asc"]],
    //         "searching": false,
    //         "bDestroy": true,
    //         columns: [
    //             { "data": "Time" },
    //             { "data": "Value" }
    //         ]
    //     }
    // }

    //获取站点类型
    var stationtype = getStationtype(feature.get("Type"));
    //初始化图表
    var curve_echarts = echarts.init(document.getElementById('curve-echarts'));
    curve_echarts.clear();
    //配置相关站点图表
    curve_echarts.setOption(setEcharts_option(data1.Datas, stationtype.typename, stationtype.dataunit, stationtype.color, feature.get("Type")), true);
    var stationinfo_table;
    //配置相关站点报表
    stationinfo_table = datatableinit(newData, '#stationinfo_table', stationinfo_table_option, stationinfo_table);
    var stationinfo_table1;
    //配置相关站点报表
    stationinfo_table1 = datatableinit(newData1, '#stationinfo_table1', stationinfo_table_option, stationinfo_table1);

}

var getLayer2 = function (database, feature, database2) {
    // var data1 = JSON.parse(database);
    console.log(database);
    console.log(database2)
    var data1 = database.data;
    var data2 = database2.data;
    ////console.log(data1);
    //alert(JSON.stringify(data1.Datas));
    $(element).popover('destroy');
    element = document.createElement('div');
    var popup = new ol.Overlay({
        element: element
    });
    map.addOverlay(popup);
    //聚焦位置中心
    popup.setPosition(ol.proj.fromLonLat([feature.get("Longitude"), feature.get("Latitude")]));
    //弹窗内容位置信息
    $(element).popover({
        'placement': 'left',
        'html': true,
        'title': '今日实时数据',
        'content': getInfoWindowView(feature)
    });
    //显示弹窗
    $(element).popover('show');
    var newData = [],
        newTime;
    var newData1 = [],
        newTime1;
    var newData2 = [],
        newTime2;
    var newData3 = [],
        newTime3;

    var shuiwei = null, liuliang = null, shuishi = null, time = null;
    // if (feature.get("Type") == "河道水文站") {
    //水文站雨量数据分类
    var r1 = $.grep(data1.Datas, function (d) {
        return d.Name == "雨量"
    });
    //水文站雨量数据筛选
    $.each(r1, function (key, obj) {
        newTime = {
            "Time": obj.Time.replace("T", " "),
            "Value": rainData(obj.Value === null ? null : obj.Value)
        };
        newData.push(newTime);
    });
    newData.sort(function (x, y) {
        if (x.Time < y.Time) {
            return 1;
        } else if (x.Time > y.Time) {
            return -1;
        } else {
            return 0;
        }
    });
    //水文站水位数据分类
    var r2 = $.grep(data2.Datas, function (d) {
        return d.Name == "水位";
    });
    //水文站水位数据筛选
    $.each(r2, function (key, obj) {
        newTime1 = {
            "Time": obj.Time.replace("T", " "),
            "Value": waterLevelData(obj.Value === null ? null : obj.Value)
        };
        newData1.push(newTime1);

    });
    if (newData1.length > 0) {
        newData1.sort(function (x, y) {
            if (x.Time < y.Time) {
                return 1;
            } else if (x.Time > y.Time) {
                return -1;
            } else {
                return 0;
            }
        });
        newData1 = [newData1[0]];
        shuiwei = waterLevelData(newData1[0].Value === null ? null : newData1[0].Value);
    }

    var r3 = $.grep(data2.Datas, function (d) {
        return d.Name == "流量";
    });
    //水文站流量数据筛选
    $.each(r3, function (key, obj) {
        newTime2 = {
            "Time": obj.Time.replace("T", " "),
            "Value": waterLevelData(obj.Value === null ? null : obj.Value)
        };
        newData2.push(newTime2);
    });
    if (newData2.length > 0) {
        newData2.sort(function (x, y) {
            if (x.Time < y.Time) {
                return 1;
            } else if (x.Time > y.Time) {
                return -1;
            } else {
                return 0;
            }
        });
        newData2 = [newData2[0]];
        liuliang = waterLevelData(newData2[0].Value === null ? null : newData2[0].Value);
        time = newData2[0].Time.replace("T", " ");
    }

    var r4 = $.grep(data2.Datas, function (d) {
        return d.Name == "水势";
    });
    //水文站水势数据筛选
    $.each(r4, function (key, obj) {
        newTime3 = {
            "Time": obj.Time.replace("T", " "),
            "Value": (obj.Value === null ? null : showFlow(obj.Value.toString()))
        };
        newData3.push(newTime3);

    });
    if (newData3.length > 0) {
        newData3.sort(function (x, y) {
            if (x.Time < y.Time) {
                return 1;
            } else if (x.Time > y.Time) {
                return -1;
            } else {
                return 0;
            }
        });
        newData3 = [newData3[0]];
        shuishi = (newData3[0].Value === null ? null : showFlow(newData3[0].Value.toString()));
    }

    var plusArray = [];
    if (time == null && shuiwei == null && liuliang == null && shuishi == null) {
        plusArray = [];
    } else {
        plusArray = [{
            "Time": time,
            "Value0": shuiwei,
            "Value1": liuliang,
            "Value2": shuishi,
        }];
    }


    //水文站数据报表option
    stationinfo_table_option = {
        "bInfo": false,
        "aaSorting": [[0, "desc"]],
        "searching": false,
        "bDestroy": true,
        columns: [
            { "data": "Time" },
            { "data": "Value" },
        ]
    }

    stationinfo_table_option1 = {
        "bInfo": false,
        "aaSorting": [[0, "desc"]],
        "searching": false,
        "bDestroy": true,
        columns: [
            { "data": "Time" },
            { "data": "Value0" },
            { "data": "Value1" },
            { "data": "Value2" }
        ]
    }
    // }
    //获取站点类型
    var stationtype = getStationtype(feature.get("Type"));
    //初始化图表
    var curve_echarts = echarts.init(document.getElementById('curve-echarts'));
    curve_echarts.clear();
    //配置相关站点图表
    curve_echarts.setOption(setEcharts_option2(data1.Datas, stationtype.typename, stationtype.dataunit, stationtype.color, feature.get("Type"), data2.Datas), true);
    var stationinfo_table;
    //配置相关站点报表
    stationinfo_table = datatableinit(newData, '#stationinfo_table', stationinfo_table_option, stationinfo_table);
    var stationinfo_table1;
    //配置相关站点报表
    stationinfo_table1 = datatableinit(plusArray, '#stationinfo_table1', stationinfo_table_option1, stationinfo_table1);
    var stationinfo_tableshuiku;
    //配置相关流量(针对水库水文站)
    stationinfo_tableshuiku = datatableinit(newData1, '#stationinfo_tableshuiku', stationinfo_table_option, stationinfo_tableshuiku);
    // var stationinfo_table3;
    // //配置相关水势
    // stationinfo_table3 = datatableinit(newData3, '#stationinfo_table3', stationinfo_table_option, stationinfo_table3);

}

//站点弹出层信息
var getInfoWindowView = function (feature) {
    var layer_warningcontent = [],
        layer_warningstate = false;
    //报警站点中报警按钮弹出的相关报警信息
    $.each(warntt0, function (key, obj) {
        if (obj.stcd == feature.get('Code') && obj.status == 0) {
            //报警站点中报警按钮弹出的相关多条报警信息
            layer_warningcontent.push(obj.remark);
            layer_warningstate = true;
        }
    });

    //今日实时数据表格html拼接
    var stationtype = getStationtype(feature.get('Type'));
    var mapText = '';
    mapText += '<div class="col-xs-12" style="padding: 0">';
    mapText += "<div class='mapmode_item_tab'><ul style='list-style-type:none;margin:0;padding:0;width:100%;height:31px;line-height:30px;border-bottom:1px solid #ddd;' id='mapmode_item_tab_ul'>" +
        "<li id='chart-report-tab' class='map-tab map-tab-active'><a id='chart-report-link' href='#' style='display:block;width:100%;height:100%;text-align:center;border-bottom:0;font-size:14px;' onclick='ShowChartReport();'>图形报表</a></li>" +
        "<li id='data-report-tab' class='map-tab'><a id='data-report-link' href='#' style='display:block;width:100%;height:100%;text-align:center;border-bottom:0;font-size:14px;' onclick='ShowDataReport();'>数据报表</a></li>" +
        "<li id='info-report-tab' class='map-tab'><a id='data-info-link' href='#' style='display:block;width:100%;height:100%;text-align:center;border-bottom:0;font-size:14px;' onclick='ShowInfoReport();'>测站信息</a></li>" +
        '</ul>';
    mapText += "<div style='height: 385px;overflow: auto;min-width: 470px;'><div id='chart-report' class='col-xs-12'>";
    mapText += "<div id='curve-echarts'></div>";
    mapText += "</div>";
    mapText += "<div id='data-report' style='display:none;' class='col-xs-12'>";
    mapText += "<div class='stationinfo_table_div'>";
    //今日实时数据雨量站表格html拼接
    if (feature.get('Type') == "雨量站") {
        mapText += "<table class='stripe row-border order-column nowrap table-bordered no-footer' id='stationinfo_table'  align='center'>" +
            "<thead><tr><th width='33%'>站名</th><th width='33%'>时间</th> <th width='33%'>" + stationtype.dataunit[0] + "</th></tr></thead>" +
            "</table></div>";
    } else if (feature.get('Type') == "河道水文站") {
        //今日实时数据水文站表格html拼接
        mapText += "<table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table'  align='center'>" +
            "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[0] + "</th></tr></thead>" +
            "</table></div>";
        mapText += "<div class='stationinfo_table_div'><table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table1'  align='center'>" +
            "<thead><tr><th width='25%'>时间</th> <th width='25%'>" + stationtype.dataunit[1] + "</th><th width='25%'>" + stationtype.dataunit[2] + "</th><th width='25%'>" + stationtype.dataunit[3] + "</th></th></tr></thead>" +
            "</table></div>";
        // mapText += "<div class='stationinfo_table_div'><table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table2'  align='center'>" +
        //     "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[2] + "</th></th></tr></thead>" +
        //     "</table></div>";
        // mapText += "<div class='stationinfo_table_div'><table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table3'  align='center'>" +
        //     "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[3] + "</th></th></tr></thead>" +
        //     "</table></div>";
    } else if (feature.get('Type') == "墒情站") {
        //今日实时数据墒情站表格html拼接
        mapText += "<table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table'  align='center'>" +
            "<thead><tr><th rowspan='2'>时间</th><th colspan='4'>相对湿度（%）</th></tr>" +
            "<tr><th rowspan='1'>" + stationtype.typename[0] + "</th><th rowspan='1'>" + stationtype.typename[1] + "</th><th rowspan='1'>" + stationtype.typename[2] + "</th><th rowspan='1'>" + stationtype.typename[3] + "</th></tr>" +
            "</thead>" +
            "</table></div>";
    } else if (feature.get('Type') == "河道水位站") {
        //今日实时数据水位站表格html拼接
        mapText += "<table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table'  align='center'>" +
            "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[0] + "</th></tr></thead>" +
            "</table></div>";
        mapText += "<div class='stationinfo_table_div'><table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table1'  align='center'>" +
            "<thead><tr><th width='25%'>时间</th> <th width='25%'>" + stationtype.dataunit[1] + "</th><th width='25%'>" + stationtype.dataunit[2] + "</th><th width='25%'>" + stationtype.dataunit[3] + "</th></th></tr></thead>" +
            "</table></div>";
        // mapText += "<div class='stationinfo_table_div'><table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table2'  align='center'>" +
        //     "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[2] + "</th></th></tr></thead>" +
        //     "</table></div>";
        // mapText += "<div class='stationinfo_table_div'><table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table3'  align='center'>" +
        //     "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[3] + "</th></th></tr></thead>" +
        //     "</table></div>";
    } else if (feature.get('Type') == "水库水文站") {
        //今日实时数据水位站表格html拼接
        mapText += "<table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_table'  align='center'>" +
            "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[0] + "</th></tr></thead>" +
            "</table></div>";
        mapText += "<div class='stationinfo_table_div'><table class='stripe row-border order-column nowrap table-bordered' id='stationinfo_tableshuiku'  align='center'>" +
            "<thead><tr><th width='50%'>时间</th> <th width='50%'>" + stationtype.dataunit[1] + "</th></th></tr></thead>" +
            "</table></div>";
    }
    mapText += "</div>";
    //今日实时数据测站信息表格html拼接
    mapText += "<div id='info-report' style='display:none;' class='col-xs-12'>";
    mapText += "<div class='stationinfodata_table_div_noborder'><table class='table table-striped table-bordered table-hover table-condensed' id='stationdata_table' align='center'>" +
        "<tr><td width='50%'><strong>测站编码</strong></td> <td width='50%'>" + feature.get('Code') + "</td></tr>" +
        "<tr><td width='50%'><strong>测站名称</strong></td> <td width='50%'>" + feature.get('Name') + "</td></tr>" +
        "<tr><td width='50%'><strong>报汛等级</strong></td> <td width='50%'>" + feature.get('Level') + "</td></tr>" +
        "<tr><td width='50%'><strong>测站类型</strong></td> <td width='50%'>" + feature.get('Type') + "</td></tr>" +
        "<tr><td width='50%'><strong>行政区域</strong></td> <td width='50%'>" + feature.get('AreaName') + "</td></tr>" +
        "<tr><td width='50%'><strong>流域</strong></td> <td width='50%'>" + feature.get('RiverAreaName') + "</td></tr>" +
        "<tr><td width='50%'><strong>水系</strong></td> <td width='50%'>" + feature.get('RiverSystemName') + "</td></tr>" +
        "<tr><td width='50%'><strong>河流</strong></td> <td width='50%'>" + feature.get('RiverName') + "</td></tr>" +
        "<tr><td width='50%'><strong>经度</strong></td> <td width='50%'>" + feature.get('Longitude') + "</td></tr>" +
        "<tr><td width='50%'><strong>纬度</strong></td> <td width='50%'>" + feature.get('Latitude') + "</td></tr>" +
        "<tr><td width='50%' style='line-height: 30px;'><strong>状态</strong></td> <td width='50%' style='line-height: 30px;'>" + showWarnbtn(layer_warningstate, layer_warningcontent) + "</td></tr>" +
        "</table></div>";

    //mapText +='<div class="col-xs-6"><strong>测站编码:</strong><span class="getInfoWindowView_font">'+ feature.get('code') +'</span></div><div class="col-xs-6"><strong>测站名称:</strong><span class="getInfoWindowView_font">'+feature.get('name')+'</span></div>';
    //mapText += '<div class="col-xs-6"><strong>报汛等级:</strong><span class="getInfoWindowView_font">'+  feature.get('level') +'</span></div><div class="col-xs-6"><strong>测站类型:</strong><span class="getInfoWindowView_font">'+feature.get('stationtype')+'</span></div>';
    //mapText += '<div class="col-xs-6"><strong>行政区域:</strong><span class="getInfoWindowView_font">'+  feature.get('area') +'</span></div><div class="col-xs-6"><strong>流域:</strong><span class="getInfoWindowView_font">'+feature.get('basin')+'</span></div>';
    //mapText += '<div class="col-xs-6"><strong>经度:</strong><span class="getInfoWindowView_font">'+  feature.get('Longitude') +'</span></div><div class="col-xs-6"><strong>纬度:</strong><span class="getInfoWindowView_font">'+feature.get('Latitude')+'</span></div>';
    mapText += "</div></div>";
    mapText += '</div></div></div>';
    return mapText;
};

//今日实时数据tab切换方法
function ShowChartReport() {
    tabClick("chart-report");
}

//今日实时数据tab切换方法
function ShowDataReport() {
    tabClick("data-report");
}

//今日实时数据tab切换方法
function ShowInfoReport() {
    tabClick("info-report");
}

//折叠table
function format(d, type) {
    var table_child_content = '', table_child_head = '';
    $.each(d.content, function (key, obj) {
        switch (type) {
            //实时雨情量级统计
            case 'rain':
                if (table_child_head == '') {
                    table_child_head = '<thead><tr><th width="33%">测站编码' +
                        '</th><th width="33%">测站名称</th><th width="34%">日累计雨量（mm）</th></tr></thead>';
                }
                table_child_content = table_child_content +
                    '<tr><td>' +
                    obj.stcd +
                    '</td><td>' +
                    obj.stnm +
                    '</td><td>' +
                    obj.drp +
                    '</td></tr>';
                break;
            //实时墒情量级统计
            case 'soil':
                if (table_child_head == '') {
                    table_child_head = ' <thead>' +
                        '<tr>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2">测站名称</th>' +
                        '<th colspan="4">相对湿度均值（%）</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th>10cm</th>' +
                        '<th>20cm</th>' +
                        '<th>40cm</th>' +
                        '<th>均值</th>' +
                        '</tr>' +
                        '</thead>';
                }
                table_child_content = table_child_content +
                    '<tr><td>' +
                    obj.Code +
                    '</td><td>' +
                    obj.Name +
                    '</td><td>' +
                    obj.R10 +
                    '</td><td>' + obj.R20 + '</td><td>' + obj.R40 + '</td><td>' + obj.RA + '</td>' +
                    '</tr>';
                break;
            //报警处理
            case 'alarm':
                if (table_child_head == '') {
                    table_child_head = '<thead><tr><th width="50%">测站信息</th><th width="50%">操作</th></tr></thead>';
                }
                table_child_content = table_child_content +
                    '<tr><td>' +
                    obj.stnm +
                    '</td><td>' +
                    '<button type="button" id=' + obj.stcd + ' onclick="warningSet1(' + obj.id + ',' + obj.value + ',this)" class="btn btn-xs btn-warnning1 warnbtn2">报警处理</button>' +
                    '</td></tr>';
                break;
        }
    });
    return '<table class="stripe row-border order-column nowrap table-bordered table_child">' +
        table_child_head +
        table_child_content +
        '</table>';
}

//折叠table(未上报数据)
function formatNull(d, type) {
    var table_child_content = '', table_child_head = '';
    $.each(d.content, function (key, obj) {
        switch (type) {
            //实时雨情量级统计(未上报数据)
            case 'rain':
                if (table_child_head == '') {
                    table_child_head = '<thead><tr><th width="33%">测站编码' +
                        '</th><th width="33%">测站名称</th><th width="34%">最后上报时间</th></tr></thead>';
                }
                table_child_content = table_child_content +
                    '<tr><td>' +
                    obj.stcd +
                    '</td><td>' +
                    obj.stnm +
                    '</td><td>' +
                    obj.tm +
                    '</td></tr>';
                break;
            //实时墒情量级统计(未上报数据)
            case 'soil':
                if (table_child_head == '') {
                    table_child_head = ' <thead>' +
                        '<tr>' +
                        '<th>测站编码</th>' +
                        '<th>测站名称</th>' +
                        '<th>最后上报时间</th>' +
                        '</tr>' +
                        '</thead>';
                }
                var soilLastTime;
                (obj.LastTime === null) ? soilLastTime = "" : soilLastTime = obj.LastTime.replace("T", " ");
                table_child_content = table_child_content +
                    '<tr><td>' +
                    obj.Code +
                    '</td><td>' +
                    obj.Name +
                    '</td><td>' +
                    soilLastTime +
                    '</td></tr>';
                break;

        }
    });
    return '<table class="stripe row-border order-column nowrap table-bordered table_child">' +
        table_child_head +
        table_child_content +
        '</table>';
}

//今日实时数据切换tab
function tabClick(id) {
    $(">li", $("#" + id + "-tab").parent()).each(function () {
        if ($(this).attr("id") != (id + "-tab")) {
            $(this).removeClass('map-tab-active');
        } else {
            $(this).addClass('map-tab-active');
        }
    });
    $(">div", $("#" + id).parent()).each(function () {
        if ($(this).attr("id") != null && $(this).attr("id").indexOf("-report") != -1)
            if ($(this).attr("id") != id) {
                $(this).hide();
            } else {
                $(this).show();
            }
    });
}

//设置坐标节点样式
var setVectorStyle = function (feature, icon, fontzize) {
    if (icon !== "flood") {
        var iconStyle = new ol.style.Icon({
            src: "../../img/" + icon + ".png",
            size: [12, 12]
        });
    } else {
        if (feature.get("Type") === "雨量站") {
            var iconStyle = new ol.style.Icon({
                src: "../../img/rain" + imgs + ".png",
                size: [12, 12]
            });
        } else if (feature.get("Type") === "河道水位站") {
            var iconStyle = new ol.style.Icon({
                src: "../../img/water" + imgs + ".png",
                size: [12, 12]
            });
        } else if (feature.get("Type") === "河道水文站") {
            var iconStyle = new ol.style.Icon({
                src: "../../img/hydrology" + imgs + ".png",
                size: [12, 12]
            });
        } else if (feature.get("Type") === "水库水文站") {
            var iconStyle = new ol.style.Icon({
                src: "../../img/hydrology" + imgs + ".png",
                size: [12, 12]
            });
        } else if (feature.get("Type") === "墒情站") {
            var iconStyle = new ol.style.Icon({
                src: "../../img/soil" + imgs + ".png",
                size: [12, 12]
            });
        }
    }
    var styles = [];
    // var imageStyle = new ol.style.Circle({
    //     radius: 5,
    //     fill: new ol.style.Fill({ color: "White" }),
    //     stroke: new ol.style.Stroke({ color: 'Blue', width: 2 })
    // });
    //地图上相应站点显示图标

    //地图上相应站点名称样式
    if (feature.get("Type") === "墒情站") {
        var color = '#f00';
    } else {
        var color = '#000';
    }


    var textStyle = new ol.style.Text({
        offsetY: 15,
        font: fontzize + 'px 微软雅黑',
        text: feature.get('Name') + feature.get('Remark'),
        fill: new ol.style.Fill({
            //color: fontcolor
            //color: 'red'
            color: color
        }),
        stroke: new ol.style.Stroke({
            color: 'White',
            width: 3
        })
    });
    //返回站点显示样式
    styles.push(new ol.style.Style({
        image: iconStyle,
        text: textStyle
    }));
    return styles;
}

//显示站点图标
var vectorLayer;
var ShowGisDevices = function (datas, icon, fontcolor, zindex, fontsize) {

    var vectorSource = new ol.source.Vector({});
    vectorLayer = new ol.layer.Vector({
        zIndex: zindex,
        visible: true,
        source: vectorSource
    });
    for (var i = 0; i < datas.length; i++) {
        var label = null;
        var ut = datas[i];

        if (!CheckLatLong2(ut.Longitude, ut.Latitude)) continue;//判断经纬度合法性
        ut.geometry = new ol.geom.Point(ol.proj.fromLonLat([ut.Longitude, ut.Latitude]));
        var feature = new ol.Feature(ut);
        vectorSource.addFeature(feature);
        feature.setStyle(setVectorStyle(feature, icon, fontsize));
    }
    map.addLayer(vectorLayer);
};

//显示地图层
var ShowMaplayer = function (zindex, LAYERS) {
    var vectorLayer = new ol.layer.Tile({
        zIndex: zindex,
        source: new ol.source.TileWMS({
            crossOrigin: true,
            url: serverConfig.gisMapUrl,
            params: { LAYERS: LAYERS, VERSION: '1.1.1' }
        })
    });
    map.addLayer(vectorLayer);
};

//左侧按钮选择地图显示相对应层
function showlayer(thisname, visablestate, zindex) {
    map.getLayers().forEach(function (layer) {
        if (layer.getZIndex() == zindex) {
            //地图显示相对应层隐藏，按钮置灰
            if (!visablestate) {
                thisname.removeClass("station_btn_visable");
                thisname.addClass("station_btn_hide");
                layer.setVisible(false);
            } else {
                //地图显示相对应层显示，按钮高亮
                thisname.removeClass("station_btn_hide");
                thisname.addClass("station_btn_visable");
                layer.setVisible(true);
            }
        }
    });
}

//初始化报警信息
function initWarning() {
    //点扩散div
    var stcd = [];
    var warntt = [];
    var user = JSON.parse($.cookie("user"));
    //报警信息接口中间服务参数
    var obj = {
        Type: 'get',
        Uri: '/warning/select',
        Parameter: {
            Code: user.AreaCode,
            Status: "0",
            Type: "",
            startTime: "1990-01-01 00:00:00",
            endTime: $("#starttime input").val().split(" ")[0] + " 23:59:59",
            start: 0,//当前页码
            length: 99999 //页面显示记录条数，在页面显示每页显示多少项的时候
        }
    };
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            //获取报警数据
            //console.log(data.data.data);
            //报警铃声
            warntt0 = data.data.data;
            if (warntt0.length > 0) {
                $("#map").append("<EMBED id='warnsound' src='../../mp3/3742.wav' align='center' border='0' width='0' height='0' loop='false' />")
            }
            //筛选未处理报警数据
            var ww0 = $.grep(data.data.data, function (d) {
                return d.status === 0;
            });
            //console.log(ww0);
            //筛选未处理报警数据编码
            map.getOverlays().clear();
            $.each(ww0, function (i, v) {
                stcd.push(v.stcd);
            });
            var stcdnn = outRepeat(stcd);
            //筛选不重复的未处理报警数据
            for (var i = 0; i < stcdnn.length; i++) {
                var r = $.grep(detectiondeviceregime_data, function (d) {
                    return d.Code == stcdnn[i];
                });
                if (r.length > 0) {
                    warntt.push(r[0]);
                }
            }
            // map.removeOverlay();
            //console.log(warntt);
            //生成地图上报警点
            for (var i = 0; i < warntt.length; i++) {
                var point_div = document.createElement('div');
                point_div.id = "css_animation_" + i;
                point_div.className = "css_animation";
                var point_overlay = new ol.Overlay({
                    element: point_div,
                    positioning: 'center-center',
                    stopEvent: false
                });
                map.addOverlay(point_overlay);

                var lon = warntt[i].Longitude;
                var lat = warntt[i].Latitude;
                point_overlay.setPosition(ol.proj.fromLonLat([lon, lat]));
            }
            setWarningShow(warning_visable);
        }
    });

}

//去除报警code数组重复内容方法
function outRepeat(a) {
    var hash = [], arr = [];
    for (var i = 0; i < a.length; i++) {
        hash[a[i]] != null;
        if (!hash[a[i]]) {
            arr.push(a[i]);
            hash[a[i]] = true;
        }
    }
    return arr;
}

//设置报警显示
function setWarningShow(isShow) {
    if (isShow) {
        //设置报警按钮显示
        $(".css_animation").show();
        $('#warning_btn').removeClass("station_btn_hide");
        $('#warning_btn').addClass("station_btn_visable");
    } else {
        //设置报警按钮显示
        $(".css_animation").hide();
        $('#warning_btn').removeClass("station_btn_visable");
        $('#warning_btn').addClass("station_btn_hide");
    }
}

//显示运维监控表格
var stationListRainstatics = [], stationListRainstatics_s = [];

function showTabledata() {
    //数据加载前先显示加载条
    $("#d_device .load-wrapp").removeClass("hidden");
    var user = JSON.parse($.cookie("user"));
    $("#AreaName").text(user.AreaName);
    //数据接口中间服务参数
    var obj = {
        Type: 'get',
        Uri: '/station/getmapstation',
        Parameter: {
            areaCode: user.AreaCode
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            stationList = data.data;
            //数据列表方法
            getViewTab(data);
        } else {
            //数据出错提示，并关闭进度条
            layer.msg(data.message, { time: 3000 });
            $("#d_device .load-wrapp").addClass("hidden");
        }
    });
}

//获取监测站点表格数据
var getViewTab = function (data) {
    //数据加载成功隐藏加载条
    var user = JSON.parse($.cookie("user"));
    $("#d_device .load-wrapp").addClass("hidden");
    var ttall = [];
    var data0 = $.grep(data.data, function (d) {
        return (d.Type == "墒情站" && d.Level !== "山洪站") || (d.Level !== "其它报汛站" && d.Level !== "山洪站")
    })
    for (var i = 0; i < country.length; i++) {
        var tt = $.grep(data0, function (d) {
            return d.AreaName == country[i]
        });
        for (var a = 0; a < tt.length; a++) {
            ttall.push(tt[a]);
        }
    }
    var tabledata = ttall;
    detectiondeviceregime_data = tabledata;
    //console.log(detectiondeviceregime_data);
    //river_table = datatableinit(river_regime_data, '#river_table', river_table_option, river_table);
    //reservoir_table = datatableinit(reservoir_regime_data, '#reservoir_table', reservoir_table_option, reservoir_table);
    //运维监控数据列表
    var risw = $.grep(detectiondeviceregime_data, function (d) {
        return d.Type == "河道水文站"
    });
    var resw = $.grep(detectiondeviceregime_data, function (d) {
        return d.Type == "水库水文站"
    });
    var yl = $.grep(detectiondeviceregime_data, function (d) {
        return d.Type == "雨量站"
    });
    var risw1 = $.grep(detectiondeviceregime_data, function (d) {
        return d.Type == "河道水位站"
    });
    var sq = $.grep(detectiondeviceregime_data, function (d) {
        return d.Type == "墒情站"
    });
    var stationnetwork_data = [
        { "name": "河道水文站", "value": risw.length },
        { "name": "水库水文站", "value": resw.length },
        { "name": "雨量站", "value": yl.length },
        { "name": "河道水位站", "value": risw1.length },
        { "name": "墒情站", "value": sq.length },
        { "name": "合计", "value": detectiondeviceregime_data.length }
    ];
    var stationnetwork_data2 = [
        { "name": "河道水文站", "value": risw.length },
        { "name": "水库水文站", "value": resw.length },
        { "name": "雨量站", "value": yl.length },
        { "name": "河道水位站", "value": risw1.length },
        { "name": "墒情站", "value": sq.length },
    ];
    //建站年份筛选
    var stCreatYear0 = [];
    var stCreatYear3 = [];
    $.each(detectiondeviceregime_data, function (i, v) {
        stCreatYear0.push(v.CreateDate.split("-")[0]);
    });
    var stCreatYear1 = outRepeat(stCreatYear0);
    for (var m = 0; m < stCreatYear1.length; m++) {
        var stCreatsameYear = $.grep(detectiondeviceregime_data, function (d) {
            return d.CreateDate.split("-")[0] <= stCreatYear1[m];
        });
        stCreatYear3.push({ year: stCreatYear1[m], total: stCreatsameYear.length });
        // console.log(stCreatYear3[m-1])
    }
    //根据年份降序排列
    stCreatYear3.sort(function (a, b) {
        return a.year - b.year;
    });
    // var stCreatYear3_1=[];
    // for(var mmi=0;mmi<5;mmi++){
    //     stCreatYear3_1.push(stCreatYear3[mmi])
    // }
    var stationnetwork_bar_xAxis = [];
    var stationnetwork_bar_yAxis = [];
    $.each(stCreatYear3, function (key, obj) {
        stationnetwork_bar_xAxis.push(obj.year);
        stationnetwork_bar_yAxis.push(obj.total);
    });
    if (stationnetwork_bar_xAxis[stationnetwork_bar_xAxis.length - 1] !== new Date().getFullYear()) {
        stationnetwork_bar_xAxis.push(new Date().getFullYear());
        stationnetwork_bar_yAxis.push(stationnetwork_bar_yAxis[stationnetwork_bar_yAxis.length - 1])
    }
    detectiondevicetable = datatableinit(detectiondeviceregime_data, '#detectiondevice_table', detectiondevicetable_option, detectiondevicetable);
    stationnetworktable = datatableinit(stationnetwork_data, '#stationnetwork_statistics_table', stationnetworktable_option, stationnetworktable);
    var stationnetwork_pie = document.getElementById('stationnetwork_pie');
    var stationnetwork_bar = document.getElementById('stationnetwork_bar');
    var resizestationnetwork_pie = function () {
        stationnetwork_pie.style.width = 700 * 0.45 + 'px';
        stationnetwork_pie.style.height = 600 * 0.4 + 'px';
        stationnetwork_bar.style.width = 750 + 'px';
        stationnetwork_bar.style.height = 600 * 0.4 + 'px';
        stationerror_bar.style.width = 730 * 0.9 + 'px';
        stationerror_bar.style.height = 1400 * 0.4 + 'px';
    };
    resizestationnetwork_pie();
    //运维监控echart
    var data1;
    var data2;
    var obj = {
        Type: 'GET',
        Uri: '/statistics/statisticsFault',
        Parameter: {
            addvcd: user.AreaCode
        }
    };
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            // data1 = data;
            //各区县报送率统计
            var obj0 = {
                Type: 'GET',
                Uri: '/statistics/unobstructed',
                Parameter: {
                    addvcd: user.AreaCode,
                    checkDate: GetDateTimeStr() + ":00"
                }
            };
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj0)
            }).done(function (database) {
                console.log(database);
                if (database.success) {
                    var name = new Array();
                    var error = new Array();
                    var normal = new Array();
                    for (var i = 0; i < database.data.data.length; i++) {
                        if ($.stationstring.indexOf(database.data.data[i].name) == -1) {
                            database.data.data.splice(i, 1);
                            i -= 1
                        }
                    }
                    var ttall = [];
                    for (var i = 0; i < country.length; i++) {
                        var tt = $.grep(database.data.data, function (d) {
                            return d.name == country[i]
                        });
                        for (var a = 0; a < tt.length; a++) {
                            ttall.push(tt[a]);
                        }
                    }
                    $.each(ttall, function (index, obj) {
                        name[index] = obj.name;
                        error[index] = obj.error;
                        normal[index] = obj.normal;
                    });
                    var stationerror_bar_chart = echarts.init(document.getElementById('stationerror_bar'));
                    var stationerror_bar_option = {
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            },
                            formatter: function (params, ticket, callback) {
                                console.log(params);
                                return params[0].seriesName + "：" + params[0].data + " 站<br/>" + params[1].seriesName + "：" + params[1].data + " 站<br/>" +
                                    "报送率：" + ((params[0].data / (params[0].data + params[1].data) * 100) == "0" ? "0" : (params[0].data / (params[0].data + params[1].data) * 100).toFixed(1)) + "%"
                            }
                        },
                        legend: {
                            data: ['正常站点', '故障站点']
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        yAxis: [
                            {
                                type: 'category',
                                data: name,
                                inverse: true,
                            }
                        ],
                        xAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: [

                            {
                                name: '正常站点',
                                type: 'bar',
                                stack: '广告',
                                data: normal,
                                itemStyle: {
                                    normal: {
                                        color: '#1fd800',
                                        lineStyle: {
                                            //color: '#009d89'
                                            color: '#1fd800'
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'inside'
                                    }
                                }
                            },
                            {
                                name: '故障站点',
                                type: 'bar',
                                stack: '广告',
                                data: error,
                                itemStyle: {
                                    normal: {
                                        color: '#f94a05',
                                        lineStyle: {
                                            //color: '#009d89'
                                            color: '#f94a05',
                                        }
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'inside'
                                    }
                                }
                            }
                        ]
                    };
                    stationerror_bar_chart.setOption(stationerror_bar_option);
                }
            })
        }
    })
    var stationnetwork_pie_chart = echarts.init(stationnetwork_pie);
    var stationnetwork_bar_chart = echarts.init(stationnetwork_bar);

    var stationnetwork_pie_option = {
        /* title : {
         text: '咸阳市站网统计',
         textStyle:{
         fontSize:14
         },
         x:'center'
         },*/
        legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'center',
        },
        tooltip: {
            trigger: 'item',
            formatter: "{b} <br/>站点数量: {c} <br/> ( {d}% )"
        },
        series: [
            {
                name: '咸阳站点统计',
                type: 'pie',
                radius: '80%',
                center: ['45%', '55%'],
                labelLine: {
                    normal: {
                        length: 20,
                        length2: 10,
                    }

                },
                data: stationnetwork_data2,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    //运维监控站网统计数据柱状图
    var stationnetwork_bar_option = {
        // color: ['#009d89'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: "{b}年<br/>站点数量: {c}"
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 99
        }, {
            start: 0,
            end: 99,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'top',
        },
        grid: {
            left: "2%",
            // right: "-1%",
            top: '15%',
            bottom: '40px',
            containLabel: true
        },
        xAxis: [
            {
                name: "年",
                type: 'category',
                data: stationnetwork_bar_xAxis,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: "站点数量(个)"
            }
        ],
        series: [
            {
                name: '站点数量',
                type: 'bar',
                barWidth: '50%',
                data: stationnetwork_bar_yAxis,
                label: {
                    normal: {
                        show: false,
                        position: 'top',
                        color: "#000"
                    }
                }
            }
        ]
    };

//运维监控故障分析柱状图


    stationnetwork_pie_chart.setOption(stationnetwork_pie_option);
    stationnetwork_bar_chart.setOption(stationnetwork_bar_option);
};

//等值分析日期选择
// var antp = 0;

// function analysis_datetimepicker(timetype, divname, inputname) {
//     var timeformat, timeupdatevalue, inputnamevalue, start_type;
//     //等值分析日期选择
//     switch (timetype) {
//         case 0:
//             timeformat = 'yyyy-mm-dd hh:ii';
//             antp = 0;
//             break;
//         case 2:
//             timeformat = 'yyyy-mm-dd';
//             antp = 2;
//             break;
//         case 3:
//             timeformat = 'yyyy-mm';
//             antp = 3;
//             break;
//         case 4:
//             timeformat = 'yyyy';
//             antp = 4;
//             break;
//     }
// //等值分析日期选择
//     if (timetype == 0) {
//         start_type = 2;
//     } else {
//         start_type = timetype;
//     }
//
// //等值分析日期选择
//     $('#' + divname).datetimepicker('remove');
//     $('#' + divname).datetimepicker({
//         language: 'zh-CN',
//         format: timeformat,
//         weekStart: 1,
//         autoclose: true,
//         todayBtn: true,
//         todayHighlight: 1,
//         startView: start_type,
//         minView: timetype,
//         forceParse: 0,
//         pickerPosition: "bottom-left",
//     });
//     //等值分析日期选择
//     inputnamevalue = $('#' + inputname).val();
//     if (inputnamevalue == "" || inputnamevalue == null || inputnamevalue == undefined) {
//         var timeupdatevalue = new Date();
//         timeupdatevalue.setHours(8, 0);
//     } else {
//         timeupdatevalue = new Date($('#' + inputname).val());
//     }
//     //等值分析日期选择
//     $('#' + divname).datetimepicker('update', timeupdatevalue);
// }

/*var ajaxoption = function (Type, Uri, Parameter, url, donefun,feature) {
 var obj = {
 Type: Type,
 Uri: Uri,
 Parameter: Parameter
 };
 $.ajax({
 contentType: "application/json;charset=utf-8",
 type: "Post",
 data: JSON.stringify(obj),
 url: url,
 cache: false,
 dataType: "json"
 }).done(function (database) {
 if (database.Success) {
 donefun(database,feature);
 } else {
 layer.msg(database.Message);
 }
 }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
 layer.msg(textStatus);
 });
 }*/

//获取地图站点
var getMapstation = function (database, flood, size, imgs) {
    var data = eval(database);
    //归类雨量站点数据
    var mapdata0 = $.grep(data, function (d) {
        return d.Type == "雨量站" && d.Level !== "山洪站";
    });
    //归类河道水位点数据
    var mapdata1 = $.grep(data, function (d) {
        return d.Type == "河道水位站" && d.Level !== "山洪站";
    });
    //归类墒情站点数据
    var mapdata2 = $.grep(data, function (d) {
        return d.Type == "墒情站" && d.Level !== "山洪站";
    });
    //归类水文站点数据
    var mapdata3 = $.grep(data, function (d) {
        return d.Type == "河道水文站" && d.Level !== "山洪站";
    });
    var mapdata4 = $.grep(data, function (d) {
        return d.Type == "水库水文站" && d.Level !== "山洪站";
    });
    // var mapdataf = $.grep(dataf, function (d) {
    //     return d.Type == "雨量站"&&d.Level == "山洪站";
    // });
    map_Waterlevelstation_data = mapdata1;
    map_Rainlstation_data = mapdata0;
    map_Soilstation_data = mapdata2;
    map_Hydrologystation_data = mapdata3;
    map_Hydrologystation_data2 = mapdata4;
    // map_floodData=[];
    // map_floodData = map_floodData.concat(mapdataf0,mapdataf1,mapdataf2,mapdataf3,mapdataf4);
    //初始化河道水位站地图显示层
    ShowGisDevices(map_Waterlevelstation_data, 'water' + imgs, '', 11, size);
    //初始化雨量站地图显示层
    ShowGisDevices(map_Rainlstation_data, 'rain' + imgs, '', 12, size);
    //初始化墒情站地图显示层
    ShowGisDevices(map_Soilstation_data, 'soil' + imgs, '', 13, size);
    //初始化河道水文站地图显示层
    ShowGisDevices(map_Hydrologystation_data, 'hydrology' + imgs, '', 14, size);
    //初始化水库水文站地图显示层
    ShowGisDevices(map_Hydrologystation_data2, 'hydrology' + imgs, '', 15, size);
    //山洪站地图显示层
    ShowGisDevices(flood, 'flood', '', 16, size);
    setWarningShow(warning_visable);

    //默认不显示山洪站
    showlayer($('#floodstation_btn'), floodstation_visable, 16);
    // setWarningShow(warning_visable);
    showlayer($("#rainlstation_btn"), rainlstation_visable, 12);
    showlayer($("#waterstation_btn"), waterstation_visable, 11);
    showlayer($("#hydrologystation_btn"), hydrology_visable, 14);
    showlayer($("#reservoirhydrology_btn"), hydrology_visable2, 15);
    showlayer($("#soilstation_btn"), soilstation_visable, 13);
    showlayer($("#floodstation_btn"), floodstation_visable, 16);
}

var antp = 0,
    floodstation_visable = false;
var rain1, rain2, rain3, rain4, rain5, rain6, rain11, rain22, rain33, rain44, rain55;
var user = JSON.parse($.cookie("user"));
var waterstation_visable = true,
    rainlstation_visable = true,
    soilstation_visable = false,
    stream_visable = true,
    river_visable = true,
    warning_visable = true,
    road_visable = false,
    terrain_visable = false,
    towns_visable = true,
    villages_visable = true,
    country_visable = false,
    terrain_num = 0,
    road_num = 0,
    country_num = 0,
    //towns_num = 0,
    hydrology_visable = true,
    hydrology_visable2 = false;
var initzoom = 0;
var initcenter = 0;
$(function () {
    showBtnAuthority();
    //初始化gis地图
    initGisMap();
    //初始化等值分析地图
    initGisMap2();
    //初始化ajax配置
    init();
    //初始化咸阳本市站点
    initXY("Name");
    //初始化站点弹窗所需信息
    initStation(user, 0);
    initWarning();
    //初始化运维监控弹窗所需数据
    showTabledata();
    //初始化实时雨情弹窗所需数据
    initRainTab(user.AreaCode);
    raintongji(user.AreaCode);
    //初始化实时水情(河道水情)弹窗所需数据
    initWaterTab(user.AreaCode);
    //实时水情(水库水情)
    initReservoirTab(user.AreaCode);
    //初始化实时实时墒情弹窗所需数据
    initSoilTab(user.AreaCode);
    initSetting();


    //初始化报警信息弹窗所需数据
    warnTab();
    //初始化地图报警站点
    setWarningShow(warning_visable);

    //默认不显示墒情和水库水文站
    showlayer($('#soilstation_btn'), false, 13);
    //默认不显示墒情和水库水文站
    showlayer($('#reservoirhydrology_btn'), false, 15);


    //初始化等值分析地图
    $("#starttime,#endtime").datetimepicker({
        format: "yyyy-mm-dd hh:ii",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 0,
        forceParse: 0,
        pickerPosition: "bottom-left",
        endDate: new Date()
    });
    //时间控件更新
    var timeupdatevalue = new Date();
    var timeupdatevalue2 = new Date();
    if (timeupdatevalue.getHours() < 8) {
        timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
        timeupdatevalue.setHours(8, 0);
        timeupdatevalue2.setHours(8, 0);
    } else {
        timeupdatevalue2.setDate(timeupdatevalue2.getDate() + 1, 0);
        timeupdatevalue.setHours(8, 0);
        timeupdatevalue2.setHours(8, 0);
    }
    $("#starttime").datetimepicker('update', timeupdatevalue);
    $("#endtime").datetimepicker('update', timeupdatevalue2);
    // setTimeout("getGisAnalyzeMap()", 2000);
    //数据接口中间服务参数


//河道水位站点击显示图层
    $('#waterstation_btn').on('click', function () {
        waterstation_visable = !waterstation_visable;
        showlayer($(this), waterstation_visable, 11);
    });
    //雨量站点击显示图层
    $('#rainlstation_btn').on('click', function () {
        rainlstation_visable = !rainlstation_visable;
        showlayer($(this), rainlstation_visable, 12);
    });
//墒情站点击显示图层

    $('#soilstation_btn').on('click', function () {
        soilstation_visable = !soilstation_visable;
        showlayer($(this), soilstation_visable, 13);
    });
//河道水文站点击显示图层
    $('#hydrologystation_btn').on('click', function () {
        hydrology_visable = !hydrology_visable;
        showlayer($(this), hydrology_visable, 14);
    });
    //水库水文站点击显示图层
    $('#reservoirhydrology_btn').on('click', function () {
        hydrology_visable2 = !hydrology_visable2;
        showlayer($(this), hydrology_visable2, 15);
    });
    $('#floodstation_btn').on('click', function () {
        floodstation_visable = !floodstation_visable;
        showlayer($(this), floodstation_visable, 16);
    });


//河流点击显示图层
    $('#stream_btn').on('click', function () {
        stream_visable = !stream_visable;
        showlayer($(this), stream_visable, 5);
    });
//水系点击显示图层
    $('#river_btn').on('click', function () {
        river_visable = !river_visable;
        showlayer($(this), river_visable, 2);
    });
//报警点击显示图层
    $('#warning_btn').on('click', function () {
        warning_visable = !warning_visable;
        setWarningShow(warning_visable);
    });
//区县点击显示图层
    $('#towns_btn').on('click', function () {
        towns_visable = !towns_visable;
        showlayer($(this), towns_visable, 6);
    });
//乡镇点击显示图层
    $('#villages_btn').on('click', function () {
        villages_visable = !villages_visable;
        showlayer($(this), villages_visable, 7);
    });
//村庄点击显示图层
    $('#country_btn').on('click', function () {
        country_visable = !country_visable;
        country_num = country_num + 1;
        if ((country_visable) && (country_visable = 1)) {
            ShowMaplayer(8, 'xianyangmap:village');
        }
        showlayer($(this), country_visable, 8);
    });
//公路点击显示图层
    $('#road_btn').on('click', function () {
        road_visable = !road_visable;
        road_num = road_num++;
        if ((road_visable) && (road_visable = 1)) {
            ShowMaplayer(3, 'xianyangmap:road');
        }
        showlayer($(this), road_visable, 3);
    });
//地形点击显示图层
    $('#terrain_btn').on('click', function () {
        terrain_visable = !terrain_visable;
        terrain_num = terrain_num++;
        if ((terrain_visable) && (terrain_num = 1)) {
            ShowMaplayer(-1, 'xianyangmap:xianyangdem');
        }
        showlayer($(this), terrain_visable, -1);
    })

    //实时雨情（雨情）刷新
    $("#rainrefresh").on('click', function () {
        initRainTab(user.AreaCode);
    });

    //实时雨情（雨情統計）刷新
    $("#rain_countrefresh").on('click', function () {
        raintongji(user.AreaCode);
    });

    //实时水情（河道水情）刷新
    $("#riverrefreshbtn").on("click", function () {
        initWaterTab(user.AreaCode);
    });

    //实时水情（水库水情）刷新
    $("#reservoirrefreshbtn").on("click", function () {
        initReservoirTab(user.AreaCode);
    });

    //关注水情（水库水情）刷新
    $("#situationrefreshbtn").on("click", function () {
        initReservoirTab(user.AreaCode);
    });

    //实时墒情（墒情）刷新
    $("#soilrefreshbtn").on("click", function () {
        initSoilTab(user.AreaCode);
    });

    //报警信息刷新按钮
    $("#warn_refresh").on("click", function () {
        warnTab();
        initWarning();

    });

    //全屏按钮
    $('#fullScreen_btn').on('click', function () {
        //退出全屏
        if (isFull) {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            } else if (de.msCancelFullScreen) {
                de.msCancelFullScreen();
            }
            return;
        }

        //执行全屏
        var el = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;//定义不同浏览器的全屏API
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        } else if (typeof window.ActiveXObject != "undefined") {
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript != null) {
                wscript.SendKeys("{F11}");
            }
        }
        //监听不同浏览器的全屏事件，并件执行相应的代码
        document.addEventListener("webkitfullscreenchange", function () {//
            if (document.webkitIsFullScreen) {
                setFullScreen(true);
            } else {
                setFullScreen(false);
            }
        }, false);

        document.addEventListener("fullscreenchange", function () {
            if (document.fullscreen) {
                setFullScreen(true);
            } else {
                setFullScreen(false);
            }
        }, false);

        document.addEventListener("mozfullscreenchange", function () {
            if (document.mozFullScreen) {
                setFullScreen(true);
            } else {
                setFullScreen(false);
            }
        }, false);

        document.addEventListener("msfullscreenchange", function () {
            if (document.msFullscreenElement) {
                setFullScreen(true);
            } else {
                setFullScreen(false);
            }
        }, false)
    });

    //返回地图中心,恢复原始大小
    $("#back_center").on("click", function () {
        // map.getLayers().forEach(function (layer) {
        //     if (layer.getZIndex() > 10) {
        //         map.removeLayer(layer);
        //     }
        // });
        // map.getOverlays().clear();

        map.getView().setCenter(initcenter);
        map.getView().setZoom(22.944090138644732);
        map.getView().setZoom(22.000000000000004);
        map.getView().setZoom(21.91719623519083);
        map.getView().setZoom(21.000000000000004);
        map.getView().setZoom(20.7358749706113);
        map.getView().setZoom(20.000000000000004);
        map.getView().setZoom(19.95779834030589);
        map.getView().setZoom(19.000000000000004);
        // map.getLayers().forEach(function (layer) {
        //     map.removeLayer(layer);
        // });
        // map.getLayers().forEach(function (layer) {
        //    console.log(layer.getZIndex())
        // });

    });

    //向上移动地图
    $("#up").on("click", function () {
        var view = map.getView();
        var mapCenter = view.getCenter();
        mapCenter[1] += 34.88 * Math.pow(2, 19 - view.getZoom()) * 300;
        view.animate({
            center: mapCenter,
            duration: 250
        })
    });

    //向下移动地图
    $("#down").on("click", function () {
        var view = map.getView();
        var mapCenter = view.getCenter();
        mapCenter[1] -= 34.88 * Math.pow(2, 19 - view.getZoom()) * 300;
        view.animate({
            center: mapCenter,
            duration: 250
        })
    });

    //向左移动地图
    $("#left").on("click", function () {
        var view = map.getView();
        var mapCenter = view.getCenter();
        mapCenter[0] -= 108.42 * Math.pow(2, 19 - view.getZoom()) * 300;
        view.animate({
            center: mapCenter,
            duration: 250
        })
    });

    //向右移动地图
    $("#right").on("click", function () {
        var view = map.getView();
        var mapCenter = view.getCenter();
        mapCenter[0] += 108.42 * Math.pow(2, 19 - view.getZoom()) * 300;
        view.animate({
            center: mapCenter,
            duration: 250
        })
    });

    function setFullScreen(fullScreen) {
        if (fullScreen) {
            $('#navigation').hide();
            $('#headTab').hide();
            $('.content-box').css('margin-top', '0px');
            $('.tab-pane iframe').css('height', '100vh');
            // $("#fullScreen_btn").hide();
            $("#fullScreen_btn").html('<span class="glyphicon glyphicon-resize-small"></span>');
            isFull = true;
        } else {
            $('#navigation').show();
            $('#headTab').show();
            $('.content-box').css('margin-top', '55px');
            $('.tab-pane iframe').css('height', '89vh');
            // $("#fullScreen_btn").show();
            $("#fullScreen_btn").html('<span class="glyphicon glyphicon-fullscreen"></span>');
            isFull = false;
        }
    }

//实时雨情点击弹窗方法
    $('#rainfall_btn').on('click', function () {
        layer.open({
            type: 1,
            //area: rainLayerHeight,
            area: ['800px', rainLayerHeight], //宽高
            //area: '800px',
            title: ['实时雨情', 'text-align:center;font-size: 16px;font-weight: bold'],
            shade: 0,
            resize: false,
            content: $('#d_rain'),
            success: function () {
                // initRainTab();
            },
            end: function () {
                $('#rainfall_btn').removeAttr("disabled");
            }
        });
        $(this).attr("disabled", "disabled");
    });
    //实时水情点击弹窗方法
    $('#waterregime_btn').on('click', function () {
        layer.open({
            type: 1,
            area: ['1000px', rainLayerHeight], //宽高
            //area: '950px',
            title: ['实时水情', 'text-align:center;font-size: 16px;font-weight: bold'],
            shade: 0,
            resize: false,
            //maxmin: true,
            content: $('#d_water'),
            success: function () {
            },
            end: function () {
                $('#waterregime_btn').removeAttr("disabled");
            }
        });
        $(this).attr("disabled", "disabled");
    });

    //实时墒情点击弹窗方法
    $('#soilmoisture_btn').on('click', function () {
        layer.open({
            type: 1,
            area: ['650px', rainLayerHeight], //宽高
            //area: '800px',
            title: ['实时墒情', 'text-align:center;font-size: 16px;font-weight: bold'],
            shade: 0,
            resize: false,
            content: $('#d_soil'),
            success: function () {

            },
            end: function () {
                $('#soilmoisture_btn').removeAttr("disabled");
            }
        });
        $(this).attr("disabled", "disabled");
    });

    //运维监控点击弹窗方法
    $('#detectiondevice_btn').on('click', function () {
        devicestation_layer = layer.open({
            type: 1,
            area: ['750px', operationLayerHeight], //宽高
            //area: '800px',
            title: ['运维监控', 'text-align:center;font-size: 16px;font-weight: bold'],
            shade: 0,
            resize: false,
            //maxmin: true,
            content: $('#d_device'),
            end: function () {
                $('#detectiondevice_btn').removeAttr("disabled");
            },
            success: function () {
            },
            full: function (dom) {
                //selector=dom.selector;
                //selector=selector.substring(1,selector.length);
                //window.frames[selector].location.reload();
            }
        });
        $(this).attr("disabled", "disabled");
    });

    //报警信息点击弹窗方法
    $('#alarm_btn').on('click', function () {
        layer.open({
            type: 1,
            area: ['790px', rainLayerHeight], //宽高
            //area: '800px',
            title: ['报警信息', 'text-align:center;font-size: 16px;font-weight: bold'],
            shade: 0,
            resize: false,
            //maxmin: true,
            content: $('#d_alarm'),
            success: function () {

            },
            close: function () {

            },
            end: function () {
                $('#alarm_btn').removeAttr("disabled");
                $(".warnbtn").popover('destroy');
            }
        });
        $(this).attr("disabled", "disabled");
    });

    //等值分析点击弹窗方法
    // var tttp = "";

    $('#analysis_btn').on('click', function () {
        var zTree, nodes, searchNodes;
        layer.open({
            type: 1,
            area: ['800px', rainLayerHeight], //宽高
            //area: '850px',
            title: ['雨情等值分析', 'text-align:center;font-size: 16px;font-weight: bold'],
            shade: 0,
            zIndex: 1000,
            resize: false,
            // btn: ['生成等值分析图'],
            //btn: ['生成等值分析图', '取消'],
            //maxmin: true,
            content: $('#d_analysis'),
            success: function (layero) {
                // initSetting();
                $("#analy_btn").click(function () {
                    // initSetting();
                    getGisAnalyzeMap();
                });
            },
            yes: function (index, layero) {
                // getGisAnalyzeMap(index);
            },
            /* btn2: function (index, layero) {
             layer.close(index);
             },*/
            end: function () {
                $('#analysis_btn').removeAttr("disabled");

            }
        });
        $(this).attr("disabled", "disabled");
    });

    //导出高清等值分析图按钮事件
    $("#export_btn").click(function () {
        downloadIsoImage();
    });

    //导出高清等值图
    function downloadIsoImage() {
        html2canvas($('#printpdf'), {
            onrendered: function (canvas) {
                // document.body.appendChild(canvas);
                // images=convertCanvasToImage(canvas);
                var contentWidth = $('#printpdf').width();
                var contentHeight = $('#printpdf').height();
                var pageHeight = contentWidth / 592.28 * 841.89;
                //未生成pdf的html页面高度
                var leftHeight = contentHeight;
                //页面偏移
                var position = 0;
                //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                var imgWidth = 595.28;
                var imgHeight = 595.28 / contentWidth * contentHeight;
                var pageData = canvas.toDataURL('image/jpeg', 1.0);
                var pdf = new jsPDF('', 'pt', 'a4');
                //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                //当内容未超过pdf一页显示的范围，无需分页
                if (leftHeight < pageHeight) {
                    pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                } else {
                    while (leftHeight > 0) {
                        //arg3-->距离左边距;arg4-->距离上边距;arg5-->宽度;arg6-->高度
                        pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                        leftHeight -= pageHeight;
                        position -= 841.89;
                        //避免添加空白页
                        if (leftHeight > 0) {
                            pdf.addPage();
                        }
                    }
                }
                pdf.save('WebEarth' + new Date().getTime() + '.pdf');
            }
        })

        function convertCanvasToImage(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            document.body.appendChild(image);
            return image;
        }


        // var pdf = new jsPDF('p', 'mm', 'a4');
        // var print_content = $('#printpdf');
        // var filename = 'Xianyang' + new Date().getTime() + '.pdf';
        // // $('#printpdf').css("transform",'rotate(90deg)');
        // pdf.addHTML($('#printpdf'), function(){
        //     console.log(pdf);
        //     pdf.output("save", filename)
        // })
    }

    //下载图片
    function DownloadPng(jobId, title, otherLayer) {
        // var timer = self.setInterval(function () {
        //     $.ajax({
        //         headers: null,
        //         async: false,
        //         contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        //         url: baseGisUrl + "/dalianmodel/jobs/" + jobId + "/export?f=pjson",
        //         type: "GET"
        //     }).done(function (r) {
        //         var result = r;
        //         if (result.jobStatus === "esriJobExecuting" || result.jobStatus === "esriJobSubmitted") return;
        //         window.clearInterval(timer);
        //         var urlParam =
        //             "?JobId=" + jobId +
        //             "&Title=" + encodeURIComponent(title) +
        //             "&SubTitle=" +
        //             "&OtherLayers=" + otherLayer +
        //             "&indexType=" + 0;
        //
        //         window.open(soilapi + "/data/exportMap" + urlParam);
        //     });
        // }, 1000);
        var urlParam =
            "?JobId=" + jobId +
            "&Title=" + encodeURIComponent(title) +
            "&SubTitle=" +
            "&OtherLayers=" + otherLayer +
            "&indexType=" + 0;

        window.open(soilapi + "/data/exportMap" + urlParam);
    }

    //运维监控刷新按钮
    $("#watchstation").on("click", function () {
        showTabledata();
    });

});

// function keydownSearch(id) {
//     //alert(id);
//     if (id == "0") {
//         $("#searchAction").click();
//     } else if (id == "1") {
//         $("#searchAction1").click();
//     } else if (id == "2") {
//         $("#searchAction2").click();
//     } else if (id == "3") {
//         $("#searchAction3").click();
//     }
// };

//运维监控站点定位到当前
function Mapmove(data) {
    ////console.log(stationData);
    layer.closeAll();
    var point = ol.proj.fromLonLat([data.Longitude, data.Latitude]);
    map.getView().setCenter(point);
    map.getLayers().forEach(function (layer) {
        try {
            layer.getSource().forEachFeature(function (f) {
                if (f.get("Code") == data.Code) {
                    showPopover(f);
                }
            });
        } catch (e) {
        }
    });
}

//初始化站點数据
var imgs;

function initStation(user, n) {
    var obj = {
        Type: 'get',
        Uri: '/station/getmapstationdata',
        Parameter: {
            areaCode: user.AreaCode,
            startTime: $("#starttime input").val().split(" ")[0] + " 08:00:00",
            endTime: $("#endtime input").val().split(" ")[0] + " 08:00:00"
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            //获取地图站点数据
            //console.log(data.data);
            $.Data = data.data;
            if (n == 0) {
                var array = $.grep(data.data, function (d) {
                    return d.Level === "中央报汛站"
                });
                var size = 10;
                imgs = "_s"
            } else if (n == 1) {
                var array = $.grep(data.data, function (d) {
                    return d.Level === "中央报汛站" || d.Level == "省级重点报汛站"
                });
                var size = 15;
                imgs = ""
            } else if (n == 2) {
                var array = $.grep(data.data, function (d) {
                    return d.Level === "中央报汛站" || d.Level == "省级重点报汛站" || d.Level == "省级一般报汛站"
                });
                var size = 15;
                imgs = ""
            } else if (n == 3) {
                // var array = data.data；
                var array = $.grep(data.data, function (d) {
                    return d.Level === "中央报汛站" || d.Level == "省级重点报汛站" || d.Level == "省级一般报汛站" || d.Level == "其他报汛站"
                });
                var size = 15;
                imgs = ""
            } else if (n == 4) {
                var array = data.data;
                var size = 15;
                imgs = ""
            }
            var flood = $.grep(data.data, function (d) {
                return d.Level === "山洪站"
            });
            getMapstation(array, flood, size, imgs);
        } else {
            //显示数据错误提示
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//缩放加载筛选站点
function wheelData(n) {
    if (n == 0) {
        var array = $.grep($.Data, function (d) {
            return d.Level === "中央报汛站"
        });
        var size = 10;
        imgs = "_s"
    } else if (n == 1) {
        var array = $.grep($.Data, function (d) {
            return d.Level === "中央报汛站" || d.Level == "省级重点报汛站"
        });
        var size = 15;
        imgs = ""
    } else if (n == 2) {
        var array = $.grep($.Data, function (d) {
            return d.Level === "中央报汛站" || d.Level == "省级重点报汛站" || d.Level == "省级一般报汛站"
        });
        var size = 15;
        imgs = ""
    } else if (n == 3) {
        // var array = data.data；
        var array = $.grep($.Data, function (d) {
            return d.Level === "中央报汛站" || d.Level == "省级重点报汛站" || d.Level == "省级一般报汛站" || d.Level == "其他报汛站"
        });
        var size = 15;
        imgs = ""
    } else if (n == 4) {
        var array = $.Data;
        var size = 15;
        imgs = ""
    }
    var flood = $.grep($.Data, function (d) {
        return d.Level === "山洪站"
    });
    getMapstation(array, flood, size, imgs);
}

function isSearchLevel(code) {
    var isSearch = false;
    if (stationList != null && stationList.length > 0) {
        var s = $.grep(stationList, function (d) {
            return d.Code == code;
        });
        if (s != null && s.length > 0) {
            if (s[0].AreaLevel != "4" && s[0].AreaLevel != "5") {
                isSearch = true;
            }
        }
    }
    return isSearch;
}

//生成等值分析图
var mapdata = [];

//等值分析
function getGisAnalyzeMap() {
    if (timeValidcheck($("#starttime input").val().split(" ")[0]) && timeValidcheck($("#endtime input").val().split(" ")[0])) {
        jobId = null;
        clearAnalyzeLayer();
        var fenlei = [rain11, rain22, rain33, rain44, rain55, rain6, 99999];
        var tt = {
            "displayFieldName": "",
            "fields": [
                {
                    "name": "STCD",
                    "type": "esriFieldTypeString",
                    "alias": "STCD",
                    "length": 8000
                },
                {
                    "name": "STNM",
                    "type": "esriFieldTypeString",
                    "alias": "STNM",
                    "length": 8000
                },
                {
                    "name": "LGTD",
                    "type": "esriFieldTypeDouble",
                    "alias": "LGTD"
                },
                {
                    "name": "LTTD",
                    "type": "esriFieldTypeDouble",
                    "alias": "LTTD"
                },
                {
                    "name": "VALUE",
                    "type": "esriFieldTypeDouble",
                    "alias": "VALUE"
                },
                {
                    "name": "ObjectId",
                    "type": "esriFieldTypeOID",
                    "alias": "ObjectId"
                }
            ],
            "features": [],
            "exceededTransferLimit": false
        };

        var xydata = {
            "areaCode": "610400",
            "taskType": 1,
            "interval": 1,
            "points": [],
        }

        var kind = [];
        var type = [];

        var levels = [{
            name: "小雨",
            min: rain1.toString(),
            max: rain11.toString()
        }, {
            name: "中雨",
            min: rain2.toString(),
            max: rain22.toString()
        }, {
            name: "大雨",
            min: rain3.toString(),
            max: rain33.toString()
        }, {
            name: "暴雨",
            min: rain4.toString(),
            max: rain44.toString()
        }, {
            name: "大暴雨",
            min: rain5.toString(),
            max: rain55.toString()
        }, {
            name: "特大暴雨",
            min: rain6.toString(),
            max: "3000"
        }];
        //alert("开始时间："+ast1 + "  " + "结束时间："+aet1);
        $("#d_analysis .load-wrapp").removeClass("hidden");
        var user = JSON.parse($.cookie("user"));
        //获取单独站点信息
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/countStationRainData',
            // Uri: '/aControl/RainControl/countRainData',
            Parameter: {
                "rainCount.adcd": user.AreaCode,
                "rainCount.startTm": $("#starttime input").val() + ":00",
                "rainCount.endTm": $("#endtime input").val() + ":00"
            }
        };
        // $.ajax({
        //     dataType: 'text',
        //     // url: gisAnalyzeMapUrl + data.result,
        //     url:"http://172.16.5.45:9081/webearth/layer/analyze/1544778030473.geojson",
        //     type: "GET"
        // }).done(function (d) {
        //     var data=JSON.parse(d);
        //     $.each(data.features,function (i,v) {
        //         kind.push(v.properties.kind)
        //     })
        //     var model = {
        //         kinds:kind,
        //         interval:1,
        //         levels:levels
        //     }
        //     $.ajax({
        //         type: "Post",
        //         data: JSON.stringify(model),
        //         url: "http://172.16.5.91:8088/webearth/main/getKindLevelList",
        //         success: function (data) {
        //             alert(JSON.stringify(data));
        //             var tt=data.res;
        //             var a=$.grep(tt,function (d) {
        //                 return d.kind===103
        //             });
        //             console.log(a[0].level);
        //         }
        //     });
        // });
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
                if (data.success) {
                    mapdata = data.data;
                    var countRain = 0;
                    // console.log(data.data);
                    $.each(mapdata, function (i, v) {
                        if (v.frgrd != "4" && v.frgrd != "5") {
                            if (isSearchLevel(v.stcd)) {
                                var value = 0;
                                if (v.drp > 0 && v.drp < 1) {
                                    value = "1.1";
                                }
                                else if (v.drp > rain6) {
                                    value = "290";
                                }
                                else if (v.drp == null || v.drp == "") {
                                    value = "0";
                                }
                                else {
                                    value = v.drp;
                                }
                                xydata.points.push({
                                    "ID": i,
                                    "Lat": v.lttd,
                                    "Lon": v.lgtd,
                                    "Name": v.stnm,
                                    "Value": value
                                });
                                if (v.drp > 0) {
                                    countRain += 1;
                                }
                                // reclass.push(reclassCode(v.Value));
                            }
                        }
                    });
                    // //console.log(reclass);
                    //console.log(JSON.stringify(xydata));
                    //等值分析
                    // console.log(JSON.stringify(xydata));
                    // xydata = {
                    //     "displayFieldName": "",
                    //     "fields": [
                    //         {
                    //             "name": "STCD",
                    //             "type": "esriFieldTypeInteger",
                    //             "alias": "STCD"
                    //         },
                    //         // {
                    //         //     "name": "STNM",
                    //         //     "type": "esriFieldTypeString",
                    //         //     "alias": "STNM",
                    //         //     "length": 8000
                    //         // },
                    //         {
                    //             "name": "LGTD",
                    //             "type": "esriFieldTypeDouble",
                    //             "alias": "LGTD"
                    //         },
                    //         {
                    //             "name": "LTTD",
                    //             "type": "esriFieldTypeDouble",
                    //             "alias": "LTTD"
                    //         },
                    //         {
                    //             "name": "VALUE",
                    //             "type": "esriFieldTypeDouble",
                    //             "alias": "VALUE"
                    //         },
                    //         {
                    //             "name": "ObjectId",
                    //             "type": "esriFieldTypeOID",
                    //             "alias": "ObjectId"
                    //         }
                    //     ],
                    //     "features": [{"attributes":{"STCD":"41138702","LGTD":"108.523839","LTTD":"34.930452","VALUE":"2","ObjectId":0}},
                    //         {"attributes":{"STCD":"41234702","LGTD":"108.342957","LTTD":"34.885890","VALUE":"34","ObjectId":101}},
                    //         {"attributes":{"STCD":"41234752","LGTD":"108.427500","LTTD":"34.955600","VALUE":"55","ObjectId":102}},
                    //         {"attributes":{"STCD":"41234760","LGTD":"108.482106","LTTD":"34.842831","VALUE":"66","ObjectId":103}},
                    //         {"attributes":{"STCD":"41106650","LGTD":"108.213719","LTTD":"34.272058","VALUE":"4","ObjectId":104}},
                    //         {"attributes":{"STCD":"41133020","LGTD":"108.047778","LTTD":"34.384444","VALUE":"1","ObjectId":105}},
                    //         {"attributes":{"STCD":"41133030","LGTD":"108.106389","LTTD":"34.331389","VALUE":"4","ObjectId":106}},
                    //         {"attributes":{"STCD":"41133040","LGTD":"108.200833","LTTD":"34.326667","VALUE":"44","ObjectId":107}},
                    //         {"attributes":{"STCD":"41133825","LGTD":"108.418056","LTTD":"34.243333","VALUE":"44","ObjectId":108}},
                    //         {"attributes":{"STCD":"41134110","LGTD":"108.531944","LTTD":"34.359722","VALUE":"44","ObjectId":109}},
                    //         {"attributes":{"STCD":"41138952","LGTD":"108.731389","LTTD":"34.825000","VALUE":"43","ObjectId":110}},
                    //         {"attributes":{"STCD":"41101100","LGTD":"108.700000","LTTD":"34.316666","VALUE":"33","ObjectId":111}},
                    //         {"attributes":{"STCD":"41101300","LGTD":"109.201912","LTTD":"34.430699","VALUE":"44","ObjectId":112}},
                    //         {"attributes":{"STCD":"41101600","LGTD":"109.766666","LTTD":"34.583333","VALUE":"63","ObjectId":113}},
                    //         {"attributes":{"STCD":"41100600","LGTD":"107.030000","LTTD":"34.230000","VALUE":"77","ObjectId":114}},
                    //         {"attributes":{"STCD":"41100900","LGTD":"107.420000","LTTD":"34.180000","VALUE":"100","ObjectId":115}}],
                    //     "exceededTransferLimit": false
                    // }
                    if (countRain > 3) {
                        $.ajax({
                            url: gisAnalyzeMapUrl + "/main/getCustomAnalyze",
                            type: "POST",
                            // // headers: null,
                            // dataType: 'json',
                            data: JSON.stringify(xydata)
                        }).done(function (data) {
                            $.ajax({
                                dataType: 'text',
                                url: gisAnalyzeMapUrl + data.result,
                                // url: "http://172.16.5.45:9081/webearth/layer/analyze/1544778030473.geojson",
                                type: "GET"
                            }).done(function (d) {
                                var d = JSON.parse(d);
                                $.each(d.features, function (i, v) {
                                    if (v.properties.kind > 0) {
                                        kind.push(v.properties.kind)
                                    }
                                })
                                var model = {
                                    kinds: unique(kind),
                                    interval: 1,
                                    levels: levels
                                }
                                $.ajax({
                                    type: "Post",
                                    data: JSON.stringify(model),
                                    url: gisAnalyzeMapUrl + "/main/getKindLevelList",
                                    success: function (d2) {
                                        // alert(JSON.stringify(data));
                                        type = d2.res;
                                        var vectorSource = new ol.source.Vector({
                                            // features: (new ol.format.GeoJSON()).readFeatures(geojsonObject);
                                            projection: 'EPSG:4326',
                                            url: gisAnalyzeMapUrl + data.result,
                                            format: new ol.format.GeoJSON(),
                                        });

                                        console.log(vectorSource)
                                        var styles = {
                                            'xiaoyu': new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                    color: '#666',
                                                    width: 0.2
                                                }),
                                                fill: new ol.style.Fill({
                                                    color: 'rgb(158,246,129,0.5)'
                                                })
                                            }),
                                            'zhongyu': new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                    color: '#666',
                                                    width: 0.2
                                                }),
                                                fill: new ol.style.Fill({
                                                    color: 'rgb(53,167,5,0.5)'
                                                })
                                            }),
                                            'dayu': new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                    color: '#666',
                                                    width: 0.2
                                                }),
                                                fill: new ol.style.Fill({
                                                    color: 'rgb(94,184,248,0.5)'
                                                })
                                            }),
                                            'baoyu': new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                    color: '#666',
                                                    width: 0.2
                                                }),
                                                fill: new ol.style.Fill({
                                                    color: 'rgb(1,0,248,0.5)'
                                                })
                                            }),
                                            'dabaoyu': new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                    color: '#666',
                                                    width: 0.2
                                                }),
                                                fill: new ol.style.Fill({
                                                    color: 'rgb(249,4,245,0.5)'
                                                })
                                            }),
                                            'tedabaoyu': new ol.style.Style({
                                                stroke: new ol.style.Stroke({
                                                    color: '#666',
                                                    width: 0.2
                                                }),
                                                fill: new ol.style.Fill({
                                                    color: 'rgb(204,0,19,0.5)'
                                                })
                                            })
                                        };
                                        var styleFunction = function (feature) {
                                            if (feature.get("kind") > 0) {
                                                var a = $.grep(type, function (d) {
                                                    return d.kind === feature.get("kind")
                                                });
                                                if (a[0].level.name === "小雨") {
                                                    return styles["xiaoyu"];
                                                } else if (a[0].level.name === "中雨") {
                                                    return styles["zhongyu"];
                                                } else if (a[0].level.name === "大雨") {
                                                    return styles["dayu"];
                                                } else if (a[0].level.name === "暴雨") {
                                                    return styles["baoyu"];
                                                } else if (a[0].level.name === "大暴雨") {
                                                    return styles["dabaoyu"];
                                                } else if (a[0].level.name === "特大暴雨") {
                                                    return styles["tedabaoyu"];
                                                }
                                            }

                                            // console.log(feature.get("kind"));
                                            // if (feature.get("kind") > 0 && feature.get("kind") < 10) {
                                            //     return styles["xiaoyu"];
                                            // } else if (feature.get("kind") > 10 && feature.get("kind") < 25) {
                                            //     return styles["zhongyu"];
                                            // } else if (feature.get("kind") > 25 && feature.get("kind") < 50) {
                                            //     return styles["dayu"];
                                            // } else if (feature.get("kind") > 50 && feature.get("kind") < 100) {
                                            //     return styles["baoyu"];
                                            // } else if (feature.get("kind") > 100 && feature.get("kind") < 250) {
                                            //     return styles["dabaoyu"];
                                            // } else if (feature.get("kind") > 250 && feature.get("kind") < 1000) {
                                            //     return styles["tedabaoyu"];
                                            // }

                                        };

                                        var vectorLayer = new ol.layer.Vector({
                                            zIndex: 20,
                                            source: vectorSource,
                                            style: styleFunction
                                        });

                                        map2.addLayer(vectorLayer);
                                        $("#legend").show();
                                        $("#d_analysis .load-wrapp").addClass("hidden");
                                        $("#isoTitle").html($("#starttime input").val().split(" ")[0].split("-")[0] + "年" + $("#starttime input").val().split(" ")[0].split("-")[1] + "月" + $("#starttime input").val().split(" ")[0].split("-")[2] + "日至" + $("#endtime input").val().split(" ")[0].split("-")[0] + "年" + $("#endtime input").val().split(" ")[0].split("-")[1] + "月" + $("#endtime input").val().split(" ")[0].split("-")[2] + "日累计降雨量等值面图");
                                    }
                                });
                            });


                            // var timer = window.setInterval((function (d) {
                            //     return function () {
                            //         //等值分析gis接口
                            //         $.ajax({
                            //             headers: null,
                            //             contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                            //             url: serverConfig.gisAnalyzeMapUrl + "/model/jobs/" + d.jobId + "/export?f=pjson",
                            //             type: "GET"
                            //         }).done(function (jobStr) {
                            //             var jobData = jobStr;
                            //             //console.log(jobData);
                            //             if (jobData.jobStatus === "esriJobExecuting" || jobData.jobStatus === "esriJobSubmitted") return;
                            //             //等值分析生成图层
                            //             if (jobData.jobStatus === "esriJobSucceeded") {
                            //                 window.clearInterval(timer);
                            //                 jobId = jobData.jobId;
                            //                 var test = serverConfig.gisResultMapUrl + "/jobs/" + jobData.jobId + "/export";
                            //                 var contourMapLayer = new ol.layer.Tile({
                            //                     zIndex: -2,
                            //                     source: new ol.source.TileArcGISRest({
                            //                         crossOrigin: true,
                            //                         url: serverConfig.gisResultMapUrl + "/jobs/" + jobData.jobId + "/export",
                            //                         params: {
                            //                             LAYERS: "show:0",
                            //                             VERSION: '1.1.1'
                            //                         }
                            //                     })
                            //                 });
                            //                 map2.addLayer(contourMapLayer);
                            //                 layer.msg('生成等值分析图成功!');
                            //                 // layer.close(index); //如果设定了yes回调，需进行手工关闭
                            //                 $("#legend").show();
                            //                 $("#d_analysis .load-wrapp").addClass("hidden");
                            //                 $("#isoTitle").html($("#starttime input").val().split(" ")[0].split("-")[0] + "年" + $("#starttime input").val().split(" ")[0].split("-")[1] + "月" + $("#starttime input").val().split(" ")[0].split("-")[2] + "日至" + $("#endtime input").val().split(" ")[0].split("-")[0] + "年" + $("#endtime input").val().split(" ")[0].split("-")[1] + "月" + $("#endtime input").val().split(" ")[0].split("-")[2] + "日累计降雨量等值面图");
                            //             }
                            //         });
                            //     };
                            // })(JSON.parse(data)), 1000);
                        })
                    }
                    else {
                        alert("降雨量数据小于3个无法生成，请重新选择日期");
                        $("#d_analysis .load-wrapp").addClass("hidden");
                        return false;
                    }
                }
            }
        );
    } else {
        layer.msg("输入时间格式有误")
    }
}

//清除等值分析表缓存
function clearAnalyzeLayer() {
    if (map2 != null) {
        map2.getLayers().forEach(function (layer) {
            if (layer.getZIndex() === 20) {
                map2.removeLayer(layer);
            }
        });
    } else {
        initGisMap2();
    }
}


//设置报警信息弹窗的报警处理
function warningSet(source, which) {
    $(".warnbtn").popover('destroy');
    $(which).popover({
        'placement': 'left',
        'html': true,
        'content': '<div style="margin: 10px; color: #d43f3a; font-size: 14px;width: 300px;text-align: center">将异常数据【<span style="font-weight: bold">' + source.value + '</span>】修改为：<input type="number" value="' + source.value + '" class="warnupdate" style="color: #404040;width: 80px;" step="0.01"></p>' +
        '<div class="errortBtngroup"><button class="ok" onclick="Ok(' + source.id + ')">提交</button><button class="no" onclick="Off()">取消</button></div>' +
        '</div>'
    });
    $(which).popover('toggle');
}

//设置报警信息弹窗的类型统计
// function warningSet1(id, val, which) {
//     $(".warnbtn2").popover('destroy');
//     $(which).popover({
//         'placement': 'left',
//         'html': true,
//         'content': '<div style="margin: 10px; color: #d43f3a; font-size: 14px;width: 300px;text-align: center">将异常数据【<span style="font-weight: bold">' + val + '</span>】修改为：<input type="number" value="' + val + '" class="warnupdate" style="color: #404040;width: 80px;" step="0.01"></p>' +
//         '<div class="errortBtngroup"><button class="ok" onclick="Ok(' + id + ')">提交</button><button class="no" onclick="Off()">取消</button></div>' +
//         '</div>'
//     });
//     $(which).popover('toggle');
// }

//报警信息处理异常数据提交
function Ok(id) {
    var user = JSON.parse($.cookie("user"));
    var newdata = $(".warnupdate").val();
    var obj = {
        Type: 'post',
        Uri: '/warning/update',
        Parameter: {
            id: id,
            processerId: user.Id,
            processValue: newdata
        }
    };
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            //刷新报警信息及状态表格
            initWarning();
            warnTab();
        } else {
            //提示错误信息
            layer.msg(data.message, { time: 3000 });
        }
    });
    //关闭弹窗
    $(".warnbtn").popover('destroy');
}

function Off() {
    //报警处理信息不提交修改的异常数据方法
    $(".warnbtn").popover('destroy');
    $(".warnbtn2").popover('destroy');
}

//设置取消报警
function offWarn(source) {
    var user = JSON.parse($.cookie("user"));
    layer.confirm('是否取消报警？', {
        btn: ['确定', '取消'] //按钮
    }, function (index) {
        //console.log("yse");
        var obj = {
            Type: 'post',
            Uri: '/warning/cancelWarning',
            Parameter: {
                id: source.id,
                processerId: user.Id
            }
        };
        $.ajax({
            url: serverConfig.operationApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            layer.msg("提交成功");
            initWarning();
            warnTab();
            layer.close(index);
        });
    }, function (index) {
        layer.close(index);
    })
}


//报警处理信息弹窗
function warnTab() {
    $("#d_alarm .load-wrapp").removeClass("hidden");
    var user = JSON.parse($.cookie("user"));
    //封装请求参数
    ////console.log(param);
    //ajax请求数据
    var obj = {
        Type: 'get',
        Uri: '/warning/select',
        Parameter: {
            Code: user.AreaCode,
            Status: "0",
            Type: "",
            startTime: GetDateStr(-10) + " 00:00:00",
            endTime: GetDateStr(0) + " 23:59:59",
            start: 0,//当前页码
            length: 99999 //页面显示记录条数，在页面显示每页显示多少项的时候
        }
    };
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        //报警信息
        //加载条隐藏
        $("#d_alarm .load-wrapp").addClass("hidden");
        console.log(data.data);
        //报警处理信息筛选未处理状态数据
        warnrh = $.grep(data.data.data, function (d) {
            return d.remark === "超出1h雨量报警界限";
        });
        warnrf = $.grep(data.data.data, function (d) {
            return d.remark === "超出3h雨量报警界限";
        });
        warnreh = $.grep(data.data.data, function (d) {
            return d.remark === "超出6h雨量报警界限";
        });
        warnref = $.grep(data.data.data, function (d) {
            return d.remark === "超出水位变幅异常值";
        });
        warnrain = $.grep(data.data.data, function (d) {
            return d.remark === "超出重量含水量安全范围";
        });
        var status = $.grep(data.data.data, function (d) {
            return d.status == 0;
        });
        //报警处理信息数据列表
        var alarmtable = $('#alarm_table').DataTable({
            language: reportLanguage1,
            lengthChange: false,
            "aaData": data.data.data,
            "bAutoWidth": false,
            "bSort": false,
            "bDestroy": true,
            "paging": false,
            "searching": true,//是否显示搜索框
            "columns": [
                { "data": "time" },
                { "data": "stcd" },
                {
                    "data": "stnm",
                    "render": function (data, type, row, meta) {
                        return data.replace(/[ ]/g, "")
                    }
                },
                { "data": "frgrd" },
                { "data": "sttp" },
                { "data": "remark" },
                { "data": "value" },
                {
                    render: function (data, type, row) {
                        var source = JSON.stringify(row).replace(/\"/g, "'");
                        if (row.type == "WARNING_RAINFALL_3H" || row.type == "WARNING_RAINFALL_6H") {
                            return '<button type="button" class="btn btn-xs btn-warnning0 warnbtn" onclick="offWarn(' + source + ',this)">取消报警</button>';
                        } else {
                            return '<button type="button" class="btn btn-xs btn-warnning0 warnbtn" onclick="warningSet(' + source + ',this)">报警处理</button>';
                        }
                    }
                }
            ],
        });

        typestatistics_data = [
            {
                "id": 1,
                "alarmtype": "超出1h雨量报警界限",
                "station_total": warnrh.length,
                // "content": [
                //     { "station": "站00001", "stationid": 1 }
                // ]
                "content": warnrh
            },
            {
                "id": 2,
                "alarmtype": "超出3h雨量报警界限",
                "station_total": warnrf.length,
                "content": warnrf
            },
            {
                "id": 3,
                "alarmtype": "超出6h雨量报警界限",
                "station_total": warnreh.length,
                "content": warnreh
            },
            {
                "id": 4,
                "alarmtype": "超出水位变幅异常值",
                "station_total": warnref.length,
                "content": warnref
            },
            {
                "id": 5,
                "alarmtype": "超出重度含水量正常范围",
                "station_total": warnrain.length,
                "content": warnrain
            }
        ];
        var alarmtypetable = $('#alarmtype_table').DataTable({
            language: reportLanguage,
            lengthChange: false,
            // "iDisplayLength": 5,
            "aaData": typestatistics_data,
            "bAutoWidth": false,
            "bSort": false,
            "bDestroy": true,
            "paging": false,
            "searching": false,//是否显示搜索框
            // "aaSorting": [[2, "asc"]],
            "columns": [
                // {
                //     "class": 'details-control',
                //     "orderable": false,
                //     "data": null,
                //     "defaultContent": ''
                // },
                { "data": "alarmtype" },
                { "data": "station_total" }
            ]
        });
        // $('#alarmtype_table tbody').off().on('click', 'td.details-control', function () {
        //     var tr = $(this).closest('tr');
        //     var row = alarmtypetable.row(tr);
        //     if (row.child.isShown()) {
        //         // This row is already open - close it
        //         row.child.hide();
        //         tr.removeClass('shown');
        //     }
        //     else {
        //         // Open this row
        //         row.child(format(row.data(), 'alarm')).show();
        //         tr.addClass('shown');
        //     }
        // });
    })
}

// $(document).ready(function () {
//     //等值分析tab切换
//     $(".chooseBox ul li").on("click", function () {
//         var _this = $(this);
//         var _index = $(this).index();
//         _this.parent("ul").siblings(".tab").find(".tab0").eq(_index).addClass("active").siblings().removeClass("active");
//         _this.addClass("active").siblings().removeClass("active");
//         // $.fn.zTree.getZTreeObj('raintreeDemoCity').checkAllNodes(false);
//         // $.fn.zTree.getZTreeObj('raintreeDemoRiver').checkAllNodes(false);
//         // $.fn.zTree.getZTreeObj('soiltreeDemoCity').checkAllNodes(false);
//         // $.fn.zTree.getZTreeObj('soiltreeDemoRiver').checkAllNodes(false);
//     })
// });

//根据系统参数设置初始化图例及报警自动刷新时间
function initSetting() {
    $.ajax({
        async: true,
        headers: { Authorization: $.cookie("sessionid") },
        contentType: "application/json;charset=utf-8",
        cache: false,
        dataType: "json",
        url: serverConfig.apiBase + "setting/getsetting",
        type: "GET"
    }).done(function (data) {
        if (data.success) {
            $.each(data.data, function (i, v) {
                switch (v.Name) {
                    case "RAIN_LEVEL1":
                        $("#RAIN_LEVEL1").text(v.Value.split("-")[0]);
                        $("#RAIN_LEVEL11").text(v.Value.split("-")[1]);
                        rain1 = parseFloat(v.Value.split("-")[0]);
                        rain11 = parseFloat(v.Value.split("-")[1]);
                        break;
                    case "RAIN_LEVEL2":
                        $("#RAIN_LEVEL2").text(v.Value.split("-")[0]);
                        $("#RAIN_LEVEL22").text(v.Value.split("-")[1]);
                        rain2 = parseFloat(v.Value.split("-")[0]);
                        rain22 = parseFloat(v.Value.split("-")[1]);
                        break;
                    case "RAIN_LEVEL3":
                        $("#RAIN_LEVEL3").text(v.Value.split("-")[0]);
                        $("#RAIN_LEVEL33").text(v.Value.split("-")[1]);
                        rain3 = parseFloat(v.Value.split("-")[0]);
                        rain33 = parseFloat(v.Value.split("-")[1]);
                        break;
                    case "RAIN_LEVEL4":
                        $("#RAIN_LEVEL4").text(v.Value.split("-")[0]);
                        $("#RAIN_LEVEL44").text(v.Value.split("-")[1]);
                        rain4 = parseFloat(v.Value.split("-")[0]);
                        rain44 = parseFloat(v.Value.split("-")[1]);
                        break;
                    case "RAIN_LEVEL5":
                        $("#RAIN_LEVEL5").text(v.Value.split("-")[0]);
                        $("#RAIN_LEVEL55").text(v.Value.split("-")[1]);
                        rain5 = parseFloat(v.Value.split("-")[0]);
                        rain55 = parseFloat(v.Value.split("-")[1]);
                        break;
                    case "RAIN_LEVEL6":
                        $("#RAIN_LEVEL6").text(v.Value.split("-")[0]);
                        rain6 = parseFloat(v.Value.split("-")[0]);
                        break;
                    case "WARNING_TIME":
                        var intervalWarning = setInterval(function () {
                            $("#warn_refresh").trigger("click");
                        }, v.Value * 1000);
                        break;
                }
            })
        }
    });
}
