var user = JSON.parse($.cookie("user"));
var areaName = user.AreaName;
var stationstring = [], qvaluestring = [];

//初始化站点方法
function initCode0() {
    var obj = {
        Type: 'get',
        Uri: '/station/getmapstation',
        Parameter: {
            areaCode: user.AreaCode,
            state: 0
        }
    };
    $.ajax({
        async: false,
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        stationstring = data.data;
    })
}

//初始化起报流量
function initQ() {
    var obj = {
        Type: 'get',
        Uri: '/aControl/RiverSimpleReportControl/riverCount'
    };
    $.ajax({
        async: false,
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        qvaluestring = data.data.unreported;
    })
}

//获取河道水情数据
var getRiverData = function () {
    if (timeValidcheck($("#river-start-time input").val().split(" ")[0])) {
        var riverSttm = $("#river-start-time input").val();
        // var riverEdtm = $("#river-end-time input").val();
        $('.load-wrapp').removeClass('hidden');
        $('#resultconcent').addClass('hidden');
        // $("#printRiverBtn").attr("disabled", true);
        var obj = {
            Type: 'get',
            Uri: '/aControl/RiverControl/riverWaterInfo',
            Parameter: {
                "waterInfo.adcd": user.AreaCode,
                "waterInfo.startTm": riverSttm + ':00',
                "waterInfo.endTm": riverSttm + ':00'
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            console.log(data.data);
            var code = [],valuedatastring=[];
            $.each(data.data, function (i, v) {
                code.push(v.stcd)
            });
            // console.log(code);
            $.each(code, function (i, v) {
                var valuedata=$.grep(qvaluestring, function (d) {
                    return d.stcd === v
                });
                valuedatastring.push(valuedata);
            });
            console.log(valuedatastring);
            $.each(data.data, function (index, v) {
                if(valuedatastring[index].length>0){
                    v.value=valuedatastring[index][0].value;
                } else {
                    v.value=null;
                }
            });
            var levelString = [], levelCode = [], matchSta = [];
            levelString = $("#levelSelect").val();
            if (levelString !== null) {
                for (var i = 0; i < levelString.length; i++) {
                    var sst = $.grep(stationstring, function (d) {
                        console.log(Typest(levelString[i]));
                        return d.Level == Typest(levelString[i])
                    });
                    $.merge(matchSta, sst);
                }
                for (var vv = 0; vv < matchSta.length; vv++) {
                    levelCode.push(matchSta[vv].Code);
                }
                // console.log(levelCode);
                //筛选去除不符合所选报讯等级返回的站码序列返回的数组

                for (var i = 0; i < data.data.length; i++) {
                    if (levelCode.indexOf(data.data[i].stcd) == -1) {
                        data.data.splice(i, 1);
                        i -= 1
                    }
                }
            }
            var rivername = [];
            for (var t = 0; t < data.data.length; t++) {
                if ((data.data[t].rvnm.replace(/\s/g, "") !== "泾河" && data.data[t].rvnm.replace(/\s/g, "") !== "渭河")) {
                    rivername.push(data.data[t].rvnm.replace(/\s/g, ""));
                }
            }
            rivername.distinct();
            var weihe = $.grep(data.data, function (d) {
                return d.rvnm.replace(/\s/g, "") === "渭河"
            });
            var jinhe = $.grep(data.data, function (d) {
                return d.rvnm.replace(/\s/g, "") === "泾河"
            });
            var other = $.grep(data.data, function (d) {
                return d.rvnm.replace(/\s/g, "") !== "泾河" && d.rvnm.replace(/\s/g, "") !== "渭河"
            });
            var otherriver = [];
            for (var hh = 0; hh < rivername.length; hh++) {
                var list = $.grep(default1(other), function (d) {
                    return d.rvnm.replace(/\s/g, "") === rivername[hh]
                });
                var list_l = { "name": rivername[hh], "data": list };
                otherriver.push(list_l);
            }
            $('.load-wrapp').addClass('hidden');
            $('#resultconcent').removeClass('hidden');

            var resultDate = "<strong>检索时间: </strong>" + riverSttm;
            var resultUnit = "水位:米 流量：立方米每秒 总记录数：" + data.data.length;
            $('#resultDate').html(resultDate);
            $('#resultUnit').html(resultUnit);
            var resultTableBottom = '<div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
            $('#resulttablebottom').html(resultTableBottom);

            var tableHtml = '<table class="table-bordered dataTable" align="center" id="riverMes_table">';
            tableHtml += "<tr style='line-height: 35px;'>" +
                '<td><strong>河流名称</strong></td>' +
                '<td><strong>测站名称</strong></td>' +
                // '<td><strong>时间</strong></td>' +
                '<td><strong>水位</strong></td>' +
                '<td><strong>流量</strong></td>' +
                '<td><strong>水势</strong></td>' +
                '<td><strong>起报流量</strong></td>' +
                '<td><strong>警戒流量</strong></td>' +
                '<td><strong>保证流量</strong></td>' +
                '</tr>';
            if (data.data.length == 0) {
                tableHtml += '<tr><td colspan="8">无数据</td></tr>';
            } else {
                $.each(default1(weihe), function (key, obj) {
                    var color = "#333";
                    if (!isNull(obj.value)) {
                        if ((obj.q - 0) > (obj.value - 0)) {
                            color = "#ffd50c"
                        }
                    }
                    if (!isNull(obj.wrq)) {
                        if ((obj.q - 0) > (obj.wrq - 0)) {
                            color = "orange"
                        }
                    }
                    if (!isNull(obj.grq)) {
                        if ((obj.q - 0) > (obj.grq - 0)) {
                            color = "red"
                        }
                    }
                    if (!isNull(obj.grq) && !isNull(obj.wrq)&& !isNull(obj.value)) {
                        if ((obj.q - 0) > (obj.grq - 0) && (obj.q - 0) > (obj.wrq - 0)&& (obj.q - 0) > (obj.value - 0)) {
                            color = "orange"
                        }
                    }
                    if (key == 0) {
                        tableHtml += '<tr style="color:' + color + '">' +
                            '<td rowspan="' + weihe.length + '">' + showDataNull(obj.rvnm, "") + '</td>' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            // '<td>' + obj.tm.replace(".0", "") + '</td>' +
                            '<td>' + waterLevelData(obj.z == null ? "" : obj.z) + '</td>' +
                            '<td>' + formatFlow(obj.q, "") + '</td>' +
                            '<td>' + showFlow(obj.wptn) + '</td>' +
                            '<td>' + showDataNull(obj.value, "") + '</td>' +
                            '<td>' + flowDataw(obj.wrq, "") + '</td>' +
                            '<td>' + flowDataw(obj.grq, "") + '</td>' +
                            '</tr>';
                    } else {
                        tableHtml += '<tr style="color:' + color + '">' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            // '<td>' + obj.tm.replace(".0", "") + '</td>' +
                            '<td>' + waterLevelData(obj.z == null ? "" : obj.z) + '</td>' +
                            '<td>' + formatFlow(obj.q, "") + '</td>' +
                            '<td>' + showFlow(obj.wptn) + '</td>' +
                            '<td>' + showDataNull(obj.value, "") + '</td>' +
                            '<td>' + flowDataw(obj.wrq, "") + '</td>' +
                            '<td>' + flowDataw(obj.grq, "") + '</td>' +
                            '</tr>';
                    }

                });
                $.each(default1(jinhe), function (key, obj) {
                    var color = "#333";
                    // if(obj.q>obj.wptn){
                    //     color="#ffd50c"
                    // }else
                    if (!isNull(obj.value)) {
                        if ((obj.q - 0) > (obj.value - 0)) {
                            color = "#ffd50c"
                        }
                    }
                    if (!isNull(obj.wrq)) {
                        if ((obj.q - 0) > (obj.wrq - 0)) {
                            color = "orange"
                        }
                    }
                    if (!isNull(obj.grq)) {
                        if ((obj.q - 0) > (obj.grq - 0)) {
                            color = "red"
                        }
                    }
                    if (!isNull(obj.grq) && !isNull(obj.wrq)&& !isNull(obj.value)) {
                        if ((obj.q - 0) > (obj.grq - 0) && (obj.q - 0) > (obj.wrq - 0)&& (obj.q - 0) > (obj.value - 0)) {
                            color = "orange"
                        }
                    }
                    if (key == 0) {
                        tableHtml += '<tr style="color:' + color + '">' +
                            '<td rowspan="' + jinhe.length + '">' + showDataNull(obj.rvnm, "") + '</td>' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            // '<td>' + obj.tm.replace(".0", "") + '</td>' +
                            '<td>' + waterLevelData(obj.z == null ? "" : obj.z) + '</td>' +
                            '<td>' + formatFlow(obj.q, "") + '</td>' +
                            '<td>' + showFlow(obj.wptn) + '</td>' +
                            '<td>' + showDataNull(obj.value, "") + '</td>' +
                            '<td>' + flowDataw(obj.wrq, "") + '</td>' +
                            '<td>' + flowDataw(obj.grq, "") + '</td>' +
                            '</tr>';
                    } else {
                        tableHtml += '<tr style="color:' + color + '">' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            // '<td>' + obj.tm.replace(".0", "") + '</td>' +
                            '<td>' + waterLevelData(obj.z == null ? "" : obj.z) + '</td>' +
                            '<td>' + formatFlow(obj.q, "") + '</td>' +
                            '<td>' + showFlow(obj.wptn) + '</td>' +
                            '<td>' + showDataNull(obj.value, "") + '</td>' +
                            '<td>' + flowDataw(obj.wrq, "") + '</td>' +
                            '<td>' + flowDataw(obj.grq, "") + '</td>' +
                            '</tr>';
                    }

                });

                $.each(otherriver, function (key, obj) {
                    $.each(obj.data, function (i, v) {
                        var color = "#333";
                        // if(obj.q>obj.wptn){
                        //     color="#ffd50c"
                        // }else
                        if (!isNull(v.value)) {
                            if ((v.q - 0) > (v.value - 0)) {
                                color = "#ffd50c"
                            }
                        }
                        if (!isNull(v.wrq)) {
                            if ((v.q - 0) > (v.wrq - 0)) {
                                color = "orange"
                            }
                        }
                        if (!isNull(v.grq)) {
                            if ((v.q - 0) > (v.grq - 0)) {
                                color = "red"
                            }
                        }
                        if (!isNull(obj.grq) && !isNull(obj.wrq)&& !isNull(obj.value)) {
                            if ((obj.q - 0) > (obj.grq - 0) && (obj.q - 0) > (obj.wrq - 0)&& (obj.q - 0) > (obj.value - 0)) {
                                color = "orange"
                            }
                        }
                        if (i == 0) {
                            tableHtml += '<tr style="color:' + color + '">' +
                                '<td rowspan="' + obj.data.length + '">' + showDataNull(v.rvnm, "") + '</td>' +
                                '<td>' + showDataNull(v.stnm, "") + '</td>' +
                                // '<td>' + obj.tm.replace(".0", "") + '</td>' +
                                '<td>' + showDataNull(v.z, "") + '</td>' +
                                '<td>' + formatFlow(v.q, "") + '</td>' +
                                '<td>' + showFlow(v.wptn) + '</td>' +
                                '<td>' + showDataNull(v.value, "") + '</td>' +
                                '<td>' + flowDataw(v.wrq, "") + '</td>' +
                                '<td>' + flowDataw(v.grq, "") + '</td>' +
                                '</tr>';
                        } else {
                            tableHtml += '<tr style="color:' + color + '">' +
                                '<td>' + showDataNull(v.stnm, "") + '</td>' +
                                // '<td>' + obj.tm.replace(".0", "") + '</td>' +
                                '<td>' + showDataNull(v.z, "") + '</td>' +
                                '<td>' + formatFlow(v.q, "") + '</td>' +
                                '<td>' + showFlow(v.wptn) + '</td>' +
                                '<td>' + showDataNull(v.value, "") + '</td>' +
                                '<td>' + flowDataw(v.wrq, "") + '</td>' +
                                '<td>' + flowDataw(v.grq, "") + '</td>' +
                                '</tr>';
                        }
                    })
                });
            }
            tableHtml += '</table>';
            $('#resultTableDiv').html(tableHtml);
        });
    } else {
        layer.msg("输入时间格式有误")
    }
};
$('#load-rainwrapp').addClass('hidden');

//导出
var aclick = function (aa) {
    if ($('#riverMes_table tr:last').find('td').text() !== "无数据") {
        var jst = $("#resultDate").text();
        var total = $("#resultUnit").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "河道水情简报.xls");
        exportExcel(aa, 'riverMes_table', '河道水情简报', jst, total, time, company, 0)
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}

$(function () {
    init();
    $(".briefin-date").datetimepicker({
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

    initCode0();
    initQ();
    //时间控件更新
    var timeupdatevalue = new Date();
    // var timeupdatevalue2 = new Date();
    timeupdatevalue.setHours(8, 0);
    if (timeupdatevalue.getHours() < 8) {
        timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
        timeupdatevalue.setHours(8, 0);
    } else {
        timeupdatevalue.setHours(8, 0);
    }
    //默认显示当前最新时间
    $("#river-start-time").datetimepicker("update", timeupdatevalue);
    // $("#river-end-time").datetimepicker("update", timeupdatevalue2);
    //加载河道水情数据
    //生成简报（河道水情数据)
    $("#runRiverBtn").on("click", function () {
        getRiverData();
    });
    $("#levelSelect").select2();
    $("#levelSelect").select2().val(['1', '2', '3']).trigger('change');
    getRiverData();
});
