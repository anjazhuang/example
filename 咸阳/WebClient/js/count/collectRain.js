var params = {
    type: "咸阳市",
    time: "",
    timeArea: ""
};
var collect_table;
var stationstring = [];

//初始化站点方法
function initCode0() {
    var user = JSON.parse($.cookie("user"));
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

function initRainData(level, code, sttm, edtm, query) {
    if (timeValidcheck(sttm.split(" ")[0]) && timeValidcheck(edtm.split(" ")[0])) {
        $(".rightTab .load-wrapp").removeClass("hidden");

        var obj = {
            Type: 'get',
            Uri: '/aControl/RainCountControl/countRainInfoByAdcd',
            Parameter: {
                "rainCount.frgrd": level,
                "rainCount.adcd": code,
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
                var allArray = [];
                levelString = powers;
                if (levelString.length>0) {
                    // for (var i = 0; i < levelString.length; i++) {
                    //     var sst = $.grep(stationstring, function (d) {
                    //         return d.Code === levelString[i]
                    //     });
                    //     $.merge(matchSta, sst);
                    // }
                    // for (var vv = 0; vv < matchSta.length; vv++) {
                    //     levelCode.push(matchSta[vv].Code);
                    // }
                    // console.log(levelCode);
                    //筛选去除不符合所选报讯等级返回的站码序列返回的数组
                    $.each(data.data, function (i, v) {
                        for (var i = 0; i < v.stationList.length; i++) {
                            if (levelString.indexOf(v.stationList[i].stcd) == -1) {
                                v.stationList.splice(i, 1);
                                i -= 1
                            }
                        }
                    });
                }

                // var rainSortArray = allArray.sort(compare("addvnm"));
                //
                // var arrAddvnm = [];
                // $.each(rainSortArray, function (key, obj) {
                //     if (arrAddvnm.indexOf(obj.addvnm) == -1) {
                //         arrAddvnm.push(obj.addvnm);
                //     }
                // });
                $(".btime").text("检索时间：" + sttm.split(" ")[0] + " 至 " + edtm.split(" ")[0]);

                $(".maketabtime").text("制表时间:" + edtm);
                var tablehtml = '<div class="tablediv"><table id="collectrain" class="stripe row-border order-column nowrap table-bordered" cellspacing="0" width="100%" id="rain_table" cellpadding="10">';
                var totalnum = 0;
                var ttall = [];
                for (var i = 0; i < country.length; i++) {
                    var tt = $.grep(data.data, function (d) {
                        return d.addvnm == country[i]
                    });
                    ttall.push(tt[0]);
                }
                // console.log(ttall);
                var arrDrp = [];
                $.each(ttall, function (key, obj) {
                    if (obj) {
                        arrDrp = obj.stationList;
                        totalnum += obj.stationList.length;
                        var arrCell = 6;
                        var arrDrpTDNum = Math.ceil(arrDrp.length / arrCell);
                        // console.log(arrDrp);
                        for (var trnum = 0; trnum < arrDrpTDNum; trnum++) {
                            tablehtml = tablehtml + '<tr>'
                            if (trnum == 0) {
                                tablehtml = tablehtml + ' <td width="16%" rowspan=' + arrDrpTDNum + '><strong>' + arrDrp[trnum].addvnm + '</strong></td>'
                            }
                            for (var tdnum = trnum * arrCell; tdnum < trnum * arrCell + arrCell; tdnum++) {
                                var drpValue;
                                rainData(arrDrp[tdnum].drp === null ? drpValue = '' : drpValue = arrDrp[tdnum].drp);
                                tablehtml = tablehtml + ' <td width="7%">' + arrDrp[tdnum].stnm + '</td>' + ' <td width="7%">' + drpValue + '</td>';
                                if (tdnum == (arrDrp.length - 1)) {
                                    if ((tdnum + 1) % arrCell == 1) {
                                        tablehtml = tablehtml + '<td colspan="10" width="70%"></td>';
                                    } else if ((tdnum + 1) % arrCell == 2) {
                                        tablehtml = tablehtml + '<td colspan="8"  width="56%"></td>';
                                    } else if ((tdnum + 1) % arrCell == 3) {
                                        tablehtml = tablehtml + '<td colspan="6"  width="42%"></td>';
                                    } else if ((tdnum + 1) % arrCell == 4) {
                                        tablehtml = tablehtml + '<td colspan="4"  width="28%"></td>';
                                    } else if ((tdnum + 1) % arrCell == 2) {
                                        tablehtml = tablehtml + '<td colspan="4"  width="14%"></td>';
                                    }
                                    break;
                                }
                            }
                            tablehtml = tablehtml + '</tr>'
                        }
                    }

                });
                $(".total").text("降雨量：毫米 总记录数:" + totalnum);
                tablehtml = tablehtml + '</table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $(".rightTab .load-wrapp").addClass("hidden");
                $('#rainTableDiv').html(tablehtml);


                /* $(".rightTab .load-wrapp").addClass("hidden");
                 city_table = $('#city_table').DataTable({
                     language: datatablesLanguage,
                     aaData: data.data,
                     scrollX: true,
                     scrollCollapse: true,
                     lengthChange: false,
                     ordering: false,
                     paging: false,
                     searching: false,
                     columns: [
                         {
                             "class": 'details-control',
                             "orderable": false,
                             "data": null,
                             "defaultContent": ''

                         },
                         //{ "data": "addvnm" },
                         {
                             "data": "addvnm",
                             "render": function (data, type, row, meta) {
                                 return data;
                             }
                         },
                         { "data": "sum" },
                         { "data": "daySVG" },
                         { "data": "stationList.length" }
                     ]
                 });
                 $('#city_table tbody').on('click', 'td.details-control', function () {
                     var tr = $(this).closest('tr');
                     var row = city_table.row(tr);
                     if (row.child.isShown()) {
                         // 关闭
                         row.child.hide();
                         tr.removeClass('shown');
                     }
                     else {
                         // 打开
                         row.child(format(row.data())).show();
                         tr.addClass('shown');
                         /!*var tableHtml = '</br><table class="stripe row-border order-column nowrap table-bordered" cellspacing="0" width="100%" id="collect_table">' +
                             '<thead><tr><th>测站编码</th><th>测站名称</th><th>报汛等级</th></tr></thead></table>'
                         row.child(tableHtml).show();
                         tr.addClass('shown');
                         collect_table = $('#collect_table').DataTable({
                             language: datatablesLanguage,
                             aaData: data.data.stationList,
                             scrollX: true,
                             scrollCollapse: true,
                             lengthChange: false,
                             ordering: false,
                             paging: false,
                             searching: false,
                             columns: [
                                 { "data": "addvcd" },
                                 { "data": "addvnm" },
                                 { "data": "frgrd" }
                             ]
                         });*!/
                     }
                 });*/
                //$('#city_table').dataTable().fnClearTable();
                //$('#city_table').dataTable().fnAddData(data.data);
            } else {
                layer.msg(data.message, { time: 3000 });
                $(".rightTab .load-wrapp").addClass("hidden");
            }
        });
    } else {
        layer.msg("时间格式有误")
    }
}

/*function getRainData(level, code, sttm, edtm) {
    $(".rightTab .load-wrapp").removeClass("hidden");
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainCountControl/countRainInfoByAdcd',
        Parameter: {
            "rainCount.frgrd": level,
            "rainCount.adcd": code,
            "rainCount.startTm": sttm + ':00',
            "rainCount.endTm": edtm + ':59'
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            $(".rightTab .load-wrapp").addClass("hidden");
            $('#city_table').dataTable().fnClearTable();
            if (! (data.data.length == 0)) {
                $('#city_table').dataTable().fnAddData(data.data);
            } else {
                $(".rightTab .load-wrapp").addClass("hidden");
                layer.msg("没有相关数据!");
            }
        } else {
            layer.msg(data.message);
        }
    });
}*/

function format(d) {
    var table_child_content = '';
    $.each(d.stationList, function (key, obj) {
        table_child_content = table_child_content +
            '<tr><td>' +
            obj.stcd +
            '</td><td>' +
            obj.stnm +
            '</td><td>' +
            obj.frgrd +
            //'</td><td>' +
            //obj.level +
            //'</td><td>' +
            //obj.type +
            '</td></tr>';
    });
    return '<table class="table table-bordered table-hover table_child" style="width: 50%;" cellpadding="5" cellspacing="0" border="0">' +
        ' <thead><tr><th>测站编码</th><th>测站名称</th><th>报汛等级</th></tr></thead>' +
        table_child_content +
        '</table>';
}

var powers = [];
$(function () {
    init();
    //initArea();
    initTreedata(0);
    initCode(0);
    initCode0();
    // $("#cityname").html(areaName);
    // $("#areaSelect").on("change", function () {
    //     //alert($(this).val())
    //     params.type = $(this).find("option:selected").text();
    // });

    $(".leftNav select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(0, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
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
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(0, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    $(".date").datetimepicker({
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
    });
    //时间控件更新
    var timeupdatevalue = new Date();
    var timeupdatevalue2 = new Date();
    // if (timeupdatevalue.getHours() < 8) {
    //     timeupdatevalue.setDate(timeupdatevalue.getDate() - 8, 0);
    //     timeupdatevalue.setHours(8, 0);
    //     timeupdatevalue2.setDate(timeupdatevalue2.getDate() - 1, 0);
    //     timeupdatevalue2.setHours(8, 0);
    // } else {
    //     timeupdatevalue.setDate(timeupdatevalue.getDate() - 7, 0);
    //     timeupdatevalue.setHours(8, 0);
    //     timeupdatevalue2.setDate(timeupdatevalue2.getDate(), 0);
    //     timeupdatevalue2.setHours(8, 0);
    // }
    timeupdatevalue.setDate(timeupdatevalue.getDate() - 7, 0);
    timeupdatevalue.setHours(8, 0);
    timeupdatevalue2.setDate(timeupdatevalue2.getDate(), 0);
    timeupdatevalue2.setHours(8, 0);
    $("#startTime").datetimepicker("update", timeupdatevalue);
    $("#endTime").datetimepicker("update", timeupdatevalue2);

    var code = JSON.parse($.cookie("user")).AreaCode;
    var sttm = $("#startTime input").val();
    var edtm = $("#endTime input").val();
    initRainData("", code, sttm, edtm);


    // $('#city_table tbody').on('click', 'td.details-control-child', function () {
    //     var tr = $(this).closest('tr');
    //     var row = collect_table.row(tr);
    //     if (row.child.isShown()) {
    //         // This row is already open - close it
    //         row.child.hide();
    //         tr.removeClass('shown');
    //     }
    //     else {
    //         // Open this row
    //         if (row.data().content != null) {
    //             row.child(format(row.data())).show();
    //         }
    //         tr.addClass('shown');
    //     }
    // });


    $("#tongji").on("click", function () {
        if ($(".tab0:first ").hasClass("active")) {
            powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
            //console.log(powers.join(","));
        } else if ($(".tab0:last").hasClass("active")) {
            //流域站点查询
            powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
            //console.log(powers);
        }
        var sttm = $("#startTime input").val();
        var edtm = $("#endTime input").val();
        initRainData("", code, sttm, edtm);
        //getRainData(level, code, sttm, edtm);
    });

});

//导出表格
var aclick = function (aa) {
    if ($('#collectrain tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "累计雨量统计表.xls");
        //alert(params.querytp+jst+total);
        exportExcel(aa, 'collectrain', '累计雨量统计表', jst, total, time, company, 0)
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}
