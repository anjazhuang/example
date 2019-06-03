var ttable, ddtable, mmtable, stagedatetype = 1;
$(function () {
    //初始化ajax
    init();
    //初始化树形插件
    initTreedata(1);
    initTreedatadd(1);
    initTreedatamm(1);
    //初始化站点编码
    initCode(1);
    //alert(stageDate("2017-07",1)[0]);
    //初始化时间控件
    $("#start-time,#end-time").datetimepicker({
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        pickerPosition: "bottom-left"
        // endDate: getPreDay(new Date())
    });
    var timeupdatevalue = new Date();
    var timeupdatevalue2 = new Date();
    if (timeupdatevalue.getHours() < 8) {
        timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
        // timeupdatevalue.setHours(8, 0);
        // timeupdatevalue2.setHours(8, 0);
    }
    /*else {
           timeupdatevalue2.setDate(timeupdatevalue2.getDate() + 1, 0);
           // timeupdatevalue.setHours(8, 0);
           // timeupdatevalue2.setHours(8, 0);
       }*/
    $("#end-time").datetimepicker("update", timeupdatevalue2);
    $("#start-time").datetimepicker("update", getPreDay(timeupdatevalue));

    var premonth = new Date();
    premonth.setMonth(premonth.getMonth() - 1);
    $("#start-time1,#start-time2").datetimepicker({
        format: "yyyy-mm",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 3,
        minView: 3,
        forceParse: 0,
        pickerPosition: "bottom-right"
        // endDate: premonth
    });
    $("#start-time1,#start-time2").datetimepicker("update", premonth);

    //初始化时段雨量对比表格
    timeRaintab();
    //初始化日旬雨量对比表格
    dateRaintab();
    //初始化旬月雨量对比表格
    montheRaintab();
    $("#tongji").click(function () {
        timeRaintab();
    });
    $("#tongji1").click(function () {
        dateRaintab();
    });
    $("#tongji2").click(function () {
        montheRaintab();
    });


    $(".queryparam select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#bxlevel1").select2().val(['1', '2', '3']).trigger('change');
    $("#bxlevel2").select2().val(['1', '2', '3']).trigger('change');
    //监测站点触发动作
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    $("#stcode1").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedatadd(1, evt.params.data.id, $("#bxlevel1").val(), $("#cztp1").val())
    });
    $("#stcode2").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedatamm(1, evt.params.data.id, $("#bxleve2").val(), $("#cztp2").val())
    });
    //报汛等级触发动作
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert(evt.params.data.id);
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
    // $("#bxlevel1").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert(evt.params.data.id);
    //     initTreedatadd(1, $("#stcode1").val(), evt.params.data.id, $("#cztp1").val())
    // });
    $("#bxlevel1").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedatadd(1, $("#stcode1").val(), "", $("#cztp1").val())
            else
                initTreedatadd(1, $("#stcode1").val(), $(this).val(), $("#cztp1").val())
        } else {
            initTreedatadd(1, $("#stcode1").val(), "", $("#cztp1").val())
        }
    });
    // $("#bxlevel2").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert(evt.params.data.id);
    //     initTreedatamm(1, $("#stcode2").val(), evt.params.data.id, $("#cztp2").val())
    // });
    $("#bxlevel2").on("change", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedatamm(1, $("#stcode2").val(), "", $("#cztp2").val())
            else
                initTreedatamm(1, $("#stcode2").val(), $(this).val(), $("#cztp2").val())
        } else {
            initTreedatamm(1, $("#stcode2").val(), "", $("#cztp2").val())
        }
    });
    //测站类型触发动作
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    $("#cztp1").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedatadd(1, $("#stcode1").val(), $("#bxlevel1").val(), evt.params.data.id)
    });
    $("#cztp2").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedatamm(1, $("#stcode2").val(), $("#bxlevel2").val(), evt.params.data.id)
    });
    $("#stageDate").change(function () {
        stagedatetype = $(this).val();
    });
    // chooseXun();
    // $("#start-time1").datetimepicker().on('changeDate', function (ev) {
    //     chooseXun();
    // });
})

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


function format(d, type) {
    var table_child_content = '';
    if (type == "month") {
        $.each(d.stationList, function (key, obj) {
            var monthName, rainValue;
            if (key == 0) {
                monthName = '上旬';
                rainValue = obj.top1;
            } else if (key == 1) {
                monthName = '中旬';
                rainValue = obj.top2;
            } else if (key == 2) {
                monthName = '下旬';
                rainValue = obj.top3;
            }
            table_child_content = table_child_content +
                '<tr><td>' + (key + 1) + '</td><td>' +
                monthName +
                '</td><td>' +
                rainValue +
                '</td></tr>';
        });
        return '<table class="table table-bordered table-hover table_child" style="width: 40%;" cellpadding="5" cellspacing="0" border="0">' +
            ' <thead><tr><th>序号</th><th>旬期</th><th>旬累计雨量（mm）</th></tr></thead>' +
            table_child_content +
            '</table>';
    } else {
        $.each(d.stationList, function (key, obj) {
            table_child_content = table_child_content +
                '<tr><td>' + (key + 1) + '</td><td>' +
                obj.tm +
                '</td><td>' +
                obj.drp +
                '</td></tr>';
        });
        return '<table class="table table-bordered table-hover table_child" style="width: 40%;" cellpadding="5" cellspacing="0" border="0">' +
            ' <thead><tr><th>序号</th><th>日期</th><th>日累计雨量（mm）</th></tr></thead>' +
            table_child_content +
            '</table>';
    }
}

// 日雨量对比
function timeRaintab(num) {
    // 时段雨量对比数据加载条
    if ($("#timer .tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        // console.log(powers);
    } else if ($("#timer .tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        // console.log(powers);
    }
    if ($("#start-time input").val() !== "" && powers.length !== 0) {
        if (timeValidcheck($("#start-time input").val())) {
            $(".aa").removeClass("hidden");
            var obj = {
                Type: 'get',
                Uri: '/aControl/RainControl/countStationRain',
                Parameter: {
                    "rainCount.stcd": powers.join(","),
                    //"rainCount.stcd": "41233910,41233890",
                    // "rainCount.startTm": "2017-09-30 12:12:12",
                    // "rainCount.endTm": "2017-10-01 12:12:12"
                    "rainCount.startTm": $("#start-time input").val() + " 08:00:00",
                    "rainCount.endTm": getNextDay($("#start-time input").val()) + " 08:00:00"
                }
            };

            $.ajax({
                url: serverConfig.rainfallfloodApi,
                data: JSON.stringify(obj),
                beforeSend: function (request) {
                    // var loading = layer.load(2, {
                    //     shade: [0.5, '#fff']
                    // });
                }
            }).done(function (data) {
                //console.log(data);
                // ddstcdarry0 = [];
                // $.each(data.data, function (i, v) {
                //     if (( v.drp !== v.dyp) && (v.drp != "")) {
                //         ddstcdarry0.push({ "stcd": v.stcd, "drp": v.drp });
                //     }
                // });
                // if (ddstcdarry0.length == 0) {
                //     $('#alltongbu').attr("disabled", true);
                // } else {
                //     $('#alltongbu').attr("disabled", false);
                // }
                if (data.success) {
                    var ddarry = $.grep(data.data, function (d) {
                        return rainData(d.drp) !== "" || rainData(obj.dyp) !== ""
                    });
                    // ttable = $('#example').DataTable({
                    //     language: reportLanguage,
                    //     aaData: data.data,
                    //     "iDisplayLength": 15,
                    //     bDestroy: true,
                    //     lengthChange: false,
                    //     ordering: false,
                    //     searching: false,
                    //     columns: [
                    //         {
                    //             "data": null,
                    //             "render": function (data, type, row, meta) {
                    //                 var startIndex = meta.settings._iDisplayStart;
                    //                 return meta.row + 1;
                    //             }
                    //         },
                    //         { "data": "stcd" },
                    //         { "data": "stnm" },
                    //         { "data": "addvnm" },
                    //         { "data": "bsnm" },
                    //         { "data": "hnnm" },
                    //         { "data": "rvnm" },
                    //         { "data": "drp" }
                    //     ]
                    // });
                    var intervaltimeRCHtml = "<div class='tabletitle'>日雨量对比统计表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#start-time input").val() + " 08:00 至 " + getNextDay($("#start-time input").val()) + " 08:00</div>" +
                        "<div class='bunits'><span class='total'>降雨量：毫米 总记录数：" + data.data.length + "</span></div></div>";
                    intervaltimeRCHtml += '<div class="tablediv"><table id="timerainCttable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervaltimeRCHtml += '<thead>' +
                        '<tr>' +
                        // '<th>序号</th>' +
                        '<th>测站编码</th>' +
                        '<th>测站名称</th>' +
                        '<th>行政区域</th>' +
                        '<th>水系</th>' +
                        '<th>河流</th>' +
                        '<th>日降雨量计算值</th>' +
                        '<th>报汛值</th>' +
                        '<th>操作</th>' +
                        '</tr>' +
                        '</thead><tbody>';
                    if (ddarry.length > 0) {
                        $.each(sortName(ddarry), function (key, obj) {
                            intervaltimeRCHtml += '<tr>' +
                                // '<td>' + (key + 1) + '</td>' +
                                '<td>' + obj.stcd + '</td>' +
                                '<td>' + obj.stnm + '</td>' +
                                '<td>' + obj.addvnm + '</td>' +
                                '<td>' + obj.hnnm + '</td>' +
                                '<td>' + obj.rvnm + '</td>' +
                                '<td>' + rainData(obj.drp) + '</td>' +
                                '<td>' + rainData(obj.dyp) + '</td>';
                            // '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(0,' + obj.stcd + ',' + (obj.drp ? obj.drp : null) + ',' + (obj.dyp ? obj.dyp : null) + ')">编辑</button> </td></tr>';
                            if (rainData(obj.drp) !== rainData(obj.dyp) && (obj.drp != "")) {
                                intervaltimeRCHtml += '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(0,' + obj.stcd + ',' + (obj.drp ? obj.drp : null) + ',' + (obj.dyp ? obj.dyp : null) + ')">编辑</button> </td>' +
                                    '</tr>';
                            } else {
                                intervaltimeRCHtml += '<td> </td></tr>';
                            }
                        });
                        // if (num == 1) {
                        //     layer.msg("全部同步成功!");
                        // }
                    } else {
                        intervaltimeRCHtml += '<tr>' +
                            '<td colspan="8">无数据</td>' +
                            '</tr>';
                    }
                    intervaltimeRCHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                    $("#timerainCt").html(intervaltimeRCHtml);
                    $(".aa").addClass("hidden");
                } else {
                    layer.msg(data.message, { time: 3000 });
                    $(".aa").addClass("hidden");
                }
            })
        } else {
            layer.msg("输入时间格式有误")
        }
    }
    else {
        layer.msg("时间和站点数据不能为空")
    }
}

// 旬雨量对比
var ddstcdarry0 = [],
    ddstcdarry1 = [],
    ddstcdarry2 = [];

function dateRaintab(num) {
    ddstcdarry1 = [];
    // 旬雨量对比数据加载条
    if ($("#dater .tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity1'), $.fn.zTree.getZTreeObj('treeDemoCity1').getNodes(), []);
        // console.log(powers);
    } else if ($("#dater .tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver1'), $.fn.zTree.getZTreeObj('treeDemoRiver1').getNodes(), []);
        // console.log(powers);
    }
    if ($("#start-time1 input").val() !== "" && powers.length !== 0) {

        $(".bb").removeClass("hidden");
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainCountControl/countXRainInfo',
            Parameter: {
                "rainCount.stcd": powers.join(","),
                //"rainCount.stcd": "41233910,41233890",
                "rainCount.startTm": $("#start-time1 input").val()
                // "rainCount.endTm": "2017-08-01 08:00:00"
                // "rainCount.startTm": stageDate($("#start-time1 input").val(), stagedatetype)[0] + " 08:00:00",
                // "rainCount.endTm": stageDate($("#start-time1 input").val(), stagedatetype)[1] + " 08:00:00"
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                if (stagedatetype == 1) {
                    var xxarry = $.grep(data.data, function (d) {
                        return rainData(d.stationList[0].top1) !== "" || rainData(d.stationList[0].top3) !== ""
                    })
                } else if (stagedatetype == 2) {
                    var xxarry = $.grep(data.data, function (d) {
                        return rainData(d.stationList[1].top1) !== "" || rainData(d.stationList[1].top3) !== ""
                    })
                } else if (stagedatetype == 3) {
                    var xxarry = $.grep(data.data, function (d) {
                        return rainData(d.stationList[2].top1) !== "" || rainData(d.stationList[2].top3) !== ""
                    })
                }
                //console.log(data);
                // $.each(data.data, function (i, v) {
                //     ddstcdarry1.push({ "stcd": v.stcd, "drp": v.drp });
                // });
                // console.log(ddstcdarry);
                // ddtable = $('#exampledd').DataTable({
                //     language: reportLanguage,
                //     aaData: data.data,
                //     lengthChange: false,
                //     "iDisplayLength": 15,
                //     ordering: false,
                //     searching: false,
                //     bDestroy: true,
                //     columns: [
                //         {
                //             "class": 'details-control',
                //             "orderable": false,
                //             "data": null,
                //             "defaultContent": ''
                //         },
                //         {
                //             "data": null,
                //             "render": function (data, type, row, meta) {
                //                 var startIndex = meta.settings._iDisplayStart;
                //                 return meta.row + 1;
                //             }
                //         },
                //         { "data": "stcd" },
                //         { "data": "stnm" },
                //         { "data": "addvnm" },
                //         { "data": "bsnm" },
                //         { "data": "hnnm" },
                //         { "data": "rvnm" },
                //         { "data": "drp" },
                //         { "data": "top3" }
                //     ],
                //     columnDefs: [
                //         {
                //             targets: 10,
                //             //根据报警类型转换相应操作按钮
                //             render: function (data, type, row, meta) {
                //                 //var aa = JSON.stringify(row).replace(/\"/g, "'");
                //                 // return '<button type="button" class="btn btn-sm btn-primary" data-hh="' + aa + '">同步</button>';
                //                 if (row.drp !== row.dyp) {
                //                     return '<button type="button" class="btn btn-xs btn-synchro" onclick="synchroRain((' + row.stcd + '),(' + row.drp + '))"><span class="glyphicon glyphicon-repeat"></span> 同步</button>';
                //                 } else {
                //                     return ' ';
                //                 }
                //             }
                //         }
                //     ]
                // });
                // $('#exampledd tbody').off().on('click', 'td.details-control', function () {
                //     var tr = $(this).closest('tr');
                //     var row = ddtable.row(tr);
                //     if (row.child.isShown()) {
                //         // This row is already open - close it
                //         row.child.hide();
                //         tr.removeClass('shown');
                //     }
                //     else {
                //         // Open this row
                //         row.child(format(row.data(), "date")).show();
                //         tr.addClass('shown');
                //     }
                // });    //下拉框combox
                var intervaldateRCHtml = "<div class='tabletitle'>旬雨量对比统计表</div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + stageDate($("#start-time1 input").val(), stagedatetype)[0] + " 08:00 至 " + stageDate($("#start-time1 input").val(), stagedatetype)[1] + " 08:00</div>" +
                    "<div class='bunits'><span class='total'>降雨量：毫米 总记录数：" + data.data.length + "</span></div></div>";
                intervaldateRCHtml += '<div class="tablediv"><table id="timeraindCttable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                intervaldateRCHtml += '<thead>' +
                    '<tr>' +
                    // '<th>序号</th>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>行政区域</th>' +
                    '<th>水系</th>' +
                    '<th>河流</th>' +
                    '<th>旬降雨量计算值</th>' +
                    '<th>报汛值</th>' +
                    '<th>操作</th>' +
                    '</tr>' +
                    '</thead><tbody>';
                if (xxarry.length > 0) {
                    $.each(sortName(xxarry), function (key, obj) {
                        intervaldateRCHtml += '<tr>' +
                            // '<td>' + (key + 1) + '</td>' +
                            '<td>' + obj.stcd + '</td>' +
                            '<td>' + obj.stnm + '</td>' +
                            '<td>' + obj.addvnm + '</td>' +
                            '<td>' + obj.hnnm + '</td>' +
                            '<td>' + obj.rvnm + '</td>';
                        if (stagedatetype == 1) {
                            intervaldateRCHtml += '<td>' + rainData(obj.stationList[0].top1) + '</td><td>' + rainData(obj.stationList[0].top3) + '</td>';
                            // '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(1,' + obj.stcd + ',' + (obj.stationList[0].top1 ? obj.stationList[0].top1 : null) + ',' + (obj.stationList[0].top3 ? obj.stationList[0].top3 : null) + ',(' + new Date(obj.stationList[0].tm).getTime() + '))">编辑</button></td></tr>';
                            if (rainData(obj.stationList[0].top1) !== rainData(obj.stationList[0].top3)) {
                                intervaldateRCHtml += '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(1,' + obj.stcd + ',' + (obj.stationList[0].top1 ? obj.stationList[0].top1 : null) + ',' + (obj.stationList[0].top3 ? obj.stationList[0].top3 : null) + ',(' + new Date(obj.stationList[0].tm).getTime() + '))">编辑</button></td>' +
                                    '</tr>';
                                // ddstcdarry1.push({
                                //     "stcd": obj.stcd,
                                //     "drp": obj.stationList[0].top1,
                                //     "tm": new Date(obj.stationList[0].tm).getTime()
                                // });
                            } else {
                                intervaldateRCHtml += '<td> </td></tr>';
                            }
                        } else if (stagedatetype == 2) {
                            intervaldateRCHtml += '<td>' + rainData(obj.stationList[1].top1) + '</td><td>' + rainData(obj.stationList[1].top3) + '</td>';
                            // '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(1,' + obj.stcd + ',' + (obj.stationList[1].top1 ? obj.stationList[1].top1 : null) + ',' + (obj.stationList[1].top3 ? obj.stationList[1].top3 : null) + ',(' + new Date(obj.stationList[1].tm).getTime() + '))">编辑</button></td></tr>';
                            if (rainData(obj.stationList[1].top1) !== rainData(obj.stationList[1].top3)) {
                                intervaldateRCHtml += '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(1,' + obj.stcd + ',' + (obj.stationList[1].top1 ? obj.stationList[1].top1 : null) + ',' + (obj.stationList[1].top3 ? obj.stationList[1].top3 : null) + ',(' + new Date(obj.stationList[1].tm).getTime() + '))">编辑</button></td>' +
                                    '</tr>';
                                // ddstcdarry1.push({
                                //     "stcd": obj.stcd,
                                //     "drp": obj.stationList[1].top1,
                                //     "tm": new Date(obj.stationList[1].tm).getTime()
                                // });
                            } else {
                                intervaldateRCHtml += '<td> </td></tr>';
                            }

                        } else if (stagedatetype == 3) {
                            intervaldateRCHtml += '<td>' + rainData(obj.stationList[2].top1) + '</td><td>' + rainData(obj.stationList[2].top3) + '</td>';
                            // '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(1,' + obj.stcd + ',' + (obj.stationList[2].top1 ? obj.stationList[2].top1 : null) + ',' + (obj.stationList[2].top3 ? obj.stationList[2].top3 : null) + ',(' + new Date(obj.stationList[2].tm).getTime() + '))">编辑</button></td></tr>';
                            if (rainData(obj.stationList[2].top1) !== rainData(obj.stationList[2].top3) && (obj.stationList[2].top1 != "")) {
                                intervaldateRCHtml += '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(1,' + obj.stcd + ',' + (obj.stationList[2].top1 ? obj.stationList[2].top1 : null) + ',' + (obj.stationList[2].top3 ? obj.stationList[2].top3 : null) + ',(' + new Date(obj.stationList[2].tm).getTime() + '))">编辑</button></td>' +
                                    '</tr>';
                                // ddstcdarry1.push({
                                //     "stcd": obj.stcd,
                                //     "drp": obj.stationList[2].top1,
                                //     "tm": new Date(obj.stationList[2].tm).getTime()
                                // });
                            } else {
                                intervaldateRCHtml += '<td> </td></tr>';
                            }
                        }

                    });
                    // if (num == 1) {
                    //     layer.msg("全部同步成功!");
                    // }
                    // if (ddstcdarry1.length == 0) {
                    //     $('#alltongbu1').attr("disabled", true);
                    // } else {
                    //     $('#alltongbu1').attr("disabled", false);
                    // }
                } else {
                    intervaldateRCHtml += '<tr>' +
                        '<td colspan="8">无数据</td>' +
                        '</tr>';
                }
                intervaldateRCHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#daterCt").html(intervaldateRCHtml);
                $(".bb").addClass("hidden");
                // ddtable.page(index ? index : 0).draw('page');
            } else {
                layer.msg(data.message, { time: 3000 });
                $(".bb").addClass("hidden");
            }
        })
    } else {
        layer.msg("时间和站点不能为空")
    }
}

// 月雨量对比
function montheRaintab(num) {
    ddstcdarry2 = [];
    // 月雨量对比数据加载条
    if ($("#monthr .tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity2'), $.fn.zTree.getZTreeObj('treeDemoCity2').getNodes(), []);
        //  console.log(powers);
    } else if ($("#monthr .tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver2'), $.fn.zTree.getZTreeObj('treeDemoRiver2').getNodes(), []);
        //console.log(powers);
    }
    if ($("#start-time2 input").val() !== "" && powers.length !== 0) {
        $(".cc").removeClass("hidden");
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainCountControl/countXRainInfo',
            Parameter: {
                "rainCount.stcd": powers.join(","),
                // "rainCount.stcd": "41233910,41233890,41101000",
                // "rainCount.startTm": "2012-11"
                "rainCount.startTm": $("#start-time2 input").val() + "-01 08:00:00",
                "rainCount.endTm": getNextMonth($("#start-time2 input").val()) + "-01 08:00:00"
            }
        };

        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj),
            beforeSend: function (request) {
                // var loading = layer.load(2, {
                //     shade: [0.5, '#fff']
                // });
            }
        }).done(function (data) {
            if (data.success) {
                var yyarry = $.grep(data.data, function (d) {
                    return rainData(d.drp) !== "" || rainData(d.top3) !== ""
                });
                // $.each(data.data, function (i, v) {
                //     if ((v.drp !== v.top3) && (v.drp != "")) {
                //         ddstcdarry2.push({ "stcd": v.stcd, "drp": v.drp });
                //     }
                // });
                // if (ddstcdarry2.length == 0) {
                //     $('#alltongbu2').attr("disabled", true);
                // } else {
                //     $('#alltongbu2').attr("disabled", false);
                // }

                // mmtable = $('#mmexample').DataTable({
                //     language: reportLanguage,
                //     aaData: data.data,
                //     bDestroy: true,
                //     // scrollX: true,
                //     // scrollCollapse: true,
                //     lengthChange: false,
                //     "iDisplayLength": 15,
                //     ordering: false,
                //     searching: false,
                //     columns: [
                //         {
                //             "class": 'details-control',
                //             "orderable": false,
                //             "data": null,
                //             "defaultContent": ''
                //         },
                //         {
                //             "data": null,
                //             "render": function (data, type, row, meta) {
                //                 var startIndex = meta.settings._iDisplayStart;
                //                 return meta.row + 1;
                //             }
                //         },
                //         { "data": "stcd" },
                //         { "data": "stnm" },
                //         { "data": "addvnm" },
                //         { "data": "bsnm" },
                //         { "data": "hnnm" },
                //         { "data": "rvnm" },
                //         { "data": "drp" },
                //         { "data": "dyp" }
                //     ]
                // });
                //
                // $('#mmexample tbody').off().on('click', 'td.details-control', function () {
                //     var tr = $(this).closest('tr');
                //     var row = mmtable.row(tr);
                //     if (row.child.isShown()) {
                //         // This row is already open - close it
                //         row.child.hide();
                //         tr.removeClass('shown');
                //     }
                //     else {
                //         // Open this row
                //         row.child(format(row.data(), "month")).show();
                //         tr.addClass('shown');
                //     }
                // });
                var intervalmonthRCHtml = "<div class='tabletitle'>月雨量对比统计表 </div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + $("#start-time2 input").val() + "</div>" +
                    "<div class='bunits'><span class='total'>降雨量：毫米 总记录数：" + data.data.length + "</span></div></div>";
                intervalmonthRCHtml += '<div class="tablediv"><table id="timerainmCttable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                intervalmonthRCHtml += '<thead>' +
                    '<tr>' +
                    // '<th>序号</th>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>行政区域</th>' +
                    '<th>水系</th>' +
                    '<th>河流</th>' +
                    '<th>月降雨量计算值</th>' +
                    '<th>报汛值</th>' +
                    '<th>操作</th>' +
                    '</tr>' +
                    '</thead><tbody>';
                if (yyarry.length > 0) {
                    $.each(sortName(yyarry), function (key, obj) {
                        intervalmonthRCHtml += '<tr>' +
                            // '<td>' + (key + 1) + '</td>' +
                            '<td>' + obj.stcd + '</td>' +
                            '<td>' + obj.stnm + '</td>' +
                            '<td>' + obj.addvnm + '</td>' +
                            '<td>' + obj.hnnm + '</td>' +
                            '<td>' + obj.rvnm + '</td>' +
                            '<td>' + rainData(obj.drp) + '</td>' +
                            '<td>' + rainData(obj.top3) + '</td>';
                        // '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(2,' + obj.stcd + ',' + (obj.drp ? obj.drp : null) + ',' + (obj.top3 ? obj.top3 : null) + ')">编辑</button> </td>';
                        if (rainData(obj.drp) !== rainData(obj.top3)) {
                            intervalmonthRCHtml += '<td><button type="button" class="btn btn-xs btn-primary" onclick="editRain(2,' + obj.stcd + ',' + (obj.drp ? obj.drp : null) + ',' + (obj.top3 ? obj.top3 : null) + ')">编辑</button> </td>' +
                                '</tr>';
                        } else {
                            intervalmonthRCHtml += '<td> </td></tr>';
                        }
                    });
                    // if (num == 1) {
                    //     layer.msg("全部同步成功!");
                    // }
                } else {
                    intervalmonthRCHtml += '<tr>' +
                        '<td colspan="8">无数据</td>' +
                        '</tr>';
                }
                intervalmonthRCHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#mmrCt").html(intervalmonthRCHtml);
                $(".cc").addClass("hidden");
            } else {
                layer.msg(data.message, { time: 3000 });
                $(".cc").addClass("hidden");
            }
        })
    } else {
        layer.msg("时间和站点不能为空")
    }

}

//判断上中下旬日期
function stageDate(month, type) {
    //alert(new Date(month.split("-")[0], month.split("-")[1].replace("0", ""), 0).getDate());
    if (type == 1) {
        return [month + "-01", month + "-10"]
    } else if (type == 2) {
        return [month + "-11", month + "-20"]
    } else if (type == 3) {
        return [month + "-21", month + "-" + new Date(month.split("-")[0], month.split("-")[1].replace("0", ""), 0).getDate()]
    }
}

//同步雨量
function synchroRain(num, stcd, drp, tm) {
    //alert(pageindex);
    if (num == 0) {
        /* var obj = {
             Type: 'get',
             Uri: '/aControl/RainControl/updateCountX',
             Parameter: {
                 //"stcd": powers.join(","),
                 "stcd": stcd,
                 // "tm": "2018-08-01 08:00:00",
                 "tm": getNextDay($("#start-time input").val()) + " 08:00:00",
                 "accp": drp ? drp : "",
                 "type": 1
             }
         };

         $.ajax({
             url: serverConfig.rainfallfloodApi,
             data: JSON.stringify(obj)
         }).done(function (data) {
             if (data.success) {
                 console.log(data);
                 timeRaintab();//更新数据，并且返回原页
             }
         })*/
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/updateSTPPtNRDYP',
            Parameter: {
                "stcd": stcd,
                "tm": getNextDay($("#start-time input").val()) + " 08:00:00",
                "dyp": drp
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                //console.log(data);
                timeRaintab();//更新数据，并且返回原页
            }
        });
    } else if (num == 1) {
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/updateCountX',
            Parameter: {
                //"stcd": powers.join(","),
                "stcd": stcd,
                // "tm": "2018-08-01 08:00:00",
                "tm": timestampToTime(tm),
                "accp": drp,
                //"accp": drp ? drp : "",
                "type": 4
            }
        };

        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                //console.log(data);
                dateRaintab();//更新数据，并且返回原页
            }
        });
    } else {
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/updateCountX',
            Parameter: {
                //"stcd": powers.join(","),
                "stcd": stcd,
                // "tm": "2018-08-01 08:00:00",
                "tm": getNextMonth($("#start-time2 input").val()) + "-01 08:00:00",
                "accp": drp,
                //"accp": drp ? drp : "",
                "type": 5
            }
        };

        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                //console.log(data);
                montheRaintab();//更新数据，并且返回原页
            }
        });
    }
}

//日雨量全部同步
function diurnalRainfalSync() {
    var count = 0;
    $.each(ddstcdarry0, function (i, v) {
        /*                var obj = {
         Type: 'get',
         Uri: '/aControl/RainControl/updateCountX',
         Parameter: {
         //"stcd": powers.join(","),
         "stcd": v.stcd,
         // "tm": "2018-08-01 08:00:00",
         "tm": getNextDay($("#start-time input").val()) + " 08:00:00",
         "accp": v.drp,
         "type": 1
         }
         };*/
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/updateSTPPtNRDYP',
            Parameter: {
                "stcd": v.stcd,
                "tm": getNextDay($("#start-time input").val()) + " 08:00:00",
                "dyp": v.drp
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            async: false,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                count = count + 1;
            }
        });
    });
    if (count == ddstcdarry0.length) {
        //$(".aa").addClass("hidden");
        timeRaintab(1);
    }
}

//旬雨量全部同步
function tenRainfalSync() {
    var count = 0;
    $.each(ddstcdarry1, function (i, v) {
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/updateCountX',
            Parameter: {
                "stcd": v.stcd,
                "tm": timestampToTime(v.tm),
                "accp": v.drp,
                "type": 4
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            async: false,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                count = count + 1;
            }
        });
    });
    if (count == ddstcdarry1.length) {
        //$(".aa").addClass("hidden");
        dateRaintab(1);
    }
}

//月雨量全部同步
function monthRainfalSync() {
    var count = 0;
    $.each(ddstcdarry2, function (i, v) {
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainControl/updateCountX',
            Parameter: {
                //"stcd": powers.join(","),
                "stcd": v.stcd,
                // "tm": "2018-08-01 08:00:00",
                // "tm": $("#start-time2 input").val() + "-01 08:00:00",
                "tm": getNextMonth($("#start-time2 input").val()) + "-01 08:00:00",
                "accp": v.drp,
                "type": 5
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            async: false,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                count = count + 1;
            }
        });
    });
    if (count == ddstcdarry2.length) {
        //$(".aa").addClass("hidden");
        montheRaintab(1);
    }
}

//全部同步
function synchroallRain(num) {
    var ddstcdarryLength
    //循环调用同步接口
    if (num == 0) {
        ddstcdarryLength = ddstcdarry0.length;
        layer.confirm('当前有' + ddstcdarryLength + '条数据可以进行同步，是否继续？', {
            btn: ['继续', '取消']
        }, function (index) {
            layer.close(index);
            layer.msg('正在全部同步中......', {
                icon: 16,
                shade: [0.8, '#393D49']
            });
            //$(".aa").removeClass("hidden");
            setTimeout("diurnalRainfalSync()", 100);
        }, function () {
        });
    } else if (num == 1) {
        //alert(stagedatetype);
        //console.log(ddstcdarry1);
        ddstcdarryLength = ddstcdarry1.length;
        layer.confirm('当前有' + ddstcdarryLength + '条数据可以进行同步，是否继续？', {
            btn: ['继续', '取消']
        }, function (index) {
            layer.close(index);
            layer.msg('正在全部同步中......', {
                icon: 16,
                shade: [0.8, '#393D49']
            });
            //$(".aa").removeClass("hidden");
            setTimeout("tenRainfalSync()", 100);
        }, function () {
        });
    } else {
        ddstcdarryLength = ddstcdarry2.length;
        layer.confirm('当前有' + ddstcdarryLength + '条数据可以进行同步，是否继续？', {
            btn: ['继续', '取消']
        }, function (index) {
            layer.close(index);
            layer.msg('正在全部同步中......', {
                icon: 16,
                shade: [0.8, '#393D49']
            });
            //$(".aa").removeClass("hidden");
            setTimeout("monthRainfalSync()", 100);
        }, function () {
        });
    }
}

//导出表格
var aclick = function (aa, i) {
    var jst = [$(".btime").eq(0).text(), $(".btime").eq(1).text(), $(".btime").eq(2).text()];
    var total = [$(".total").eq(0).text(), $(".total").eq(1).text(), $(".total").eq(2).text()];
    var time = [$(".maketabtime").eq(0).text(), $(".maketabtime").eq(1).text(), $(".maketabtime").eq(2).text()];
    var company = [$(".maketabcom").eq(0).text(), $(".maketabcom").eq(1).text(), $(".maketabcom").eq(2).text()];
    if (i == 0) {
        if ($('#timerainCttable tr:last').find('td').text() !== "无数据") {
            $(aa).attr("download", "日雨量对比表.xls");
            exportExcel(aa, 'timerainCttable', '日雨量对比表', jst[0], total[0], time[0], company[0], 1)
        } else {
            alert("无数据无法导出");
            $(aa).removeAttr("download");
        }
    } else if (i == 1) {
        if ($('#timeraindCttable tr:last').find('td').text() !== "无数据") {
            $(aa).attr("download", "旬雨量对比表.xls");
            exportExcel(aa, 'timeraindCttable', '旬雨量对比表', jst[1], total[1], time[1], company[1], 1)
        } else {
            alert("无数据无法导出");
            $(aa).removeAttr("download");
        }
    } else if (i == 2) {
        if ($('#timerainmCttable tr:last').find('td').text() !== "无数据") {
            $(aa).attr("download", "月雨量对比表.xls");
            exportExcel(aa, 'timerainmCttable', '月雨量对比表', jst[2], total[2], time[2], company[2], 1)
        } else {
            alert("无数据无法导出");
            $(aa).removeAttr("download");
        }
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

//获取指定日期的前一天
function getPreDay(d) {
    d = new Date(d);
    d = +d - 1000 * 60 * 60 * 24;
    d = new Date(d);
    //return d;
    //格式化
    return d.getFullYear() + "-" + (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) + "-" + (d.getDate() < 10 ? "0" + (d.getDate()) : d.getDate());
}

//获取指定日期的后一个月
function getNextMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2;
    return t2;
}

//获取指定日期的前一个月
function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2;
    return t2;
}

// //时间蹉互换
// function timestampToTime(timestamp) {
//     var date = new Date(timestamp),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
//         Y = date.getFullYear() + '-',
//         M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
//         D = date.getDate() + ' ',
//         h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
//         m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
//         s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
//     return Y + M + D + h + m + s;
// }

//编辑方法
function editRain(tp, stcd, r, y, tm) {
    layer.open({
        type: 1,
        area: ['300px', '180px'], //宽高
        title: '报汛值编辑',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['提交', '关闭'],
        shadeClose: true,
        content: $("#editRainform"),
        success: function () {
            if (!isNull(r)) {
                $("#rainVal1").val(r);
            } else {
                $("#rainVal1").val("");
            }

            if (y !== null) {
                $("#rainVal0").text(y)
            } else {
                $("#rainVal0").text("")
            }
        },
        yes: function (index) {
            if ($("#rainVal1").val() !== "") {
                if (tp == 0) {
                    var obj = {
                            Type: 'get',
                            Uri: '/aControl/RainControl/updateSTPPtNRDYP',
                            Parameter: {
                                "stcd": stcd,
                                "tm": getNextDay($("#start-time input").val()) + " 08:00:00",
                                "dyp": $("#rainVal1").val()
                            }
                        }
                    ;
                    $.ajax({
                        url: serverConfig.rainfallfloodApi,
                        async: false,
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        if (data.success) {
                            layer.close(index);//关闭按钮
                            timeRaintab();
                        }
                    });
                } else if (tp == 1) {
                    var obj = {
                        Type: 'get',
                        Uri: '/aControl/RainControl/updateCountX',
                        Parameter: {
                            //"stcd": powers.join(","),
                            "stcd": stcd,
                            // "tm": "2018-08-01 08:00:00",
                            "tm": timestampToTime(tm),
                            "accp": $("#rainVal1").val(),
                            //"accp": drp ? drp : "",
                            "type": 4
                        }
                    };

                    $.ajax({
                        url: serverConfig.rainfallfloodApi,
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        if (data.success) {
                            layer.close(index)
                            dateRaintab();//更新数据，并且返回原页
                        }
                    });
                } else {
                    var obj = {
                        Type: 'get',
                        Uri: '/aControl/RainControl/updateCountX',
                        Parameter: {
                            //"stcd": powers.join(","),
                            "stcd": stcd,
                            // "tm": "2018-08-01 08:00:00",
                            "tm": getNextMonth($("#start-time2 input").val()) + "-01 08:00:00",
                            "accp": $("#rainVal1").val(),
                            //"accp": drp ? drp : "",
                            "type": 5
                        }
                    };

                    $.ajax({
                        url: serverConfig.rainfallfloodApi,
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        if (data.success) {
                            layer.close(index)
                            montheRaintab();//更新数据，并且返回原页
                        }
                    });
                }
            } else {
                layer.msg("输入值不能为空")
            }
        },
        end: function (index, layero) {
            layer.close(index);//关闭按钮
        }
    })
}

var db = "", str = "";

function chooseXun() {
    db = new Date();
    str = db.getFullYear() + "-" + ((db.getMonth() + 1) < 10 ? "0" + (db.getMonth() + 1) : (db.getMonth() + 1));//获取当前实际日期
    if (Date.parse($("#start-time1 input").val()) == Date.parse(str)) {
        if (db.getDate() < 11) {
            //上旬
            $("#stageDate").find("option[value='1']").removeAttr("disabled");
            $("#stageDate").find("option[value='1']").siblings().attr("disabled", true)
        } else if (db.getDate() < 21) {
            //中旬
            $("#stageDate").find("option[value='3']").attr("disabled", true);
            $("#stageDate").find("option[value='3']").siblings().removeAttr("disabled")
        } else {
            $("#stageDate").find("option").removeAttr("disabled");
        }
    } else if (Date.parse($("#start-time1 input").val()) > Date.parse(str)) {
        $("#stageDate").find("option").attr("disabled", true);
    } else {
        $("#stageDate").find("option").removeAttr("disabled");
        $("#stageDate").val("1");
    }
}