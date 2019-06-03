var params = {
    type: "1h",
    time: "",
    timeArea: ""
};
var table, zTree, nodes, searchNodes, powers;

var time_1h_data = [
    {
        "id": 1,
        "code": "5A81921110",
        "name": "渭河测站1",
        "areaName": "武功县",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "59.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "1h", "rainfall": "12.3" },
            { "id": "2", "timeType": "2h", "rainfall": "13.1" },
            { "id": "3", "timeType": "3h", "rainfall": "14.5" },
            { "id": "4", "timeType": "4h", "rainfall": "11.2" },
            { "id": "5", "timeType": "5h", "rainfall": "8" },
            { "id": "...", "timeType": "...", "rainfall": "..." }
        ]
    }, {
        "id": 2,
        "code": "5A81921110",
        "name": "渭河测站2",
        "areaName": "兴平市",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "69.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "1h", "rainfall": "12.3" },
            { "id": "2", "timeType": "2h", "rainfall": "13.1" },
            { "id": "3", "timeType": "3h", "rainfall": "14.5" },
            { "id": "4", "timeType": "4h", "rainfall": "11.2" },
            { "id": "5", "timeType": "5h", "rainfall": "8" },
            { "id": "...", "timeType": "...", "rainfall": "..." }
        ]
    }, {
        "id": 3,
        "code": "5A81921110",
        "name": "渭河测站3",
        "areaName": "渭城区",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "42.5",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "1h", "rainfall": "12.3" },
            { "id": "2", "timeType": "2h", "rainfall": "13.1" },
            { "id": "3", "timeType": "3h", "rainfall": "14.5" },
            { "id": "4", "timeType": "4h", "rainfall": "11.2" },
            { "id": "5", "timeType": "5h", "rainfall": "8" },
            { "id": "...", "timeType": "...", "rainfall": "..." }
        ]
    }
];

var time_3h_data = [
    {
        "id": 1,
        "code": "5A81921110",
        "name": "渭河测站1",
        "areaName": "武功县",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "59.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "3h", "rainfall": "12.3" },
            { "id": "2", "timeType": "6h", "rainfall": "13.1" },
            { "id": "3", "timeType": "9h", "rainfall": "14.5" },
            { "id": "4", "timeType": "12h", "rainfall": "11.2" },
            { "id": "5", "timeType": "15h", "rainfall": "8" },
            { "id": "...", "timeType": "...", "rainfall": "..." }
        ]
    }, {
        "id": 2,
        "code": "5A81921110",
        "name": "渭河测站2",
        "areaName": "兴平市",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "69.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "3h", "rainfall": "12.3" },
            { "id": "2", "timeType": "6h", "rainfall": "13.1" },
            { "id": "3", "timeType": "9h", "rainfall": "14.5" },
            { "id": "4", "timeType": "12h", "rainfall": "11.2" },
            { "id": "5", "timeType": "15h", "rainfall": "8" },
            { "id": "...", "timeType": "...", "rainfall": "..." }
        ]
    }, {
        "id": 3,
        "code": "5A81921110",
        "name": "渭河测站3",
        "areaName": "渭城区",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "42.5",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "3h", "rainfall": "12.3" },
            { "id": "2", "timeType": "6h", "rainfall": "13.1" },
            { "id": "3", "timeType": "9h", "rainfall": "14.5" },
            { "id": "4", "timeType": "12h", "rainfall": "11.2" },
            { "id": "5", "timeType": "15h", "rainfall": "8" },
            { "id": "...", "timeType": "...", "rainfall": "..." }
        ]
    }
];

var time_6h_data = [
    {
        "id": 1,
        "code": "5A81921110",
        "name": "渭河测站1",
        "areaName": "武功县",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "59.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "6h", "rainfall": "12.3" },
            { "id": "2", "timeType": "12h", "rainfall": "13.1" },
            { "id": "3", "timeType": "18h", "rainfall": "14.5" },
            { "id": "4", "timeType": "24h", "rainfall": "11.2" }
        ]
    }, {
        "id": 2,
        "code": "5A81921110",
        "name": "渭河测站2",
        "areaName": "兴平市",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "69.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "6h", "rainfall": "12.3" },
            { "id": "2", "timeType": "12h", "rainfall": "13.1" },
            { "id": "3", "timeType": "18h", "rainfall": "14.5" },
            { "id": "4", "timeType": "24h", "rainfall": "11.2" }
        ]
    }, {
        "id": 3,
        "code": "5A81921110",
        "name": "渭河测站3",
        "areaName": "渭城区",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "42.5",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "6h", "rainfall": "12.3" },
            { "id": "2", "timeType": "12h", "rainfall": "13.1" },
            { "id": "3", "timeType": "18h", "rainfall": "14.5" },
            { "id": "4", "timeType": "24h", "rainfall": "11.2" }
        ]
    }
];

var time_12h_data = [
    {
        "id": 1,
        "code": "5A81921110",
        "name": "渭河测站1",
        "areaName": "武功县",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "59.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "12h", "rainfall": "12.3" },
            { "id": "2", "timeType": "24h", "rainfall": "13.1" }
        ]
    }, {
        "id": 2,
        "code": "5A81921110",
        "name": "渭河测站2",
        "areaName": "兴平市",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "69.1",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "12h", "rainfall": "12.3" },
            { "id": "2", "timeType": "24h", "rainfall": "13.1" }
        ]
    }, {
        "id": 3,
        "code": "5A81921110",
        "name": "渭河测站3",
        "areaName": "渭城区",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "42.5",
        "top1": "60",
        "top2": "59.1",
        "top3": "58.1",
        "content": [
            { "id": "1", "timeType": "12h", "rainfall": "12.3" },
            { "id": "2", "timeType": "24h", "rainfall": "13.1" }
        ]
    }
];

//时间格式
function format(d) {
    var table_child_content = '';
    $.each(d.content, function (key, obj) {
        table_child_content = table_child_content +
            '<tr><td>' +
            obj.id +
            '</td><td>' +
            obj.timeType +
            '</td><td>' +
            obj.rainfall +
            '</td></tr>';
    });
    return '<table class="table table-bordered table-hover table_child" style="width: 30%;" cellpadding="5" cellspacing="0" border="0">' +
        ' <thead><tr><th>序号</th><th>时间类型</th><th>雨量（mm）</th></tr></thead>' +
        table_child_content +
        '</table>';
}

$(function () {
    //初始化ajax
    init();
    //初始化树形插件
    initTreedata(1);
    //初始化测站编码
    initCode(1);
    //日期选择
    $("#chose-date").on("change", function () {
        //alert($(this).val())
        params.type = $(this).val();
    });
    //下拉框combox
    $("select").select2();
    //监测站点触发筛选数据
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    //报汛等级触发筛选数据
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
    //测站类型触发筛选数据
    var selecthtml = '<option value="">全部</option><option value="PP">雨量站</option><option value="ZQ">河道水文站</option>';
    $("#cztp").html(selecthtml);
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    //初始化时间控件
    $("#s-time,#e-time").datetimepicker({
        format: "yyyy-mm-dd hh:ii",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 0,
        forceParse: 0,
        pickerPosition: "bottom-right",
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
    timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
    timeupdatevalue.setHours(8, 0);
    timeupdatevalue2.setHours(8, 0);
    $("#s-time").datetimepicker('update', timeupdatevalue);
    $("#e-time").datetimepicker('update', timeupdatevalue2);
//初始化表格
    queryTimerain();
//表格点击时间
//     $('#time_table tbody').on('click', 'td.details-control', function () {
//         var tr = $(this).closest('tr');
//         var row = table.row(tr);
//         if (row.child.isShown()) {
//             // This row is already open - close it
//             row.child.hide();
//             tr.removeClass('shown');
//         }
//         else {
//             // Open this row
//             row.child(format(row.data())).show();
//             tr.addClass('shown');
//         }
//     });
//统计按钮
    $("#tongji").on("click", function () {
        params.time = $("#time").val();
        //alert(JSON.stringify(params))
        // $(".rightTab h4 span").text(params.type);
        if (params.type === "1h") {
            //一小时
            // $('#time_table').dataTable().fnClearTable();
            // $('#time_table').dataTable().fnAddData(time_1h_data);
            queryTimerain("1")
        }
        else if (params.type === "3h") {
            //三小时
            // $('#time_table').dataTable().fnClearTable();
            // $('#time_table').dataTable().fnAddData(time_3h_data);
            queryTimerain("3")
        }
        else if (params.type === "6h") {
            //6小时
            // $('#time_table').dataTable().fnClearTable();
            // $('#time_table').dataTable().fnAddData(time_6h_data);
            queryTimerain("6")
        }
        else if (params.type === "12h") {
            //12小时
            // $('#time_table').dataTable().fnClearTable();
            // $('#time_table').dataTable().fnAddData(time_12h_data);
            queryTimerain("12")
        }
    });


    // $("#searchAction").click(function () {
    //     zTree = $.fn.zTree.getZTreeObj("treeDemoCity");
    //     nodes = zTree.getNodes();
    //     zTree.cancelSelectedNode();
    //     if ($("#searchTxt").val() != "") {
    //         searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt").val(), null);
    //         if (searchNodes != null && searchNodes != undefined) {
    //             for (var i = 0; i < searchNodes.length; i++) {
    //                 zTree.selectNode(searchNodes[i], true, false);
    //             }
    //         }
    //     }
    // });
    //
    // $("#searchAction1").click(function () {
    //     zTree = $.fn.zTree.getZTreeObj("treeDemoRiver");
    //     nodes = zTree.getNodes();
    //     zTree.cancelSelectedNode();
    //     if ($("#searchTxt1").val() != "") {
    //         searchNodes = zTree.getNodesByParamFuzzy("name", $("#searchTxt1").val(), null);
    //         if (searchNodes != null && searchNodes != undefined) {
    //             for (var i = 0; i < searchNodes.length; i++) {
    //                 zTree.selectNode(searchNodes[i], true, false);
    //             }
    //         }
    //     }
    // });
});

// function keydownSearch() {
//     $("#searchAction").click();
// };
//
// function keydownSearch1() {
//     $("#searchAction1").click();
// };
//
// function initTree() {
//     var setting = {
//         check: {
//             enable: true,
//             chkboxType: { "Y": "ps", "N": "ps" }
//             //chkboxType: { "Y": "ps", "N": "ps" },
//         },
//         data: {
//             simpleData: {
//                 enable: true,
//                 idKey: "id", // id编号命名
//                 pIdKey: "pId", // 父id编号命名
//                 rootPId: 0
//             }
//         },
//         view: {
//             showIcon: true
//         }
//     };
//     $.fn.zTree.init($("#treeDemoCity"), setting, JSON.parse(localStorage.getItem("treearea")));
//     $.fn.zTree.init($("#treeDemoRiver"), setting, JSON.parse(localStorage.getItem("treeriver")));
//     var treeObj = $.fn.zTree.getZTreeObj("treeDemoCity");
//     treeObj.expandAll(true);
//     var treeObjr = $.fn.zTree.getZTreeObj("treeDemoRiver");
//     treeObjr.expandAll(true);
// }
//

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

function queryTimerain(tt) {
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        //console.log(powers);
    } else if ($(".tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        //console.log(powers);
    }
    if ($("#s-time").val() !== "" && $("#e-time").val() !== "" && powers.length !== 0) {
        if (timeValidcheck($("#s-time").val().split(" ")[0]) && timeValidcheck($("#e-time").val().split(" ")[0])) {
            $(".rightTab .load-wrapp").removeClass("hidden");
            var obj = {
                Type: 'get',
                Uri: '/aControl/RainCountControl/hdCountRainInfo',
                Parameter: {
                    "rainCount.stcd": powers.join(","),
                    // "rainCount.stcd": "41134602",
                    "rainCount.startTm": $("#s-time").val() + ":00",
                    "rainCount.endTm": $("#e-time").val() + ":00",
                    "rainCount.step": tt ? tt : "1"
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
                    console.log(database);
                    // table = $('#time_table').DataTable({
                    //     aaData: database.data,
                    //     lengthChange: false,
                    //     "iDisplayLength": 15,
                    //     searching: false,
                    //     bDestroy: true,
                    //     language: reportLanguage,
                    //     ordering: false,
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
                    //         { "data": "hnnm" },
                    //         { "data": "rvnm" },
                    //         { "data": "drp" },
                    //         { "data": "top1" },
                    //         { "data": "top2" },
                    //         { "data": "top3" }
                    //     ],
                    //     // columnDefs: [
                    //     //     {
                    //     //         targets: 9,
                    //     //         render: function (data, type, row, meta) {
                    //     //             var source = JSON.stringify(row).replace(/\"/g, "'");
                    //     //             return '<button type="button" class="btn btn-xs set" onclick="setStation(' + source + ')"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button><button type="button" class="btn btn-xs btn-del" onclick="delete0(' + source + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                    //     //         }
                    //     //     }
                    //     // ],
                    //
                    // });
                    var intervaltimeRlHtml = "<div class='tabletitle'>" + params.type + "降雨量统计表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-time").val() + " 至 " + $("#e-time").val() + "</div>" +
                        "<div class='bunits'><span class='total'>降雨量：毫米 总记录数：" + database.data.length + "</span></div></div>";
                    intervaltimeRlHtml += '<div class="tablediv"><table id="timeRaintable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervaltimeRlHtml += '<thead>' +
                        '<tr>' +
                        // '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编码</th>' +
                        '<th rowspan="2">测站名称</th>' +
                        '<th rowspan="2">行政区域</th>' +
                        '<th rowspan="2">水系</th>' +
                        '<th rowspan="2">河流</th>' +
                        '<th rowspan="2">累计降雨量</th>' +
                        '<th colspan="3">时段统计值</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th rowspan="1">最大</th>' +
                        '<th rowspan="1">次大</th>' +
                        '<th rowspan="1">第三</th>' +
                        '</tr>' +
                        '</thead><tbody>';
                    if (database.data.length > 0) {
                        $.each(sortName(database.data), function (key, obj) {
                            var topArray = [];
                            $.each(obj.stationList, function (listKey, listObj) {
                                if (topArray.indexOf(listObj.drp) == -1) {
                                    topArray.push(listObj.drp)
                                }
                            });
                            //console.log(topArray);
                            intervaltimeRlHtml += '<tr>' +
                                // '<td>' + (key + 1) + '</td>' +
                                '<td>' + obj.stcd + '</td>' +
                                '<td>' + obj.stnm + '</td>' +
                                '<td>' + obj.addvnm + '</td>' +
                                '<td>' + obj.hnnm + '</td>' +
                                '<td>' + obj.rvnm + '</td>' +
                                '<td>' + rainData(obj.drp) + '</td>';
                            if (topArray.length >= 3) {
                                intervaltimeRlHtml += '<td>' + rainData(topArray[0]) + '</td>' +
                                    '<td>' + rainData(topArray[1]) + '</td>' +
                                    '<td>' + rainData(topArray[2]) + '</td>';
                            } else {
                                if (obj.stationList.length >= 3) {
                                    intervaltimeRlHtml += '<td>' + rainData(obj.stationList[0].drp) + '</td>' +
                                        '<td>' + rainData(obj.stationList[1].drp) + '</td>' +
                                        '<td>' + rainData(obj.stationList[2].drp) + '</td>';
                                } else if (obj.stationList.length == 2) {
                                    intervaltimeRlHtml += '<td>' + rainData(obj.stationList[0].drp) + '</td>' +
                                        '<td>' + rainData(obj.stationList[1].drp) + '</td>' +
                                        '<td></td>';
                                }
                                else if (obj.stationList.length == 1) {
                                    intervaltimeRlHtml += '<td>' + rainData(obj.stationList[0].drp) + '</td>' +
                                        '<td></td>' +
                                        '<td></td>';
                                } else {
                                    intervaltimeRlHtml += '<td></td>' +
                                        '<td></td>' +
                                        '<td></td>';
                                }
                            }
                            intervaltimeRlHtml += '</tr>';
                        });
                    } else {
                        intervaltimeRlHtml += '<tr>' +
                            '<td colspan="9">无数据</td>' +
                            '</tr>';
                    }
                    intervaltimeRlHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                    $("#timeRain").html(intervaltimeRlHtml);
                    $(".rightTab .load-wrapp").addClass("hidden");
                } else {
                    layer.msg(database.message, { time: 3000 });
                    $(".rightTab .load-wrapp").addClass("hidden");
                }
            })
        } else {
            layer.msg("时间输入格式有误");
        }
    } else {
        layer.msg("时间选项和站点选项不能同时为空")
    }

}

//导出表格
var aclick = function (aa) {
    if ($('#timeRaintable tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var title = $(".tabletitle").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "时段降雨量表.xls");
        //alert(params.querytp+jst+total);
        exportExcel(aa, 'timeRaintable', title, jst, total, time, company, 2)
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}

