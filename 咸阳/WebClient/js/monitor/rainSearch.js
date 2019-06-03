//监测查询参数
var params = {
    type: "rain",
    startime: "",
    endtime: ""
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

var html = "";
var myChart = "";
var option = "";
var table = "";
var resizeWorldMapContainer = "";
var title = "降雨量（mm）";
var unit = "降雨量（mm）";
var subtitle = "";
var powers = [];
var user = JSON.parse($.cookie("user"));
var height = 130;

function defaultFormatDate() {
    if (($("#labelendtime").hasClass('hidden')) || ($("e-date").hasClass('hidden'))) {
        $("#labelstarttime").text("开始时间:");
        $("#labelendtime").addClass('show');
        $("#e-date").addClass('show');
    }
}

function defaultFormatDate() {
    if (($("#labelendtime").hasClass('hidden')) || ($("e-date").hasClass('hidden'))) {
        $("#labelstarttime").text("开始时间:");
        $("#labelendtime").removeClass('hidden');
        $("#e-date").removeClass('hidden');
    }
}

function singleFormatDate() {
    $("#labelstarttime").text("时间:");
    $("#labelendtime").addClass('hidden');
    $("#e-date").addClass('hidden');
}

function stationSelect() {
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
            var html0 = '<option value="">请选择</option>';
            $.each(data.data, function (key, obj) {
                html0 += "<option value='" + obj.Code + "'>" + obj.Name + "(" + obj.Code + ")</option>";
            });
            $("#stationsel").html(html0);
            $("#stationsel").select2();
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//时间控件更新
var timeupdatevalue = new Date();
timeupdatevalue.setHours(8, 0);
// if (new Date().getHours() < 8) {
//     var starttimevalue = new Date();
//     starttimevalue.setTime(starttimevalue.getTime() - 24 * 60 * 60 * 1000);
//     starttimevalue.setHours(8, 0);
//     var endtimevalue = new Date();
//     endtimevalue.setHours(8, 0);
// } else {
//     var starttimevalue = new Date();
//     starttimevalue.setHours(8, 0);
//     var endtimevalue = new Date();
//     endtimevalue.setTime(endtimevalue.getTime() + 24 * 60 * 60 * 1000);
//     endtimevalue.setHours(8, 0);
// }
var starttimevalue = new Date();
starttimevalue.setTime(starttimevalue.getTime() - 24 * 60 * 60 * 1000);
starttimevalue.setHours(8, 0);
var endtimevalue = new Date();
endtimevalue.setHours(8, 0);

//隐藏相关时间控件
function hideFormatDate() {
    $("#formatdate1").addClass('hidden');
    $("#formatdate2").addClass('hidden');
    $("#formatdate3").addClass('hidden');
    $("#formatdate4").addClass('hidden');
    $("#formatdate5").addClass('hidden');
    $("#formatdate6").addClass('hidden');
    $("#formatdate7").addClass('hidden');
    $("#formatdate8").addClass('hidden');
}

//显示树型列表
function showTreeList() {
    if ($(".chooseBox").hasClass("hidden")) {
        $(".chooseBox").removeClass('hidden');
    }
}

function getNextMouthFirstData(dt, num) {
    var date = new Date(dt);
    var em = parseFloat(date.getMonth()) + num;
    var ey = date.getFullYear();
    if (em > 12) {
        em = 1;
        ey = ey + 1;
    } else if(em ==0){
        em = 12;
        ey = ey - 1;
    }
    return ey + "-" + (em > 9 ? em : "0" + em) + "-01 08:00:00";
}

function getNextMouth(dt, num) {
    var date = new Date(dt);
    var em = date.getMonth() + num;
    var ey = date.getFullYear();
    if (em > 12) {
        em = 1;
        ey = ey + 1;
    }
    return ey + "-" + (em > 9 ? em : "0" + em);
}

//时段降雨量表格
function periodRainfallTable() {
    //雨情数据类型选择查询传递参数
    if (timeValidcheck(params.startime.split(" ")[0]) && timeValidcheck(params.endtime.split(" ")[0])) {
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/countRainData',
            Parameter: {
                "rainCount.stcd": powers.join(","),
                "rainCount.startTm": params.startime + ":00",
                "rainCount.endTm": params.endtime + ":00"
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
                var tableData = $.grep(default0(data.data), function (d) {
                    return d.tm != "" && d.tm != null && d.drp != "" && d.drp != null;
                });
                var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                    "<div class='bunits'><span class='total'>降雨量:毫米  总记录数：" + tableData.length + "</span> </div><div>";
                intervalRainHtml += '<div class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0" >';
                intervalRainHtml += '<thead><tr>' +
                    '<th>序号</th>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>站址</th>' +
                    '<th>时间</th>' +
                    '<th>时段降雨量</th>' +
                    '<th>时段长</th>' +
                    '<th>日降雨量</th>' +
                    '<th>天气状况</th>' +
                    '</tr></thead>';
                if (tableData.length == 0) {
                    intervalRainHtml += '<tr><td colspan="9">无数据</td></tr>';
                } else {
                    $.each(tableData, function (key, obj) {
                        intervalRainHtml += '<tr>' +
                            '<td>' + (key+1) + '</td>' +
                            '<td>' + obj.stcd + '</td>' +
                            '<td>' + obj.stnm + '</td>';
                        intervalRainHtml += '<td class="stlcWidth" >' + obj.stlc + '</td>';
                        intervalRainHtml += '<td>' + obj.tm + '</td>' +
                            '<td>' + rainData(obj.drp) + '</td>' +
                            '<td>' + timeLength(obj.intv) + '</td>' +
                            '<td>' + rainData(obj.dyp) + '</td>' +
                            '<td>' + showeather(obj.wth) + '</td>' +
                            '</tr>';
                    });
                }
                intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#raintab").html(intervalRainHtml);
                //雨情统计数据列表
                /*table = $('#rain-tab').DataTable({
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
                        // { "data": "bsnm" },
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
                });*/

                // myChart.hideLoading();
                var x_soil_data = [], stationame = [], chartsData = [];
                $.each(data.data, function (key, obj) {
                    x_soil_data.push(obj.tm)
                });
                var selected = {};
                //雨情图形报表option设置
                for (var i = 0; i < powers.length; i++) {
                    var tt = $.grep(data.data, function (d) {
                        return d.stcd == powers[i] && d.tm !== "" && d.tm !== null;
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
                        console.log(selected)
                        var chartsobj = {
                            name: tt[0].stnm,
                            type: 'bar',
                            // barGap: '-100%',
                            barCategoryGap: '40%',
                            barWidth: "5",
                            data: stationdata
                        };
                        chartsData.push(chartsobj);
                        stationame.push(tt[0].stnm);
                        selected[tt[0].stnm] = i < 5;
                    }
                }
                //console.log(chartsData);
                if (chartsData.length == 0) {
                    layer.msg("没有找到雨情相关站点数据");
                    stationame = [];
                }
                //生成雨情图形报表
                myChart.setOption({
                    title: {
                        text: "降雨量柱状图",
                        subtext: params.startime + ":00 -" + params.endtime + ":00",
                        left: 'center',
                        textStyle: {
                            fontSize: 18
                        },
                        itemGap: 5
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
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            animation: false,
                            label: {
                                backgroundColor: '#9bcd9b',
                            }
                        },
                        backgroundColor: '#9bcd9b',
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
                        data: stationame,
                        selected: selected,
                        itemGap: 20
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
    } else {
        layer.msg("输入时间格式有误")
    }
}

//多日降雨量表格
function multiDayRainfallTable() {
    if (timeValidcheck($("#s-date2").find("input").val()) && timeValidcheck($("#e-date2").find("input").val())) {
        params.startime = $("#s-date2").find("input").val() + " 08:00:00";
        params.endtime = getNextDay($("#e-date2").find("input").val()) + " 08:00:00";
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/loadDaysData',
            Parameter: {
                "rainCount.stcd": powers.join(","),
                "rainCount.startTm": params.startime,
                "rainCount.step": "1440",
                "rainCount.endTm": params.endtime
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
            layer.close(loading);
            console.log(data);
            if (data.success) {
                var tableData = data.data;
                var syear;
                var yearArray = [];
                var yearData = [];
                var monthData = [];
                var monthArray = [];

                $.each(tableData, function (key, obj) {
                    $.each(obj.stationList, function (key2, obj2) {
                        var tm = new Date(obj2.tm);
                        tm.setTime(tm.getTime() - 24 * 60 * 60 * 1000);
                        var tmYear = tm.getFullYear(),
                            tmMonth = parseInt(tm.getMonth()) + 1,
                            tmDay = tm.getDate();
                        obj2.Year = tmYear;
                        obj2.Month = tmMonth;
                        obj2.Day = tmDay;
                        if (key == 0) {
                            if (syear != obj2.Year) {
                                syear = obj2.Year;
                                yearArray.push(syear);
                            }
                        }
                    });
                    if (key == 0) {
                        $.each(yearArray, function (key3, value3) {
                            var yearDataItem = $.grep(obj.stationList, function (d) {
                                return d.Year == value3;
                            });
                            var smonth = "";
                            $.each(yearDataItem, function (key4, obj4) {
                                if (smonth != obj4.Month) {
                                    smonth = obj4.Month;
                                    monthArray.push({ m: smonth, y: obj4.Year });
                                }
                            });
                            yearData.push(yearDataItem);
                        });
                        $.each(monthArray, function (key5, value5) {
                            var monthDataItem = $.grep(obj.stationList, function (d) {
                                return d.Month == value5.m && d.Year == value5.y;
                            });
                            monthData.push(monthDataItem);
                        });
                    }
                });

                var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                    "<div><div class='btime'><strong>检索日期: </strong>" + $("#s-date2 input").val() + " 08:00 至 " + $("#e-date2 input").val() + " 08:00</div>" +
                    "<div class='bunits'><span class='total'>降雨量:毫米 总记录数：" + tableData.length + "</span></div><div>";
                intervalRainHtml += '<div class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" cellspacing="0">';
                intervalRainHtml += '<thead><tr>' +
                    '<th rowspan="3">序号</th>' +
                    '<th rowspan="3">测站编码</th>' +
                    '<th  rowspan="3">测站名称</th>' +
                    '<th  rowspan="3">站址</th>';
                $.each(yearData, function (key, yearDataObj) {
                    intervalRainHtml += '<th colspan=' + yearDataObj.length + '>' + yearDataObj[0].Year + '年</th>';
                });
                intervalRainHtml += '</tr><tr>';
                $.each(monthData, function (key, monthDataObj) {
                    intervalRainHtml += '<th colspan=' + monthDataObj.length + '>' + monthDataObj[0].Month + '月</th>';
                });
                intervalRainHtml += '</tr><tr>';
                $.each(monthData, function (key, monthDataObj) {
                    $.each(monthDataObj, function (key, dayDataObj) {
                        intervalRainHtml += '<th >' + dayDataObj.Day + '日</th>';
                    });
                });
                intervalRainHtml += '</tr></thead>';
                $.each(tableData, function (key, obj) {
                    intervalRainHtml += '<tr>' +
                        '<td > ' + (key+1) + ' </td>' +
                        '<td > ' + obj.stcd + ' </td>' +
                        '<td > ' + obj.stnm + ' </td>' +
                        '<td style="text-align: left"> ' + obj.stlc + ' </td>';
                    $.each(obj.stationList, function (key2, obj2) {
                        intervalRainHtml += '<td >' + rainData(obj2.dyp) + '</td>';
                    });
                    intervalRainHtml += '</tr>';
                });
                intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#raintab").html(intervalRainHtml);

                /*            console.log(yearArray);
                            console.log(monthArray);
                            console.log(yearData);
                            console.log(monthData);*/

            } else {
                layer.msg(data.message, { time: 3000 });
            }
        });
    } else {
        layer.msg("输入时间格式有误")
    }
}

//月逐日降雨量
function monthDayRainTable() {
    params.startime = $("#s-date3").find("input").val() + "-01 08:00:00";
    var starttime = new Date(params.startime);
    var endtime = getNextMouthFirstData(starttime, 2);
    params.endtime = endtime;
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainControl/loadDaysData',
        Parameter: {
            "rainCount.stcd": powers.join(","),
            "rainCount.startTm": params.startime,
            "rainCount.step": "1440",
            "rainCount.endTm": params.endtime
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
        layer.close(loading);
        if (data.success) {
            var tableData = data.data;
            var monthData = [];
            $.each(tableData, function (key, obj) {
                $.each(obj.stationList, function (key2, obj2) {
                    var tm = new Date(obj2.tm);
                    tm.setTime(tm.getTime() - 24 * 60 * 60 * 1000);
                    var tmYear = tm.getFullYear(),
                        tmMonth = parseInt(tm.getMonth()) + 1,
                        tmDay = tm.getDate();
                    obj2.Year = tmYear;
                    obj2.Month = tmMonth;
                    obj2.Day = tmDay;
                    if (key == 0) {
                        monthData = obj.stationList;
                    }
                });
            });
            var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                "<div><div class='btime'><strong>检索月份: </strong>" + $("#s-date3 input").val() + "</div>" +
                "<div class='bunits'><span class='total'>总记录数：" + tableData.length + "</span></div><div>";
            intervalRainHtml += '<div class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" cellspacing="0">';
            intervalRainHtml += '<thead><tr>' +
                '<th rowspan="2" >序号</th>' +
                '<th rowspan="2" >测站编码</th>' +
                '<th  rowspan="2" >测站名称</th>' +
                '<th  rowspan="2" >站址</th>';
            intervalRainHtml += '<th colspan=' + monthData.length + '>' + monthData[0].Month + '月</th>';
            intervalRainHtml += '</tr><tr>';
            $.each(monthData, function (key, monthDataObj) {
                intervalRainHtml += '<th >' + monthDataObj.Day + '日</th>';
            });

            $.each(tableData, function (key, obj) {
                intervalRainHtml += '<tr>' +
                    '<td style="width: 100px"> ' + (key+1) + ' </td>' +
                    '<td style="width: 100px"> ' + obj.stcd + ' </intervalRainHtml += \'</tr></thead>\';td>' +
                    '<td style="width: 100px"> ' + obj.stnm + ' </td>' +
                    '<td style="width: 300px;text-align: left"> ' + obj.stlc + ' </td>';
                $.each(obj.stationList, function (key2, obj2) {
                    intervalRainHtml += '<td style="width:50px;">' + rainData(obj2.dyp) + '</td>';
                });
                intervalRainHtml += '</tr>';
            });

            intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';

            $("#raintab").html(intervalRainHtml);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//年逐日降雨量
function yearDayRainTable() {
    params.startime = $("#s-date4").find("input").val() + "-01-01 08:00:00";
    params.endtime = getNextMouthFirstData(params.startime, 13);
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainControl/loadDaysDataByYear',
        Parameter: {
            "rainCount.stcd": $("#stationsel").val(),
            "rainCount.startTm": params.startime,
            "rainCount.step": "1440",
            "rainCount.endTm": params.endtime
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
        layer.close(loading);
        if (data.success == "true") {
            $.each(data.data, function (key, obj) {
                $.each(obj.stationList, function (key2, obj2) {
                    var tm = new Date(obj2.tm);
                    tm.setTime(tm.getTime() - 24 * 60 * 60 * 1000);
                    var tmYear = tm.getFullYear(),
                        tmMonth = parseInt(tm.getMonth()) + 1,
                        tmDay = tm.getDate();
                    obj2.Year = tmYear;
                    obj2.Month = tmMonth;
                });
            });
            var monthDataArray = [], monthDataItem;
            tableData = data.data[0].stationList;
            for (var i = 1; i <= 12; i++) {
                var monthDataItem = $.grep(tableData, function (d) {
                    return (d.Month == i && d.stcd != "");
                });
                monthDataArray.push(monthDataItem);
            }
            console.log(monthDataArray);

            //月降雨量数组
            var monthRainArray = $.grep(tableData, function (d) {
                return (d.stnm == "月降雨量" && d.stcd == "");
            });

            //降雨日数
            var rainDayArray = $.grep(tableData, function (d) {
                return (d.stnm == "降雨日数" && d.stcd == "");
            });

            //最大日量
            var maxDayArray = $.grep(tableData, function (d) {
                return (d.stnm == "最大日量" && d.stcd == "");
            });
            //年降雨量
            var yearRainArray = $.grep(tableData, function (d) {
                return ((d.stnm == "年降雨日数") || (d.stnm == "年降雨量") && d.stcd == "");
            });
            console.log(yearRainArray);
            var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                "<div><div class='btime'>测站名称:" + $("#stationsel").find("option:selected").text() + "</div>" +
                "<div class='bunits'><span class='total'>资料年份:" + $("#s-date4 input").val() + "</span></div><div>";
            intervalRainHtml += '<div  class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
            intervalRainHtml += '<thead><tr>' +
                // '<th>序号</th>' +
                '<th>日&frasl;月</th>' +
                '<th>一月</th>' +
                '<th>二月</th>' +
                '<th>三月</th>' +
                '<th>四月</th>' +
                '<th>五月</th>' +
                '<th>六月</th>' +
                '<th>七月</th>' +
                '<th>八月</th>' +
                '<th>九月</th>' +
                '<th>十月</th>' +
                '<th>十一月</th>' +
                '<th>十二月</th>' +
                '</tr></thead>';
            for (var iday = 1; iday <= 31; iday++) {
                intervalRainHtml += '<tr><td>' + iday + '</td>';
                for (var imonth = 1; imonth <= 12; imonth++) {
                    try {
                        intervalRainHtml += '<td>' + rainData(monthDataArray[imonth - 1][iday - 1].dyp) + '</td>';
                    } catch (e) {
                        intervalRainHtml += '<td></td>';
                    }
                }
                intervalRainHtml += '</tr>';
            }

            intervalRainHtml += '<tr><td>月降雨量</td>';
            for (var imonth = 1; imonth <= 12; imonth++) {
                intervalRainHtml += '<td>' + rainData(monthRainArray[imonth - 1].drp) + '</td>';
            }
            intervalRainHtml += '</tr>';

            intervalRainHtml += '<tr><td>降雨日数</td>';
            for (var imonth = 1; imonth <= 12; imonth++) {
                intervalRainHtml += '<td>' + rainDayArray[imonth - 1].dyp + '</td>';
            }
            intervalRainHtml += '</tr>';

            intervalRainHtml += '<tr><td>最大日量</td>';
            for (var imonth = 1; imonth <= 12; imonth++) {
                intervalRainHtml += '<td>' + rainData(maxDayArray[imonth - 1].dyp) + '</td>';
            }
            intervalRainHtml += '</tr>';
            intervalRainHtml += '<tr><td>年统计</td>';
            intervalRainHtml += '<td>年降雨量</td>' + '<td>' + rainData(yearRainArray[0].dyp) + '</td><td>降雨日数</td><td>' + yearRainArray[1].dyp + '</td><td colspan="8"></td>';
            intervalRainHtml += '</tr>';
            intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
            $("#raintab").html(intervalRainHtml);
        } else {
            var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                "<div><div class='btime'>测站名称:" + $("#stationsel").find("option:selected").text() + "</div>" +
                "<div class='bunits'><span class='total'>资料年份:" + $("#s-date4 input").val() + "</span></div><div>";
            intervalRainHtml += '<div  class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
            intervalRainHtml += '<thead><tr><td>无数据</td></tr></thead></table>';
            $("#raintab").html(intervalRainHtml);
            layer.msg("无数据返回", { time: 3000 });
        }
    });
}

//年逐月降雨量
function yearMonthRainTable() {
    var starttime = $("#s-date5").find("input").val() + "-01";
    var endtime = new Date(getNextMouthFirstData(starttime, 13));
    endtime = endtime.format("yyyy-MM");
    params.startime = starttime;
    params.endtime = endtime;
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainCountControl/countYByTmStep',
        Parameter: {
            "rainCount.stcd": powers.join(","),
            "rainCount.startTm": params.startime + "-01 08:00:00",
            "rainCount.endTm": params.endtime + "-01 08:00:00"
            // "rainCount.stcd": "41101100",
            // "rainCount.startTm": "2015-08-14 08:00:00",
            // "rainCount.endTm": "2016-08-14 08:00:00"
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
        layer.close(loading);
        if (data.success) {
            console.log(data);
            var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                "<div><div class='btime'><strong>检索年份: </strong>" + $("#s-date5 input").val() + "</div>" +
                "<div class='bunits'><span class='total'>降雨量:毫米 总记录数：" + data.data.length + "</span></div><div>";
            intervalRainHtml += '<div class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" cellspacing="0">';
            intervalRainHtml += '<thead><tr>' +
                '<th>序号</th>' +
                '<th>测站编码</th>' +
                '<th>测站名称</th>' +
                '<th>站址</th>';
            for (var imonth = 1; imonth <= 12; imonth++) {
                intervalRainHtml += '<th>' + imonth + '月</th>';
            }
            intervalRainHtml += '</tr></thead>';
            $.each(data.data, function (key, obj) {
                intervalRainHtml += '<tr>' +
                    '<td style="width: 100px">' + (key+1) + '</td>' +
                    '<td style="width: 100px">' + obj.stcd + '</td>' +
                    '<td style="width: 100px">' + obj.stnm + '</td>' +
                    '<td style="width: 300px;text-align: left">' + obj.stlc + '</td>';
                for (var imonth = 1; imonth <= 12; imonth++) {
                    intervalRainHtml += '<td style="width: 50px">' + rainData(obj.stationList[imonth - 1].drp) + '</td>';
                }
                intervalRainHtml += '</tr>';
            });
            intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
            $("#raintab").html(intervalRainHtml);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//旬降雨量
function xunMonthRainTable() {
    params.startime = $("#s-date6").find("input").val();
    params.endtime = getNextMouth($("#e-date6").find("input").val(), 2);
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainCountControl/countXByTmStep',
        Parameter: {
            "rainCount.stcd": powers.join(","),
            "rainCount.startTm": params.startime + "-01 08:00:00",
            "rainCount.endTm": params.endtime + "-01 08:00:00"
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
        console.log(data.data);
        //console.log(JSON.stringify(data.data));
        layer.close(loading);
        if (data.success) {
            var tableData = data.data;
            var syear;
            var yearArray = [];
            var yearData = [];
            var monthData = [];
            var monthArray = [];
            var yearArray_new = [];
            var yearData_new = [];
            var monthData_new = [];
            var monthArray_new = [];
            $.each(tableData, function (key, obj) {
                $.each(obj.stationList, function (key2, obj2) {
                    var tm = new Date(obj2.tm);
                    tm.setTime(tm.getTime() - 24 * 60 * 60 * 1000);
                    var tmYear = tm.getFullYear(),
                        tmMonth = parseInt(tm.getMonth()) + 1,
                        tmDay = tm.getDate();
                    obj2.Year = tmYear;
                    obj2.Month = tmMonth;
                    obj2.Day = tmDay;
                    if (key == 0) {
                        if ((key == 0) && (obj2.addvcd != "")) {
                            if (syear != obj2.Year) {
                                syear = obj2.Year;
                                yearArray.push(syear);
                            }
                        }
                    }
                });
                if (key == 0) {
                    $.each(yearArray, function (key3, value3) {
                        var yearDataItem = $.grep(obj.stationList, function (d) {
                            return d.Year == value3;
                        });
                        var smonth = "";
                        $.each(yearDataItem, function (key4, obj4) {
                            if (smonth != obj4.Month) {
                                objMonth = {
                                    Year: value3,
                                    Month: obj4.Month
                                };
                                smonth = obj4.Month;
                                monthArray.push(objMonth);
                            }
                        });
                        yearData.push(yearDataItem);
                    });
                    $.each(monthArray, function (key5, obj5) {
                        var monthDataItem = $.grep(obj.stationList, function (d) {
                            return (d.Month == obj5.Month && d.Year == obj5.Year);
                        });
                        monthData.push(monthDataItem);
                    });
                }

                $.each(yearArray, function (key3, value3) {
                    var yearDataItem_new = $.grep(obj.stationList, function (d) {
                        return d.Year == value3;
                    });
                    var smonth_new = "";
                    $.each(yearDataItem_new, function (key4, obj4) {
                        if (smonth_new != obj4.Month) {
                            var objMonth_new = {
                                Year: value3,
                                Month: obj4.Month
                            };
                            smonth_new = obj4.Month;
                            monthArray_new.push(objMonth_new);
                        }
                    });
                    yearData_new.push(yearDataItem_new);
                });
                $.each(monthArray_new, function (key5, obj5) {
                    var monthDataItem_new = $.grep(obj.stationList, function (d) {
                        return (d.Month == obj5.Month && d.Year == obj5.Year);
                    });
                    monthData_new.push(monthDataItem_new);
                });
            });
            var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                "<div><div class='btime'><strong>检索月份: </strong>" + $("#s-date6 input").val() + " 至 " + $("#e-date6 input").val() + "</div>" +
                "<div class='bunits'><span class='total'>降雨量:毫米 总记录数：" + tableData.length + "</span> </div><div>";
            intervalRainHtml += '<div class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" cellspacing="0">';
            intervalRainHtml += '<thead><tr>' +
                '<th rowspan="3">序号</th>' +
                '<th rowspan="3">测站编码</th>' +
                '<th  rowspan="3">测站名称</th>' +
                '<th  rowspan="3">站址</th>';
            $.each(yearData, function (key, yearDataObj) {
                intervalRainHtml += '<th colspan=' + yearDataObj.length + '>' + yearDataObj[0].Year + '年</th>';
            });
            intervalRainHtml += '</tr><tr>';
            $.each(monthData, function (key, monthDataObj) {
                intervalRainHtml += '<th colspan=' + monthDataObj.length + '>' + monthDataObj[0].Month + '月</th>';
            });
            intervalRainHtml += '</tr><tr>';
            //重新计算合计

            $.each(monthData_new, function (key, monthDataObj) {
                var xsum = 0;
                $.each(monthDataObj, function (key_2, dayDataObj) {
                    if (key_2 < 3) {
                        if (!isNull(dayDataObj.drp)) {
                            xsum += dayDataObj.drp - 0;
                        }
                    } else if (key_2 === 3) {
                        dayDataObj.drp = xsum
                    }
                });
            });

            $.each(monthData, function (key, monthDataObj) {
                // if(key<2) {
                $.each(monthDataObj, function (key, dayDataObj) {
                    intervalRainHtml += '<th>' + dayDataObj.top1 + '</th>';
                });
                // }
            });
            intervalRainHtml += '</tr></thead>';
            $.each(tableData, function (key, obj) {
                intervalRainHtml += '<tr>' +
                    '<td style="width: 100px"> ' + (key+1) + ' </td>' +
                    '<td style="width: 100px"> ' + obj.stcd + ' </td>' +
                    '<td style="width: 100px"> ' + obj.stnm + ' </td>' +
                    '<td style="width: 300px;text-align: left"> ' + obj.stlc + ' </td>';
                $.each(obj.stationList, function (key2, obj2) {
                    intervalRainHtml += '<td style="width:50px;">' + rainData(obj2.drp) + '</td>';
                });
                intervalRainHtml += '</tr>';
            });
            intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
            $("#raintab").html(intervalRainHtml);
            console.log(yearArray);
            console.log(monthArray);
            console.log(yearData);
            console.log(monthData);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//月降雨量
function monthRainTable() {
    params.startime = $("#s-date7").find("input").val();
    params.endtime = getNextMouth($("#e-date7").find("input").val(), 2);
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainCountControl/countYByTmStep',
        Parameter: {
            "rainCount.stcd": powers.join(","),
            "rainCount.startTm": params.startime + "-01 08:00:00",
            "rainCount.endTm": params.endtime + "-01 08:00:00"
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
        layer.close(loading);
        if (data.success) {
            var tableData = data.data;
            var syear;
            var yearArray = [];
            var yearData = [];
            var monthData = [];
            var monthArray = [];
            $.each(tableData, function (key, obj) {
                $.each(obj.stationList, function (key2, obj2) {
                    var tm = new Date(obj2.tm);
                    tm.setTime(tm.getTime() - 24 * 60 * 60 * 1000);
                    var tmYear = tm.getFullYear(),
                        tmMonth = parseInt(tm.getMonth()) + 1,
                        tmDay = tm.getDate();
                    obj2.Year = tmYear;
                    obj2.Month = tmMonth;
                    obj2.Day = tmDay;
                    if (key == 0) {
                        // if((key == 0)&&(obj2.addvcd!="")) {
                        if (syear != obj2.Year) {
                            syear = obj2.Year;
                            yearArray.push(syear);
                        }
                    }
                });
                if (key == 0) {
                    $.each(yearArray, function (key3, value3) {
                        var yearDataItem = $.grep(obj.stationList, function (d) {
                            return d.Year == value3;
                        });
                        var smonth = "";
                        $.each(yearDataItem, function (key4, obj4) {
                            if (smonth != obj4.Month) {
                                smonth = obj4.Month;
                                monthArray.push(smonth);
                            }
                        });
                        yearData.push(yearDataItem);
                    });
                    $.each(monthArray, function (key5, value5) {
                        var monthDataItem = $.grep(obj.stationList, function (d) {
                            return d.Month == value5;
                        });
                        monthData.push(monthDataItem);
                    });
                }
            });
            var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                "<div><div class='btime'><strong>检索月份: </strong>" + $("#s-date7 input").val() + " 至 " + $("#e-date7 input").val() + "</div>" +
                "<div class='bunits'><span class='total'>降雨量:毫米 总记录数：" + tableData.length + "</span></div><div>";
            intervalRainHtml += '<div class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" cellspacing="0">';
            intervalRainHtml += '<thead><tr>' +
                '<th rowspan="2">序号</th>' +
                '<th rowspan="2">测站编码</th>' +
                '<th  rowspan="2">测站名称</th>' +
                '<th  rowspan="2">站址</th>';
            $.each(yearData, function (key, yearDataObj) {
                intervalRainHtml += '<th rowspan="1" colspan=' + yearDataObj.length + '>' + yearDataObj[0].Year + '年</th>';
            });
            intervalRainHtml += '</tr><tr>';
            $.each(monthData, function (key, monthDataObj) {
                intervalRainHtml += '<th rowspan="1" colspan="1">' + monthDataObj[0].Month + '月</th>';
            });
            intervalRainHtml += '</tr></thead>';
            $.each(tableData, function (key, obj) {
                intervalRainHtml += '<tr>' +
                    '<td style="width: 100px"> ' + (key+1) + ' </td>' +
                    '<td style="width: 100px"> ' + obj.stcd + ' </td>' +
                    '<td style="width: 100px"> ' + obj.stnm + ' </td>' +
                    '<td style="width: 300px;text-align: left"> ' + obj.stlc + ' </td>';
                $.each(obj.stationList, function (key2, obj2) {
                    intervalRainHtml += '<td style="width:50px;">' + rainData(obj2.drp) + '</td>';
                });
                intervalRainHtml += '</tr>';
            });
            intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
            $("#raintab").html(intervalRainHtml);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });

}

//累计雨量
function totalRainTable() {
    if (timeValidcheck($("#s-date8").find("input").val().split(" ")[0]) && timeValidcheck($("#e-date8").find("input").val().split(" ")[0])) {
        params.startime = $("#s-date8").find("input").val() + ":00";
        params.endtime = $("#e-date8").find("input").val() + ":00";
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/countStationRainData',
            Parameter: {
                "rainCount.stcd": powers.join(","),
                "rainCount.startTm": params.startime,
                "rainCount.endTm": params.endtime
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
            layer.close(loading);
            if (data.success) {
                height = 130;
                // resizeWorldMapContainer(5);
                var name = new Array();
                var normal = new Array();
                $.each(sortName(data.data), function (index, obj) {
                    name[index] = obj.stnm;
                    normal[index] = rainData(obj.drp);
                });
                var length = 22 / name.length * 100;
                myChart.setOption({
                    title: {
                        text: "累计降雨量柱状图",
                        subtext: params.startime + " - " + params.endtime,
                        left: 'center',
                        textStyle: {
                            fontSize: 18
                        },
                        itemGap: 6
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params, ticket, callback) {
                            console.log(params);
                            return "测站名称：" + params[0].axisValue + " " + params[0].seriesName + "：" + params[0].data + "mm"
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    dataZoom: {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                        start: 0,
                        end: length
                    },
                    legend: {
                        type: 'scroll',
                        top: 40,
                        data: name
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: name,
                            // axisLabel: {
                            //     rotate: 15
                            // }
                            inverse: true
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '累计降雨量',
                            type: 'bar',
                            stack: '广告',
                            itemStyle: {
                                normal: {
                                    color: '#3169d8',
                                    lineStyle: {
                                        //color: '#009d89'
                                        color: '#1fd800',
                                    }
                                }
                            },
                            data: normal,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'inside',
                                    // color: "#333"
                                    // formatter: '{c}%'
                                }
                            }
                        }
                    ]
                }, true);
                var intervalRainHtml = "<div class='tabletitle'>" + $("#searchtype").find("option:selected").text() + "表</div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date8 input").val() + " 至 " + $("#e-date8 input").val() + "</div>" +
                    "<div class='bunits'><span class='total'>降雨量:毫米  总记录数：" + data.data.length + "</span></div><div>";
                intervalRainHtml += '<div class="tablediv"><table id="raintable" class="raintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                intervalRainHtml += '<thead><tr>' +
                    '<th>序号</th>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>行政区域</th>' +
                    '<th>流域</th>' +
                    '<th>水系</th>' +
                    '<th>站址</th>' +
                    '<th>降雨量</th>' +
                    '</tr></thead>';
                // var ttall = [];
                // for (var i = 0; i < country.length; i++) {
                //     var tt = $.grep(data.data, function (d) {
                //         return d.addvnm == country[i]
                //     });
                //     for (var a = 0; a < tt.length; a++) {
                //         ttall.push(tt[a]);
                //     }
                // }
                $.each(sortName(data.data), function (key, obj) {
                    intervalRainHtml += '<tr>' +
                        '<td>' + (key+1) + '</td>' +
                        '<td>' + obj.stcd + '</td>' +
                        '<td>' + obj.stnm + '</td>' +
                        '<td>' + obj.addvnm + '</td>' +
                        '<td>' + obj.bsnm + '</td>' +
                        '<td>' + obj.hnnm + '</td>';
                    if (obj.stlc.length < 3) {
                        intervalRainHtml += '<td class="stlcWidth" style="text-align: center">' + obj.stlc + '</td>';
                    } else {
                        intervalRainHtml += '<td class="stlcWidth" style="text-align: left">' + obj.stlc + '</td>';
                    }
                    intervalRainHtml += '<td>' + rainData(obj.drp) + '</td>' +
                        '</tr>';
                });
                intervalRainHtml += '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#raintab").html(intervalRainHtml);
            } else {
                layer.msg(data.message, { time: 3000 });
                myChart.hideLoading();
            }
        });
    } else {
        layer.msg("输入时间格式有误", { time: 3000 });
    }
}

$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata(1);
    //初始化监测站点数据
    initCode(1);
    //下拉框combox
    stationSelect();

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
    var datetimepickerOption2 = {
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        pickerPosition: "bottom-left",
        endDate: new Date()
    };
    $("#s-date2,#e-date2").datetimepicker(datetimepickerOption2);

    var datetimepickerOption3 = {
        format: "yyyy-mm",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 3,
        minView: 3,
        forceParse: 0,
        pickerPosition: "bottom-left"
    };
    $("#s-date3").datetimepicker(datetimepickerOption3);
    $("#s-date3").datetimepicker('update', new Date());

    var datetimepickerOption4 = {
        format: "yyyy",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 4,
        minView: 4,
        forceParse: 0,
        pickerPosition: "bottom-left"
    };
    $("#s-date4").datetimepicker(datetimepickerOption4);
    $("#s-date4").datetimepicker('update', new Date());

    var datetimepickerOption5 = {
        format: "yyyy",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 4,
        minView: 4,
        forceParse: 0,
        pickerPosition: "bottom-left"
    };
    $("#s-date5").datetimepicker(datetimepickerOption5);
    $("#s-date5").datetimepicker('update', new Date());

    var datetimepickerOption6 = {
        format: "yyyy-mm",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 3,
        minView: 3,
        forceParse: 0,
        pickerPosition: "bottom-left"
    };
    $("#s-date6,#e-date6").datetimepicker(datetimepickerOption6);
    $("#s-date6").datetimepicker('update', getNextMouthFirstData(new Date(), 0));
    $("#e-date6").datetimepicker('update', new Date());

    var datetimepickerOption7 = {
        format: "yyyy-mm",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 3,
        minView: 3,
        forceParse: 0,
        pickerPosition: "bottom-left"
    };
    $("#s-date7,#e-date7").datetimepicker(datetimepickerOption7);
    $("#s-date7").datetimepicker('update', getNextMouthFirstData(new Date(), 0));
    $("#e-date7").datetimepicker('update', new Date());
    var datetimepickerOption8 = {
        format: "yyyy-mm-dd hh:ii",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 0,
        forceParse: 0,
        pickerPosition: "bottom-left"
    };
    $("#s-date8,#e-date8").datetimepicker(datetimepickerOption8);


    $("#s-date,#s-date8").datetimepicker('update', starttimevalue);
    $("#e-date,#e-date8").datetimepicker('update', endtimevalue);
    var sa = new Date();
    sa.setTime(sa.getTime() - 86400000 * 8);
    var eb = new Date();
    eb.setTime(eb.getTime() - 86400000);
    $("#s-date2").datetimepicker('update', sa);
    $("#e-date2").datetimepicker('update', eb);
    //开始时间
    params.startime = $("#s-date").find("input").val();
    //结束时间
    params.endtime = $("#e-date").find("input").val();

    $(".leftNav select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });

    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert($("#stcode").val());
    //     initTreedata(1, $("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(1, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(1, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(1, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    var selecthtml = '<option value="">全部</option><option value="PP">雨量站</option><option value="ZQ">河道水文站</option><option value="ZZ">河道水位站</option><option value="RR">水库水文站</option>';
    $("#cztp").html(selecthtml);
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    //右边图表自适应方法
    resizeWorldMapContainer = function (height) {
        document.getElementById('chart').style.width = (window.innerWidth - 253) + 'px';
        document.getElementById('chart').style.height = (window.innerHeight - height) + 'px';
    };
    //右边图表自适应方法
    resizeWorldMapContainer(height);
    //右边图表初始化容器
    myChart = echarts.init(document.getElementById('chart'));
    //右边图表初始化
    option = {
        title: {
            text: "降雨量柱状图",
            subtext: subtitle,
            left: 'center',
            textStyle: {
                fontSize: 18
            },
            itemGap: 6
        },
        tooltip: {
            trigger: 'item',
            show: true,
            showDelay: 0,
            hideDelay: 0,
            transitionDuration: 0,
            backgroundColor: '#9bcd9b',
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

    periodRainfallTable();
    //统计查询方法
    $("#tongji").click(function () {
        // $(".nav-tabs").removeClass("disabled0");
        //开始时间
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
            //河道水情查询
            var loading = "";
            $("#raintab").removeClass("hidden").siblings().addClass("hidden");

            if ($("#searchtype").val() == 1) {
                $('a[href="#chart0"]').parent("li").removeAttr("style");
                $('a[href="#chart0"]').css("pointer-events", "visible");
                periodRainfallTable()
            } else if ($("#searchtype").val() == 2) {
                $('a[href="#chart0"]').parent("li").css({
                    "cursor": "not-allowed",
                    "background": "#e0e0e0",
                    "opacity": "0.5"
                });
                $('a[href="#chart0"]').css("pointer-events", "none");
                multiDayRainfallTable();
            } else if ($("#searchtype").val() == 3) {
                $('a[href="#chart0"]').parent("li").css({
                    "cursor": "not-allowed",
                    "background": "#e0e0e0",
                    "opacity": "0.5"
                });
                $('a[href="#chart0"]').css("pointer-events", "none");
                monthDayRainTable();
            } else if ($("#searchtype").val() == 4) {
                $('a[href="#chart0"]').parent("li").css({
                    "cursor": "not-allowed",
                    "background": "#e0e0e0",
                    "opacity": "0.5"
                });
                $('a[href="#chart0"]').css("pointer-events", "none");
                if ($("#stationsel").val() == "") {
                    layer.msg("请选择站点!")
                } else {
                    yearDayRainTable();
                }
            } else if ($("#searchtype").val() == 5) {
                $('a[href="#chart0"]').parent("li").css({
                    "cursor": "not-allowed",
                    "background": "#e0e0e0",
                    "opacity": "0.5"
                });
                $('a[href="#chart0"]').css("pointer-events", "none");
                yearMonthRainTable();
            } else if ($("#searchtype").val() == 6) {
                $('a[href="#chart0"]').parent("li").css({
                    "cursor": "not-allowed",
                    "background": "#e0e0e0",
                    "opacity": "0.5"
                });
                $('a[href="#chart0"]').css("pointer-events", "none");
                xunMonthRainTable();
            } else if ($("#searchtype").val() == 7) {
                $('a[href="#chart0"]').parent("li").css({
                    "cursor": "not-allowed",
                    "background": "#e0e0e0",
                    "opacity": "0.5"
                });
                $('a[href="#chart0"]').css("pointer-events", "none");
                monthRainTable();
            } else if ($("#searchtype").val() == 8) {
                // $('a[href="#chart0"]').parent("li").css({
                //     "cursor": "not-allowed",
                //     "background": "#e0e0e0",
                //     "opacity": "0.5"
                // });
                // $('a[href="#chart0"]').css("pointer-events", "none");
                $('a[href="#chart0"]').parent("li").removeAttr("style");
                $('a[href="#chart0"]').css("pointer-events", "visible");
                totalRainTable();
            }

        } else {
            layer.msg("请选择站点以及开始和结束时间!");
        }
    });

    $("#searchtype").change(function () {
        if ($("#searchtype").val() == 1) {
            hideFormatDate();
            $("#formatdate1").removeClass('hidden');
            var datetimepickerOption = {
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
            };
            $("#s-date,#e-date").datetimepicker(datetimepickerOption);
            showTreeList();
            /*            minview = 0;
                        formatdate = "yyyy-mm-dd hh:ii";
                        if ($("#s-date input").val()=="") {
                            var sDate=( new Date().format("yyyy-MM-dd hh:mm:ss") );
                        } else {
                            var sDate=( new Date(($("#s-date input").val())).format("yyyy-MM-dd hh:mm:ss") );
                        }
                        if ($("#e-date input").val()=="") {
                            var eDate=( new Date().format("yyyy-MM-dd hh:mm:ss") );
                        } else {
                            var eDate=( new Date(($("#e-date input").val())).format("yyyy-MM-dd hh:mm:ss") );
                        }
                        defaultFormatDate();*/
        } else if ($("#searchtype").val() == 2) {
            hideFormatDate();
            $("#formatdate2").removeClass('hidden');
            showTreeList();
        } else if ($("#searchtype").val() == 3) {
            hideFormatDate();
            $("#formatdate3").removeClass('hidden');
            showTreeList();
        } else if ($("#searchtype").val() == 4) {
            hideFormatDate();
            $(".chooseBox").addClass('hidden');
            $("#formatdate4").removeClass('hidden');
        } else if ($("#searchtype").val() == 5) {
            hideFormatDate();
            $(".chooseBox").addClass('hidden');
            $("#formatdate5").removeClass('hidden');
            showTreeList();
        } else if ($("#searchtype").val() == 6) {
            hideFormatDate();
            $("#formatdate6").removeClass('hidden');
            showTreeList();
        } else if ($("#searchtype").val() == 7) {
            $(".chooseBox").removeClass('hidden');
            hideFormatDate();
            $("#formatdate7").removeClass('hidden');
            showTreeList();
        } else if ($("#searchtype").val() == 8) {
            hideFormatDate();
            $("#formatdate8").removeClass('hidden');
            showTreeList();
        }

        /*        datetimepickerOption.minView = minview;
                datetimepickerOption.format = formatdate;
                $("#s-date,#e-date").datetimepicker('remove');
                $("#s-date,#e-date").datetimepicker(datetimepickerOption);
                $("#s-date input").val(sDate);
                $("#e-date input").val(eDate);*/

    });

    /*    //初始化数据表格（无数据状态）
        table = $('#rain-tab').DataTable({
            aaData: null,
            lengthChange: false,
            "iDisplayLength": 15,
            searching: false,
            bDestroy: true,
            language: reportLanguage,
            ordering: false
        });*/


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


var aclick = function (aa) {
    if ($('#raintable tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        //alert(jst + total);
        if ($("#searchtype").val() == 1) {
            $(aa).attr("download", "时段降雨量表.xls");
            exportExcel(aa, 'raintable', '时段降雨量表', jst, total, time, company, 1)
        } else if ($("#searchtype").val() == 2) {
            $(aa).attr("download", "多日降雨量表.xls");
            exportExcel(aa, 'raintable', '多日降雨量表', jst, total, time, company, 3)
        } else if ($("#searchtype").val() == 3) {
            $(aa).attr("download", "月逐日降雨量.xls");
            exportExcel(aa, 'raintable', '月逐日降雨量', jst, total, time, company, 2)
        } else if ($("#searchtype").val() == 4) {
            $(aa).attr("download", "年逐日降雨量.xls");
            exportExcel(aa, 'raintable', '年逐日降雨量', jst, total, time, company, 1)
        } else if ($("#searchtype").val() == 5) {
            $(aa).attr("download", "年逐月降雨量.xls");
            exportExcel(aa, 'raintable', '年逐月降雨量', jst, total, time, company, 1)
        } else if ($("#searchtype").val() == 6) {
            $(aa).attr("download", "旬降雨量.xls");
            exportExcel(aa, 'raintable', '旬降雨量', jst, total, time, company, 3)
        } else if ($("#searchtype").val() == 7) {
            $(aa).attr("download", "月降雨量.xls");
            exportExcel(aa, 'raintable', '月降雨量', jst, total, time, company, 2)
        } else if ($("#searchtype").val() == 8) {
            $(aa).attr("download", "累计降雨量.xls");
            exportExcel(aa, 'raintable', '累计降雨量', jst, total, time, company, 1)
        }
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}

//获取指定日期的后一天
function getNextDay(d) {
    d = new Date(d);
    d = +d + 1000 * 60 * 60 * 24;
    d = new Date(d);
    //return d;
    //格式化
    return d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" + (d.getDate()) : d.getDate());
}

