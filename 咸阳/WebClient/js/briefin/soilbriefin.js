var user = JSON.parse($.cookie("user"));
var areaName = user.AreaName;

function sortNumber(a, b) {
    return a.RA - b.RA;
}

var stationstring = [];

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
        async:false,
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        stationstring = data.data;
    })
}

//生成表格
var generatingTable = function (set, data) {
    var tablehtml = '<table class="table-bordered dataTable" id=' + set.table + '>';
    tablehtml += '<tr style="display: none"><td></td><td></td><td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td></tr>';
    var arrCell = set.cell;
    var tdnum = (arrCell + 1) * 2;
    var tdwidth = Math.round(100 / tdnum);
    var sortData = (data.sort(sortNumber));
    sortData = $.grep(sortData, function (d) {
        return (d.RA != "" && d.RA != null);
    });
    var maxValue = null;
    var minValue = null;
    if (sortData.length > 0) {
        maxValue = sortData[sortData.length - 1].RA;
        minValue = sortData[0].RA;
    }
    console.log(maxValue);
    console.log(minValue);
    // tablehtml = tablehtml + '<tr><th colspan="'+ tdnum +'"><strong>'+ str +'</strong></th></tr>';
    $.each(set.addvnm, function (key, value) {
        var arr = $.grep(data, function (data) {
            return data[set.name] == value;
        });
        var arrTDNum = Math.ceil(arr.length / arrCell);
        var arrConcrete, arrStation;
        for (var trnum = 0; trnum < arrTDNum; trnum++) {
            arrConcrete = arr[trnum];
            tablehtml += '<tr>';
            if (trnum == 0) {
                tablehtml += '<td width="' + tdwidth * 2 + '%" rowspan=' + arrTDNum + '><strong>' + arrConcrete[set.name] + '</strong></td>';
            }
            for (var tdnum = trnum * arrCell; tdnum < trnum * arrCell + arrCell; tdnum++) {
                var countValue;
                arrStation = arr[tdnum];
                arrStation[set.value] === null ? countValue = '' : countValue = arrStation[set.value];
                if (countValue == maxValue && minValue != maxValue && maxValue != null) {
                    tablehtml += ' <td width="' + tdwidth + '%" style="color:red;font-weight: bold;">' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%"><span style="color:red;font-weight: bold;">' + countValue + '</span></td>';
                } else if (countValue == minValue && minValue != maxValue && minValue != null) {
                    tablehtml += ' <td width="' + tdwidth + '%" style="color:blue;font-weight: bold;">' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%"><span style="color:blue;font-weight: bold;">' + countValue + '</span></td>';
                } else {
                    tablehtml += ' <td width="' + tdwidth + '%">' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%">' + countValue + '</td>';
                }
                if (tdnum == (arr.length - 1)) {
                    if (((tdnum + 1) % arrCell) > 0) {
                        var tdcolspan = (arrCell - ((tdnum + 1) % arrCell)) * 2;
                        tablehtml += '<td colspan="' + tdcolspan + '" width="' + tdcolspan * tdwidth + '%"></td>';
                    }
                    break;
                }
            }
            tablehtml += '</tr>'
        }
    });
    tablehtml += '<tr><td><strong>最大相对湿度均值（%）</strong></td><td colspan="2"><span id="soilMax"></span></td><td colspan="2"><strong>最小相对湿度均值（%）</strong></td><td colspan="2"><span id="soilMin"></span></td><td colspan="2"><strong>平均相对湿度均值（%）</strong></td><td colspan="2"><span id="soilAvg"></span></td></tr>';
    tablehtml += '<tr><td colspan="8"><strong>相对湿度均值（%）大于60的测站数量</strong></td><td colspan="3"><span id="soilLevel1"></span></td></tr>';
    tablehtml += '<tr><td colspan="8"><strong>相对湿度均值（%）在50 - 60之间的测站数量</strong></td><td colspan="3"><span id="soilLevel2"></span></td></tr>';
    tablehtml += '<tr><td colspan="8"><strong>相对湿度均值（%）在40 - 50之间的测站数量</strong></td><td colspan="3"><span id="soilLevel3"></span></td></tr>';
    tablehtml += '<tr><td colspan="8"><strong>相对湿度均值（%）在30 - 40之间的测站数量</strong></td><td colspan="3"><span id="soilLevel4"></span></td></tr>';
    tablehtml += '<tr><td colspan="8"><strong>相对湿度均值（%）小于30的测站数量</strong></td><td colspan="3"><span id="soilLevel5"></span></td></tr>';
    tablehtml += '<tr><td colspan="11"><div id="soilMoudle"></div></td></tr>';
    tablehtml += '</table>';
    return tablehtml;
};

//导出
var aclick = function (aa) {
    if ($('#soilMes_table tr:last').find('td').text() !== "无数据") {
        var jst = $("#resultDate").text();
        var total = $("#resultUnit").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "墒情简报.xls");
        exportExcel(aa, 'soilMes_table', '墒情简报', jst, total, time, company, 2)
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}

//获取简报模板数据
var getMoudle = function (type, obj, id) {
    var res;
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
                    case type:
                        res = '<div class="briefinmes"><strong>' + v.Value + '</strong></div>';
                        res = res.replace(/\n|\r\n/g, "<br/>");
                        res = res.replace("{count}", obj.count);
                        res = res.replace("{max}", obj.max);
                        res = res.replace("{min}", obj.min);
                        res = res.replace("{avg}", obj.avg);

                        $('#' + id).html(res);
                        break;
                }
            });
        }
    });
};

var getSoilData = function () {
    if (timeValidcheck($("#soil-start-time input").val().split(" ")[0])) {
        var sttm = $("#soil-start-time input").val();
        var edtm = $("#soil-end-time input").val();
        $('#load-soilwrapp').removeClass('hidden');
        $('#resultconcent').addClass('hidden');
        // $("#printSoilBtn").attr("disabled", true);
        // $("#printSoilJbBtn").attr("disabled", true);
        var obj = {
            // Type: 'post',
            // Uri: '/data/getsoilreport',
            Type: 'get',
            Uri: '/data/getmapdata2',
            Parameter: {
                // "AreaCode": user.AreaCode,
                // "StartTime": sttm + ' :00',
                // "EndTime": edtm + ' :59'
                areaCode: user.AreaCode,
                startTime: sttm + ':00',
                endTime: sttm + ':59'
            }
        };
        $.ajax({
            url: serverConfig.soilApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                console.log(data.data);
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
                        if (levelCode.indexOf(data.data[i].Station.Code) == -1) {
                            data.data.splice(i, 1);
                            i -= 1
                        }
                    }
                }
                var soildata = $.grep(data.data, function (d) {
                    return d.Datas.length !== 0;
                })
                // var allArray = [],
                //     dataMax,
                //     dataMin,
                //     dataAvg,
                //     nullData = data.data.NullData.length,
                //     level1Data = data.data.Level1Data.length,
                //     level2Data = data.data.Level2Data.length,
                //     level3Data = data.data.Level3Data.length,
                //     level4Data = data.data.Level4Data.length,
                //     level5Data = data.data.Level5Data.length;
                // data.data.Max === null ? dataMax = 0 : dataMax = data.data.Max;
                // data.data.Min === null ? dataMin = 0 : dataMin = data.data.Min;
                // data.data.Avg === null ? dataAvg = 0 : dataAvg = data.data.Avg;
                // $.each(data.data.Level1Data, function (key, obj) {
                //     allArray.push(obj);
                // });
                // $.each(data.data.Level2Data, function (key, obj) {
                //     allArray.push(obj);
                // });
                // $.each(data.data.Level3Data, function (key, obj) {
                //     allArray.push(obj);
                // });
                // $.each(data.data.Level4Data, function (key, obj) {
                //     allArray.push(obj);
                // });
                // $.each(data.data.Level5Data, function (key, obj) {
                //     allArray.push(obj);
                // });
                // $.each(data.data.NullData, function (key, obj) {
                //     allArray.push(obj);
                // });
                //
                // var soilSortArray = allArray.sort(compare("AreaName"));
                //
                // var arrAreaName = [];
                // $.each(soilSortArray, function (key, obj) {
                //     if (arrAreaName.indexOf(obj.AreaName) == -1) {
                //         arrAreaName.push(obj.AreaName);
                //     }
                // });
                // var config = {
                //     "table": "soilMes_table",
                //     "addvnm": arrAreaName,
                //     "cell": 5,
                //     "name": "AreaName",
                //     "value": "RA",
                //     "stnm": "Name"
                // };
                // var tablehtml = generatingTable(config, soilSortArray, "相对湿度均值（%）");
                //
                // $('#resultTableDiv').html(tablehtml);

                $('#soilTitle').html(areaName + '墒情简报  （' + sttm + ' 至 ' + edtm + ' ）');
                $('#load-soilwrapp').addClass('hidden');
                $('#resultconcent').removeClass('hidden');
                // $("#printSoilBtn").attr("disabled", false);
                // $("#printSoilJbBtn").attr("disabled", false);
                // var modleData = {
                //     "max": dataMax,
                //     "min": dataMin,
                //     "avg": dataAvg
                // };
                // getMoudle("BRIEFING_SOIL", modleData, "soilMoudle");
                var resultDate = "<strong>检索时间: </strong>" + sttm;
                var resultUnit = "相对湿度:% 总记录数：" + soildata.length;
                $('#resultDate').html(resultDate);
                $('#resultUnit').html(resultUnit);
                var resultTableBottom = '<div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $('#resulttablebottom').html(resultTableBottom);

                // $('#soilMax').html(dataMax);
                // $('#soilMin').html(dataMin);
                // $('#soilAvg').html(dataAvg);
                // $('#soilLevel1').html(level1Data + '站');
                // $('#soilLevel2').html(level2Data + '站');
                // $('#soilLevel3').html(level3Data + '站');
                // $('#soilLevel4').html(level4Data + '站');
                // $('#soilLevel5').html(level5Data + '站');
                // $('#soilLevel6').html(nullData + '站');
                var tableHtml = '<table class="table-bordered" align="center" id="soilMes_table">';
                tableHtml += '<tr>' +
                    '<th rowspan="2" class="text-center">行政区域</th>' +
                    '<th rowspan="2" class="text-center">测站编码</th>' +
                    '<th rowspan="2" class="text-center">测站名称</th>' +
                    '<th rowspan="2" class="text-center">数据时间</th>' +
                    '<th colspan="4" rowspan="1" class="text-center">重量含水量</th>' +
                    '</tr>' +
                    '<tr>' +
                    '<th rowspan="1" class="text-center">10cm</th>' +
                    '<th rowspan="1" class="text-center">20cm</th>' +
                    '<th rowspan="1" class="text-center">40cm</th>' +
                    '<th rowspan="1" class="text-center">均值</th>' +
                    '</tr>';
                if (soildata.length == 0) {
                    tableHtml += '<tr><td colspan="8">无数据</td></tr>';
                } else {
                    var ttall = [];
                    for (var i = 0; i < country.length; i++) {
                        var tt = $.grep(default0(soildata), function (d) {
                            return d.Station.AreaName == country[i]
                        });
                        for (var a = 0; a < tt.length; a++) {
                            ttall.push(tt[a]);
                        }
                    }
                    $.each(ttall, function (key, obj) {
                        tableHtml += '<tr>' +
                            '<td>' + obj.Station.AreaName + '</td>' +
                            '<td>' + obj.Station.Code + '</td>' +
                            '<td>' + obj.Station.Name + '</td>';
                        if (obj.Datas.length > 0) {
                            tableHtml += '<td>' + obj.Datas[0].Time.replace("T", " ") + '</td>' +
                                '<td>' + (obj.Datas[0].Value == null ? "" : obj.Datas[0].Value) + '</td>' +
                                '<td>' + (obj.Datas[4].Value == null ? "" : obj.Datas[4].Value) + '</td>' +
                                '<td>' + (obj.Datas[5].Value == null ? "" : obj.Datas[5].Value) + '</td>' +
                                '<td>' + (obj.Datas[6].Value == null ? "" : obj.Datas[6].Value) + '</td>';
                        } else {
                            tableHtml += '<td colspan="5"> </td>';
                        }
                        tableHtml += "</tr>"
                    });
                }
                tableHtml += '</table>';
                $('#resultTableDiv').html(tableHtml);
            } else {
                layer.msg(data.message);
            }
        });
    } else {
        layer.msg("输入时间格式有误")
    }
};

$('#load-rainwrapp').addClass('hidden');

//打印表格
var printTable = function (title, mesid, mouldid, url) {
    var mestable = "<div class='title'>" + $("#" + title).html() + "</div>" + $("#" + mesid).html(),
        mouldid = "#" + mouldid + " " + ".briefinmes";
    briefinmes = "<div class='title'><>" + $("#" + title).html() + "</div>" + $(mouldid).html();
    localStorage.setItem("print", mestable);
    localStorage.setItem("printbriefin", briefinmes);
    var win = window.open(url);
};

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
    $("#soil-start-time").datetimepicker("update", timeupdatevalue);
    // $("#soil-end-time").datetimepicker("update", endtimevalue);
    //加载墒情数据
    getSoilData();
    initCode0();
    //生成简报（墒情)
    $("#runBtn").on("click", function () {
        getSoilData();
    });
    $("#levelSelect").select2().val(['1', '2', '3']).trigger('change');
});
