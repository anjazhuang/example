var params = {
    type: "river",
    state: 2
};

$(function () {
    //ajax初始化
    init();
    //初始化树形插件数据
    initTreedata(2);
    //初始化站点编码
    initCode(2);
    //监测站点触发动作筛选方法
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(params.state, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    //报汛等级触发方法筛选方法
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert(evt.params.data.id);
    //     initTreedata(params.state, $("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(params.state, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(params.state, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(params.state, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    //测站类型触发筛选方法
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(params.state, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    //时间控件初始化
    $("#start-time,#end-time").datetimepicker({
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
    //     timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
    //     timeupdatevalue.setHours(8, 0);
    //     timeupdatevalue2.setHours(8, 0);
    // } else {
    //     timeupdatevalue2.setDate(timeupdatevalue2.getDate() + 1, 0);
    //     timeupdatevalue.setHours(8, 0);
    //     timeupdatevalue2.setHours(8, 0);
    // }
    timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
    timeupdatevalue.setHours(8, 0);
    timeupdatevalue2.setHours(8, 0);
    $("#end-time").datetimepicker("update", timeupdatevalue2);
    $("#start-time").datetimepicker("update", timeupdatevalue);
    //河道水情特征值
    queryRiverrain();
    //水库水情特征值
    queryReservoirrain();
    //下拉框combox
    $("select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    //初始化表格

    //数据类型选择
    $("#selectType").change(function () {
        $(".select2-selection__rendered").empty();
        $("#bxlevel").val("");
        params.type = $(this).val();
        if (params.type == "river") {
            params.state = 2;
            initTreedata(2);
            //初始化站点编码
            initCode(2);
            var selecthtml = '<option value="">全部</option><option value="ZZ">河道水位站</option><option value="ZQ">河道水文站</option>';
            $("#cztp").html(selecthtml);
        } else if (params.type == "reservoir") {
            params.state = 3;
            initTreedata(3);
            //初始化站点编码
            initCode(3);
            var selecthtml = '<option value="RR">水库水文站</option>';
            $("#cztp").html(selecthtml);
        }
    });
    //数据类型选择
    $("#selectType").select2();

    //统计
    $("#tongji").on("click", function () {
        if (params.type == "river") {
            queryRiverrain();
            $("#river").removeClass("hidden");
            $("#reservoir").addClass("hidden");
        } else if (params.type == "reservoir") {
            queryReservoirrain();
            $("#river").addClass("hidden");
            $("#reservoir").removeClass("hidden");
        }
    });
});

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

// 河道特征加载数据
function queryRiverrain() {
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        console.log(powers);
    } else if ($(".tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        //alert("dd");
        console.log(powers);
    }
    if ($("#start-time input").val() !== "" && $("#end-time input").val() !== "" && powers.length !== 0) {
        if (timeValidcheck($("#start-time input").val().split(" ")[0]) && timeValidcheck($("#end-time input").val().split(" ")[0])) {
            $("#river .load-wrapp").removeClass("hidden");

            var obj = {
                Type: 'get',
                Uri: '/aControl/RiverControl/riverWaterAnalysis',
                Parameter: {
                    "waterInfo.stcd": powers.join(","),
                    // "waterInfo.stcd": "41101300",
                    // "waterInfo.startTm": "2017-10-01 12:12:12",
                    // "waterInfo.endTm": "2017-10-10 12:12:12"
                    "waterInfo.startTm": $("#start-time input").val() + ":00",
                    "waterInfo.endTm": $("#end-time input").val() + ":59"
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
            }).done(function (database) {
                if (database.success) {
                    //console.log(database);
                    // var river_table = $('#river table').DataTable({
                    //     language: reportLanguage,
                    //     aaData: database.data,
                    //     lengthChange: false,
                    //     ordering: false,
                    //     "iDisplayLength": 15,
                    //     searching: false,
                    //     bDestroy: true,
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
                    //         { "data": "name" },
                    //         { "data": "bsnm" },
                    //         { "data": "hnnm" },
                    //         { "data": "rvnm" },
                    //         { "data": "maxz" },
                    //         { "data": "minz" }
                    //     ]
                    // });
                    // // table = $('#time_table').DataTable({
                    // //     aaData: database.data,
                    // //     lengthChange: false,
                    // //     "iDisplayLength": 15,
                    // //     searching: false,
                    // //     bDestroy: true,
                    // //     language: reportLanguage,
                    // //     ordering: false,
                    // //     columns: [
                    // //         {
                    // //             "data": null,
                    // //             "render": function (data, type, row, meta) {
                    // //                 var startIndex = meta.settings._iDisplayStart;
                    // //                 return meta.row + 1;
                    // //             }
                    // //         },
                    // //         { "data": "stcd" },
                    // //         { "data": "stnm" },
                    // //         { "data": "addvnm" },
                    // //         { "data": "bsnm" },
                    // //         { "data": "hnnm" },
                    // //         { "data": "rvnm" },
                    // //         { "data": "drp" },
                    // //         { "data": "top1" },
                    // //         { "data": "top2" },
                    // //         { "data": "top3" }
                    // //     ],
                    // //     // columnDefs: [
                    // //     //     {
                    // //     //         targets: 9,
                    // //     //         render: function (data, type, row, meta) {
                    // //     //             var source = JSON.stringify(row).replace(/\"/g, "'");
                    // //     //             return '<button type="button" class="btn btn-xs set" onclick="setStation(' + source + ')"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button><button type="button" class="btn btn-xs btn-del" onclick="delete0(' + source + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                    // //     //         }
                    // //     //     }
                    // //     // ],
                    // //
                    // // });
                    //
                    // $('#year_table tbody').off().on('click', 'td.details-control', function () {
                    //     var tr = $(this).closest('tr');
                    //     var row = year_table.row(tr);
                    //     if (row.child.isShown()) {
                    //         // This row is already open - close it
                    //         row.child.hide();
                    //         tr.removeClass('shown');
                    //     }
                    //     else {
                    //         // Open this row
                    //         row.child(format(row.data(), "year")).show();
                    //         tr.addClass('shown');
                    //     }
                    // });
                    var intervaltimeRiverHtml = "<div class='tabletitle'>河道特征值</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#start-time input").val() + " 至 " + $("#end-time input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>水位：米 流量：立方米每秒 总记录数：" + database.data.length + "</span></div></div>";
                    intervaltimeRiverHtml += '<div class="tablediv"><table id="riverRaintable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervaltimeRiverHtml += '<thead>' +
                        '<tr>' +
                        // '<th>序号</th>' +
                        '<th>测站编码</th>' +
                        '<th>测站名称</th>' +
                        '<th>时间</th>' +
                        '<th>统计时段标志</th>' +
                        '<th>行政区域</th>' +
                        '<th>水系</th>' +
                        '<th>河流</th>' +
                        '<th>最大流量发生时间</th>' +
                        '<th>最大流量</th>' +
                        '<th>最流量发生时间</th>' +
                        '<th>最小流量</th>' +
                        '</tr>' +
                        '</thead><tbody>';
                    if (database.data.length > 0) {
                        var ttall = [];
                        for (var i = 0; i < country.length; i++) {
                            var tt = $.grep(database.data, function (d) {
                                return d.Name == country[i]
                            });
                            for (var a = 0; a < tt.length; a++) {
                                ttall.push(tt[a]);
                            }
                        }
                        $.each(ttall, function (key, obj) {
                            intervaltimeRiverHtml += '<tr>' +
                                // '<td>' + (key + 1) + '</td>' +
                                '<td>' + obj.STCD + '</td>' +
                                '<td>' + obj.STNM + '</td>' +
                                '<td>' + timestampToTime(obj.IDTM.time) + '</td>' +
                                '<td>' + timeLength0(obj.STTDRCD) + '</td>' +
                                '<td>' + obj.Name + '</td>' +
                                '<td>' + obj.HNNM + '</td>' +
                                '<td>' + obj.RVNM + '</td>' +
                                '<td>' + timestampToTime(obj.MXQTM.time) + '</td>' +
                                '<td>' + formatFlow(JSON.stringify(obj.MXQ) == null ? "" : obj.MXQ) + '</td>' +
                                '<td>' + timestampToTime(obj.MNQTM.time) + '</td>' +
                                '<td>' + formatFlow(obj.MNQ == null ? "" : obj.MNQ) + '</td>' +
                                '</tr>';
                        });
                    } else {
                        intervaltimeRiverHtml += '<tr>' +
                            '<td colspan="11">无数据</td>' +
                            '</tr>';
                    }
                    intervaltimeRiverHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                    $("#river0").html(intervaltimeRiverHtml);
                    $("#river .load-wrapp").addClass("hidden");
                } else {
                    layer.msg(database.message, { time: 3000 });
                    $("#river .load-wrapp").addClass("hidden");
                }
            })
        } else {
            layer.msg("输入时间格式有误")
        }
    } else {
        layer.msg("请选择日期和站点")
    }

}

// 水库特征加载数据
function queryReservoirrain() {
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        //console.log(powers);
    } else if ($(".tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        //alert("dd");
        //console.log(powers);
    }
    if ($("#start-time input").val() !== "" && $("#end-time input").val() !== "" && powers.length !== 0) {
        if (timeValidcheck($("#start-time input").val().split(" ")[0]) && timeValidcheck($("#end-time input").val().split(" ")[0])) {
            $("#reservoir .load-wrapp").removeClass("hidden");

            var obj = {
                Type: 'get',
                Uri: '/aControl/RsvrControl/rsvrWaterAnalysis',
                Parameter: {
                    "waterInfo.stcd": powers.join(","),
                    // "waterInfo.stcd": "41101300",
                    // "waterInfo.startTm": "2017-10-01 12:12:12",
                    // "waterInfo.endTm": "2017-10-10 12:12:12"
                    "waterInfo.startTm": $("#start-time input").val() + ":00",
                    "waterInfo.endTm": $("#end-time input").val() + ":59"
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
            }).done(function (database) {
                if (database.success) {
                    //console.log(database);
                    // var reservoir_table = $('#reservoir table').DataTable({
                    //     language: reportLanguage,
                    //     aaData: database.data,
                    //     "iDisplayLength": 15,
                    //     lengthChange: false,
                    //     ordering: false,
                    //     searching: false,
                    //     bDestroy: true,
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
                    //         { "data": "name" },
                    //         { "data": "bsnm" },
                    //         { "data": "hnnm" },
                    //         { "data": "rvnm" },
                    //         { "data": "maxz" },
                    //         { "data": "minz" }
                    //     ]
                    // });
                    // // table = $('#time_table').DataTable({
                    // //     aaData: database.data,
                    // //     lengthChange: false,
                    // //     "iDisplayLength": 15,
                    // //     searching: false,
                    // //     bDestroy: true,
                    // //     language: reportLanguage,
                    // //     ordering: false,
                    // //     columns: [
                    // //         {
                    // //             "data": null,
                    // //             "render": function (data, type, row, meta) {
                    // //                 var startIndex = meta.settings._iDisplayStart;
                    // //                 return meta.row + 1;
                    // //             }
                    // //         },
                    // //         { "data": "stcd" },
                    // //         { "data": "stnm" },
                    // //         { "data": "addvnm" },
                    // //         { "data": "bsnm" },
                    // //         { "data": "hnnm" },
                    // //         { "data": "rvnm" },
                    // //         { "data": "drp" },
                    // //         { "data": "top1" },
                    // //         { "data": "top2" },
                    // //         { "data": "top3" }
                    // //     ],
                    // //     // columnDefs: [
                    // //     //     {
                    // //     //         targets: 9,
                    // //     //         render: function (data, type, row, meta) {
                    // //     //             var source = JSON.stringify(row).replace(/\"/g, "'");
                    // //     //             return '<button type="button" class="btn btn-xs set" onclick="setStation(' + source + ')"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button><button type="button" class="btn btn-xs btn-del" onclick="delete0(' + source + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                    // //     //         }
                    // //     //     }
                    // //     // ],
                    // //
                    // // });
                    //
                    // $('#year_table tbody').off().on('click', 'td.details-control', function () {
                    //     var tr = $(this).closest('tr');
                    //     var row = year_table.row(tr);
                    //     if (row.child.isShown()) {
                    //         // This row is already open - close it
                    //         row.child.hide();
                    //         tr.removeClass('shown');
                    //     }
                    //     else {
                    //         // Open this row
                    //         row.child(format(row.data(), "year")).show();
                    //         tr.addClass('shown');
                    //     }
                    // });
                    var intervaltimeReservoirHtml = "<div class='tabletitle'>水库特征值</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#start-time input").val() + " 至 " + $("#end-time input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>水位：米 流量：立方米每秒 总记录数：" + database.data.length + "</span></div></div>";
                    intervaltimeReservoirHtml += '<div class="tablediv"><table id="reRaintable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervaltimeReservoirHtml += '<thead>' +
                        '<tr>' +
                        // '<th>序号</th>' +
                        '<th>测站编码</th>' +
                        '<th>测站名称</th>' +
                        '<th>时间</th>' +
                        '<th>统计时段标志</th>' +
                        '<th>行政区域</th>' +
                        '<th>水系</th>' +
                        '<th>河流</th>' +
                        '<th>最高水位</th>' +
                        '<th>最低水位</th>' +
                        '<th>最大入库流量</th>' +
                        '<th>最小入库流量</th>' +
                        '<th>最大出库流量</th>' +
                        '<th>最小出库流量</th>' +
                        '</tr>' +
                        '</thead><tbody>';
                    if (database.data.length > 0) {
                        var ttall = [];
                        for (var i = 0; i < country.length; i++) {
                            var tt = $.grep(database.data, function (d) {
                                return d.Name == country[i]
                            });
                            for (var a = 0; a < tt.length; a++) {
                                ttall.push(tt[a]);
                            }
                        }
                        $.each(ttall, function (key, obj) {
                            intervaltimeReservoirHtml += '<tr>' +
                                // '<td>' + (key + 1) + '</td>' +
                                '<td>' + obj.STCD + '</td>' +
                                '<td>' + obj.STNM + '</td>' +
                                '<td>' + obj.IDTM.time + '</td>' +
                                '<td>' + obj.STTDRCD + '</td>' +
                                '<td>' + obj.Name + '</td>' +
                                '<td>' + obj.HNNM + '</td>' +
                                '<td>' + obj.RVNM + '</td>' +
                                '<td>' + waterLevelData(obj.HTRZ == null ? "" : obj.HTRZ) + '</td>' +
                                '<td>' + waterLevelData(obj.LTRZ == null ? "" : obj.LTRZ) + '</td>' +
                                '<td>' + waterLevelData(obj.MXINQ == null ? "" : obj.MXINQ) + '</td>' +
                                '<td>' + waterLevelData(obj.MINQ == null ? "" : obj.MINQ) + '</td>' +
                                '<td>' + waterLevelData(obj.MXOTQ == null ? "" : obj.MXOTQ) + '</td>' +
                                '<td>' + waterLevelData(obj.MNOTQ == null ? "" : obj.MNOTQ) + '</td>' +
                                '</tr>';
                        });
                    } else {
                        intervaltimeReservoirHtml += '<tr>' +
                            '<td colspan="14">无数据</td>' +
                            '</tr>';
                    }
                    intervaltimeReservoirHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">' + tablemaker + '</div></div>';
                    $("#reservoir0").html(intervaltimeReservoirHtml);
                    $("#reservoir .load-wrapp").addClass("hidden");
                } else {
                    layer.msg(database.message, { time: 3000 });
                    $("#reservoir .load-wrapp").addClass("hidden");
                }
            })
        } else {
            layer.msg("输入时间格式有误")
        }
    } else {
        layer.msg("时间和站点不能为空")
    }

}

//导出表格
var aclick = function (aa) {
    var jst = [$(".btime").eq(0).text(), $(".btime").eq(1).text()];
    var total = [$(".total").eq(0).text(), $(".total").eq(1).text()];
    var time = [$(".maketabtime").eq(0).text(), $(".maketabtime").eq(1).text()];
    var company = [$(".maketabcom").eq(0).text(), $(".maketabcom").eq(1).text()];
    // alert(jst+total);
    if (params.type == "river") {
        if ($('#riverRaintable tr:last').find('td').text() !== "无数据") {
            $(aa).attr("download", "河道特征值水情表.xls");
            exportExcel(aa, 'riverRaintable', "河道特征值水情表", jst[0], total[0], time[0], company[0], 1)
        } else {
            alert("无数据无法导出");
            $(aa).removeAttr("download");
        }
    } else if (params.type == "reservoir") {
        if ($('#reRaintable tr:last').find('td').text() !== "无数据") {
            $(aa).attr("download", "水库特征值水情表.xls");
            exportExcel(aa, 'reRaintable', "水库特征值水情表", jst[1], total[1], time[1], company[1], 1)
        } else {
            alert("无数据无法导出");
            $(aa).removeAttr("download");
        }
    }
}
