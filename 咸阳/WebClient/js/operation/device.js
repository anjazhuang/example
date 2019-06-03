//日期格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//设置安装和报废时间
function discarded_time_set(starttime_id, endtime_id, terms_id) {
    var terms = parseInt($('#' + terms_id).val()),
        starttime = new Date($('#' + starttime_id).val()),
        endtime = new Date(starttime.setFullYear(starttime.getFullYear() + terms)).format("yyyy-MM-dd");
    $('#' + endtime_id).val(endtime);
}


var user = JSON.parse($.cookie("user"));

//初始化及查询站点列表方法
function setTable() {
    //数据列表加载
    table = $('#device_table').DataTable({
        language: reportLanguage1,
        scrollX: true,
        scrollCollapse: true,
        lengthChange: false,
        ordering: false,
        serverSide: true,
        searching: false,
        bDestroy: true,
        iDisplayLength: 15,
        columns: [
            { "data": null, "targets": 0 },
            { "data": "deviceCode" },
            { "data": "deviceName" },
            { "data": "STNM" },
            { "data": "installTime" },
            { "data": "scrapYear" },
            { "data": "scrapTime" },
            { "data": null }
        ],
        columnDefs: [
            {
                targets: 4,
                render: function (data, type, row, meta) {
                    return new Date(data).format("yyyy-MM-dd");
                }
            },
            {
                targets: 5,
                render: function (data, type, row, meta) {
                    return data + '年';
                }
            },
            {
                targets: 6,
                render: function (data, type, row, meta) {
                    return new Date(data).format("yyyy-MM-dd");
                }
            },
            {
                targets: 7,
                render: function (data, type, row, meta) {
                    return '<button type="button" class="btn btn-sm set" onclick=setDevice("' + row.id + '")><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button>' +
                        '<button type="button" class="btn btn-sm btn-del" onclick=delDevice("' + row.id + '")><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                }
            }
        ],
        ajax: function (data, callback, settings) {
            var deviceName = $("#deviceName").val() == "" ? "" : $("#deviceName").val(),
                deviceCode = $("#deviceCode").val() == "" ? "" : $("#deviceCode").val(),
                stcd = $("#station").val() == "全部" ? "" : $("#station").val();

            var obj = {
                Type: 'get',
                Uri: '/device/select',
                Parameter: {
                    deviceName: deviceName,
                    deviceCode: deviceCode,
                    stcd: stcd
                }
            };
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj)
            }).done(function (database) {
                if (database.success) {
                    setTimeout(function () {
                        //封装返回数据
                        var result = database.data;
                        //console.log(result);
                        var returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.total;//返回数据全部记录
                        returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data;//返回的数据列表
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
}

//显示报警弹窗
function showwarning(data, id) {
    id = '#' + id;
    if (data) {
        $('.btn-warnning').popover('destroy');
        $(id).popover({
            'placement': 'left',
            'html': true,
            'content': data
        });
        $(id).popover('show');
    } else {
        $(id).popover('destroy');
    }
}


//所属测站
function initstation(id) {
    $("#" + id).select2();
    var obj = {
        Type: 'get',
        Uri: '/station/getmapstation',
        Parameter: {
            areaCode: user.AreaCode
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            //console.log(data);
            if (id == "station") {
                var html = '<option value="">全部</option>';
            } else {
                var html = '<option value="">请选择</option>';
            }
            var area = data.data;
            $.each(area, function (key, obj) {
                html += "<option value='" + obj.Code + "'>" + obj.Name + "</option>";
            });
            $("#" + id).html(html);
        } else {
            layer.msg(data.message);
        }
    });
}


function setDevice(id) {
    if (isNull(id)) {
        layer.open({
            type: 1,
            area: ['800px', '465px'], //宽高
            title: '添加设备',
            shade: 0.1,
            maxmin: false,
            resize: false,
            zIndex: 0,
            btn: ['保存', '关闭'],
            shadeClose: true,
            content: $('#adddevice'),
            success: function () {
                initstation('stnm');
                $('#stnm').val("").select2();
            },
            yes: function (index, layero) {
                var check = true;
                $("#stnm,#installation_time,#warranty_period,#deviceNameInput,#deviceCodeInput").each(function () {
                    if ($(this).val() == "") {
                        $(this).focus();
                        var name = $(this).attr("name");
                        layer.msg(name + "不能为空");
                        check = false;
                    }
                });
                if (check) {
                    var obj = {
                        Type: 'post',
                        Uri: '/device/add',
                        Parameter: {
                            id: id,
                            deviceCode: $("#deviceCodeInput").val(),
                            deviceName: $("#deviceNameInput").val(),
                            stcd: $("#stnm").val(),
                            installTime: $("#installation_time").val(),
                            scrapYear: $("#warranty_period").val(),
                            scrapTime: $("#discarded_time").val(),
                            remarks: $("#remarks").val(),
                            path: $("#devicepath").val()
                        }
                    };

                    $.ajax({
                        url: serverConfig.operationApi,
                        data: JSON.stringify(obj)
                    }).done(function (database) {
                        if (database.success) {
                            setTable();
                            layer.msg('添加成功!');
                            layer.close(index);
                        }
                    });
                }
            },
            end: function (index, layero) {
                layer.close(index);
                $("#adddevice")[0].reset();
            }
        });
    }
    else {
        // initstation('stnm');
        layer.open({
            type: 1,
            area: ['800px', '465px'], //宽高
            title: '修改设备',
            shade: 0.1,
            maxmin: false,
            resize: false,
            zIndex: 0,
            btn: ['保存', '关闭'],
            shadeClose: true,
            content: $('#adddevice'),
            success: function () {
                var obj = {
                    Type: 'get',
                    Uri: '/device/select',
                    Parameter: {
                        id: id
                    }
                };
                $.ajax({
                    url: serverConfig.operationApi,
                    data: JSON.stringify(obj)
                }).done(function (database) {
                    if (database.success) {
                        //alert(database.data.data[0].stcd);
                        if (!isNull(database.data.data[0])) {
                            $("#deviceCodeInput").val(database.data.data[0].deviceCode);
                            $("#deviceNameInput").val(database.data.data[0].deviceName);
                            $("#warranty_period").val(database.data.data[0].scrapYear);
                            $("#installation_time").val(new Date(database.data.data[0].installTime).format("yyyy-MM-dd"));
                            $("#devicepath").val(database.data.data[0].path);
                            $("#remarks").val(database.data.data[0].remarks);
                            discarded_time_set('installation_time', 'discarded_time', 'warranty_period');
                            //$("#stnm").find("option[value='" + database.data.data[0].stcd + "']").prop('selected', true);
                            //$("#stnm").val(database.data.data[0].stcd);
                            //$("#stnm").trigger("change").val(database.data.data[0].stcd);
                            $('#stnm').val(database.data.data[0].stcd).select2();
                            //var deviceid = database.data.data[0].id;
                            //alert(database.data.data[0].scrapYear);
                        }
                    }
                });
            },
            yes: function (index, layero) {
                var check = true;
                $("#deviceCodeInput,#deviceNameInput,#warranty_period,#installation_time").each(function () {
                    if ($(this).val() == "") {
                        $(this).focus();
                        var name = $(this).attr("name");
                        layer.msg(name + "不能为空");
                        check = false;
                    }
                });
                if (check) {
                    var Parameter = {
                        id: id,
                        deviceCode: $("#deviceCodeInput").val(),
                        deviceName: $("#deviceNameInput").val(),
                        stcd: $("#stnm").val(),
                        installTime: $("#installation_time").val(),
                        scrapYear: $("#warranty_period").val(),
                        scrapTime: $("#discarded_time").val(),
                        remarks: $("#remarks").val(),
                        path: $("#devicepath").val()
                    };
                    //console.log(Parameter);
                    var obj = {
                        Type: 'post',
                        Uri: '/device/update',
                        Parameter: {
                            id: id,
                            deviceCode: $("#deviceCodeInput").val(),
                            deviceName: $("#deviceNameInput").val(),
                            stcd: $("#stnm").val(),
                            installTime: $("#installation_time").val(),
                            scrapYear: $("#warranty_period").val(),
                            scrapTime: $("#discarded_time").val(),
                            remarks: $("#remarks").val(),
                            path: $("#devicepath").val()
                        }
                    };

                    $.ajax({
                        url: serverConfig.operationApi,
                        data: JSON.stringify(obj)
                    }).done(function (database) {
                        if (database.success) {
                            setTable();
                            layer.msg('修改成功!');
                            layer.close(index);
                        }
                    });
                }
            },
            end: function (index, layero) {
                layer.close(index);
                $("#adddevice")[0].reset();
            }
        });
    }

}

function delDevice(id) {
    layer.confirm('是否删除？', {
        btn: ['确实', '取消'] //按钮
    }, function () {
        var obj = {
            Type: 'get',
            Uri: '/device/delete/' + id
        };
        $.ajax({
            url: serverConfig.operationApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                setTable();
                layer.msg('删除成功!');
            } else {
                layer.msg(data.message, { time: 3000 });
            }
        });
    }, function (index) {
        layer.close(index);
    });
}

function updateDate() {
    var installation_time_value = $('#installation_time').val();
    if (installation_time_value == null || installation_time_value == undefined || installation_time_value == '') {
        layer.msg('请选择安装时间!');
    } else {
        //时间控件改变时间时触发事件
        discarded_time_set('installation_time', 'discarded_time', 'warranty_period');
    }
}

$(function () {
    //初始化列表
    init();
    initstation('station');
    initstation('stnm');
    setTable();

    //查询
    $("#searchBtn").click(function () {
        setTable();
    });
    //点击其他地方，移除popover
    $('body').click(function (event) {
        var target = $(event.target);       // 判断自己当前点击的内容
        if (!target.hasClass('btn-warnning')) {
            $('.btn-warnning').popover('destroy');
        }
    });

    //设置结束和开始时间
    $(".date").datetimepicker({
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        pickerPosition: "left",
    }).on('changeDate', function () {
        //时间控件改变时间时触发事件
        discarded_time_set('installation_time', 'discarded_time', 'warranty_period');
    });

    //计算关联报废日期
    $('#warranty_period').on('click keyup', function () {
        updateDate();
    });


    //添加设备按钮触发弹窗
    $('#device_add_btn').on('click', function () {
        setDevice();
    });
});
