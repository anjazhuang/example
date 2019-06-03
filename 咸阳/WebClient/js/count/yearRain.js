var params = {
    type: "旬月",
    start: "",
    end: ""
}

var year_data = [
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
            { "id": "1", "date": "2013年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "2", "date": "2014年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "3", "date": "2015年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "4", "date": "2016年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "5", "date": "2017年", "rainfall": "12.3", "rate": "12.3" }
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
            { "id": "1", "date": "2013年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "2", "date": "2014年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "3", "date": "2015年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "4", "date": "2016年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "5", "date": "2017年", "rainfall": "12.3", "rate": "12.3" }
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
            { "id": "1", "date": "2013年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "2", "date": "2014年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "3", "date": "2015年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "4", "date": "2016年", "rainfall": "12.3", "rate": "12.3" },
            { "id": "5", "date": "2017年", "rainfall": "12.3", "rate": "12.3" }
        ]
    }
];

//时间格式
function format(d, type) {
    var table_child_content = '';
    $.each(d.stationList, function (key, obj) {
        table_child_content = table_child_content +
            '<tr><td>' +
            (key + 1) +
            '</td><td>' +
            obj.tm +
            '</td><td>' +
            obj.drp +
            '</td><td>' +
            obj.top2 +
            '</td></tr>';
    });
    return '<table class="table table-bordered table-hover table_child" style="width: 40%;" cellpadding="5" cellspacing="0" border="0">' +
        '<thead><tr><th>序号</th><th>年份</th><th>年累计雨量（mm）</th><th>年距平率（%）</th></tr></thead>' +
        table_child_content +
        '</table>';
}

$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata(1);
    //初始化站点编码数据
    initCode(1);
    //统计类型
    $("#selectType").on("change", function () {
        params.type = $(this).val();
        // alert(params.type);
        if (params.type === "旬月") {
            $("#month").removeClass("hidden");
            $("#year").addClass("hidden");

        } else if (params.type === "年") {
            $("#year").removeClass("hidden");
            $("#month").addClass("hidden");
        }
    });
    //选择框combox
    $("select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    //监测站点combox触发筛选站点
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    //报汛等级combox触发筛选站点
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
    //测站类型combox触发筛选站点
    var selecthtml = '<option value="">全部</option><option value="PP">雨量站</option><option value="ZQ">河道水文站</option>';
    $("#cztp").html(selecthtml);
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(1, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    //初始化年份时间控件

    $(".start,.end").datetimepicker({
        language: 'zh-CN',
        format: 'yyyy',
        weekStart: 1,
        autoclose: true,
        todayBtn: true,
        todayHighlight: 1,
        startView: 4, //这里就设置了默认视图为年视图
        minView: 4, //设置最小视图为年视图
        forceParse: 0,
        pickerPosition: "bottom-right",
        endDate: new Date()
    });
    var tt = new Date();
    tt.setFullYear(tt.getFullYear() + 1);
    $(".start").datetimepicker("update", new Date());
    $(".end").datetimepicker("update", tt);

    queryYearrain();
    //表格点击事件

    //统计
    $("#tongji").off().on("click", function () {
        //统计年份
        queryYearrain()
    });

})

function fill(d) {
    return d < 10 ? '0' + d : d.toString();
};


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

// 雨量统计表加载数据
function queryYearrain() {
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        //console.log(powers);
    } else if ($(".tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        //console.log(powers);
    }
    if ($(".start").val() !== "" && powers.length !== 0) {
        $(".rightTab .load-wrapp").removeClass("hidden");
        var obj = {
            Type: 'get',
            Uri: '/aControl/RainCountControl/countMRainInfo',
            Parameter: {
                "rainCount.stcd": powers.join(","),
                //"rainCount.stcd": "41233910,41233890",
                // "rainCount.startTm": "2017",
                // "rainCount.endTm": "2018"
                "rainCount.startTm": $(".start").val(),
                "rainCount.endTm": (parseInt($(".start").val()) + 1).toString()
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
                // var year_table = $('#year_table').DataTable({
                //     language: reportLanguage,
                //     aaData: database.data,
                //     bDestroy: true,
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
                //         { "data": "top1" }
                //     ]
                // });
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
                //
                // });
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
                if (database.data !== null) {
                    var intervaltimeYHtml = "<div class='tabletitle'> 降雨量距平分析表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-time").val() + "年 至 " + (parseInt($(".start").val()) + 1).toString() + "年</div>" +
                        "<div class='bunits'><span class='total'>降雨量：毫米  总记录数：" + database.data.length + "</span></div></div>";
                    intervaltimeYHtml += '<div class="tablediv"><table id="yearRaintable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervaltimeYHtml += '<thead>' +
                        '<tr>' +
                        // '<th>序号</th>' +
                        '<th style="width: 12.5%">测站编码</th>' +
                        '<th style="width: 12.5%">测站名称</th>' +
                        '<th style="width: 12.5%">行政区域</th>' +
                        '<th style="width: 12.5%">水系</th>' +
                        '<th style="width: 12.5%">河流</th>' +
                        '<th style="width: 12.5%">累计降雨量</th>' +
                        '<th style="width: 12.5%">多年平均值</th>' +
                        '<th style="width: 12.5%">年距平率</th>' +
                        '</tr>' +
                        '</thead><tbody>';
                    if (database.data.length > 0) {
                        $.each(sortName(database.data), function (key, obj) {
                            intervaltimeYHtml += '<tr>' +
                                // '<td>' + (key + 1) + '</td>' +
                                '<td>' + obj.stcd + '</td>' +
                                '<td>' + obj.stnm + '</td>' +
                                '<td>' + obj.addvnm + '</td>' +
                                '<td>' + obj.hnnm + '</td>' +
                                '<td>' + obj.rvnm + '</td>' +
                                '<td>' + rainData(obj.drp) + '</td>' +
                                '<td>' + rainData(obj.top1) + '</td>' +
                                '<td>' + YearRainPercent(obj.top2) + '</td>';
                        });
                    } else {
                        intervaltimeYHtml += '<tr>' +
                            '<td colspan="8">无数据</td>' +
                            '</tr>';
                    }
                    intervaltimeYHtml += '</tbody></table></div><div class="bottomRemark"> <div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                    $("#yearRain").html(intervaltimeYHtml);
                    $(".rightTab .load-wrapp").addClass("hidden");
                } else {
                    layer.msg(database.message, { time: 3000 });
                    $(".rightTab .load-wrapp").addClass("hidden");
                }
            } else {
                layer.msg(database.message, { time: 3000 });
                $(".rightTab .load-wrapp").addClass("hidden");
            }
        })
    } else {
        layer.msg("时间和站点不能为空");
    }
}

//导出表格
var aclick = function (aa) {
    if ($('#yearRaintable tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "降雨量距平分析表.xls");
        //alert(params.querytp+jst+total);
        exportExcel(aa, 'yearRaintable', '降雨量距平分析表', jst, total, time, company, 1)
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}