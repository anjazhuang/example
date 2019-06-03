var table = "";
var user = JSON.parse($.cookie("user"));
var state = ['未执行', '正在执行', '完成'];
//图片接口连接
var picapi = $.cookie("picapi");
//图片显示src连接
var picapi1 = picapi.replace("/api", "");
var user = JSON.parse($.cookie("user"));


function showState(data) {
    var stateValue;
    switch (data) {
        case 0:
            stateValue = "未执行";
            break;
        case 1:
            stateValue = "正在执行";
            break;
        case 2:
            stateValue = "完成";
            break;
    }
    return stateValue;
}

function selectInitTable() {
    table = $('#planlist').DataTable({
        language: reportLanguage1,
        scrollX: true,
        scrollCollapse: true,
        lengthChange: false,
        ordering: false,
        serverSide: true,
        searching: false,
        bDestroy: true,
        //设置每页显示15条数据
        iDisplayLength: 15,
        columns: [
            { "data": null },
            // { "data": "startTime" },
            { "data": "contnt" },
            { "data": "startTime" },
            { "data": "endTime" },
            { "data": "createTime" },
            {
                'data': 'state', 'class': 'text-center',
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    var a1 = moment(oData.endTime).diff(moment(), 'Seconds');
                    if (moment(oData.endTime).diff(moment(), 'Seconds') < 0 && (oData.state)) {
                        $(nTd).html("逾期");
                    } else {
                        $(nTd).html(showState(sData));
                    }
                }
            },
            { "data": "maintName" },
            { "data": "Phone" }
        ],
        columnDefs: [{
            targets: 8,
            //操作按钮
            render: function (data, type, row) {
                var aa = JSON.stringify(row).replace(/\"/g, "'");
                var html = '';
                var SystemRole = user.SystemRole;
                var btnhtml = '';
                if (SystemRole == '超级管理员' || SystemRole == '普通用户') {

                } else {
                    //进行维护计划由于APP执行，WEB端隐藏
                    //if (row.state == 0) {
                    //    btnhtml = '<button type="button" class="btn btn-sm order" onclick="doplan(' + row.id + ')"><span class="glyphicon glyphicon-edit"></span> 执行计划</button>';
                    //} else if (row.state == 1) {
                    //    btnhtml = '<button type="button" class="btn btn-sm repairbtn" onclick="protectplan((' + aa + '))"><span class="glyphicon glyphicon-edit"></span> 维护操作</button>' + '<button type="button" class="btn btn-sm order" onclick="maintenance(' + row.id + ')"><span class="glyphicon glyphicon-edit"></span> 完成维护</button>';
                    //}
                }

                return btnhtml += '<button type="button" class="btn btn-sm detailbtn" onclick="deltailplan(' + aa + ')"><span class="glyphicon glyphicon-file"></span> 详情</button>'
            }
        }
        ],
        ajax: function (data, callback, settings) {
            var user = JSON.parse($.cookie("user"));
            //alert(data.length);
            //封装请求参数
            //console.log(param);
            //ajax请求数据
            var obj = {
                Type: 'get',
                Uri: '/planTask/select',
                Parameter: {
                    start: data.start,//当前页码
                    length: data.length, //页面显示记录条数，在页面显示每页显示多少项的时候
                    SystemRole: user.SystemRole,
                    userId: user.Id,
                    state: $("#state").val()
                }
            };
            // $.ajax({
            //     type: "GET",
            //     url: "http://172.16.5.91:8088/xianyang/api/planTask/select ",
            //     data: {
            //         start: (data.start / data.length),//当前页码
            //         length: data.length, //页面显示记录条数，在页面显示每页显示多少项的时候
            //         SystemRole: user.SystemRole,
            //         userId: user.Id,
            //         state: $("#state").val(),
            //     }
            // })
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj)
            }).done(function (database) {
                if (database.success) {
                    //console.log(database.data);
                    setTimeout(function () {
                        //封装返回数据
                        var result = database.data;
                        //console.log(result);
                        var returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.total;//返回数据全部记录
                        returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data;//返回的数据列表
                        //console.log(returnData);
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
    init();
    initArea();
    changeSt(user.AreaCode);
    $(".content-box select").select2();
    $("#s-date,#e-date,#ee-date").datetimepicker({
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        pickerPosition: "top-left",
        startDate: new Date()
    });
    $("#s-date,#e-date").datetimepicker('update', new Date());

    //初始化表格
    selectInitTable();

    //点击查看大图方法
    $("body").on("click", ".smallpic img", function () {
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

    //修改上传图片
    $("#addpic").on("change", function () {
        var num = $('.img-add .smallpic').length;
        var files = $(this).get(0).files;
        var windowURL = window.URL || window.webkitURL;
        for (var i = 0; i < files.length; i++) {
            var url = windowURL.createObjectURL(files[i]); //客户端图形缩略图预览路径
            var dname = /\.([^\.]+)$/.exec(files[i].name); //文件后缀名
            var pattern = /\.(jpg|gif|jpeg|png)+$/ig; //图片验证正则模式
            $('.img-add').append('<span class="smallpic" ><img src="' + url + '"></span>');
        }
    });
    //删除图片
    $("body").on("click", ".delete", function () {
        $(this).parent("span").remove();
        if (!$(".addbtnbox").show()) {
            $(".addbtnbox").show();
        }
    });

    $(".adminArea").change(function () {
        var areacode = $(this).val();
        //alert(areacode);
        changeSt(areacode);
    });

    $("#selectPaln").on("click", function () {
        selectInitTable();
    });
});

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
            $(".adminArea").html(html);
        } else {
            layer.msg(data.message);
        }
    });
}

//执行计划
function doplan(id) {
    layer.confirm('是否开始执行计划？', {
        btn: ['确定', '取消'] //按钮
    }, function (index) {
        var obj = {
            Type: 'post',
            Uri: '/planTask/update',
            Parameter: {
                id: id,
                state: 1
            }
        };
        // $.ajax({
        //     type: "post",
        //     url: "http://172.16.5.91:8088/xianyang/api/planTask/update",
        //     data: JSON.stringify(Parameter)
        // })
        $.ajax({
            url: serverConfig.operationApi,
            data: JSON.stringify(obj)
        }).done(function (database) {
            if (database.success) {
                selectInitTable();
                layer.msg('执行计划成功!');
                layer.close(index);
            }
        });
        layer.close(index);
    }, function (index) {
        layer.close(index);
    })
}

//完成维护
function maintenance(id) {
    layer.confirm('是否完成维护？', {
        btn: ['确定', '取消'] //按钮
    }, function (index) {
        var obj = {
            Type: 'post',
            Uri: '/planTask/update',
            Parameter: {
                id: id,
                state: 2
            }
        };
        $.ajax({
            url: serverConfig.operationApi,
            data: JSON.stringify(obj)
        }).done(function (database) {
            if (database.success) {
                selectInitTable();
                layer.msg('执行计划成功!');
                layer.close(index);
            }
        });
        layer.close(index);
    }, function (index) {
        layer.close(index);
    })

}

//维护操作
function protectplan(oo) {
    var bool = true;
    layer.open({
        type: 1,
        area: ['650px', '480px'], //宽高
        title: '维护操作',
        shade: 0.1,
        maxmin: false,
        resize: false,
        zIndex: 0,
        btn: ['保存', '关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $(".protect"),
        success: function (layero) {
            $("#journal").val("");
            $("#OpAreaName_span").html(oo.AreaName);
            $("#OpSTNM_span").html(oo.STNM);
            $("#OpstartTime_span").html(oo.startTime);
            $("#OpendTime_span").html(oo.endTime);
            $("#OpmaintName_span").html(oo.maintName);
            //var contnthtml = obj.contnt.replace(/\n|\r\n/g,"<br/>");
            $("#Opcontnt_span").html(oo.contnt);
            $('.img-add').text("");
            $("#addpic").val("");
        },
        yes: function (index) {
            var check = true,
                username = user.Name,
                userid = user.Id;

            if ($("#journal").val() == "") {
                $("#journal").focus();
                var name = $("#journal").attr("name");
                layer.msg(name + "不能为空");
                check = false;
            }


            if ($('#addpic')[0].files.length !== 0) {
                //添加图片
                var cc = $('#addpic')[0].files.length;
                for (var i = 0; i < $('#addpic')[0].files.length; i++) {
                    var imgdata = new FormData();
                    imgdata.append('files[]', $('#addpic')[0].files[i]);
                    //console.log(imgdata);
                    $.ajax({
                        async: false,
                        url: picapi + "/planTask/addMedia?userId=" + userid + "&userName=" + username + "&procId=" + oo.id,
                        data: imgdata,
                        cache: false,
                        contentType: false,
                        dataType: "json",
                        processData: false,
                        type: 'POST'
                    }).done(function (data) {
                        if (data.success) {
                            //layer.msg(data.message);
                        } else {
                            layer.msg(data.message);
                            bool = false;
                        }
                    });
                }
            }

            var journal = $("#journal").val();
            if (journal != "") {
                var obj = {
                    Type: 'post',
                    Uri: '/planTask/addJournal',
                    Parameter: {
                        procId: oo.id,
                        content: journal,
                        operaterId: userid,
                        operateName: username
                    }
                };
                // var Parameter = {
                //     procId: obj.id,
                //     content: journal
                // }
                // $.ajax({
                //     type: "post",
                //     url: "http://172.16.5.91:8088/xianyang/api/planTask/addJournal?userId=" + userid + "&userName=" + username,
                //     data: JSON.stringify(Parameter)
                // })
                $.ajax({
                    url: serverConfig.operationApi,
                    data: JSON.stringify(obj)
                }).done(function (data) {
                    if (data.success) {
                        layer.msg("保存成功!");
                        layer.close(index);
                    } else {
                        layer.msg(data.message);
                        bool = false;
                    }
                });

            }

        },
        end: function (index) {
        }
    })
}

//详情
function deltailplan(oo) {
    layer.open({
        type: 1,
        area: ['600px', '450px'], //宽高
        title: '详情',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $(".detailplan"),
        success: function () {
            $("#AreaName_span").html(oo.AreaName);
            $("#STNM_span").html(oo.STNM);
            $("#startTime_span").html(oo.startTime);
            $("#endTime_span").html(oo.endTime);
            $("#maintName_span").html(oo.maintName);
            //var contnthtml = obj.contnt.replace(/\n|\r\n/g,"<br/>");
            $("#contnt_span").html(oo.contnt);

            table = $('#detailsTable').DataTable({
                language: reportLanguage,
                scrollX: true,
                scrollCollapse: true,
                lengthChange: false,
                ordering: false,
                serverSide: true,
                searching: false,
                bDestroy: true,
                paging: false,
                iDisplayLength: 15,
                columns: [
                    { "data": "operateTime" },
                    { "data": "" },
                ],
                columnDefs: [{
                    targets: 1,
                    //操作按钮
                    render: function (data, type, row) {
                        if (row.content == "图片") {
                            var picurl = '<span class="smallpic"><img src="' + picapi1 + row.url + '"></span>';
                            return picurl;
                        } else {
                            return row.content
                        }
                    }
                }
                ],
                ajax: function (data, callback, settings) {
                    var user = JSON.parse($.cookie("user"));
                    var obj = {
                        Type: 'get',
                        Uri: '/planTask/reflect',
                        Parameter: {
                            procId: oo.id
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
                                //console.log(result);
                                var returnData = {};
                                returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                                returnData.recordsTotal = result.total;//返回数据全部记录
                                returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                                returnData.data = result.data;//返回的数据列表
                                //console.log(returnData);
                                //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                                //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                                callback(returnData);
                            }, 50);
                        } else {
                            layer.msg(database.message);
                        }
                    });
                }
            });
        },
        yes: function (index, layero) {
            layer.close(index);
        },
        end: function (index) {

        }
    })
}

//新增维护计划
function customizedPlan() {
    layer.open({
        type: 1,
        area: ['350px', '520px'], //宽高
        title: '自定义维修单',
        shade: 0.1,
        maxmin: false,
        resize: false,
        zIndex: 0,
        btn: ['保存', '关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $(".customized"),
        success: function () {
            $("#contnt").val("");
        },
        yes: function (index, layero) {
            var check = true;
            $("#repairst,#contnt,#maintainer").each(function () {
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
                    Uri: '/planTask/add',
                    Parameter: {
                        addvcd: $("#AreaName").val(),
                        stcd: $("#repairst").val(),
                        startTime: $("#startTime").val(),
                        endTime: $("#endTime").val(),
                        contnt: $("#contnt").val(),
                        maintUserId: $("#maintainer").val()
                    }
                };
                $.ajax({
                    url: serverConfig.operationApi,
                    data: JSON.stringify(obj)
                }).done(function (database) {
                    if (database.success) {
                        selectInitTable();
                        layer.msg('新增维护计划成功!');
                        layer.close(index);
                    }
                });
            }
        },
        end: function (index, layero) {
            $("#AreaName").val("610400");
            $("#repairst").val("");
            $("#maintainer").val("");
            $("#contnt").val("");
            layer.close(index);
        }
    });
}

//通过行政区域改变维修站点
function changeSt(area) {
    //维修站点菜单
    var htmlcd = "<option value=''>请选择</option>";
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
        if (data.success) {
            $.each(data.data, function (i, v) {
                htmlcd += "<option value='" + v.Code + "'>" + v.Name + "</option>";
            });
            $("#repairst").html(htmlcd);
        }
    });

    //指派维护人员
    $.ajax({
        type: "get",
        url: serverConfig.apiBase + "user/getuser",
        data: {
            AreaCode: $("#AreaName").val(),
            SystemRole: "OPERATION"
        }
    }).done(function (data) {
        if (data.success) {
            var htmlzp = "<option value=''>请选择</option>";
            $.each(data.data, function (i, v) {
                htmlzp += "<option value='" + v.Id + "'>" + v.Name + "</option>";
            });
            $("#maintainer").html(htmlzp);
        }
    });


}

