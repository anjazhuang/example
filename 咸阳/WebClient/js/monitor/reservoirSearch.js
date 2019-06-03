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
var title = "水库水情";
var title1 = "水位";
var unit = "水位（m）";
var subtitle = "";
var powers = [];
$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata(3);
    //初始化监测站点数据
    initCode(3);
    //下拉框combox
    $(".leftNav select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(3, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert($("#stcode").val());
    //     initTreedata(3, $("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(3, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(3, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(3, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    var selecthtml = '<option value="RR">水库水文站</option>';
    $("#cztp").html(selecthtml);
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(3, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
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
        //水库水情查询
        html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)'>入库流量</option><option value='出库流量(m³/s)'>出库流量</option>";
        unit = "水位(m)";
        //水库水情(默认水位)统计生成图表
        chartfunc0(unit, powers, 0);
        $("body").on("change", ".shuiku", function () {
            unit = $(this).val();
            //水库水情数据类型选择
            if (unit == "水位(m)") {
                html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)'>入库流量</option><option value='出库流量(m³/s)'>出库流量</option>";
                //水库水情水位数据类型选择
                title1 = "水位";
                chartfunc0(unit, powers, 0);
            } else if (unit == "入库流量(m³/s)") {
                html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)' selected>入库流量</option><option value='出库流量(m³/s)'>出库流量</option>";
                //水库水情入库流量数据类型选择
                title1 = "入库流量";
                chartfunc0(unit, powers, 1);
            } else if (unit == "出库流量(m³/s)") {
                html = "<option value='水位(m)'>水位</option><option value='入库流量(m³/s)'>入库流量</option><option value='出库流量(m³/s)' selected>出库流量</option>";
                //水库水情出库流量数据类型选择
                title1 = "出库流量";
                chartfunc0(unit, powers, 2);
            }
        });
    } else {
        layer.msg("请选择站点以及开始和结束时间!")
    }
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
                console.log(data.data);
                layer.close(loading);
                $("#reservoirtab").removeClass("hidden").siblings().addClass("hidden");
                //图表标题
                title = "水库水情";
                $("#dataType").html(html);
                $("#dataType").removeAttr("class");
                $("#dataType").addClass("shuiku");
                var x_soil_data = [], stationame = [], chartsData = [], waterHeight = [];
                $.each(data.data, function (key, obj) {
                    x_soil_data.push(obj.tm)
                });
                //水库水情图表option配置
                for (var i = 0; i < powers.length; i++) {
                    var tt = $.grep(data.data, function (d) {
                        return d.stcd == powers[i] && d.tm !== "" && d.tm !== null;
                    });
                    if (tt.length !== 0) {
                        var stationdata = [];
                        //console.log("找到的站点编码:" + powers[i]);
                        if (type == 0) {
                            $.each(tt, function (key, obj) {
                                if (obj.rz !== null && obj.rz !== "") {
                                    var aa = {
                                        name: obj.tm,
                                        value: [obj.tm, obj.rz]
                                    }
                                    stationdata.push(aa);
                                    waterHeight.push(obj.rz);
                                }
                            });
                        } else if (type == 1) {
                            waterHeight = [];
                            $.each(tt, function (key, obj) {
                                if (obj.inq !== null && obj.inq !== "") {
                                    var aa = {
                                        name: obj.tm,
                                        value: [obj.tm, obj.inq]
                                    }
                                    stationdata.push(aa);
                                }
                            });
                        } else if (type == 2) {
                            waterHeight = [];
                            $.each(tt, function (key, obj) {
                                if (obj.otq !== null && obj.otq !== "") {
                                    var aa = {
                                        name: obj.tm,
                                        value: [obj.tm, obj.otq]
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
                    layer.msg("没有找到水库水情相关数据");
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
                        name: unit0,
                        max: waterHeight.length > 0 ? (Math.max.apply(null, waterHeight) + 1).toFixed(2) : null,
                        min: waterHeight.length > 0 ? (Math.min.apply(null, waterHeight) - 1).toFixed(2) : null
                    },
                    series: chartsData
                }, true);

                if (data.data.length > 0) {
                    //水库水情筛选掉时间不为空的数据
                    var newReservoirdata = $.grep(data.data, function (d) {
                        return d.tm !== "" && d.tm !== null
                    });
                    newReservoirdata.sort(function (a, b) {
                        return Date.parse(a.tm.replace("-", "/")) - Date.parse(b.tm.replace("-", "/"));//时间正序
                    });
                    var intervalReservoirHtml = "<div class='tabletitle'>水库水情信息表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>水位:米 流量:立方米每秒 蓄水量:百万立方米  总记录数:" + newReservoirdata.length + "</span></div></div>";
                    intervalReservoirHtml += '<div class="tablediv1"><table id="reservoirtable" class="reservoirtable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalReservoirHtml += '<thead><tr>' +
                        '<th>序号</th>' +
                        '<th>水库编码</th>' +
                        '<th>水库名称</th>' +
                        '<th>站址</th>' +
                        '<th>时间</th>' +
                        '<th>库水位</th>' +
                        '<th>蓄水量</th>' +
                        '<th>入库</th>' +
                        '<th>出库</th>' +
                        '<th>水势</th>' +
                        '<th>汛限水位</th>' +
                        '<th>超汛限水位</th>' +
                        '<th>旱限水位</th>' +
                        '<th>超旱限水位</th>' +
                        '</tr></thead><tbody>';
                    var array=["羊毛湾","金盆","石头河","冯家山","王家崖","段家峡"];
                    var newdata=[];
                    for (var i = 0; i < newReservoirdata.length; i++) {
                        if (array.indexOf(newReservoirdata[i].stnm) > -1) {
                            newdata.push(newReservoirdata[i])
                        }
                    }
                    if (newdata.length > 0) {
                        $.each(newdata, function (key, obj) {
                            intervalReservoirHtml += '<tr>' +
                                '<td>' + (key+1) + '</td>' +
                                '<td>' + obj.stcd + '</td>' +
                                '<td>' + obj.stnm + '</td>' +
                                '<td class="stlcWidth">' + obj.stlc + '</td>' +
                                '<td>' + (obj.tm == null ? "" : obj.tm.replace(".0", "")) + '</td>' +
                                '<td>' + waterLevelData(obj.rz == null ? "" : obj.rz) + '</td>' +
                                '<td>' + waterLevelData(obj.w == null ? "" : obj.w) + '</td>' +
                                '<td>' + formatFlow(obj.inq == null ? "" : obj.inq) + '</td>' +
                                '<td>' + formatFlow(obj.otq == null ? "" : obj.otq) + '</td>' +
                                '<td>' + showFlow(obj.rwptn) + '</td>' +
                                '<td>'+ waterLevelData(obj.fsltdz)+'</td>' +
                                '<td>'+ waterLevelData(obj.eflwl)+' </td>' +
                                '<td>'+ waterLevelData(obj.dlwl)+'</td>' +
                                '<td>'+ waterLevelData(obj.sdlwl)+'</td>' +
                                '</tr>';
                        });
                    } else {
                        var intervalReservoirHtml = "<div class='tabletitle'>水库水情信息表</div>" +
                            "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                            "<div class='bunits'><span class='total'>水位:米 流量:立方米每秒 蓄水量:百万立方米 总记录数：" + data.data.length + "</span> </div></div>";
                        intervalReservoirHtml += '<div class="tablediv1"><table id="reservoirtable" class="reservoirtable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                        intervalReservoirHtml += '<thead><tr>' +
                            '<th>序号</th>' +
                            '<th>水库编码</th>' +
                            '<th>水库名称</th>' +
                            '<th>站址</th>' +
                            '<th>时间</th>' +
                            '<th>库水位</th>' +
                            '<th>蓄水量</th>' +
                            '<th>入库</th>' +
                            '<th>出库</th>' +
                            '<th>水势</th>' +
                            '<th>汛限水位</th>' +
                            '<th>超汛限水位</th>' +
                            '<th>旱限水位</th>' +
                            '<th>超旱限水位</th>' +
                            '</tr></thead><tbody>';
                        intervalReservoirHtml += '<tr>' +
                            '<td colspan="14">无数据</td>' +
                            '</tr>';
                    }
                } else {
                    var intervalReservoirHtml = "<div class='tabletitle'>水库水情信息表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>水位:米 流量:立方米每秒 蓄水量:百万立方米 总记录数：" + data.data.length + "</span></div></div>";
                    intervalReservoirHtml += '<div class="tablediv1"><table id="reservoirtable" class="reservoirtable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalReservoirHtml += '<thead><tr>' +
                        '<th>序号</th>' +
                        '<th>水库编码</th>' +
                        '<th>水库名称</th>' +
                        '<th>站址</th>' +
                        '<th>时间</th>' +
                        '<th>库水位</th>' +
                        '<th>蓄水量</th>' +
                        '<th>入库</th>' +
                        '<th>出库</th>' +
                        '<th>水势</th>' +
                        '<th>汛限水位</th>' +
                        '<th>超汛限水位</th>' +
                        '<th>旱限水位</th>' +
                        '<th>超旱限水位</th>' +
                        '</tr></thead><tbody>';
                    intervalReservoirHtml += '<tr>' +
                        '<td colspan="14">无数据</td>' +
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
    if ($('#reservoirtable tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "水库水情信息表.xls");
        //alert(params.querytp+jst+total);
        exportExcel(aa, 'reservoirtable', '水库水情信息表', jst, total, time, company, 1)
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}