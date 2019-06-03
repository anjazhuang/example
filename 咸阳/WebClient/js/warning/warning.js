var sttm, edtm, status, type = "";
$(function () {
    //初始化表格
    init();
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
        pickerPosition: "bottom-left",
        endDate: new Date()
    });
    //默认显示当前最新时间
    var timeupdatevalue = new Date();
    timeupdatevalue.setDate(timeupdatevalue.getDate() - 7);
    $("#start-time").datetimepicker("update", timeupdatevalue);
    $("#end-time").datetimepicker("update", new Date());
    $("select").select2();
    setTable();
    //查询按钮功能
    $("#tongji").on("click", function () {
        sttm = $("#start-time input").val();
        edtm = $("#end-time input").val();
        status = $("#Status").find("option:selected").val();
        type = $("#WarningType").find("option:selected").val();
        if (timeValidcheck($("#start-time input").val()) && timeValidcheck($("#end-time input").val())) {
            setTable(status, type, sttm, edtm);
        } else {
            layer.msg("输入时间格式有误")
        }
    })
});

//报警处理弹窗
function waringSeting(data) {
    layer.open({
        type: 1,
        area: ['400px', '420px'], //宽高
        title: '报警处理',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['提交', '关闭'],
        shadeClose: true,
        content: $("#warnform"),
        success: function () {
            //设置弹窗内获取后台的各项数据
            $("#warn_tm").text(data.time);
            $("#warn_cd").text(data.stcd);
            $("#warn_nm").text(data.stnm);
            $("#warn_area").text(data.name);
            //根据后台的代号设置相关测站类型
            $("#warn_solist").text(data.sttp);
            //根据后台的代号设置相关报警类型
            $("#warn_tp").text(function () {
                if (data.type === "WARNING_RAINFALL_1H") {
                    return '超出1h雨量报警界限';
                } else if (data.type === "WARNING_RAINFALL_3H") {
                    return '超出3h雨量报警界限';
                } else if (data.type === "WARNING_RAINFALL_6H") {
                    return '超出6h雨量报警界限';
                } else if (data.type === "WARNING_WATER_LEVEL") {
                    return '超出水位变幅异常值';
                } else if (data.type === "WARNING_SOIL_CONTENT") {
                    return '超出重量含水量安全范围';
                }
            });
            //根据测站类型设置修改异常数据小数位
            if (data.type === "WARNING_RAINFALL" || data.type === "WARNING_WATER_CONTENT") {
                $(".errorset").find("input").attr("step", "0.1")
            } else {
                $(".errorset").find("input").removeAttr("step")
            }
            //初始化异常数据
            $("#warn_data0").text(data.value);
            $("#warn_data1").val(data.value);
        },
        yes: function (index) {
            //获取用户session参数以及修改后的数据
            var user = JSON.parse($.cookie("user"));
            var newdata = $("#warn_data1").val();
            var obj = {
                Type: 'post',
                Uri: '/warning/update',
                Parameter: {
                    id: data.id,
                    processerId: user.Id,
                    processValue: newdata
                }
            };
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj)
            }).done(function (data) {
                if (data.success) {
                    //刷新表格
                    setTable();
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                    layer.msg("提交成功");
                } else {
                    //提示错误信息
                    layer.msg(data.message)
                }
            });
        },
        end: function (index, layero) {
            layer.close(index);//关闭按钮
        }
    })
}

//取消报警弹窗
function offWarning(data) {
    var user = JSON.parse($.cookie("user"));
    layer.confirm('是否取消报警？', {
        btn: ['确定', '取消'] //按钮
    }, function (index) {
        //console.log("yse");
        var obj = {
            Type: 'post',
            Uri: '/warning/cancelWarning',
            Parameter: {
                id: data.id,
                processerId: user.Id
            }
        };
        $.ajax({
            url: serverConfig.operationApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            layer.msg("提交成功");
            layer.close(index);
            setTable();
        });
    }, function (index) {
        layer.close(index);
    })
}


//设置表格
function setTable(status, type, sttm, edtm) {
    //设置表格选项系数
    table = $('#warning_table').DataTable({
        language: reportLanguage,
        scrollX: true,
        scrollCollapse: true,
        lengthChange: false,
        ordering: false,
        serverSide: true,
        searching: false,
        bDestroy: true,
        //设置每页显示15条数据
        // iDisplayLength: 15,
        paging: false,
        //设置表格字段参数
        columns: [
            { "data": null, "targets": 0 },
            { "data": "time" },
            { "data": "stcd" },
            {
                "data": "stnm",
                "render": function (data, type, row, meta) {
                    return data.replace(/[ ]/g, "")
                }
            },
            { "data": "frgrd" },
            {
                "data": "sttp"
            },
            { "data": "name" },
            // { "data": "bsnm" },
            { "data": "hnnm" },
            { "data": "rvnm" },
            {
                "data": "type",
                //根据后台传回的数据转换成报警类型
                render: function (data, type, row, meta) {
                    if (data === "WARNING_RAINFALL_1H") {
                        return '超出1h雨量报警界限';
                    } else if (data === "WARNING_RAINFALL_3H") {
                        return '超出3h雨量报警界限';
                    } else if (data === "WARNING_RAINFALL_6H") {
                        return '超出6h雨量报警界限';
                    } else if (data === "WARNING_WATER_LEVEL") {
                        return '超出水位变幅异常值';
                    } else if (data === "WARNING_SOIL_CONTENT") {
                        return '超出重量含水量安全范围';
                    }
                }
            },
            {
                "data": "status",
                //根据报警类型转换相应状态
                render: function (data, type, row, meta) {
                    if (data === 1) {
                        return '已处理';
                    } else {
                        return '正在报警'
                    }
                }

            },
            { "data": "value" },
            { "data": "processvalue" },
            { "data": "status" }
        ],
        columnDefs: [
            {
                targets: 13,
                //根据报警类型转换相应操作按钮
                render: function (data, type, row, meta) {
                    if (data === 0) {
                        var aa = JSON.stringify(row).replace(/\"/g, "'");
                        if (row.type == "WARNING_RAINFALL_3H" || row.type == "WARNING_RAINFALL_6H") {
                            return '<button type="button" class="btn btn-sm btn-warnning" onclick="offWarning(' + aa + ')">取消报警</button>';
                        } else {
                            return '<button type="button" class="btn btn-sm btn-warnning" onclick="waringSeting(' + aa + ')">报警处理</button>';
                        }
                    } else {
                        return ''
                    }
                }
            }
        ],
        ajax: function (data, callback, settings) {
            var user = JSON.parse($.cookie("user"));
            //封装请求参数
            ////console.log(param);
            //ajax请求数据
            var obj = {
                Type: 'get',
                Uri: '/warning/select',
                Parameter: {
                    Code: user.AreaCode,
                    Status: status ? status : "",
                    Type: type ? type : "",
                    startTime: sttm ? sttm + " 00:00:00" : $("#start-time input").val() + " 00:00:00",
                    endTime: edtm ? edtm + " 23:59:59" : $("#end-time input").val() + " 23:59:59",
                    start: 0,//当前页码
                    length: 999999 //页面显示记录条数，在页面显示每页显示多少项的时候
                }
            };
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj)
            }).done(function (database) {
                if (database.success) {
                    var warnst = $.grep(database.data.data, function (d) {
                        return d.status == 0
                    });
                    if (warnst.length > 0) {
                        $(".content-box").find("#warnsound").remove();
                        $(".content-box").append("<EMBED id='warnsound' src='../../mp3/3742.wav' align='center' border='0' width='0' height='0' loop='false' />")
                    }
                    //console.log(database.data);
                    setTimeout(function () {
                        //封装返回数据
                        var result = database.data;
                        ////console.log(result);
                        var returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.total;//返回数据全部记录
                        returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data;//返回的数据列表
                        ////console.log(returnData);
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                    }, 50);
                } else {
                    layer.msg(database.message);
                }
            });
        },
        fnDrawCallback: function () { //解决序号列没法生成的问题
            var api = this.api();
            var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
            api.column(0).nodes().each(function (cell, i) {
                cell.innerHTML = startIndex + i + 1;
            });
        }
    });
    // var user = JSON.parse($.cookie("user"));
    // var obj = {
    //     Type: 'get',
    //     Uri: '/warning/select',
    //     Parameter: {
    //         Code: user.AreaCode,
    //         Status: status ? status : "",
    //         Type: type ? type : "",
    //         startTime: sttm ? sttm + " 00:00:00" : "",
    //         endTime: edtm ? edtm + " 23:59:59" : "",
    //         start: 1,//当前页码
    //         length: 99999 //页面显示记录条数，在页面显示每页显示多少项的时候
    //     }
    // };
    // $.ajax({
    //     url: serverConfig.operationApi,
    //     data: JSON.stringify(obj)
    // }).done(function (database) {
    //     if (database.success) {
    //         var warnst=$.grep(database.data.data,function (d) {
    //             return d.status == 0
    //         });
    //         if (warnst.length > 0) {
    //             $(".content-box").find("#warnsound").remove();
    //             $(".content-box").append("<EMBED id='warnsound' src='../../mp3/3742.wav' align='center' border='0' width='0' height='0' loop='false' />")
    //         }
    //         var intervaltimeWarningHtml = '<div class="tablediv"><table id="riverRaintable" class="timeRaintable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
    //         intervaltimeWarningHtml += '<thead>' +
    //             '<tr>' +
    //             // '<th>序号</th>' +
    //             '<th>报警时间</th>' +
    //             '<th>测站编码</th>' +
    //             '<th>测站名称</th>' +
    //             '<th>报汛等级</th>' +
    //             '<th>测站类型</th>' +
    //             '<th>行政区域</th>' +
    //             '<th>水系</th>' +
    //             '<th>河流</th>' +
    //             '<th>报警类型</th>' +
    //             '<th>状态</th>' +
    //             '<th>异常数据</th>' +
    //             '<th>更新数据</th>' +
    //             '<th>操作</th>' +
    //             '</tr>' +
    //             '</thead><tbody>';
    //         if (database.data.data.length > 0) {
    //             $.each(database.data.data, function (key, obj) {
    //                 intervaltimeWarningHtml += '<tr>' +
    //                     // '<td>' + (key + 1) + '</td>' +
    //                     '<td>' + obj.time + '</td>' +
    //                     '<td>' + obj.stcd + '</td>' +
    //                     '<td>' + obj.stnm + '</td>' +
    //                     '<td>' + obj.frgrd + '</td>' +
    //                     '<td>' + obj.sttp + '</td>' +
    //                     '<td>' + obj.name + '</td>' +
    //                     '<td>' + obj.hnnm + '</td>' +
    //                     '<td>' + obj.rvnm + '</td>' +
    //                     '<td>' + obj.frgrd + '</td>' +
    //                     '<td>' + obj.status + '</td>' +
    //                     '<td>' + obj.processvalue + '</td>' +
    //                     '<td>' + obj.status + '</td>' +
    //                     '<td><button type="button" class="btn btn-sm btn-warnning" onclick="waringSeting()">报警处理</button></td>' +
    //                     '</tr>';
    //             });
    //         } else {
    //             intervaltimeWarningHtml += '<tr>' +
    //                 '<td colspan="13">无数据</td>' +
    //                 '</tr>';
    //         }
    //         intervaltimeWarningHtml += '</tbody></table></div>';
    //         $("#warnTab").html(intervaltimeWarningHtml);
    //     } else {
    //         layer.msg(database.message, {time: 3000});
    //     }
    // })
}