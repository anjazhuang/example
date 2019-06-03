//监测查询参数
var params = {
    type: "reservoir",
    startime: "",
    endtime: ""
}

var html = "";
var myChart = "";
var option = "";
var table = "";
var resizeWorldMapContainer = "";
var title = "站点信息";
var title1 = "电源电压";
var unit = "电源电压(v)";
var subtitle = "";
var powers = [];
$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata(0);
    //初始化监测站点数据
    initCode(0);
    //下拉框combox
    $(".leftNav select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger("change");
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(0, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert($("#stcode").val());
    //     initTreedata(0,$("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(0, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(0, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(0, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    var selecthtml = '<option value="">全部</option><option value="PP">雨量站</option><option value="ZQ">河道水位站</option><option value="ZZ">河道水文站</option><option value="RR">水库水文站</option><option value="SS">墒情站</option>';
    $("#cztp").html(selecthtml);
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(0, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id);
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

    //统计查询方法
    $("#tongji").click(function () {
        initReservoir();
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
    initReservoir();
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

function initReservoir() {
    params.startime = $("#s-date").find("input").val();
    //结束时间
    params.endtime = $("#e-date").find("input").val();
    //行政区域站点查询
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        //console.log(powers);
        //console.log(powers.join(","));
    } else if ($(".tab0:last").hasClass("active")) {
        //流域站点查询
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        //console.log(powers);
    }
    //查询条件不能为空
    if (params.startime !== "" && params.endtime !== "" && powers.length !== 0) {
        //查询时图形报表总是显示
        $(".tab-pane").eq(0).addClass("active in").siblings().removeClass("in active");
        $(".navtab li").eq(0).addClass("active").siblings().removeClass("active");
        html = "<option value='电源电压(v)'>电源电压</option><option value='信号强度'>信号强度</option>";
        unit = "电源电压(v)";

        chartfunc0(unit, powers, 0);
        $("body").on("change", ".shuiku", function () {
            unit = $(this).val();
            if (unit == "电源电压(v)") {
                html = "<option value='电源电压(v)'>电源电压</option><option value='信号强度'>信号强度</option>";
                title1 = "电源电压";
                chartfunc0(unit, powers, 0);
            } else if (unit == "信号强度") {
                html = "<option value='电源电压(v)'>电源电压</option><option value='信号强度' selected>信号强度</option>";
                title1 = "信号强度";
                chartfunc0(unit, powers, 1);
            }
        });
    } else {
        layer.msg("请选择站点以及开始和结束时间!")
    }
}


function chartfunc0(unit0, powers, type) {
    var loading = "";
    var obj = {
        Type: 'get',
        Uri: '/station/state',
        Parameter: {
            // "waterInfo.stcd": powers.join(","),
            "stcd": powers.join(","),
            //"stcd":"",
            "startTime": params.startime + ":00",
            "endTime": params.endtime + ":59"
        }
    };

    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
            if (data.success) {
                console.log(data);
                //加载条隐藏
                layer.close(loading);
                $("#reservoirtab").removeClass("hidden").siblings().addClass("hidden");
                //图表标题
                title = "站点信息";
                $("#dataType").html(html);
                $("#dataType").removeAttr("class");
                $("#dataType").addClass("shuiku");
                var x_soil_data = [], stationame = [], chartsData = [];
                $.each(data.data, function (key, obj) {
                    x_soil_data.push(obj.tm)
                });

                for (var i = 0; i < powers.length; i++) {
                    var tt = $.grep(data.data.data, function (d) {
                        return d.stcd == powers[i] && d.tm !== "" && d.tm !== null;
                    });
                    if (tt.length !== 0) {
                        var stationdata = [];
                        //console.log("找到的站点编码:" + powers[i]);
                        if (type == 0) {
                            $.each(tt, function (key, obj) {
                                if (obj.vt !== null && obj.vt !== "") {
                                    var aa = {
                                        name: obj.tm,
                                        value: [obj.tm, obj.vt]
                                    }
                                    stationdata.push(aa);
                                }
                            });
                        } else if (type == 1) {
                            $.each(tt, function (key, obj) {
                                if (obj.signal !== null && obj.signal !== "") {
                                    var aa = {
                                        name: obj.tm,
                                        value: [obj.tm, obj.signal]
                                    }
                                    stationdata.push(aa);
                                }
                            });
                        }
                        var chartsobj = {
                            name: tt[0].stnm.replace(/[ ]/g, ""),
                            type: 'line',
                            symbol: 'circle',
                            symbolSize: 6,
                            data: stationdata
                        };
                        chartsData.push(chartsobj);
                        stationame.push(tt[0].stnm.replace(/[ ]/g, ""))
                    }
                }
                //console.log(chartsData);
                if (chartsData.length == 0) {
                    layer.msg("没有找到相关数据");
                    stationame = [];
                }
                myChart.setOption({
                    title: {
                        text: title + title1 + "过程图",
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
                        bottom: "80"
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 100
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 0,
                            end: 100
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
                                backgroundColor: '#9BCD9B'
                            }
                        },
                        backgroundColor: '#9BCD9B',
                        formatter: function (params, ticket, callback) {
                            var oo = [];
                            for (var ii = 0; ii < params.length; ii++) {
                                //console.log(params[ii]);
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

                var newReservoirdata = $.grep(data.data.data, function (d) {
                    return (d.tm !== "" && d.tm !== null);
                });
                var intervalReservoirHtml = "<div class='tabletitle'>站点信息表</div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                    "<div class='bunits'><span class='total'>总记录数:" + newReservoirdata.length + "</span></div></div>";
                intervalReservoirHtml += '<div class="tablediv1"><table id="reservoirtable" class="reservoirtable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                intervalReservoirHtml += '<thead><tr>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>行政区域</th>' +
                    '<th>时间</th>' +
                    '<th>流域</th>' +
                    '<th>水系</th>' +
                    '<th>河流</th>' +
                    '<th>测站类型</th>' +
                    '<th>电源电压</th>' +
                    '<th>信号强度</th>' +
                    '</tr></thead><tbody>';
                if (newReservoirdata.length > 0) {
                    $.each(newReservoirdata, function (key, obj) {
                        intervalReservoirHtml += '<tr>' +
                            '<td>' + obj.stcd + '</td>' +
                            '<td>' + obj.stnm + '</td>' +
                            '<td>' + obj.name + '</td>' +
                            '<td>' + obj.tm + '</td>' +
                            '<td>' + obj.bsnm + '</td>' +
                            '<td>' + obj.hnnm + '</td>' +
                            '<td>' + obj.rvnm + '</td>' +
                            '<td>' + obj.sttp + '</td>' +
                            '<td>' + (obj.vt == null ? "" : obj.vt) + '</td>' +
                            '<td>' + (obj.signal == null ? "" : obj.signal) + '</td>' +
                            '</tr>';
                    });
                } else {
                    intervalReservoirHtml += '<tr>' +
                        '<td colspan="10">无数据</td>' +
                        '</tr>';
                }

                intervalReservoirHtml += '</tbody></table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#reservoirtab").html(intervalReservoirHtml);
            } else {
                //错误信息提示
                layer.msg(data.message, { time: 3000 });
            }
        }
    )
}

//导出表格
var aclick = function (aa) {
    var jst = $(".btime").text();
    var total = $(".total").text();
    var time = $(".maketabtime").text();
    var company = $(".maketabcom").text();
    $(aa).attr("download", "站点信息表.xls");
    //alert(params.querytp+jst+total);
    exportExcel(aa, 'reservoirtable', '站点信息表', jst, total, time, company, 1)
}