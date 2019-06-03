//监测查询参数
var params = {
    type: "river",
    startime: "",
    endtime: ""
}

var html = "";
var myChart = "";
var option = "";
var table = "";
var resizeWorldMapContainer = "";
var unit = "水位(m)";
var title = '河道水情';
var title1 = "水位(m)";
var subtitle = "";
$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata();
    //初始化监测站点数据
    initCode();
    //查询类型判断
    $("#selType").on("change", function () {
        // params.type = $(this).val();
        // alert(params.type);
        if ($(this).val() == 0) {
            //查询类型判断：河道水情
            params.type = "river";
        } else if ($(this).val() == 1) {
            //查询类型判断：水库水情
            params.type = "reservoir";
        } else if ($(this).val() == 2) {
            //查询类型判断：雨情
            params.type = "rain";
        } else if ($(this).val() == 3) {
            //查询类型判断：墒情
            params.type = "soil";
        }
    });
    //下拉框combox
    $(".leftNav select").select2();
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    $("#bxlevel").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert($("#stcode").val());
        initTreedata($("#stcode").val(), evt.params.data.id, $("#cztp").val())
    });
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata($("#stcode").val(),$("#bxlevel").val(), evt.params.data.id)
    });
    //右边图表自适应方法
    resizeWorldMapContainer = function () {
        document.getElementById('chart').style.width = (window.innerWidth - 253) + 'px';
        document.getElementById('chart').style.height = (window.innerHeight - 130) + 'px';
    };
    //右边图表自适应方法
    resizeWorldMapContainer();
    //右边图表初始化容器
    myChart = echarts.init(document.getElementById('chart'));
    //右边图表初始化
    option = {
        title: {
            text: title + title1 + "过程曲线",
            subtext: subtitle,
            left: 'center',
            textStyle: {
                fontSize: 16
            },
            itemGap: 6
        },
        tooltip: {
            trigger: 'item',
            show: true,
            showDelay: 0,
            hideDelay: 0,
            transitionDuration: 0,
            backgroundColor: 'rgba(255,0,255,0.7)',
            borderColor: '#f50',
            borderRadius: 8,
            borderWidth: 2,
            padding: 10,    // [5, 10, 15, 20]
            formatter: function (params, ticket, callback) {
                // //console.log(params);
                var res = params[1] + '<br/>' + "XX人数" + ' : ' + params[2];
                return res;
            }
        },

        grid: {
            left: '5%',
            right: '5%',
            top: "80",
            bottom: "80"
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 65,
                end: 85
            },
            {
                type: 'inside',
                realtime: true,
                start: 65,
                end: 85
            }
        ],
        toolbox: {
            right: 100,
            feature: {
                saveAsImage: {
                    title: "保存为图片",
                    iconStyle: {
                        normal: {
                            textAlign: "left"
                        }
                    },
                    excludeComponents: ["dataZoom", "toolbox"]
                }
            }
        },
        legend: {
            type: 'scroll',
            top: 40,
            //data: ['站点1', '站点2']
        },
        xAxis: {
            name: '时间/h',
            type: 'category',
            boundaryGap: false,
            //data: time,
        },
        yAxis: {
            type: 'value',
            name: unit,
            nameLocation: "end"
        },
        series: []
    };

    myChart.setOption(option);
    //右边图表自适应方法
    window.onresize = function () {
        //重置容器高宽
        resizeWorldMapContainer();
        myChart.resize();
    };


    //导出事件
    $("#exportFile").click(function () {
        if (params.type === "soil") {
            params.startime = $("#s-date").find("input").val();
            params.endtime = $("#e-date").find("input").val();
            if ($(".tab0:first ").hasClass("active")) {
                var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
                //console.log(powers);
            } else if ($(".tab0:last").hasClass("active")) {
                var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
                //console.log(powers);
            }
            var obj = {
                Type: 'post',
                Uri: '/data/exportsoildata',
                SessionId: $.cookie("sessionid"),
                Parameter: {
                    Codes: powers,
                    StartTime: params.startime + ":00",
                    EndTime: params.endtime + ":59"
                }
            };
            DownLoadFile({
                url: serverConfig.soilExportApi,
                data: obj
            });
        }
    });
    //统计查询方法
    $("#tongji").click(function () {
        // $(".nav-tabs").removeClass("disabled0");
        //开始时间
        params.startime = $("#s-date").find("input").val();
        //结束时间
        params.endtime = $("#e-date").find("input").val();
        //行政区域站点查询
        if ($(".tab0:first ").hasClass("active")) {
            var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
            //console.log(powers);
            //console.log(powers.join(","));
        } else if ($(".tab0:last").hasClass("active")) {
            //流域站点查询
            var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
            //console.log(powers);
        }
        //查询条件不能为空
        if (params.startime !== "" && params.endtime !== "" && powers.length !== 0) {
            //查询时图形报表总是显示
            $(".tab-pane").eq(0).addClass("active in").siblings().removeClass("in active");
            $(".navtab li").eq(0).addClass("active").siblings().removeClass("active");
            //河道水情查询
            if (params.type === "river") {
                unit = "水位(m)";
                html = "<option value='水位(m)'>水位</option><option value='流量(m³/s)'>流量</option>"
                chartfunc(unit, powers, 0);
                $("body").on("change", ".RIVER", function () {
                    unit = $(this).val();
                    title1 = $(this).val();
                    //河道水情数据类型选择
                    if (unit == "水位(m)") {
                        //水位数据类型下拉选项
                        html = "<option value='水位(m)' selected>水位</option><option value='流量(m³/s)'>流量</option>"
                        //水位统计生成图表
                        chartfunc(unit, powers, 0);
                    } else if (unit == "流量(m³/s)") {
                        //水位数据类型下拉选项：选择流量时执行
                        html = "<option value='水位(m)'>水位</option><option value='流量(m³/s)'  selected>流量</option>"
                        //流量统计生成图表
                        chartfunc(unit, powers, 1);
                    }
                });

            } else if (params.type === "reservoir") {
                html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)'>入库流量</option><option value='出库流量(m³/s)'>出库流量</option>";
                unit = "水位(m)";
                //水库水情(默认水位)统计生成图表
                chartfunc0(unit, powers, 0);
                $("body").on("change", ".shuiku", function () {
                    unit = $(this).val();
                    title1 = $(this).val();
                    //水库水情数据类型选择
                    if (unit == "水位(m)") {
                        html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)'>入库流量</option><option value='出库流量(m³/s)'>出库流量</option>";
                        //水库水情水位数据类型选择
                        chartfunc0(unit, powers, 0);
                    } else if (unit == "入库流量(m³/s)") {
                        html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)' selected>入库流量</option><option value='出库流量(m³/s)'>出库流量</option>";
                        //水库水情入库流量数据类型选择
                        chartfunc0(unit, powers, 1);
                    } else if (unit == "出库流量(m³/s)") {
                        html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)'>入库流量</option><option value='出库流量(m³/s)' selected>出库流量</option>";
                        //水库水情出库流量数据类型选择
                        chartfunc0(unit, powers, 2);
                    }
                });
            } else if (params.type === "rain") {
                //雨情数据类型选择
                var loading = "";
                $("#raintab").removeClass("hidden").siblings().addClass("hidden");
                //console.log(powers.join(","));
                //雨情数据类型选择查询传递参数
                var obj = {
                    Type: 'get',
                    Uri: '/aControl/RainControl/countRainData',
                    Parameter: {
                        "rainCount.stcd": powers.join(","),
                        "rainCount.startTm": params.startime + ":00",
                        "rainCount.endTm": params.endtime + ":59"
                    }
                };
                $.ajax({
                    url: serverConfig.rainfallfloodApi,
                    data: JSON.stringify(obj),
                    beforeSend: function (request) {
                        //加载条
                        loading = layer.load(2, {
                            shade: [0.5, '#fff']
                        });
                        // myChart.showLoading({
                        //     text: '数据加载中...',
                        //     zlevel: 2
                        // });
                    }
                }).done(function (data) {
                    //console.log(data);
                    //加载条隐藏
                    layer.close(loading);
                    html = "<option value='降雨量(m^3/s)'>降雨量</option>";
                    unit = "降雨量(mm)";
                    title = "降雨量(mm)";
                    $("#dataType").html(html);
                    $("#dataType").removeAttr("class");
                    if (data.success) {
                        //雨情统计数据列表
                        table = $('#rain-tab').DataTable({
                            aaData: data.data,
                            lengthChange: false,
                            searching: false,
                            destroy: true,
                            language: reportLanguage,
                            "iDisplayLength": 15,
                            ordering: false,
                            columns: [
                                {
                                    "data": null,
                                    "render": function (data, type, row, meta) {
                                        var startIndex = meta.settings._iDisplayStart;
                                        return meta.row + 1;
                                    }
                                },
                                { "data": "tm" },
                                { "data": "addvcd" },
                                { "data": "stnm" },
                                { "data": "addvnm" },
                                { "data": "bsnm" },
                                { "data": "rvnm" },
                                { "data": "hnnm" },
                                {
                                    "data": "drp",
                                    "render": function (data, type, row, meta) {
                                        if (data.length > 0) {
                                            return data
                                        } else {
                                            return 0
                                        }
                                    }
                                }
                            ]
                        });
                        // myChart.hideLoading();
                        var x_soil_data = [], stationame = [], chartsData = [];
                        $.each(data.data, function (key, obj) {
                            x_soil_data.push(obj.tm)
                        });
                        //雨情图形报表option设置
                        for (var i = 0; i < powers.length; i++) {
                            var tt = $.grep(data.data, function (d) {
                                return d.stcd == powers[i];
                            });
                            if (tt.length !== 0) {
                                var stationdata = [];
                                //console.log("找到的站点编码:" + powers[i]);
                                $.each(tt, function (key, obj) {
                                    var aa = {
                                        name: obj.tm,
                                        value: [obj.tm, obj.drp]
                                    }
                                    stationdata.push(aa);
                                });
                                var chartsobj = {
                                    name: tt[0].stnm,
                                    type: 'bar',
                                    // barGap: '-100%',
                                    barCategoryGap: '40%',
                                    barWidth: "15px",
                                    data: stationdata
                                };
                                chartsData.push(chartsobj);
                                stationame.push(tt[0].stnm)
                            }
                        }
                        //console.log(chartsData);
                        if (chartsData.length == 0) {
                            layer.msg("没有找到雨情相关站点数据")
                        }
                        //生成雨情图形报表
                        myChart.setOption({
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                }
                            },
                            title: {
                                text: title + "过程曲线",
                                subtext: params.startime + ":00 -" + params.endtime + ":59",
                                left: 'center',
                                textStyle: {
                                    fontSize: 16
                                },
                                itemGap: 6
                            },
                            grid: {
                                left: '5%',
                                right: '5%',
                                top: "95",
                                bottom: "80"
                            },
                            dataZoom: [
                                {
                                    show: true,
                                    realtime: true,
                                    start: 65,
                                    end: 85
                                },
                                {
                                    type: 'inside',
                                    realtime: true,
                                    start: 65,
                                    end: 85
                                }
                            ],
                            toolbox: {
                                right: 100,
                                feature: {
                                    saveAsImage: {
                                        title: "保存为图片",
                                        iconStyle: {
                                            normal: {
                                                textAlign: "left"
                                            }
                                        },
                                        excludeComponents: ["dataZoom", "toolbox"]
                                    }
                                }
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    animation: false,
                                    label: {
                                        backgroundColor: '#505765'
                                    }
                                },
                                formatter: function (params, ticket, callback) {
                                    var oo = [];
                                    for (var ii = 0; ii < params.length; ii++) {
                                        //console.log(params[ii]);
                                        var res = params[ii].seriesName + ': 时间:' + params[ii].data.value[0].replace("T", " ") + '  数据:' + params[ii].data.value[1] + "<br/>";
                                        oo.push(res);
                                    }
                                    return oo.join(" ")
                                }
                            },
                            legend: {
                                type: 'scroll',
                                top: 40,
                                data: stationame
                            },
                            xAxis: {
                                name: '时间/h',
                                type: 'time',
                                splitLine: {
                                    show: false
                                }
                            },
                            yAxis: {
                                name: unit,
                                inverse: true,
                                nameLocation: "start"
                            },
                            series: chartsData
                        }, true);
                    } else {
                        //错误提示
                        layer.msg(data.message, { time: 3000 });
                        //隐藏加载条
                        myChart.hideLoading();
                    }
                });

            } else if (params.type === "soil") {
                //alert($("#s-date").find("input").val());
                // myChart.showLoading({
                //     text: '数据加载中...'
                // });
                var loading = "";
                //墒情查询参数
                var obj = {
                    Type: 'post',
                    Uri: '/data/getsoildata',
                    Parameter: {
                        Codes: powers,
                        StartTime: params.startime + ":00",
                        EndTime: params.endtime + ":59"
                    }
                };
                ////console.log(obj);
                $.ajax({
                    url: serverConfig.soilApi,
                    data: JSON.stringify(obj),
                    beforeSend: function (request) {
                        loading = layer.load(2, {
                            shade: [0.5, '#fff'] //0.1透明度的白色背景
                        });
                    }
                }).done(function (data) {
                    if (data.success) {
                        layer.close(loading);
                        var x_soil_data = [], stationame = [], chartsData = [];
                        //console.log(data.data);
                        $("#soiltab").removeClass("hidden").siblings().addClass("hidden");
                        //墒情数据类型
                        html = "<option value='重量含水量（%）'>重量含水量</option>";
                        $("#dataType").html(html);
                        $("#dataType").removeAttr("class");
                        title = "墒情";
                        title1 = "重量含水量（%）";
                        unit = "重量含水量（%）";
                        //墒情数据分类
                        $.each(data.data, function (key, obj) {
                            x_soil_data.push(obj.Time.replace("T", " "))
                        });
                        //墒情图表option
                        for (var i = 0; i < powers.length; i++) {
                            var tt = $.grep(data.data, function (d) {
                                return d.Code == powers[i];
                            });
                            if (tt.length !== 0) {
                                var stationdata = [];
                                //console.log("找到的站点编码:" + powers[i]);
                                $.each(tt, function (key, obj) {
                                    var aa = {
                                        name: obj.Time,
                                        value: [obj.Time, obj.MA]
                                    }
                                    stationdata.push(aa);
                                });
                                var chartsobj = {
                                    name: tt[0].Name,
                                    type: 'line',
                                    symbolSize: 10,
                                    data: stationdata
                                };
                                chartsData.push(chartsobj);
                                stationame.push(tt[0].Name)
                            }
                        }
                        //console.log(chartsData);
                        // //console.log("找到的所有站点编码名组合:" + stationname);
                        // myChart.refresh;
                        if (chartsData.length == 0) {
                            layer.msg("没有找到墒情相关站点数据")
                        }
                        myChart.setOption({
                            title: {
                                text: title + title1 + "过程曲线",
                                subtext: params.startime + ":00 -" + params.endtime + ":59",
                                left: 'center',
                                textStyle: {
                                    fontSize: 16
                                },
                                itemGap: 6
                            },
                            //墒情图表位置
                            grid: {
                                left: '5%',
                                right: '5%',
                                top: "80",
                                bottom: "80"
                            },
                            dataZoom: [
                                {
                                    show: true,
                                    realtime: true,
                                    start: 65,
                                    end: 85
                                },
                                {
                                    type: 'inside',
                                    realtime: true,
                                    start: 65,
                                    end: 85
                                }
                            ],
                            toolbox: {
                                right: 100,
                                feature: {
                                    saveAsImage: {
                                        title: "保存为图片",
                                        iconStyle: {
                                            normal: {
                                                textAlign: "left"
                                            }
                                        },
                                        excludeComponents: ["dataZoom", "toolbox"]
                                    }
                                }
                            },
                            legend: {
                                data: stationame,
                                type: 'scroll',
                                top: 40
                            },
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    type: 'cross',
                                    animation: false,
                                    label: {
                                        backgroundColor: '#505765'
                                    }
                                },
                                padding: 5,
                                formatter: function (params, ticket, callback) {
                                    var oo = [];
                                    for (var ii = 0; ii < params.length; ii++) {
                                        //console.log(params[ii]);
                                        var res = params[ii].seriesName + ': 时间:' + params[ii].data.value[0].replace("T", " ") + '  数据:' + params[ii].data.value[1] + "<br/>";
                                        oo.push(res);
                                    }
                                    return oo.join(" ")
                                }
                            },
                            xAxis: {
                                name: '时间/h',
                                type: 'time',
                                splitLine: {
                                    show: false
                                }
                            },
                            yAxis: {
                                name: unit,
                                type: 'value',
                                inverse: false
                            },
                            series: chartsData
                        }, true);
                        //墒情数据列表
                        table = $('#soil-tab').DataTable({
                            aaData: data.data,
                            lengthChange: false,
                            searching: false,
                            destroy: true,
                            "iDisplayLength": 15,
                            language: reportLanguage,
                            ordering: false,
                            columns: [
                                { "data": null, "targets": 0 },
                                { "data": "Time" },
                                { "data": "Code" },
                                { "data": "Name" },
                                { "data": "AreaName" },
                                { "data": "RiverAreaName" },
                                { "data": "RiverSystemName" },
                                { "data": "RiverName" },
                                { "data": "M10" },
                                { "data": "M20" },
                                { "data": "M40" },
                                { "data": "MA" }
                            ],
                            fnDrawCallback: function () { //解决序号列没法生成的问题
                                var api = this.api();
                                var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数(适用于后台分页)
                                api.column(0).nodes().each(function (cell, i) {
                                    cell.innerHTML = 1 + i;
                                    //适用于后台分页 cell.innerHTML =  1 + i+startIndex;
                                });
                                api.column(1).nodes().each(function (cell, i) {
                                    cell.innerHTML = cell.innerHTML.replace("T", " ");
                                });
                            }
                        });
                    } else {
                        //提示错误信息
                        layer.msg(data.message, { time: 3000 });
                        layer.close(loading);
                    }
                });
            }
        } else {
            layer.msg("请选择站点以及开始和结束时间!")
        }
    });
    //初始化时间控件
    $("#s-date,#e-date").datetimepicker({
        format: "yyyy-mm-dd hh:ii",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 0,
        forceParse: 0,
        pickerPosition: "top-left",
        endDate: new Date()
    });
    //时间控件更新
    var timeupdatevalue = new Date();
    timeupdatevalue.setHours(0, 0)
    $("#s-date").datetimepicker('update', timeupdatevalue);
    $("#e-date").datetimepicker('update', new Date());

    //初始化数据表格（无数据状态）
    table = $('#river-tab').DataTable({
        aaData: null,
        lengthChange: false,
        "iDisplayLength": 15,
        searching: false,
        bDestroy: true,
        language: reportLanguage,
        ordering: false,
        columns: [
            { "data": null },
            { "data": "tm" },
            { "data": "stcd" },
            { "data": "stnm" },
            { "data": "bsnm" },
            { "data": "hnnm" },
            { "data": "rvnm" },
            { "data": "z" },
            { "data": "q" }
        ]
    });
    // $("#searchAction").click(function () {
    //     zTree = $.fn.zTree.getZTreeObj("treeDemoCity");
    //     nodes = zTree.getNodes();
    //     zTree.cancelSelectedNode();
    //     if ($("#searchTxt").val() != "") {
    //         searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt").val(), null);
    //         if (searchNodes != null && searchNodes != undefined) {
    //             for (var i = 0; i < searchNodes.length; i++) {
    //                 zTree.selectNode(searchNodes[i], true, false);
    //             }
    //         }
    //     }
    // });
    //
    // $("#searchAction1").click(function () {
    //     zTree = $.fn.zTree.getZTreeObj("treeDemoRiver");
    //     nodes = zTree.getNodes();
    //     zTree.cancelSelectedNode();
    //     if ($("#searchTxt1").val() != "") {
    //         searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt1").val(), null);
    //         if (searchNodes != null && searchNodes != undefined) {
    //             for (var i = 0; i < searchNodes.length; i++) {
    //                 zTree.selectNode(searchNodes[i], true, false);
    //             }
    //         }
    //     }
    // });
    //
    var selectData = [{ id: 0, text: '河道水情' }, { id: 1, text: '水库水情' }, { id: 2, text: '雨情' }, { id: 3, text: '墒情' }];
    $("#selType").select2({
        data: selectData
    })
});

//获取日期
function getDate(datestr) {
    var temp = datestr.split("-");
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}

function daysBetween(sDate1, sDate2) {
//Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
    return nDays;
};

//搜索站点
// function keydownSearch() {
//     $("#searchAction").click();
// };
//
// function keydownSearch1() {
//     $("#searchAction1").click();
// };

//初始化站点树
// function initTree() {
//     var setting = {
//         check: {
//             enable: true,
//             chkboxType: { "Y": "ps", "N": "ps" }
//             //chkboxType: { "Y": "ps", "N": "ps" },
//         },
//         data: {
//             simpleData: {
//                 enable: true,
//                 idKey: "id", // id编号命名
//                 pIdKey: "pId", // 父id编号命名
//                 rootPId: 0
//             }
//         },
//         view: {
//             showIcon: true
//         }
//     };
//     $.fn.zTree.init($("#treeDemoCity"), setting, JSON.parse(localStorage.getItem("treearea")));
//     $.fn.zTree.init($("#treeDemoRiver"), setting, JSON.parse(localStorage.getItem("treeriver")));
//     var treeObj = $.fn.zTree.getZTreeObj("treeDemoCity");
//     treeObj.expandAll(true);
//     var treeObjr = $.fn.zTree.getZTreeObj("treeDemoRiver");
//     treeObjr.expandAll(true);
// }

//遍历选择的树形节点
function GetNodeIds(zTree, nodes, ids) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && !nodes[i].getCheckStatus().half) {
            if (nodes[i].id.length === 8) {
                ids.push(nodes[i].id)
            }
        }
        if (nodes[i].children != null) {
            GetNodeIds(zTree, nodes[i].children, ids);
        }
    }
    return ids;
}

//显示查询河道水情图表方法
function chartfunc(unit0, powers, type) {
    var loading = "";
    $("#rivertab").removeClass("hidden").siblings().addClass("hidden");
    //向中间服务传递查询参数
    var obj = {
        Type: 'get',
        Uri: '/aControl/RiverControl/riverWaterInfo',
        Parameter: {
            "waterInfo.stcd": powers.join(","),
            "waterInfo.startTm": params.startime + ":00",
            "waterInfo.endTm": params.endtime + ":59"
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj),
        beforeSend: function (request) {
            loading = layer.load(2, {
                shade: [0.5, '#fff']
            });
        }
    }).done(function (data) {
        //console.log(data.data);
        if (data.success) {
            //加载条隐藏
            layer.close(loading);
            //图表标题
            title = "河道水情";
            $("#dataType").html(html);
            $("#dataType").removeAttr("class");
            $("#dataType").addClass("RIVER");
            var x_soil_data = [], stationame = [], chartsData = [];
            $.each(data.data, function (key, obj) {
                x_soil_data.push(obj.tm)
            });
            //河道水情图表选项配置
            for (var i = 0; i < powers.length; i++) {
                var tt = $.grep(data.data, function (d) {
                    return d.stcd == powers[i];
                });
                if (tt.length !== 0) {
                    var stationdata = [];
                    //console.log("找到的站点编码:" + powers[i]);
                    if (type == 0) {
                        $.each(tt, function (key, obj) {
                            var aa = {
                                name: obj.tm,
                                value: [obj.tm, obj.z]
                            };
                            stationdata.push(aa);
                        });
                    } else if (type == 1) {
                        $.each(tt, function (key, obj) {
                            var aa = {
                                name: obj.tm,
                                value: [obj.tm, obj.q]
                            };
                            stationdata.push(aa);
                        });
                    }
                    var chartsobj = {
                        name: tt[0].stnm.replace(/[ ]/g, ""),
                        type: 'line',
                        symbolSize: 10,
                        data: stationdata
                    };
                    chartsData.push(chartsobj);
                    stationame.push(tt[0].stnm.replace(/[ ]/g, ""));
                }
            }
            //console.log(chartsData);
            //console.log("找到的所有站点名称：" + stationame);
            if (chartsData.length == 0) {
                layer.msg("没有找到河道水情相关站点数据")
            }
            //查询站点
            myChart.setOption({
                title: {
                    text: title + title1 + "过程曲线",
                    subtext: params.startime + "00--" + params.endtime + ":59",
                    left: 'center',
                    textStyle: {
                        fontSize: 16
                    },
                    itemGap: 6
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: "80",
                    bottom: "80"
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 65,
                        end: 85
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 65,
                        end: 85
                    }
                ],
                toolbox: {
                    right: 100,
                    feature: {
                        saveAsImage: {
                            title: "保存为图片",
                            iconStyle: {
                                normal: {
                                    textAlign: "left"
                                }
                            },
                            excludeComponents: ["dataZoom", "toolbox"]
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    },
                    formatter: function (params, ticket, callback) {
                        var oo = [];
                        for (var ii = 0; ii < params.length; ii++) {
                            //console.log(params[ii]);
                            var res = params[ii].seriesName + ': 时间:' + params[ii].data.value[0].replace("T", " ") + '  数据:' + params[ii].data.value[1] + "<br/>";
                            oo.push(res);
                        }
                        return oo.join(" ")
                    }
                },
                legend: {
                    type: 'scroll',
                    top: 40,
                    data: stationame
                },
                xAxis: {
                    name: '时间/h',
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    name: unit0
                },
                series: chartsData
            }, true);

            //河道水情数据列表
            table = $('#river-tab').DataTable({
                aaData: data.data,
                lengthChange: false,
                searching: false,
                "iDisplayLength": 15,
                bDestroy: true,
                language: reportLanguage,
                ordering: false,
                columns: [
                    {
                        "data": null,
                        "render": function (data, type, row, meta) {
                            var startIndex = meta.settings._iDisplayStart;
                            return meta.row + 1;
                        }
                    },
                    { "data": "tm" },
                    { "data": "stcd" },
                    {
                        "data": "stnm",
                        "render": function (data, type, row, meta) {
                            return data.replace(/[ ]/g, "")
                        }
                    },
                    { "data": "bsnm" },
                    { "data": "hnnm" },
                    { "data": "rvnm" },
                    { "data": "z" },
                    { "data": "q" },
                ]
            });
        } else {
            //提示错误信息
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//水库水情查询数据方法函数
function chartfunc0(unit0, powers, type) {
    var loading = "";
    //pp作为水库暂时假数据
    // var pp = ["40610222"];
    var obj = {
        Type: 'get',
        Uri: '/aControl/RsvrControl/rsvrWaterInfo',
        Parameter: {
            // "waterInfo.stcd": powers.join(","),
            "waterInfo.stcd": powers.join(","),
            "waterInfo.startTm": params.startime + ":00",
            "waterInfo.endTm": params.endtime + ":59"
        }
    };

    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj),
        beforeSend: function (request) {
            loading = layer.load(2, {
                shade: [0.5, '#fff']
            });
        }
    }).done(function (data) {
        if (data.success) {
            //加载条隐藏
            layer.close(loading);
            $("#reservoirtab").removeClass("hidden").siblings().addClass("hidden");
            //图表标题
            title = "水库水情";
            $("#dataType").html(html);
            $("#dataType").removeAttr("class");
            $("#dataType").addClass("shuiku");
            var x_soil_data = [], stationame = [], chartsData = [];
            $.each(data.data, function (key, obj) {
                x_soil_data.push(obj.tm)
            });
            //水库水情图表option配置
            for (var i = 0; i < powers.length; i++) {
                var tt = $.grep(data.data, function (d) {
                    return d.stcd == powers[i];
                });
                if (tt.length !== 0) {
                    var stationdata = [];
                    //console.log("找到的站点编码:" + powers[i]);
                    if (type == 0) {
                        $.each(tt, function (key, obj) {
                            var aa = {
                                name: obj.tm,
                                value: [obj.tm, obj.rz]
                            }
                            stationdata.push(aa);
                        });
                    } else if (type == 1) {
                        $.each(tt, function (key, obj) {
                            var aa = {
                                name: obj.tm,
                                value: [obj.tm, obj.inq]
                            }
                            stationdata.push(aa);
                        });
                    } else if (type == 2) {
                        $.each(tt, function (key, obj) {
                            var aa = {
                                name: obj.tm,
                                value: [obj.tm, obj.otq]
                            }
                            stationdata.push(aa);
                        });
                    }
                    var chartsobj = {
                        name: tt[0].stnm.replace(/[ ]/g, ""),
                        type: 'line',
                        symbolSize: 10,
                        data: stationdata
                    };
                    chartsData.push(chartsobj);
                    stationame.push(tt[0].stnm)
                }
            }
            //console.log(chartsData);
            if (chartsData.length == 0) {
                layer.msg("没有找到水库水情相关站点数据")
            }
            myChart.setOption({
                title: {
                    text: title + title1 + "过程曲线",
                    subtext: params.startime + ":00--" + params.endtime + ":59",
                    left: 'center',
                    textStyle: {
                        fontSize: 16
                    },
                    itemGap: 6
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    top: "80",
                    bottom: "80"
                },
                dataZoom: [
                    {
                        show: true,
                        realtime: true,
                        start: 65,
                        end: 85
                    },
                    {
                        type: 'inside',
                        realtime: true,
                        start: 65,
                        end: 85
                    }
                ],
                toolbox: {
                    right: 100,
                    feature: {
                        saveAsImage: {
                            title: "保存为图片",
                            iconStyle: {
                                normal: {
                                    textAlign: "left"
                                }
                            },
                            excludeComponents: ["dataZoom", "toolbox"]
                        }
                    }
                },
                legend: {
                    type: 'scroll',
                    top: 40,
                    data: stationame
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        animation: false,
                        label: {
                            backgroundColor: '#505765'
                        }
                    },
                    formatter: function (params, ticket, callback) {
                        var oo = [];
                        for (var ii = 0; ii < params.length; ii++) {
                            //console.log(params[ii]);
                            var res = params[ii].seriesName + ': 时间:' + params[ii].data.value[0].replace("T", " ") + '  数据:' + params[ii].data.value[1] + "<br/>";
                            oo.push(res);
                        }
                        return oo.join(" ")
                    }
                },
                xAxis: {
                    name: '时间/h',
                    type: 'time',
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    name: unit0
                },
                series: chartsData
            }, true);

            //水库水情数据列表
            table = $('#reservoir-tab').DataTable({
                aaData: data.data,
                lengthChange: false,
                searching: false,
                destroy: true,
                "iDisplayLength": 15,
                language: reportLanguage,
                ordering: false,
                columns: [
                    {
                        "data": null,
                        "render": function (data, type, row, meta) {
                            var startIndex = meta.settings._iDisplayStart;
                            return meta.row + 1;
                        }
                    },
                    { "data": "tm" },
                    { "data": "stcd" },
                    { "data": "stnm" },
                    { "data": "bsnm" },
                    { "data": "hnnm" },
                    { "data": "rvnm" },
                    { "data": "rz" },
                    { "data": "inq" },
                    { "data": "otq" }
                ]
            });
        } else {
            //错误信息提示
            layer.msg(data.message, { time: 3000 });
        }
    })
}