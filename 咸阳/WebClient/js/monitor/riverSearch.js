//监测查询参数
var params = {
    type: "river",
    querytp: "0",
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
var powers,powerscon,powersconall = [];
$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata(2);
    //初始化监测站点数据
    initCode(2);
    //查询类型判断
    $("#queryType").on("change", function () {
        params.querytp = $(this).val();
        if (params.querytp == 0) {
            $("#cc-st").text("开始时间");
            $("#cc-et").text("结束时间");
            $("#s-date,#e-date").datetimepicker('remove');
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
                pickerPosition: "bottom-left",
                endDate: new Date()
            });
            //时间控件更新
            var timeupdatevalue = new Date();
            var timeupdatevalue2 = new Date();
            timeupdatevalue.setHours(0, 0);
            timeupdatevalue2.setDate(timeupdatevalue2.getDate(), 0);
            timeupdatevalue2.setHours(23, 0);
            timeupdatevalue2.setMinutes(59, 0);
            $("#s-date").datetimepicker('update', timeupdatevalue);
            $("#e-date").datetimepicker('update', timeupdatevalue2);
        } else {
            $("#cc-st").text("开始月份");
            $("#cc-et").text("结束月份");
            $("#s-date,#e-date").datetimepicker('remove');
            $("#s-date,#e-date").datetimepicker({
                format: "yyyy-mm",
                language: 'zh-CN',
                weekStart: 1,
                todayBtn: true,
                autoclose: true,
                todayHighlight: 1,
                startView: 3,
                minView: 3,
                forceParse: 0,
                pickerPosition: "bottom-left",
                endDate: new Date()
            });
            var mm = new Date();
            mm.setMonth(new Date().getMonth() + 1);
            $("#s-date").datetimepicker('update', new Date());
            $("#e-date").datetimepicker('update', mm);
        }
    });
    //下拉框combox
    $(".leftNav select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(2, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert($("#stcode").val());
    //     initTreedata(2, $("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(2, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(2, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(2, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    var selecthtml = '<option value="">全部</option><option value="ZZ">河道水位站</option><option value="ZQ">河道水文站</option>';
    $("#cztp").html(selecthtml);
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(2, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
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

    //右边图表自适应方法
    window.onresize = function () {
        //重置容器高宽
        resizeWorldMapContainer();
        myChart.resize();
    };


    //导出事件

    //统计查询方法
    $("#tongji").click(function () {
        initRiver();
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
        pickerPosition: "bottom-left",
        endDate: new Date()
    });
    //时间控件更新
    var timeupdatevalue = new Date();
    var timeupdatevalue2 = new Date();
    // if (timeupdatevalue.getHours() < 8) {
    //     timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
    //     timeupdatevalue.setHours(8, 0);
    //     timeupdatevalue2.setHours(8, 0);
    // } else {
    //     timeupdatevalue2.setDate(timeupdatevalue2.getDate() + 1, 0);
    //     timeupdatevalue.setHours(8, 0);
    //     timeupdatevalue2.setHours(8, 0);
    // }
    timeupdatevalue.setHours(0, 0);
    timeupdatevalue2.setDate(timeupdatevalue2.getDate(), 0);
    timeupdatevalue2.setHours(23, 0);
    timeupdatevalue2.setMinutes(59, 0);
    $("#s-date").datetimepicker('update', timeupdatevalue);
    $("#e-date").datetimepicker('update', timeupdatevalue2);
    initRiver();
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

//遍历选择的树形节点(部分站点对比)
function GetNodeCodes(zTree, nodes, ids) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && !nodes[i].getCheckStatus().half) {
            if (nodes[i].id.length === 8) {
                ids.push({"code":nodes[i].id,"name":nodes[i].name});
            }
        }
        if (nodes[i].children != null) {
            GetNodeCodes(zTree, nodes[i].children, ids);
        }
    }
    return ids;
}

//遍历选择的树形节点(全部对比)
function GetNodeCodes2(zTree, nodes, ids) {
    for (var i = 0; i < nodes.length; i++) {
        if (!nodes[i].getCheckStatus().half) {
            if (nodes[i].id.length === 8) {
                ids.push({"code":nodes[i].id,"name":nodes[i].name});
            }
        }
        if (nodes[i].children != null) {
            GetNodeCodes2(zTree, nodes[i].children, ids);
        }
    }
    return ids;
}

function initRiver() {
    //开始时间
    params.startime = $("#s-date").find("input").val();
    //结束时间
    params.endtime = $("#e-date").find("input").val();
    //行政区域站点查询
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        powerscon=GetNodeCodes($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        powersconall=GetNodeCodes2($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), [])
        //console.log(powers.join(","));
    } else if ($(".tab0:last").hasClass("active")) {
        //流域站点查询
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        powerscon=GetNodeCodes($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        powersconall=GetNodeCodes2($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), [])
        //console.log(powers);
    }
    //查询条件不能为空
    if (params.startime !== "" && params.endtime !== "" && powers.length !== 0) {
        //查询时图形报表总是显示
        $(".tab-pane").eq(0).addClass("active in").siblings().removeClass("in active");
        $(".navtab li").eq(0).addClass("active").siblings().removeClass("active");
        //河道水情信息表查询
        unit = "水位(m)";
        html = "<option value='水位(m)'>水位</option><option value='流量(m³/s)'>流量</option>";
        if (params.querytp == 0) {
            if (timeValidcheck(params.startime.split(" ")[0]) && timeValidcheck(params.endtime.split(" ")[0])) {
                chartfunc(unit, powers, 0, params.querytp);
            } else {
                layer.msg("输入时间格式有误")
            }
        } else {
            chartfunc(unit, powers, 0, params.querytp);
        }
    } else {
        layer.msg("请选择站点以及开始和结束时间!")
    }
}

//显示河道水情对比图表(单个)方法
function showrivercharts(tt,unit0,type) {
    var waterHeight = [];
    var stationame = [], chartsData = [];

    if (tt.length !== 0) {
        var stationdata = [];
        //console.log("找到的站点编码:" + powers[i]);
        if (type == 0) {
            $.each(tt, function (key, obj) {
                if (obj.z !== null && obj.z !== "") {
                    var aa = {
                        name: obj.tm,
                        value: [obj.tm, obj.z]
                    };
                    stationdata.push(aa);
                    waterHeight.push(obj.z);
                }
            });
        } else if (type == 1) {
            waterHeight = [];
            $.each(tt, function (key, obj) {
                if (obj.q !== null && obj.q !== "") {
                    var aa = {
                        name: obj.tm,
                        value: [obj.tm, formatFlow(obj.q)]
                    };
                    stationdata.push(aa);
                    // waterHeight.push(obj.q);
                }
            });
        }
        var chartsobj = {
            name: tt[0].stnm.replace(/[ ]/g, ""),
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            smooth: true,
            data: stationdata
        };
        chartsData.push(chartsobj);
        stationame.push(tt[0].stnm.replace(/[ ]/g, ""));
    }
    // console.log(waterHeight);
    // alert(Math.max.apply(null, waterHeight) + 1);
    //console.log("找到的所有站点名称：" + stationame);
    if (chartsData.length == 0) {
        layer.msg("没有找到河道水情相关数据");
        stationame = [];
    }
    //查询站点
    myChart.setOption({
        title: {
            text: "河道水情信息过程图",
            subtext: params.startime + ":00 --" + params.endtime + ":00",
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
            bottom: "100"
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                bottom:50
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
                    backgroundColor: '#9BCD9B'
                }
            },
            backgroundColor: '#9BCD9B',
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
            name: unit0,
            max: waterHeight.length > 0 ? (Math.max.apply(null, waterHeight) + 0.1).toFixed(2) : null,
            min: waterHeight.length > 0 ? (Math.min.apply(null, waterHeight) - 0.1).toFixed(2) : null
            // max: Math.max.apply(null, waterHeight) + 1,
            // min: Math.min.apply(null, waterHeight) - 1
        },
        series: chartsData
    }, true);
}

//显示河道水情对比图表(两个)方法
function showrivercharts2(tt,tt2,unit0,type) {
    var waterHeight= [],waterHeight2 = [];
    var stationame = [], chartsData = [];
    var stationdata= [],stationdata2 = [];
    if (tt.length !== 0) {
        //console.log("找到的站点编码:" + powers[i]);
        if (type == 0) {
            $.each(tt, function (key, obj) {
                if (obj.z !== null && obj.z !== "") {
                    var aa = {
                        name: obj.tm,
                        value: [obj.tm, obj.z]
                    };
                    stationdata.push(aa);
                    waterHeight.push(obj.z);
                }
            });
        } else if (type == 1) {
            waterHeight = [];
            $.each(tt, function (key, obj) {
                if (obj.q !== null && obj.q !== "") {
                    var aa = {
                        name: obj.tm,
                        value: [obj.tm, formatFlow(obj.q)]
                    };
                    stationdata.push(aa);
                    // waterHeight.push(obj.q);
                }
            });
        }
        var chartsobj = {
            name: tt[0].stnm.replace(/[ ]/g, ""),
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            smooth: true,
            data: stationdata
        };
        chartsData.push(chartsobj);
        stationame.push(tt[0].stnm.replace(/[ ]/g, ""));
    }
    if (tt2.length !== 0) {
        //console.log("找到的站点编码:" + powers[i]);
        if (type == 0) {
            $.each(tt2, function (key, obj) {
                if (obj.z !== null && obj.z !== "") {
                    var aa = {
                        name: obj.tm,
                        value: [obj.tm, obj.z]
                    };
                    stationdata2.push(aa);
                    waterHeight2.push(obj.z);
                }
            });
        } else if (type == 1) {
            waterHeight2 = [];
            $.each(tt2, function (key, obj) {
                if (obj.q !== null && obj.q !== "") {
                    var aa = {
                        name: obj.tm,
                        value: [obj.tm, formatFlow(obj.q)]
                    };
                    stationdata2.push(aa);
                    // waterHeight.push(obj.q);
                }
            });
        }
        var chartsobj2 = {
            name: tt2[0].stnm.replace(/[ ]/g, ""),
            type: 'line',
            symbol: 'circle',
            symbolSize: 6,
            xAxisIndex: 1,
            yAxisIndex: 1,
            smooth: true,
            data: stationdata2
        };
        chartsData.push(chartsobj2);
        stationame.push(tt2[0].stnm.replace(/[ ]/g, ""));
    }
    // console.log(waterHeight);
    // alert(Math.max.apply(null, waterHeight) + 1);
    //console.log("找到的所有站点名称：" + stationame);
    if (chartsData.length == 0) {
        layer.msg("没有找到河道水情相关数据");
        stationame = [];
    }
    //查询站点
    myChart.setOption({
        title: {
            text: "河道水情信息过程图",
            subtext: params.startime + ":00 --" + params.endtime + ":00",
            left: 'center',
            textStyle: {
                fontSize: 16
            },
            itemGap: 6
        },
        grid: [{
            left: '5%',
            right: '5%',
            height: '240px',
            top: "80"
        },{
            left: '5%',
            right: '5%',
            top: "385",
            height: '240px'
        }],
        dataZoom: [
            {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                xAxisIndex: [0, 1],
                bottom:50
            },
            {
                realtime: true,
                start: 0,
                end: 100,
                xAxisIndex: [0, 1],
                bottom:50
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
                    backgroundColor: '#9BCD9B'
                }
            },
            backgroundColor: '#9BCD9B',
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
        xAxis: [{
            name: '时间/h',
            type: 'time',
            splitLine: {
                show: false
            }
        },{
            gridIndex: 1,
            name: '时间/h',
            type: 'time',
            splitLine: {
                show: false
            }
        }],

        yAxis: [{
            name: unit0,
            max: waterHeight.length > 0 ? (Math.max.apply(null, waterHeight) + 0.1).toFixed(2) : null,
            min: waterHeight.length > 0 ? (Math.min.apply(null, waterHeight) - 0.1).toFixed(2) : null
            // max: Math.max.apply(null, waterHeight) + 1,
            // min: Math.min.apply(null, waterHeight) - 1
        },{
            gridIndex: 1,
            name: unit0,
            max: waterHeight2.length > 0 ? (Math.max.apply(null, waterHeight2) + 0.1).toFixed(2) : null,
            min: waterHeight2.length > 0 ? (Math.min.apply(null, waterHeight2) - 0.1).toFixed(2) : null
            // max: Math.max.apply(null, waterHeight) + 1,
            // min: Math.min.apply(null, waterHeight) - 1
        }],
        series: chartsData
    }, true);
}


//显示查询河道水情图表方法
function chartfunc(unit0, powers, type, cctp) {
    var loading = "";
    $("#rivertab").removeClass("hidden").siblings().addClass("hidden");
    //向中间服务传递查询参数
    if (cctp == 0) {
        $('a[href="#chart0"]').parent("li").removeAttr("style");
        $('a[href="#chart0"]').css("pointer-events", "visible");
        var obj = {
            Type: 'get',
            Uri: '/aControl/RiverControl/riverWaterInfo',
            Parameter: {
                "waterInfo.stcd": powers.join(","),
                //"waterInfo.adcd":610402,
                "waterInfo.startTm": params.startime + ":00",
                "waterInfo.endTm": params.endtime + ":59"
            }
        };
    } else if (cctp == 1) {
        $('a[href="#chart0"]').parent("li").css({
            "cursor": "not-allowed",
            "background": "#e0e0e0",
            "opacity": "0.5"
        });
        $('a[href="#chart0"]').css("pointer-events", "none");
        // 旬平均流量
        var obj = {
            Type: 'get',
            Uri: '/aControl/RiverControl/wholeMonthAvgQInfo',
            Parameter: {
                //"waterInfo.adcd":610402,
                "waterInfo.stcd": powers.join(","),
                "waterInfo.startTm": params.startime + "-01 08:00:00",
                "waterInfo.endTm": getAfterMonth(params.endtime) + "-01 08:00:00"
            }
        }
    } else if (cctp == 2) {
        // 月平均流量
        $('a[href="#chart0"]').parent("li").css({
            "cursor": "not-allowed",
            "background": "#e0e0e0",
            "opacity": "0.5"
        });
        $('a[href="#chart0"]').css("pointer-events", "none");
        var obj = {
            Type: 'get',
            Uri: '/aControl/RiverControl/monthAvgQInfo',
            Parameter: {
                //"waterInfo.adcd": 610402,
                "waterInfo.stcd": powers.join(","),
                "waterInfo.startTm": getPreMonth(params.startime) + "-01 08:00:00",
                "waterInfo.endTm": params.endtime + "-01 08:00:00"
            }
        }

    } else if (cctp == 3) {
        // 旬径流量
        $('a[href="#chart0"]').parent("li").css({
            "cursor": "not-allowed",
            "background": "#e0e0e0",
            "opacity": "0.5"
        });
        $('a[href="#chart0"]').css("pointer-events", "none");
        var obj = {
            Type: 'get',
            Uri: '/aControl/RiverControl/wholeMonthWInfo',
            Parameter: {
                //"waterInfo.adcd": 610402,
                "waterInfo.stcd": powers.join(","),
                "waterInfo.startTm": params.startime + "-01 08:00:00",
                "waterInfo.endTm": getAfterMonth(params.endtime) + "-01 08:00:00"
            }
        }

    } else if (cctp == 4) {
        // 月径流量
        $('a[href="#chart0"]').parent("li").css({
            "cursor": "not-allowed",
            "background": "#e0e0e0",
            "opacity": "0.5"
        });
        $('a[href="#chart0"]').css("pointer-events", "none");
        var obj = {
            Type: 'get',
            Uri: '/aControl/RiverControl/monthWInfo',
            Parameter: {
                //"waterInfo.adcd": 610402,
                "waterInfo.stcd": powers.join(","),
                "waterInfo.startTm": getPreMonth(params.startime) + "-01 08:00:00",
                "waterInfo.endTm": params.endtime + "-01 08:00:00"
            }
        }

    }
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
            console.log(data.data);
            // var data.data=[];
            // for(var i=0;i<data.data.length;i++){
            //     if(data.data[i].stnm.replace(/[ ]/g, "")=="咸阳"||data.data[i].stnm.replace(/[ ]/g, "")=="杨陵"){
            //         data.data.push(data.data[i])
            //     }
            // }
            layer.close(loading);
            if (cctp == 0) {
                var html0="";
                var html1 = '<option value="">请选择</option>';
                $.each(powerscon,function (key, obj) {
                    html0 += "<option value='" + obj.code + "'>" + obj.name + "(" + obj.code + ")</option>";
                });
                $.each(powersconall,function (key, obj) {
                    html1 += "<option value='" + obj.code + "'>" + obj.name + "(" + obj.code + ")</option>";
                });
                $("#stnm0").html(html0);
                $("#stnm1").html(html1);
                $("#stnm0").select2();
                $("#stnm1").select2();
                title = "河道水情";
                $("#dataType").html(html);
                $("#dataType").removeAttr("class");
                $("#dataType").addClass("RIVER");

                //河道水情图表选项配置

                var tt = $.grep(data.data, function (d) {
                    // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                    return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                });
                showrivercharts(tt,unit0,type);

                $("body").off("change").on("change", ".RIVER", function () {
                    unit = $(this).val();
                    title1 = $(this).val();
                    //河道水情数据类型选择
                    if (unit == "水位(m)") {
                        //水位数据类型下拉选项
                        // html = "<option value='水位(m)' selected>水位</option><option value='流量(m³/s)'>流量</option>"
                        // //水位统计生成图表
                        // if (params.querytp == 0) {
                        //     if (timeValidcheck(params.startime.split(" ")[0]) && timeValidcheck(params.endtime.split(" ")[0])) {
                        //         chartfunc(unit, powers, 0, params.querytp);
                        //     } else {
                        //         layer.msg("输入时间格式有误")
                        //     }
                        // } else {
                        //     chartfunc(unit, powers, 0, params.querytp);
                        // }
                        if( $("#stnm1").val()===""){
                            showrivercharts(tt,unit0,0);
                        } else {
                            if(powers.indexOf($("#stnm1").val())===-1){
                                var ff0 = $.grep(data.data, function (d) {
                                    // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                                    return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                                });
                                var ff1=[];
                                var objCon = {
                                    Type: 'get',
                                    Uri: '/aControl/RiverControl/riverWaterInfo',
                                    Parameter: {
                                        "waterInfo.stcd": $("#stnm1").val(),
                                        //"waterInfo.adcd":610402,
                                        "waterInfo.startTm": params.startime + ":00",
                                        "waterInfo.endTm": params.endtime + ":59"
                                    }
                                };
                                $.ajax({
                                    url: serverConfig.rainfallfloodApi,
                                    data: JSON.stringify(objCon)
                                }).done(function (data2) {
                                    ff1=data2.data;
                                    showrivercharts2(ff0,ff1,unit0,0)
                                });
                            } else if((powers.indexOf($("#stnm1").val())>-1)) {
                                var con0 = $.grep(data.data, function (d) {
                                    // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                                    return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                                });
                                var con1 = $.grep(data.data, function (d) {
                                    // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                                    return d.stcd === $("#stnm1").val() && d.tm !== null && d.tm !== "";
                                });
                                // showrivercharts2(ff0,ff1,unit0,type);
                                console.log(con0);
                                console.log(con1);
                                showrivercharts2(con0,con1,unit0,0)
                            }
                        }

                    } else if (unit == "流量(m³/s)") {
                        //水位数据类型下拉选项：选择流量时执行
                        // html = "<option value='水位(m)'>水位</option><option value='流量(m³/s)'  selected>流量</option>"
                        // //流量统计生成图表
                        // if (params.querytp == 0) {
                        //     if (timeValidcheck(params.startime.split(" ")[0]) && timeValidcheck(params.endtime.split(" ")[0])) {
                        //         chartfunc(unit, powers, 1, params.querytp);
                        //     } else {
                        //         layer.msg("输入时间格式有误")
                        //     }
                        // } else {
                        //     chartfunc(unit, powers, 1, params.querytp);
                        // }
                        if( $("#stnm1").val()===""){
                            showrivercharts(tt,unit0,1);
                        } else {
                            if(powers.indexOf($("#stnm1").val())===-1){
                                var ff0 = $.grep(data.data, function (d) {
                                    // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                                    return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                                });
                                var ff1=[];
                                var objCon = {
                                    Type: 'get',
                                    Uri: '/aControl/RiverControl/riverWaterInfo',
                                    Parameter: {
                                        "waterInfo.stcd": $("#stnm1").val(),
                                        //"waterInfo.adcd":610402,
                                        "waterInfo.startTm": params.startime + ":00",
                                        "waterInfo.endTm": params.endtime + ":59"
                                    }
                                };
                                $.ajax({
                                    url: serverConfig.rainfallfloodApi,
                                    data: JSON.stringify(objCon)
                                }).done(function (data2) {
                                    ff1=data2.data;
                                    showrivercharts2(ff0,ff1,unit,1)
                                });
                            } else if((powers.indexOf($("#stnm1").val())>-1)) {
                                var con0 = $.grep(data.data, function (d) {
                                    // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                                    return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                                });
                                var con1 = $.grep(data.data, function (d) {
                                    // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                                    return d.stcd === $("#stnm1").val() && d.tm !== null && d.tm !== "";
                                });
                                // showrivercharts2(ff0,ff1,unit0,type);
                                console.log(con0);
                                console.log(con1);
                                showrivercharts2(con0,con1,unit,1)
                            }
                        }

                    }
                });
                //生成对比数据图表点击按钮
                $("#showContractchart").off("click").on("click",function () {
                    $("#dataType").html(html);
                    $("#dataType").removeAttr("class");
                    $("#dataType").addClass("RIVER");
                    if( $("#stnm1").val()===""){
                        var ff = $.grep(data.data, function (d) {
                            // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                            return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                        });
                        showrivercharts(ff,unit0,type);
                    }else {
                       if(powers.indexOf($("#stnm1").val())===-1){
                           var ff0 = $.grep(data.data, function (d) {
                               // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                               return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                           });
                           var ff1=[];
                           var objCon = {
                               Type: 'get',
                               Uri: '/aControl/RiverControl/riverWaterInfo',
                               Parameter: {
                                   "waterInfo.stcd": $("#stnm1").val(),
                                   //"waterInfo.adcd":610402,
                                   "waterInfo.startTm": params.startime + ":00",
                                   "waterInfo.endTm": params.endtime + ":59"
                               }
                           };
                           $.ajax({
                               url: serverConfig.rainfallfloodApi,
                               data: JSON.stringify(objCon)
                           }).done(function (data2) {
                                ff1=data2.data;
                               showrivercharts2(ff0,ff1,unit0,type)
                           });
                       } else if((powers.indexOf($("#stnm1").val())>-1)) {
                           var con0 = $.grep(data.data, function (d) {
                               // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                               return d.stcd === $("#stnm0").val() && d.tm !== null && d.tm !== "";
                           });
                           var con1 = $.grep(data.data, function (d) {
                               // return d.stcd == powers[i] && d.tm !== null && d.tm !== "";
                               return d.stcd === $("#stnm1").val() && d.tm !== null && d.tm !== "";
                           });
                           // showrivercharts2(ff0,ff1,unit0,type);
                           console.log(con0);
                           console.log(con1);
                           showrivercharts2(con0,con1,unit0,type)
                       }
                    }
                });
                var intervalRiverHtml = "<div class='tabletitle'>河道水情信息表</div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                    "<div class='bunits'><span class='total'>水位:米 流量:立方米每秒 面积:平方米 总记录数：" + data.data.length + "</span></div></div>";
                intervalRiverHtml += '<div class="tablediv2"><table id="rivertable" class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                intervalRiverHtml += '<thead><tr>' +
                    '<th>序号</th>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>河流</th>' +
                    '<th>时间</th>' +
                    '<th>水位</th>' +
                    '<th>流量</th>' +
                    '<th>水势</th>' +
                    '<th>河水特征</th>' +
                    '<th>面积</th>' +
                    '<th>测流方法</th>' +
                    '<th>测积方法</th>' +
                    '<th>警戒流量</th>' +
                    '<th>保证流量</th>' +
                    '<th>报讯等级</th>' +
                    '</tr></thead><tbody>';
                if (data.data.length > 0) {

                    //
                    // // data.data.sort(function (a, b) {
                    // //     // return a.stcd - b.stcd
                    // //     return Date.parse(a.tm.replace("-", "/")) - Date.parse(b.tm.replace("-", "/"));//时间正序
                    // // });
                    // data.data.sort(function (a, b) {
                    //     return a.stcd - b.stcd
                    //     // return Date.parse(a.tm.replace("-", "/")) - Date.parse(b.tm.replace("-", "/"));//时间正序
                    // });
                    // data.data.sort(function (a, b) {
                    //     // return a.stcd - b.stcd
                    //     return Date.parse(a.tm.replace("-", "/")) - Date.parse(b.tm.replace("-", "/"));//时间正序
                    // });
                    $.each(default0(data.data), function (key, obj) {
                            intervalRiverHtml += '<tr>' +
                                '<td>' + (key+1) + '</td>' +
                                '<td>' + obj.stcd + '</td>' +
                                '<td>' + obj.stnm + '</td>' +
                                '<td>' + obj.rvnm + '</td>' +
                                '<td>' + obj.tm.replace(".0", "") + '</td>' +
                                '<td>' + waterLevelData(obj.z == null ? "" : obj.z) + '</td>' +
                                '<td>' + formatFlow(obj.q) + '</td>' +
                                '<td>' + showFlow(obj.wptn) + '</td>' +
                                '<td>' + RiverCharacter(obj.flwchrcd) + '</td>' +
                                '<td>' + Acreage(obj.xsa) + '</td>' +
                                '<td>' + Msqmt(obj.msqmt == null ? "" : obj.msqmt) + '</td>' +
                                '<td>' + Msamt(obj.msamt == null ? "" : obj.msamt) + '</td>' +
                                '<td>' + flowDataw(obj.wrq == null ? "" : obj.wrq) + '</td>' +
                                '<td>' + flowDataw(obj.grq == null ? "" : obj.grq) + '</td>' +
                                '<td>' + xqType(obj.frgrd) + '</td>' +
                                '</tr>';
                    });
                } else {
                    intervalRiverHtml += '<tr>' +
                        '<td colspan="15">无数据</td>' +
                        '</tr>';
                }
                intervalRiverHtml += '</tbody></table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div> ';
                $("#rivertab").html(intervalRiverHtml);
            } else if (cctp == 1) {
                if (data.data !== null && data.data.length > 0) {
                    $.each(data.data[0].data, function (key, obj) {
                        var tm = new Date(obj.idtm);
                        tm.setTime(tm.getTime() - 24 * 60 * 60 * 1000);
                        var tmYear = tm.getFullYear(),
                            tmMonth = parseInt(tm.getMonth()) + 1 < 10 ? "0" + (parseInt(tm.getMonth()) + 1) : (parseInt(tm.getMonth()) + 1),
                            tmDay = tm.getDate() < 10 ? "0" + tm.getDate() : tm.getDate();
                        obj.idtm = tmYear + "-" + tmMonth + "-" + tmDay + " 08:00:00";
                    });
                    var YearList = [],
                        YearList1 = [],
                        MonthList = [],
                        MonthList1 = [];
                    $.each(data.data[0].data, function (i, v) {
                        YearList.push(v.idtm.split("-")[0]);
                    });
                    YearList1 = outRepeat(YearList);
                    $.each(data.data[0].data, function (i, v) {
                        MonthList.push(v.idtm.split("-")[1]);
                    });
                    // MonthList1 = outRepeat(MonthList);
                    var intervalRiverHtml = "<div class='tabletitle'>旬平均流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>流量:立方米每秒 总记录数：" + data.data.length + "</span> </div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table id="rivertable" class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="3">序号</th>' +
                        '<th rowspan="3">测站编码</th>' +
                        '<th rowspan="3" style="width: 70px;">测站名称</th>';
                    for (var i = 0; i < YearList1.length; i++) {
                        var yy = $.grep(data.data[0].data, function (d) {
                            return d.idtm.indexOf(YearList1[i]) !== -1
                        });
                        intervalRiverHtml += '<th rowspan="1" colspan="' + yy.length + '">' + YearList1[i] + '年</th>'
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '<tr>';
                    for (var i = 0; i < MonthList.length / 3; i++) {
                        intervalRiverHtml += '<th rowspan="1" colspan="3">' + MonthList[i * 3] + '月</th>'
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '<tr>';
                    for (var i = 0; i < MonthList.length / 3; i++) {
                        intervalRiverHtml +=
                            '<th rowspan="1">上旬</th>' +
                            '<th rowspan="1">中旬</th>' +
                            '<th rowspan="1">下旬</th>';
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '</thead><tbody>';
                    $.each(data.data, function (key, obj) {
                        intervalRiverHtml += '<tr>' +
                            '<td style="width: 70px;">' + (key+1) + '</td>' +
                            '<td style="width: 70px;">' + obj.stcd + '</td>' +
                            '<td style="width: 90px;">' + obj.stnm + '</td>';
                        $.each(obj.data, function (key2, obj2) {
                            intervalRiverHtml += '<td>' + formatFlow(obj2.avq) + '</td>';
                        });
                        intervalRiverHtml += '</tr>';
                    });
                } else {
                    var intervalRiverHtml = "<div class='tabletitle'>旬平均流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'>流量:立方米每秒 总记录数：0</div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table  class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2" style="width: 70px;">测站名称</th></tr></thead>' +
                        '<tbody><tr><td colspan="2">无数据</td></tr>';
                }
                intervalRiverHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#rivertab").html(intervalRiverHtml);
            } else if (cctp == 2) {
                if (data.data !== null && data.data.length > 0) {
                    var YearList = [],
                        YearList1 = [],
                        MonthList = [];
                    $.each(data.data[0].data, function (i, v) {
                        YearList.push(v.idtm.split("-")[0]);
                    });
                    YearList1 = outRepeat(YearList);
                    $.each(data.data[0].data, function (i, v) {
                        MonthList.push(v.idtm.split("-")[1]);
                    });
                    var intervalRiverHtml = "<div class='tabletitle'>月平均流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>流量:立方米每秒 总记录数：" + data.data.length + "</span></div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table id="rivertable" class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2" style="width: 70px;">测站名称</th>';
                    for (var i = 0; i < YearList1.length; i++) {
                        var yy = $.grep(data.data[0].data, function (d) {
                            return d.idtm.indexOf(YearList1[i]) !== -1
                        });
                        intervalRiverHtml += '<th rowspan="1" colspan="' + yy.length + '">' + YearList1[i] + '年</th>'
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '<tr>';
                    for (var i = 0; i < MonthList.length; i++) {
                        intervalRiverHtml +=
                            '<th rowspan="1">' + MonthList[i] + '月</th>';
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '</thead><tbody>';
                    $.each(data.data, function (key, obj) {
                        intervalRiverHtml += '<tr>' +
                            '<td style="width: 70px;">' +(key+1) + '</td>' +
                            '<td style="width: 70px;">' + obj.stcd + '</td>' +
                            '<td style="width: 90px;">' + obj.stnm + '</td>';
                        for (var i = 0; i < obj.data.length; i++) {
                            intervalRiverHtml += '<td>' + formatFlow(obj.data[i].avq) + '</td>';
                        }
                        intervalRiverHtml += '</tr>';
                    });
                } else {
                    var intervalRiverHtml = "<div class='tabletitle'>月平均流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'>流量:立方米每秒 总记录数：0</div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table  class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2" style="width: 70px;">测站名称</th></tr></thead>' +
                        '<tbody><tr><td colspan="2">无数据</td></tr></tbody>';
                }
                intervalRiverHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#rivertab").html(intervalRiverHtml);
            } else if (cctp == 3) {
                var jllarray = [];
                var jllSum = 0;
                if (data.data !== null && data.data.length > 0) {
                    $.each(data.data[0].data, function (key, obj) {
                        var tm = new Date(obj.idtm);
                        tm.setTime(tm.getTime() - 24 * 60 * 60 * 1000);
                        var tmYear = tm.getFullYear(),
                            tmMonth = parseInt(tm.getMonth()) + 1 < 10 ? "0" + (parseInt(tm.getMonth()) + 1) : (parseInt(tm.getMonth()) + 1),
                            tmDay = tm.getDate() < 10 ? "0" + tm.getDate() : tm.getDate();
                        obj.idtm = tmYear + "-" + tmMonth + "-" + tmDay + " 08:00:00";
                    });
                    var YearList = [],
                        YearList1 = [],
                        MonthList = [];
                    $.each(data.data[0].data, function (i, v) {
                        YearList.push(v.idtm.split("-")[0]);
                    });
                    YearList1 = outRepeat(YearList);
                    $.each(data.data[0].data, function (i, v) {
                        MonthList.push(v.idtm.split("-")[1]);
                    });
                    var intervalRiverHtml = "<div class='tabletitle'>旬径流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>径流量:百万立方米每秒 总记录数：" + data.data.length + "</span></div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table  id="rivertable" class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="3">序号</th>' +
                        '<th rowspan="3">测站编码</th>' +
                        '<th rowspan="3" style="width: 70px;">测站名称</th>';
                    for (var i = 0; i < YearList1.length; i++) {
                        var yy = $.grep(data.data[0].data, function (d) {
                            return d.idtm.indexOf(YearList1[i]) !== -1
                        });
                        intervalRiverHtml += '<th rowspan="1" colspan="' + (yy.length ) + '">' + YearList1[i] + '年</th>'
                    }
                    intervalRiverHtml +=
                        '<th rowspan="3" style="width: 70px;">径流总量</th></tr>' +
                        '<tr>';
                    for (var i = 0; i < MonthList.length / 3; i++) {
                        intervalRiverHtml += '<th rowspan="1" colspan="3">' + MonthList[i * 3] + '月</th>'
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '<tr>';
                    for (var i = 0; i < MonthList.length / 3; i++) {
                        intervalRiverHtml +=
                            '<th rowspan="1">上旬</th>' +
                            '<th rowspan="1">中旬</th>' +
                            '<th rowspan="1">下旬</th>';
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '</thead><tbody>';
                    $.each(data.data, function (key, obj) {
                        intervalRiverHtml += '<tr>' +
                            '<td style="width: 70px;">' + (key+1) + '</td>' +
                            '<td style="width: 70px;">' + obj.stcd + '</td>' +
                            '<td style="width: 90px;">' + obj.stnm + '</td>';
                        jllarray=[];
                        $.each(obj.data, function (key2, obj2) {
                            intervalRiverHtml += '<td>' + flowData(obj2.jll) + '</td>';
                            if (obj2.jll !== null && obj2.jll !== "") {
                                jllarray.push(obj2.jll);
                            }
                        });
                        jllSum=0;
                        $.each(jllarray, function (i, v) {
                            jllSum += parseFloat(v);
                        });
                        intervalRiverHtml += '<td style="width: 90px;">' + flowData(jllSum) + '</td></tr>';
                    });
                } else {
                    var intervalRiverHtml = "<div class='tabletitle'>旬径流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'>径流量:百万立方米每秒 总记录数：0</div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table  class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2" style="width: 70px;">测站名称</th></tr></thead>' +
                        '<tbody><tr><td colspan="2">无数据</td></tr>';
                }
                intervalRiverHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#rivertab").html(intervalRiverHtml);
            } else if (cctp == 4) {
                var jllSum2 = 0;
                var jllarray2 = [];
                if (data.data !== null && data.data.length > 0) {
                    var YearList = [],
                        YearList1 = [],
                        MonthList = [];
                    $.each(data.data[0].data, function (i, v) {
                        YearList.push(v.idtm.split("-")[0]);
                    });
                    YearList1 = outRepeat(YearList);
                    $.each(data.data[0].data, function (i, v) {
                        MonthList.push(v.idtm.split("-")[1]);
                    });
                    var intervalRiverHtml = "<div class='tabletitle'>月径流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>径流量:百万立方米每秒 总记录数：" + data.data.length + "</span> </div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table id="rivertable" class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2">测站名称</th>';
                    for (var i = 0; i < YearList1.length; i++) {
                        var yy = $.grep(data.data[0].data, function (d) {
                            return d.idtm.indexOf(YearList1[i]) !== -1
                        });
                        intervalRiverHtml += '<th rowspan="1" colspan="' + yy.length + '">' + YearList1[i] + '年</th>'
                    }
                    intervalRiverHtml +=
                        '<th rowspan="2">径流总量</th></tr>' +
                        '<tr>';
                    for (var i = 0; i < MonthList.length; i++) {
                        intervalRiverHtml +=
                            '<th rowspan="1">' + MonthList[i] + '月</th>';
                    }
                    intervalRiverHtml +=
                        '</tr>' +
                        '</thead><tbody>';
                    $.each(data.data, function (key, obj) {
                        intervalRiverHtml += '<tr>' +
                            '<td style="width: 70px;">' + (key+1) + '</td>' +
                            '<td style="width: 70px;">' + obj.stcd + '</td>' +
                            '<td style="width: 90px;">' + obj.stnm + '</td>';
                        jllarray2=[];
                        for (var i = 0; i < obj.data.length; i++) {
                            intervalRiverHtml += '<td>' + flowData(obj.data[i].jll) + '</td>';
                            if (obj.data[i].jll !== null && obj.data[i].jll !== "") {
                                jllarray2.push(obj.data[i].jll);
                            }
                        }
                        jllSum2=0;
                        $.each(jllarray2, function (i, v) {
                            jllSum2 += parseFloat(v)
                        });
                        intervalRiverHtml += '<td>' + flowData(jllSum2) + '</td></tr>';
                    });
                } else {
                    var intervalRiverHtml = "<div class='tabletitle'>月径流量表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'>径流量:百万立方米每秒 总记录数：0</div></div>";
                    intervalRiverHtml += '<div class="tablediv1"><table class="rivertable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalRiverHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2">测站名称</th></tr></thead>' +
                        '<tbody><tr><td colspan="2">无数据</td></tr>'
                }
                intervalRiverHtml += '</tbody></table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#rivertab").html(intervalRiverHtml);
            }
        } else {
            //提示错误信息
            layer.msg(data.message, { time: 3000 });
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

//判断类型
function Msqmt(q) {
    if (q == 1) {
        return "水位流量关系曲线"
    } else if (q == 2) {
        return "浮标及溶液测流法"
    } else if (q == 3) {
        return "流速仪及量水建筑物"
    } else if (q == 4) {
        return "估算法"
    } else if (q == 5) {
        return "ADCP"
    } else if (q == 6) {
        return "电功率反推法"
    } else {
        return "其他方法"
    }
}

function Msamt(q) {
    if (q == 1) {
        return "水位面积关系曲线"
    } else if (q == 2) {
        return "测深杆或测深锤，铅鱼"
    } else if (q == 3) {
        return "回声探测仪"
    } else if (q == "5") {
        return "ADCP"
    } else if (q == 9) {
        return "其它方法"
    } else {
        return ""
    }
}

function xqType(q) {
    if (q == 1) {
        return "中央报汛站"
    } else if (q == 2) {
        return "省级重点报汛站"
    } else if (q == 3) {
        return "省级一般报汛站"
    }else if (q == 4) {
        return "其他报讯站"
    } else if (q == 5) {
        return "山洪站"
    }else {
        return ""
    }
}

var aclick = function (aa) {
    if ($('#rivertable tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        //alert(params.querytp+jst+total);
        if (params.querytp == 0) {
            $(aa).attr("download", "河道水情信息表.xls");
            exportExcel(aa, 'rivertable', '河道水情信息表', jst, total, time, company, 1)
        } else if (params.querytp == 1) {
            $(aa).attr("download", "旬平均流量表.xls");
            exportExcel(aa, 'rivertable', '旬平均流量表', jst, total, time, company, 3)
        } else if (params.querytp == 2) {
            $(aa).attr("download", "月平均流量表.xls");
            exportExcel(aa, 'rivertable', '月平均流量表', jst, total, time, company, 2)
        } else if (params.querytp == 3) {
            $(aa).attr("download", "旬径流量表.xls");
            exportExcel(aa, 'rivertable', '旬径流量表', jst, total, time, company, 3)
        } else if (params.querytp == 4) {
            $(aa).attr("download", "月径流量表.xls");
            exportExcel(aa, 'rivertable', '月径流量表', jst, total, time, company, 2)
        }
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}


function getPreDay(d) {
    d = new Date(d);
    d = +d - 1000 * 60 * 60 * 24;
    d = new Date(d);
    //return d;
    //格式化
    return d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" + (d.getDate()) : d.getDate());
}

//河道特征转换
function RiverCharacter(n) {
    switch (n) {
        case "0":
            return "干涸"
            break;
        case "2":
            return "断流"
            break;
        case "3":
            return "顺逆不定"
            break;
        case "4":
            return "逆流"
            break;
        case "5":
            return "起涨"
            break;
        case "6":
            return "洪峰"
            break;
        default :
            return ""
            break;
    }
}