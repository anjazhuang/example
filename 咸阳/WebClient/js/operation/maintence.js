var priority = ['', '紧急', '优先', '普通'];
//图片接口连接
var picapi = $.cookie("picapi");
//图片显示src连接
var picapi1 = picapi.replace("/api", "");
var table = "";
var user = JSON.parse($.cookie("user"));
//console.log(user);
var url = "userId=" + user.Id + "&userName=" + user.Name;

function selectTaskTable() {
    //console.log(111);
    table = $('#repairlist').DataTable({
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
            { "data": null },
            { "data": "taskNo" },
            { "data": "stcd" },
            { "data": "STNM" },
            { "data": "AreaName" },
            { "data": "priorityName" },
            { "data": "createTime" },
            { "data": "content" },
            {
                'data': 'taskStatus', 'class': 'text-center',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    var strHtml = '';
                    var reciveHour = moment(oData.reciveTime).diff(moment(oData.createTime), 'hours');
                    var dealHour = moment(oData.finishTime).diff(moment(oData.dealTime), 'hours');
                    if (sData > 10) {
                        strHtml += '<div>响应<span class="text-red">' + reciveHour + '</span>小时</div>\n';
                    } else {
                        strHtml += '<div>未响应</div>\n';
                    }
                    if (sData > 30) {
                        strHtml += '<div>修复<span class="text-red">' + dealHour + '</span>小时</div>';
                    } else {
                        strHtml += '<div>未修复</div>';
                    }
                    $(nTd).html(strHtml);
                }
            },
            { "data": "taskStatusName" },
            { "data": "maintName" },
            { "data": "Phone" },
            { "data": null }
        ],
        columnDefs: [{
            targets: 12,
            //操作按钮
            render: function (data, type, row) {
                var aa = JSON.stringify(row).replace(/\"/g, "'");
                var html = '';
                var SystemRole = user.SystemRole;
                // //console.log(SystemRole);
                // //console.log(data.taskStatus);
                if (SystemRole == '超级管理员' || SystemRole == '普通用户') {
                    if (data.taskStatus == 0)
                        html += '<button type="button" class="btn btn-sm order" onclick="disPacth((' + aa + '))"><span class="glyphicon glyphicon-edit"></span> 派单</button>';
                    if (data.taskStatus == 10)
                        html += '<button type="button" class="btn btn-sm order" onclick="disPacth((' + aa + '))"><span class="glyphicon glyphicon-edit"></span>重新派单</button>';
                } else {
                    //进行维护流程由于APP执行，WEB端隐藏
                    //if (data.taskStatus == 10)
                    //    html += '<button type="button" class="btn btn-sm order" onclick="orderTaking((' + data.taskNo + '),0)"><span class="glyphicon glyphicon-edit"></span> 接单</button>';
                    //if (data.taskStatus == 20)
                    //    html += '<button type="button" class="btn btn-sm order" onclick="orderTaking((' + data.taskNo + '),1)"><span class="glyphicon glyphicon-edit"></span> 开始维修</button>';
                    //if (data.taskStatus == 30) {
                    //    html += '<button type="button" class="btn btn-sm repairbtn" onclick="repaired((' + aa + '),1)"><span class="glyphicon glyphicon-edit"></span> 维修操作</button>';
                    //    html += '<button type="button" class="btn btn-sm order" onclick="orderTaking((' + data.taskNo + '),2)"><span class="glyphicon glyphicon-edit"></span> 结束维修</button>';
                    //}

                }
                return html += '<button type="button" class="btn btn-sm detailbtn" onclick="repaired((' + aa + '),2)"><span class="glyphicon glyphicon-file"></span> 详情</button>';
            }
        },
        ],
        ajax: function (data, callback, settings) {
            var user = JSON.parse($.cookie("user"));
            //alert(data.length);
            //封装请求参数
            ////console.log(param);
            //ajax请求数据
            // var obj = {
            //     Type: 'get',
            //     Uri: '/task/select',
            //     Parameter: {
            //         Code: user.AreaCode,
            //         Status: status ? status : "",
            //         start: (data.start / data.length),//当前页码
            //         length: data.length //页面显示记录条数，在页面显示每页显示多少项的时候
            //     }
            // };
            var obj = {
                Type: 'get',
                Uri: '/task/select',
                Parameter: {
                    SystemRole: user.SystemRole,
                    userId: user.Id,
                    AreaCode: user.AreaCode,
                    taskStatus: $("#selectTaskStatus").val(),
                    priorityStatus: $("#selectPriorityStatus").val(),
                    area: $("#area").val(),
                    start: data.start,//当前页码
                    length: data.length, //页面显示记录条数，在页面显示每页显示多少项的时候
                }
            };
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj)
            }).done(function (database) {
                if (database.success) {
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
}

$(function () {
    //初始化ajax
    init();
    //初始化行政区域
    initArea();
    //加载指派维修人员
    // servicePersonal();
    changeSt(user.AreaCode);
//初始化时间控件
    $("#s-date,#e-date").datetimepicker({
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
    var timeupdatevalue2 = new Date();
    if (timeupdatevalue.getHours() < 8) {
        timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
        timeupdatevalue.setHours(8, 0);
        timeupdatevalue2.setHours(8, 0);
    } else {
        timeupdatevalue2.setDate(timeupdatevalue2.getDate() + 1, 0);
        timeupdatevalue.setHours(8, 0);
        timeupdatevalue2.setHours(8, 0);
    }
    $("#s-date").datetimepicker('update', timeupdatevalue);
    $("#e-date").datetimepicker('update', timeupdatevalue2);
    //下拉框combox
    $(".content-box select").select2();
    //初始化维护计划数据列表

    //修改上传图片
    $("#addpic").on("change", function () {
        var num = $('.img-add .smallpic').length;
        var files = $(this).get(0).files;
        var windowURL = window.URL || window.webkitURL;
        for (var i = 0; i < files.length; i++) {
            var url = windowURL.createObjectURL(files[i]); //客户端图形缩略图预览路径
            var dname = /\.([^\.]+)$/.exec(files[i].name); //文件后缀名
            var pattern = /\.(jpg|gif|jpeg|png)+$/ig; //图片验证正则模式
            $('.img-add').append('<span class="smallpic" ><img src="' + url + '"><i class="glyphicon glyphicon-remove-circle delete" ></i></span>');
        }
    });
    //删除图片
    $("body").on("click", ".delete", function () {
        $(this).parent("span").remove();
        if (!$(".addbtnbox").show()) {
            $(".addbtnbox").show();
        }
    });

    $("#selectTask").on("click", function () {
        selectTaskTable();
    });

    $(".adminArea").change(function () {
        var areacode = $(this).val();
        //alert(areacode);
        changeSt(areacode);
    })
});

//行政区域
function initArea() {
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "area/getarea"
    }).done(function (data) {
        if (data.success) {
            var html = "";
            var area = data.data;
            $.each(area, function (key, obj) {
                html += "<option value='" + obj.Code + "'>" + obj.Name + "</option>";
            });
            $(".adminArea").append(html);
            selectTaskTable();
        } else {
            layer.msg(data.message);
        }
    });
}

//派单
function disPacth(data) {
    //console.log(data);
    servicePersonal(data.addvcd, data.maintUserId);
    $("#updateTaskNo").html(data.taskNo);
    $("#updateAddvcd").html(data.AreaName);
    $("#updateStcd").html(data.stcd);
    $("#updateStmn").html(data.STNM);
    $("#updateContent").html(data.content);
    // //console.log(data.priorityStatus);
    $("#updatePriority").val(data.priorityStatus);
    layer.open({
        type: 1,
        area: ['400px', '350px'], //宽高
        title: '维修派单',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['保存', '关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $(".orderlayer"),
        yes: function (index) {
            var maintuserid = $("#serviceperson").val();
            if (maintuserid != '请选择') {
                //console.log(data.taskno);
                var Parameter = {
                    taskNo: data.taskNo,
                    stcd: data.stcd,
                    priorityStatus: $("#updatePriority").val(),
                    priorityName: priority[parseInt($("#updatePriority").val())],
                    maintUserId: $("#serviceperson").val(),
                    taskStatus: 10
                }
                //console.log(JSON.stringify(Parameter));
                var obj = {
                    Type: 'post',
                    Uri: '/task/update',
                    Parameter: {
                        taskNo: data.taskNo,
                        stcd: data.stcd,
                        priorityStatus: $("#updatePriority").val(),
                        priorityName: priority[parseInt($("#updatePriority").val())],
                        maintUserId: $("#serviceperson").val(),
                        taskStatus: 10
                    }
                };
                $.ajax({
                    url: serverConfig.operationApi,
                    data: JSON.stringify(obj)
                }).done(function (data) {
                    if (data.success) {
                        layer.msg(data.message);
                        layer.close(index);
                        selectTaskTable();
                    } else {
                        layer.msg(data.message);
                    }
                });

            } else {
                layer.msg('请选择维修人员');
            }
        }
    })
}

//接单
function orderTaking(taskNo, a) {
    var status = ['接单', '开始维修', '结束维修'];
    var operate = ['Maintenance', 'execute', 'end'];
    layer.confirm('是否' + status[a] + '？', {
        btn: ['确定', '取消'] //按钮
    }, function (index) {
        //console.log("yse");
        var obj = {
            Type: 'get',
            Uri: '/taskProcess/taskOperate',
            Parameter: {
                taskNo: taskNo,
                operaterName: user.Name,
                operaterId: user.Id,
                operate: operate[a]
            }
        };
        $.ajax({
            url: serverConfig.operationApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            if (data.success) {
                layer.msg(data.message);
                layer.close(index);
                selectTaskTable();
            } else {
                layer.msg(data.message);
            }
        });
    }, function (index) {
        layer.close(index);
    })

    // if (tp === 1) {
    //     layer.confirm('是'+status[tp]+'' + id + '？', {
    //         btn: ['确定', '取消'] //按钮
    //     }, function (index) {
    //         //console.log("yse")
    //         // layer.close(index);
    //     }, function (index) {
    //         layer.close(index);
    //     })
    // } else {
    //     layer.confirm('是否结束维修单' + id + '？', {
    //         btn: ['确定', '取消'] //按钮
    //     }, function (index) {
    //         layer.close(index);
    //     }, function (index) {
    //         layer.close(index);
    //     })
    // }
}

function state(s) {
    if (s === 1) {
        return "正常"
    } else if (s === 0) {
        return "不正常"
    }
}

//加载流程
function initProcess(taskNo) {
    $("#process").html("");
    var obj = {
        Type: 'get',
        Uri: '/taskProcess/select',
        Parameter: {
            taskNo: taskNo
        }
    };
    // $.ajax({
    //     type: "GET",
    //     url: "http://172.16.5.91:8088/xianyang/api/taskProcess/select?taskNo=" + taskNo,
    // })
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {

            var html = "";
            var data = data.data.data;
            $.each(data, function (key, obj) {
                //流程节点
                html += '<div class="child"><span></span> <p class="state">' + obj.content + '</p><p class="tm">' + obj.operateTime + '</p></div>';

                //修改维修流程详情
                if (obj.content == "执行维修中") {

                    var tHtml = "";
                    var bHtml = "";
                    var para = {
                        Type: 'get',
                        Uri: '/taskProcess/select2',
                        Parameter: {
                            taskNo: taskNo
                        }
                    };
                    $.ajax({
                        async: false,
                        url: serverConfig.operationApi,
                        data: JSON.stringify(para)
                    }).done(function (logData) {
                        if (logData.success) {
                            var gdata = logData.data.data;
                            $.each(gdata, function (index, obj) {
                                if (obj.basTaskDealNodes.length > 0) {
                                    $.each(obj.basTaskDealNodes, function (index, source) {
                                        bHtml += '<tr><td>外观状态：' + state(source.appearanceStat) + '</td><td>外观状态：' + state(source.appearance2Stat) + '</td></tr>';
                                        bHtml += '<tr><td>雨量筒状态：' + state(source.rainGaugeStat) + '</td><td>雨量筒状态：' + state(source.rainGauge2Stat) + '</td></tr>';
                                        bHtml += '<tr><td>线路状态：' + state(source.circuitStat) + '</td><td>线路状态：' + state(source.circuit2Stat) + '</td></tr>';
                                        bHtml += '<tr><td>电池状态：' + state(source.batteryStat) + '</td><td>电池状态：' + state(source.battery2Stat) + '</td></tr>';
                                        bHtml += '<tr><td>SIM卡状态：' + state(source.simCardStat) + '</td><td>SIM卡状态：' + state(source.simCard2Stat) + '</td></tr>';
                                        bHtml += '<tr><td>RTU状态：' + state(source.rtuStat) + '</td><td>RTU状态：' + state(source.rtu2Stat) + '</td></tr>';
                                        bHtml += '<tr><td>天线状态：' + state(source.antennaStat) + '</td><td>天线状态：' + state(source.antenna2Stat) + '</td></tr>';
                                        bHtml += '<tr><td>滴水试验误差：' + state(source.dripTestStat) + '</td><td>雷达水位计状态：' + state(source.waterLevelGauge2Stat) + '</td></tr>';
                                        bHtml += '<tr><td></td><td>滴水试验误差：' + state(source.dripTestStat) + '</td></tr>';
                                        bHtml += '<tr><td style="text-align:center;font-weight:bold;" colspan="2">维修日志</td></tr>';
                                        bHtml += '<tr><td colspan="2">' + source.content + '</td></tr>';
                                        bHtml += '<tr style="font-weight:bold;"><td>看护人：' + (source.caretaker == null ? "" : source.caretaker) + '</td><td>联系电话：' + (source.caretakerTel == null ? "" : source.caretakerTel) + '</td></tr>';
                                        if (source.attas.length > 0) {
                                            $.each(source.attas, function (index, source2) {
                                                bHtml += '<tr><td colspan="2"><li class="li-border"><img class="smallpic" src=' + picapi1 + source2.url + '><small>照片上传时间:' + source.operateTime + '</small></li></td></tr>';
                                            });
                                        }
                                    });

                                    var tHtml = '<table style="text-align:left;font-size:5px;" class="table table-striped"><thead><tr><th style="text-align:center">雨量站维修流程</th><th style="text-align:center">水文水位站维修流程</th></tr></thead><tbody>' + bHtml + '</tbody></table>'

                                    html += '<ul style="list-style: none;">' + tHtml + '</ul>';
                                }
                            });
                        } else {
                            layer.msg(logData.message);
                        }
                    });
                }
                //if (obj.basTaskDealNodes.length > 0) {
                //    //如果该节点有上传图片等信息
                //    html += '<ul style="list-style: none;">';
                //    $.each(obj.basTaskDealNodes, function (index, source) {
                //        if (source.dealType == 1) {
                //            //日志
                //            html += '<li>' + source.content + ' ' + source.operateTime + '</li>';
                //        }
                //        if (source.dealType == 2) {
                //            //图片
                //            html += ' <li><img  class="smallpic" src=' + picapi1 + source.url + '></li>';
                //        }

                //    })
                //    html += '</ul>';
                //}
            });
            $("#process").append(html);
            //点击查看大图方法
            $(".smallpic").on("click", function () {
                //console.log("11");
                var img_src = $(this).attr("src");
                layer.open({
                    type: 1,
                    area: ['650px', '650px'], //宽高
                    title: '查看图片',
                    shade: 0.2,
                    shadeClose: false,
                    scrollbar: false,
                    maxmin: true,
                    content: '<img src="' + img_src + '">' //这里content是一个普通的String
                });
            })
        } else {
            layer.msg(data.message);
        }
    });
}

//维修操作与详情
function repaired(data, type) {
    var bool = true;
    layer.open({
        type: 1,
        area: ['800px', '450px'], //宽高
        title: '维修操作',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['打印', '关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $(".repaired"),
        success: function () {
            //打开窗口初始化
            // //console.log(data);
            $("#operaterTaskNo").html(data.taskNo);
            $("#operaterAddvcd").html(data.AreaName);
            $("#operaterStcd").html(data.stcd);
            $("#operaterStmn").html(data.STNM);
            $("#operaterName").html(data.maintName);
            $("#operaterPriorityName").html(data.priorityName);
            $("#operaterContent").html(data.content);
            $("#operaterPriorityName").val(data.maintName);
            $('.img-add').text("");
            $("#addpic").val("");

            if (type == 2) {
                //查看详情的话
                $("#process").css('display', 'block');
                $("#operate").css('display', 'none');
                //加载流程记录
                initProcess(data.taskNo);

            } else {
                $("#process").css('display', 'none');
                $("#operate").css('display', 'block');
                $("#journal").val('');
            }
        },
        yes: function (index) {
            //打印div
            $("#printDiv").show();
            $("#printBody").html($("#pDiv1").html() + $("#pDiv2").html());

            html2canvas($("#printDiv"), {
                useCORS: true,
                onrendered: function (canvas) {
                    var win = window.open();
                    win.document.write("<div style='margin:0 auto;width:500px;'><img style='width:500px;' src='" + canvas.toDataURL() + "'/></div>");
                    //win.document.write("<div style='width:500px; margin:0 auto;'><img style='width:400px;height:400px;' src='" + canvas.toDataURL() + "'/></div>");
                    win.document.close();
                    setTimeout(function () {
                        win.print();
                        win.close();
                        window.close();
                        $("#printDiv").hide();
                    }, 100);
                }
            });

            ////console.log($('#addpic')[0].files.length);
            //for (var i = 0; i < $('#addpic')[0].files.length; i++) {
            //    var imgdata = new FormData();
            //    imgdata.append('files[]', $('#addpic')[0].files[i]);
            //    //console.log(imgdata);
            //    $.ajax({
            //        async: false,
            //        url: picapi + "/taskDealNode/addMedia?taskNo=" + data.taskNo + "&" + url,
            //        data: imgdata,
            //        cache: false,
            //        contentType: false,
            //        dataType: "json",
            //        processData: false,
            //        type: 'POST'
            //    }).done(function (data) {
            //        if (data.success) {
            //            //layer.msg(data.message);
            //        } else {
            //            layer.msg(data.message);
            //            bool = false;
            //        }
            //    });
            //}
            //var journal = $("#journal").val();
            //if (journal != "") {
            //    //添加日志
            //    // var Parameter = {
            //    //     taskNo: data.taskNo,
            //    //     operaterId: user.id,
            //    //     operateName: user.name,
            //    //     userName: userName,
            //    //     content: journal,
            //    //     dealType: 1,
            //    // }
            //    var obj = {
            //        Type: 'post',
            //        Uri: '/taskDealNode/addJournal',
            //        Parameter: {
            //            taskNo: data.taskNo,
            //            operaterId: user.id,
            //            operateName: user.name,
            //            content: journal,
            //            dealType: 1
            //        }
            //    };
            //    // $.ajax({
            //    //     type: "post",
            //    //     url: "http://172.16.5.91:8088/xianyang/api/taskDealNode/addJournal?taskNo=" + data.taskNo + "&" + url,
            //    //     data: JSON.stringify(Parameter)
            //    // })
            //    $.ajax({
            //        url: serverConfig.operationApi,
            //        data: JSON.stringify(obj)
            //    }).done(function (data) {
            //        if (data.success) {

            //        } else {
            //            layer.msg(data.message);
            //            bool = false;
            //        }
            //    });

            //}
            //if (bool) {
            //    layer.close(index);
            //    selectTaskTable();
            //}
        }
    });

}

//维修单详情
function repairedDetail() {
    layer.open({
        type: 1,
        area: ['600px', '460px'], //宽高
        title: '维修单详情',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $(".repaireddetail")
    })
}

//自定义维修单
function customizedRepair() {
    $("#content").val("");
    layer.open({
        type: 1,
        area: ['400px', '440px'], //宽高
        title: '自定义维修单',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['提交', '关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $(".customized"),
        yes: function (index) {
            var stcd = $("#repairst").val();
            if ($("#content").val().length == 0) {
                layer.msg('请选填写内容');
                return;
            }
            if (stcd.length != 8) {
                layer.msg('请选择测站');
                return;
            }
            var Parameter = {
                stcd: stcd,
                content: $("#content").val(),
                priorityStatus: 3
            }
            var obj = {
                Type: 'post',
                Uri: '/task/addTask',
                Parameter: {
                    stcd: stcd,
                    content: $("#content").val(),
                    priorityStatus: 3
                }
            };
            // $.ajax({
            //     type: "post",
            //     url: 'http://172.16.5.91:8088/xianyang/api/task/addTask',
            //     data: JSON.stringify(Parameter)
            // })
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj)
            }).done(function (data) {
                if (data.success) {
                    layer.msg(data.message);
                    layer.close(index);
                    selectTaskTable()
                } else {
                    layer.msg(data.message);
                }
            });


        }
    })
}

//指派维修人员
function servicePersonal(AreaCode, maintuserid) {
    $("#serviceperson").html("<option>请选择</option>");
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "user/getuser",
        data: {
            AreaCode: AreaCode,
            SystemRole: "OPERATION"
        }
    }).done(function (data) {
        //console.log(data);
        var html = "";
        if (data.success) {
            $.each(data.data, function (i, v) {
                html += "<option value=" + v.Id + ">" + v.Name + "</option>";
            });
            $("#serviceperson").append(html);
            if (maintuserid != null)
                $("#serviceperson").val(maintuserid);
        }
    })
}

//通过行政区域改变维修站点
function changeSt(area) {
    var htmlcd = "<option>请选择</option>";
    var obj = {
        Type: 'get',
        Uri: '/station/getmapstation',
        Parameter: {
            areaCode: area
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        // //console.log(data.data);
        if (data.success) {
            $.each(data.data, function (i, v) {
                htmlcd += "<option value='" + v.Code + "'>" + v.Name + "</option>";
            });
            $("#repairst").html(htmlcd);
        }
    })
}