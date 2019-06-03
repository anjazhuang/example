var user = JSON.parse($.cookie("user"));
var areaName = user.AreaName;

function sortNumber(a, b) {
    return a.drp - b.drp;
}

var stationstring = [];

//初始化站点方法
function initCode0() {
    stationstring = [];
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

var newdatalist = [];
var newsum, rainAvg2;
//生成表格
var generatingTable = function (set, data) {
    newdatalist = [];
    newsum = 0;
    //筛选去除不符合所选报讯等级返回的站码序列返回的数组
    var tablehtml = '<table class="table-bordered dataTable" align="center" id=' + set.table + '>';
    var arrCell = set.cell;
    var tdnum = (arrCell + 1) * 2;
    var tdwidth = Math.round(100 / tdnum);
    var sortData = (data.sort(sortNumber));
    sortData = $.grep(sortData, function (d) {
        return (d.drp != "" && d.drp != null);
    });
    var maxValue = null;
    var minValue = null;
    if (sortData.length > 0) {
        maxValue = sortData[sortData.length - 1].drp;
        minValue = sortData[0].drp;
    }
    console.log(maxValue);
    console.log(minValue);
    var newdata = $.grep(data, function (data) {
        return data[set.name] !== "杨陵示范区" && data[set.name] !== "其它区域" && data[set.value] !== ""
    });
    console.log(newdata);
    for (var i = 0; i < newdata.length; i++) {
        newdatalist.push(parseFloat(newdata[i].drp))
    }
    console.log(Math.max.apply(null, newdatalist));
    for (var i = 0; i < newdatalist.length; i++) {
        newsum += parseFloat(newdatalist[i])
    }
    rainAvg2 = newsum / newdatalist.length;
    $.each(country, function (key, value) {
        var arr = $.grep(data, function (data) {
            return data[set.name] == value
        });
        var arrTDNum = Math.ceil(arr.length / arrCell);
        var arrConcrete, arrStation;
        tablehtml += '<tr style="display: none"><td></td><td></td><td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td> <td></td></tr>';
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
                // if (countValue == maxValue && minValue != maxValue && maxValue != null) {
                //     tablehtml += ' <td width="' + tdwidth + '%" style="color:red;font-weight: bold;">' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%"><span style="color:red;font-weight: bold;">' + countValue + '</span></td>';
                // } else if (countValue == minValue && minValue != maxValue && minValue != null) {
                //     tablehtml += ' <td width="' + tdwidth + '%" style="color:blue;font-weight: bold;">' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%"><span style="color:blue;font-weight: bold;">' + countValue + '</span></td>';
                // } else {
                //     tablehtml += ' <td width="' + tdwidth + '%">' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%">' + countValue + '</td>';
                // }
                if (countValue == maxValue && minValue != maxValue && maxValue != null) {
                    tablehtml += ' <td width="' + tdwidth + '%" >' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%"><span >' + countValue + '</span></td>';
                } else if (countValue == minValue && minValue != maxValue && minValue != null) {
                    tablehtml += ' <td width="' + tdwidth + '%" >' + arrStation[set.stnm] + '</td>' + ' <td width="' + tdwidth + '%"><span>' + countValue + '</span></td>';
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
    // tablehtml += '<tr><td><strong>最大降雨量（mm）</strong></td><td colspan="2"><span id="rainMax"></span></td><td colspan="2"><strong>最小降雨量（mm）</strong></td><td colspan="2"><span id="rainMin"></span></td><td colspan="2"><strong>平均降雨量（mm）</strong></td><td colspan="2"><span id="rainAvg"></span></td></tr>';
    tablehtml += '<tr><td><strong>最大</strong></td><td colspan="2"><span id="rainMax"></span></td><td colspan="2"><strong>最小</strong></td><td colspan="2"><span id="rainMin"></span></td><td colspan="2"><strong>平均值</strong></td><td colspan="2"><span id="rainAvg"></span></td></tr>';
    tablehtml += '<tr><td colspan="8" style="text-align: left">累计降雨量小于10mm</td><td colspan="3"><span id="rainc10"></span></td></tr>';
    tablehtml += '<tr><td colspan="8" style="text-align: left">累计降雨量在10 - 25mm之间</td><td colspan="3"><span id="rainc25"></span></td></tr>';
    tablehtml += '<tr><td colspan="8" style="text-align: left">累计降雨量在25 - 50mm之间的测站数量</td><td colspan="3"><span id="rainc50"></span></td></tr>';
    tablehtml += '<tr><td colspan="8" style="text-align: left">累计降雨量在50 - 100mm之间的测站数量</td><td colspan="3"><span id="rainc100"></span></td></tr>';
    tablehtml += '<tr><td colspan="8" style="text-align: left">累计降雨量在100 - 250mm之间的测站数量</td><td colspan="3"><span id="rainc250"></span></td></tr>';
    tablehtml += '<tr><td colspan="8" style="text-align: left">累计降雨量大于250mm的测站数量</td><td colspan="3"><span id="rainb250"></span></td></tr>';
    tablehtml += '<tr><td colspan="8" style="text-align: left">累计未降雨测站数量</td><td colspan="3"><span id="rainb0"></span></td></tr>';
    // tablehtml += '<tr><td colspan="8"><strong>未上报数据的测站数量</strong></td><td colspan="3"><span id="nulldata"></span></td></tr>';
    // tablehtml += '<tr><td colspan="11"><div id="rainMoudle"></div></td></tr>';
    tablehtml += '</table>';
    return tablehtml;
};

//导出
var aclick = function (aa) {
    var jst = $("#resultDate").text();
    var total = $("#resultUnit").text();
    var time = $(".maketabtime").text();
    var company = $(".maketabcom").text();
    $(aa).attr("download", "雨情简报.xls");
    exportExcel(aa, 'rainMes_table', '雨情简报', jst, total, time, company, 0)
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
                        var min = obj.min == "-1.0" ? "0.0" : obj.min;
                        var avg = typeof(obj.avg) == "undefined" ? "" : obj.avg;
                        res = '<div class="briefinmes"><strong>' + v.Value + '</strong></div>';
                        res = res.replace(/\n|\r\n/g, "<br/>");
                        res = res.replace("{count}", obj.count);
                        res = res.replace("{max}", obj.max);
                        res = res.replace("{min}", min);
                        res = res.replace("{avg}", avg);
                        $('#' + id).html(res);
                        break;
                }
            });
        }
    });
};
//获取雨情数据
var getRainData = function () {
    if (timeValidcheck($("#start-time input").val().split(" ")[0]) && timeValidcheck($("#end-time input").val().split(" ")[0])) {
        var sttm = $("#start-time input").val();
        var edtm = $("#end-time input").val();
        $('#load-rainwrapp').removeClass('hidden');
        $('#resultconcent').addClass('hidden');
        $("#printRainBtn").attr("disabled", true);
        $("#printRainJbBtn").attr("disabled", true);
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainReportControl/getRainCountReport2',
            Parameter: {
                "rainCount.adcd": user.AreaCode,
                "rainCount.startTm": sttm + ':00',
                "rainCount.endTm": edtm + ':00'
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                var levelString = [], levelCode = [], matchSta = [];
                levelString = $("#levelSelect").val();
                if (levelString.length > 0) {
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
                    //筛选去除不符合所选报讯等级返回的站码序列返回的数组
                    for (var i = 0; i < data.data.nullData.length; i++) {
                        if (levelCode.indexOf(data.data.nullData[i].stcd) === -1) {
                            data.data.nullData.splice(i, 1);
                            i -= 1
                        }
                    }
                    for (var i = 0; i < data.data.bcm250.length; i++) {
                        if (levelCode.indexOf(data.data.bcm250[i].stcd) === -1) {
                            data.data.bcm250.splice(i, 1);
                            i -= 1
                        }
                    }
                    for (var i = 0; i < data.data.cm250.length; i++) {
                        if (levelCode.indexOf(data.data.cm250[i].stcd) === -1) {
                            data.data.cm250.splice(i, 1);
                            i -= 1
                        }
                    }
                    for (var i = 0; i < data.data.cm100.length; i++) {
                        if (levelCode.indexOf(data.data.cm100[i].stcd) === -1) {
                            data.data.cm100.splice(i, 1);
                            i -= 1
                        }
                    }
                    for (var i = 0; i < data.data.cm50.length; i++) {
                        if (levelCode.indexOf(data.data.cm50[i].stcd) === -1) {
                            data.data.cm50.splice(i, 1);
                            i -= 1
                        }
                    }
                    for (var i = 0; i < data.data.cm25.length; i++) {
                        if (levelCode.indexOf(data.data.cm25[i].stcd) === -1) {
                            data.data.cm25.splice(i, 1);
                            i -= 1
                        }
                    }
                    for (var i = 0; i < data.data.cm10.length; i++) {
                        if (levelCode.indexOf(data.data.cm10[i].stcd) === -1) {
                            data.data.cm10.splice(i, 1);
                            i -= 1
                        }
                    }
                }
                var allArray = [],
                    rainAvg,
                    nullData = data.data.nullData.length,
                    totalbcm250 = data.data.bcm250.length,
                    totalcm250 = data.data.cm250.length,
                    totalcm100 = data.data.cm100.length,
                    totalcm50 = data.data.cm50.length,
                    totalcm25 = data.data.cm25.length,
                    totalcm10 = data.data.cm10.length,
                    totalcm0 = 0;
                for (var i = 0; i < data.data.cm10.length; i++) {
                    if (data.data.cm10[i].drp == "0.0") {
                        totalcm0 = totalcm0 + 1
                    }
                }
                if (!isNull(data.data.avg)) {
                    rainAvg = (parseFloat(data.data.avg)).toFixed(1);
                }
                $.each(data.data.bcm250, function (key, obj) {
                    allArray.push(obj);
                });
                $.each(data.data.cm250, function (key, obj) {
                    allArray.push(obj);
                });
                $.each(data.data.cm100, function (key, obj) {
                    allArray.push(obj);
                });
                $.each(data.data.cm50, function (key, obj) {
                    allArray.push(obj);
                });
                $.each(data.data.cm25, function (key, obj) {
                    allArray.push(obj);
                });
                $.each(data.data.cm10, function (key, obj) {
                    allArray.push(obj);
                });
                $.each(data.data.cm50, function (key, obj) {
                    allArray.push(obj);
                });
                $.each(data.data.nullData, function (key, obj) {
                    allArray.push(obj);
                });
                var rainSortArray = allArray.sort(compare("addvnm"));
                console.log(rainSortArray);
                var arrAddvnm = [];
                $.each(rainSortArray, function (key, obj) {
                    if (arrAddvnm.indexOf(obj.addvnm) == -1) {
                        arrAddvnm.push(obj.addvnm);
                    }
                });

                var config = {
                    "table": "rainMes_table",
                    "addvnm": arrAddvnm,
                    "cell": 5,
                    "name": "addvnm",
                    "value": "drp",
                    "stnm": "stnm"
                };
                var tablehtml = generatingTable(config, rainSortArray);
                $('#resultTableDiv').html(tablehtml);
                $('#resultTitle').html(areaName + '雨情简报  （' + sttm + ' 至 ' + edtm + ' ）');
                $('#load-rainwrapp').addClass('hidden');
                $('#resultconcent').removeClass('hidden');
                $("#printRainBtn").attr("disabled", false);
                $("#printRainJbBtn").attr("disabled", false);
                var modleData = {
                    "count": data.data.sum,
                    "max": data.data.max,
                    "min": data.data.min,
                    "avg": rainAvg
                };
                // getMoudle("BRIEFING_RAIN", modleData, "rainMoudle");

                var resultDate = "<strong>检索时间: </strong>" + sttm + " 至 " + edtm;
                var resultUnit = "降雨量:毫米；总记录数：" + allArray.length;
                $('#resultDate').html(resultDate);
                $('#resultUnit').html(resultUnit);
                var resultTableBottom = '<div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $('#resulttablebottom').html(resultTableBottom);
                $('#rainTotal').html(data.data.sum);
                // $('#rainMax').html(data.data.max == "0.0" ? "0" : data.data.max);
                // if (data.data.min == "-1.0") {
                //     $('#rainMin').html("0");
                // } else {
                //     $('#rainMin').html(data.data.min);
                // }

                // $('#rainAvg').html(rainAvg);
                var max, min, avg = "";
                if (newdatalist.length > 0) {
                    max = Math.max.apply(null, newdatalist) === "0.0" ? "0" : Math.max.apply(null, newdatalist);
                    min = Math.min.apply(null, newdatalist) === "0.0" ? "0" : Math.min.apply(null, newdatalist);
                    avg = rainAvg2.toFixed(1) == "0.0" ? "0" : (rainAvg2).toFixed(1);
                } else {
                    max = "";
                    min = "";
                    avg = ""
                }
                $('#rainMax').html(max);
                $('#rainMin').html(min);
                $('#rainAvg').html(avg);
                $('#rainb250').html(totalbcm250 + ' 站 ');
                $('#rainc250').html(totalcm250 + ' 站 ');
                $('#rainc100').html(totalcm100 + ' 站 ');
                $('#rainc50').html(totalcm50 + ' 站 ');
                $('#rainc25').html(totalcm25 + ' 站 ');
                $('#rainc10').html(totalcm10 + ' 站 ');
                $('#rainb0').html(totalcm0 + ' 站 ');
                $('#nulldata').html(nullData + ' 站 ');
            } else {
                layer.msg(data.message);
            }
        })
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
    //var win = window.open('printbriefin.html');
};

$(function () {
    init();
    initCode0();
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
    //默认显示当前最新时间
    $("#start-time").datetimepicker("update", starttimevalue);
    $("#end-time").datetimepicker("update", endtimevalue);
    getRainData();
    //加载雨情数据
    $("#levelSelect").select2();
    $("#levelSelect").select2().val(['1', '2', '3']).trigger('change');

    //生成简报（雨情)
    $("#runRainBtn").on("click", function () {
        getRainData();
    });
    //打印(雨情)
    $("#printRainBtn").on("click", function () {
        var title = "resultTitle",
            mesid = "resultTableDiv",
            mouldid = "rainMoudle",
            url = "printtable.html";
        printTable(title, mesid, mouldid, url);
    });
    $("#printRainJbBtn").on("click", function () {
        var title = "resultTitle",
            mesid = "resultTableDiv",
            mouldid = "rainMoudle",
            url = "printbriefin.html";
        printTable(title, mesid, mouldid, url);
    });

});
