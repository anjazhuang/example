var params = {
    type: "旬月",
    start: "",
    end: ""
}


var date_data = [
    {
        "id": 1,
        "code": "5A81921110",
        "name": "渭河测站1",
        "areaName": "武功县",
        "bs": "渭河",
        "hnmm": "渭河",
        "rn": "渭河",
        "rainfallCount": "59.1",
        "content": [
            { "id": "1", "date": "2017年1月1日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "2", "date": "2017年1月2日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "3", "date": "2017年1月3日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "4", "date": "2017年1月4日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "5", "date": "2017年1月5日", "rainfall": "12.3", "rate": "12.3" }
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
        "content": [
            { "id": "1", "date": "2017年1月1日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "2", "date": "2017年1月2日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "3", "date": "2017年1月3日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "4", "date": "2017年1月4日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "5", "date": "2017年1月5日", "rainfall": "12.3", "rate": "12.3" }
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
        "content": [
            { "id": "1", "date": "2017年1月1日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "2", "date": "2017年1月2日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "3", "date": "2017年1月3日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "4", "date": "2017年1月4日", "rainfall": "12.3", "rate": "12.3" },
            { "id": "5", "date": "2017年1月5日", "rainfall": "12.3", "rate": "12.3" }
        ]
    }
];


//时间格式
function format(d, type) {
    var table_child_content = '';
    var stationList = d.stationList.sort(function(a,b){
        return Date.parse(a.tm) - Date.parse(b.tm);//时间正序
        });
    $.each(stationList, function (key, obj) {
        table_child_content = table_child_content +
            '<tr><td>' +
            (key + 1) +
            '</td><td>' +
            obj.tm +
            '</td><td>' +
            obj.drp +
            '</td>';
    });
    return '<table class="table table-bordered table-hover table_child" style="width: 40%;" cellpadding="5" cellspacing="0" border="0">' +
        ' <thead><tr><th>序号</th><th>日期</th><th>日累计雨量（mm）</th></tr></thead>' +
        table_child_content +
        '</table>';

}

var date_table;
$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata();
    //初始化站点编码数据
    initCode();

    //统计类型

    //选择框combox
    $("select").select2();
    //监测站点combox触发筛选站点
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    //报汛等级combox触发筛选站点
    $("#bxlevel").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata($("#stcode").val(), evt.params.data.id, $("#cztp").val())
    });
    //测站类型combox触发筛选站点
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata($("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    //初始化年份时间控件
    $(".start,.end").datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        todayBtn: true,
        todayHighlight: 1,
        startView: 4, //这里就设置了默认视图为年视图
        minView: 2, //设置最小视图为年视图
        forceParse: 0,
        pickerPosition: "top-left",
        endDate: new Date()
    });
    var tt = new Date();
    tt.setDate(tt.getDate() + 1);
    $(".start").datetimepicker("update", new Date());
    $(".end").datetimepicker("update", tt);

    //初始化表格数据
    queryDaterain();
    //统计
    $("#tongji").off().on("click", function () {
        //统计年份
        queryDaterain();
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
})

function fill(d) {
    return d < 10 ? '0' + d : d.toString();
};

// function keydownSearch() {
//     $("#searchAction").click();
// };
//
// function keydownSearch1() {
//     $("#searchAction1").click();
// };

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

function queryDaterain() {
    $(".rightTab .load-wrapp").removeClass("hidden");
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        console.log(powers);
    } else if ($(".tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        console.log(powers);
    }
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainCountControl/loadCountByStep',
        Parameter: {
            "rainCount.stcd": powers.join(","),
            //"rainCount.stcd": "41233910,41233890",
            "rainCount.startTm": $(".start").val() + " 08:00:00",
            "rainCount.endTm": $(".end").val() + " 08:00:00",
            // "rainCount.startTm": "2017-09-30 12:12:12",
            // "rainCount.endTm": "2017-10-01 12:12:12",
            "rainCount.step": "1440"
        }
    };
    //alert($(".start").val() + " 00:00:00");
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj),
        beforeSend: function (request) {
            // var loading = layer.load(2, {
            //     shade: [0.5, '#fff']
            // });
        }
    }).done(function (data) {
        //console.log(data.data);
        if (data.success) {
            date_table = $('#date_table').DataTable({
                language: reportLanguage,
                aaData: data.data,
                bDestroy: true,
                "iDisplayLength": 15,
                lengthChange: false,
                ordering: false,
                searching: false,
                columns: [
                    {
                        "class": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    {
                        "data": null,
                        "render": function (data, type, row, meta) {
                            var startIndex = meta.settings._iDisplayStart;
                            return meta.row + 1;
                        }
                    },
                    { "data": "stcd" },
                    { "data": "stnm" },
                    { "data": "addvnm" },
                    { "data": "bsnm" },
                    { "data": "hnnm" },
                    { "data": "rvnm" },
                    { "data": "drp" }
                ]
            });
            $(".rightTab .load-wrapp").addClass("hidden");
        } else {
            layer.msg(data.message, { time: 3000 });
            $(".rightTab .load-wrapp").addClass("hidden");
        }
        $('#date_table tbody').off().on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = date_table.row(tr);
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child(format(row.data(), "date")).show();
                tr.addClass('shown');
            }
        });

    })
    // table = $('#time_table').DataTable({
    //     language: reportLanguage,
    //     scrollX: true,
    //     scrollCollapse: true,
    //     lengthChange: false,
    //     ordering: false,
    //     serverSide: true,
    //     searching: false,
    //     bDestroy: true,
    //     iDisplayLength: 15,
    //     columns: [
    //         { "data": null, "targets": 0 },
    //         { "data": "stcd" },
    //         { "data": "name" },
    //         { "data": "addvnm" },
    //         { "data": "bsnm" },
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
    //     ajax: function (data, callback, settings) {
    //         //封装请求参数
    //         //console.log(param);
    //         //ajax请求数据
    //         var obj = {
    //             Type: 'get',
    //             Uri: '/aControl/RainCountControl/loadCountDataByStep',
    //             Parameter: {
    //                 // "waterInfo.stcd": powers.join(","),
    //                 "rainCount.stcd": powers.join(","),
    //                 "rainCount.startTm": $("#s-time").val(),
    //                 "rainCount.endTm": $("#e-time").val(),
    //                 "rainCount.step": tt ? tt : "60"
    //             }
    //         };
    //         $.ajax({
    //             url: serverConfig.rainfallfloodApi,
    //             data: JSON.stringify(obj),
    //             beforeSend: function (request) {
    //                 // var loading = layer.load(2, {
    //                 //     shade: [0.5, '#fff']
    //                 // });
    //             }
    //         }).done(function (database) {
    //             if (database.success) {
    //                 console.log(database.data);
    //                 setTimeout(function () {
    //                     //封装返回数据
    //                     var result = database.data;
    //                     //console.log(result);
    //                     var returnData = {};
    //                     returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
    //                     returnData.recordsTotal = result.total;//返回数据全部记录
    //                     returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
    //                     returnData.data = result.data;//返回的数据列表
    //                     //console.log(returnData);
    //                     //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
    //                     //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
    //                     callback(returnData);
    //                 }, 50);
    //                 $(".rightTab .load-wrapp").addClass("hidden");
    //             } else {
    //                 layer.msg(database.message);
    //             }
    //         });
    //     },
    //     fnDrawCallback: function () { //解决序号列没法生成的问题
    //         var api = this.api();
    //         var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
    //         api.column(0).nodes().each(function (cell, i) {
    //             cell.innerHTML = startIndex + i + 1;
    //         });
    //     }
    // });
}