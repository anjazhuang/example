var area = "";
var table = "";
var html, html2 = "";
var role, roleId = "";
var code = "";
$(function () {
    //初始化ajax
    init();
    //初始化用户列表
    initTab();
    //初始化行政区域
    initArea();
});

//初始化用户表格
function initTab() {
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "user/getuser"
    }).done(function (data) {
        if (data.success) {
            table = $('#example').DataTable({
                language: reportLanguage,
                scrollX: true,
                scrollCollapse: true,
                lengthChange: false,
                ordering: false,
                searching: false,
                aaData: data.data,
                bDestroy: true,
                paging:false,
                columns: [
                    { "data": null },
                    { "data": "Name" },
                    { "data": "Account" },
                    { "data": "AreaName" },
                    { "data": "RoleName" },
                    { "data": "SystemRole" },
                    { "data": "Phone" },
                    { "data": "Remark" },
                    { "data": null }
                ],
                columnDefs: [{
                    targets: 8,
                    render: function (data, type, row, meta) {
                        var aa = JSON.stringify(row).replace(/\"/g, "'");
                        return '<button type="button"  class="btn btn-xs set" onclick="setUser(' + aa + ')"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button><button type="button"  class="btn btn-xs btn-del" onclick="delUser(' + aa + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                    }
                }],
                fnDrawCallback: function () { //解决序号列没法生成的问题
                    var api = this.api();
                    var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
                    api.column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = startIndex + i + 1;
                    });
                }
            });
        }
    });
    $(".selectGroup select").select2();
}

//初始化行政区域
function initArea() {
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "area/getarea"
    }).done(function (data) {
        if (data.success) {
            console.log(data.data);
            html = "";
            area = data.data;
            $.each(area, function (key, obj) {
                html += "<option value='" + obj.Code + "'>" + obj.Name + "</option>";
            });
            $("#adminArea").html(html);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//添加及修改用户
function setUser(row) {
    // //console.log(data.Id);
    if (row) {
        $(".confirmpsd").addClass("hidden");
        $(".setpsd").addClass("hidden");
        //添加用户弹窗
        layer.open({
            type: 1,
            area: ['450px', '550px'], //宽高
            title: '修改用户',
            shade: 0.1,
            maxmin: false,
            resize: false,
            btn: ['保存', '关闭'],
            shadeClose: true,
            //offset: ['150px', '20px'],
            content: $("#userform"),
            success: function (layero) {
                //添加及修改用户
                $("#username").val(row.Name);
                $("#account").val(row.Account);
                $("#city").val(row.AreaName);
                $("#remark").val(row.Remark);
                $("#phone").val(row.Phone == null || row.Phone == "" ? "" : row.Phone);
                // $("#roleid").html("<option value='" + row.RoleId + "'>" + row.RoleName + "</option>");
                code = row.AreaCode;
                roleId = row.RoleId;
                if (row.SystemRole == "普通用户") {
                    role = "USER"
                } else {
                    role = "OPERATION"
                }
                $("input[name='user'][value='" + role + "']").prop("checked", "checked");
                $.ajax({
                    type: "Get",
                    url: serverConfig.apiBase + "area/getarea"
                }).done(function (data) {
                    if (data.success) {
                        //行政区域
                        // //console.log(data);
                        html = "";
                        area = data.data;
                        // //console.log(area);
                        $.each(area, function (key, obj) {
                            // alert(obj.Name);
                            html += "<option value='" + obj.Code + "'>" + obj.Name + "</option>";
                        });
                        $("#area").html(html);
                        $("#area").find("option[value='" + code + "']").attr("selected", true);
                    } else {
                        layer.msg(data.message, { time: 3000 });
                    }
                });

                $.ajax({
                    type: "Get",
                    url: serverConfig.apiBase + "role/getrole"
                }).done(function (data2) {
                    if (data2.success) {
                        //用户名
                        html2 = "<option value=''>请选择</option>";
                        // //console.log(data);
                        // area = data.data;
                        // //console.log(area);
                        $.each(data2.data, function (key, obj) {
                            // alert(obj.Name);
                            html2 += "<option value='" + obj.Id + "'>" + obj.Name + "</option>";
                        });
                        $("#roleid").html(html2);
                        $("#roleid").find("option[value='" + roleId + "']").attr("selected", true);
                    } else {
                        layer.msg(data2.message);
                    }
                });
                //区域选择
                $("body").on("change", "#area", function () {
                    code = $(this).val();
                });
                //角色选择
                $("body").on("change", "#roleid", function () {
                    roleId = $(this).val();
                });

                //时间控件初始化
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
                    pickerPosition: "bottom-right"
                });
            },
            yes: function (index, layero) {
                role = $("input[name='user']:checked").val();
                // roleId = $("#roleid:selected").val();
                //alert(roleId);
                //规定电话号码格式
                var pp = $("#phone").val() ? $("#phone").val() : '';
                if (pp !== "") {
                    if (!(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(pp))&&!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(pp))) {
                        layer.msg("请输入正确的电话格式！");
                        //规定电话号码格式，格式错误后面无法点击
                    } else {
                        var obj = {
                            Id: row.Id,
                            Name: $("#username").val(),
                            Account: $("#account").val(),
                            AreaCode: code,
                            SystemRole: role,
                            Password: row.Password,
                            Remark: $("#remark").val(),
                            Phone: $("#phone").val(),
                            RoleId: roleId
                        };
                        //alert(JSON.stringify(obj));
                        $.ajax({
                            type: "post",
                            url: serverConfig.apiBase + "user/saveuser",
                            data: JSON.stringify(obj)
                        }).done(function (data) {
                            ////console.log(data);
                            if (data.success) {
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                                layer.msg("提交成功");
                                initTab();
                            } else {
                                layer.msg(data.message, { time: 3000 });
                            }
                        });
                    }
                } else {
                    var obj = {
                        Id: row.Id,
                        Name: $("#username").val(),
                        Account: $("#account").val(),
                        AreaCode: code,
                        SystemRole: role,
                        Password: row.Password,
                        Remark: $("#remark").val(),
                        Phone: $("#phone").val(),
                        RoleId: roleId
                    };
                    //alert(JSON.stringify(obj));
                    $.ajax({
                        type: "post",
                        url: serverConfig.apiBase + "user/saveuser",
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        ////console.log(data);
                        if (data.success) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                            layer.msg("提交成功");
                            initTab();
                        } else {
                            layer.msg(data.message, { time: 3000 });
                        }
                    });
                }

            },
            end: function (index, layero) {
                layer.close(index);
            }
        });
    } else {
        //修改用户
        $(".confirmpsd").removeClass("hidden");
        $(".setpsd").removeClass("hidden");
        $("#username").val("");
        $("#account").val("");
        $("#psd").val("");
        $("#phone").val("");
        $("#roleid").val("");
        $("#psd2").val("");
        $("input[name='user'][value='USER']").prop("checked", "checked");
        $("#remark").val("");
        //区域选择
        code = "610400";
        //用户选择
        $("body").on("change", "#roleid", function () {
            roleId = $(this).val();
        });
        //密码设置
        $("#psd2").blur(function () {
            if ($(this).val() !== $("#psd").val()) {
                $("#psd2").parents(".confirmpsd").nextAll().css("pointer-events", "none");
                layer.msg("确认密码输入不一致！");
            } else {
                $("#psd2").parents(".confirmpsd").nextAll().removeAttr("style");
            }
        });
        role = $('input[type="radio"][name="user"]:checked').val();
        //规定电话号码格式
        layer.open({
            type: 1,
            area: ['450px', '650px'], //宽高
            title: '创建用户',
            shade: 0.1,
            maxmin: false,
            resize: false,
            btn: ['保存', '关闭'],
            shadeClose: true,
            //offset: ['150px', '20px'],
            content: $("#userform"),
            success: function (layero) {
                // $(layero).find("select").select2();
                $.ajax({
                    type: "GET",
                    url: serverConfig.apiBase + "area/getarea"
                }).done(function (data) {
                    if (data.success) {
                        //区域选择
                        html = "";
                        area = data.data;
                        // //console.log(area);
                        $.each(area, function (key, obj) {
                            // alert(obj.Name);
                            html += "<option value='" + obj.Code + "'>" + obj.Name + "</option>";
                        });
                        $("#area").html(html);
                    } else {
                        layer.msg(data.message, { time: 3000 });
                    }
                });
                $.ajax({
                    type: "Get",
                    url: serverConfig.apiBase + "role/getrole"
                }).done(function (data2) {
                    if (data2.success) {
                        //用户选择
                        html2 = "<option value=''>请选择</option>";
                        // //console.log(data);
                        // area = data.data;
                        // //console.log(area);
                        $.each(data2.data, function (key, obj) {
                            // alert(obj.Name);
                            html2 += "<option value='" + obj.Id + "'>" + obj.Name + "</option>";
                        });
                        $("#roleid").html(html2);
                    } else {
                        layer.msg(data.message, { time: 3000 });
                    }
                });
                $("body").on("change", "#area", function () {
                    code = $(this).val();
                });
                $("body").on("change", "#roleid", function () {
                    roleId = $(this).val();
                });
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
                    pickerPosition: "bottom-right"
                });
            },
            yes: function (index, layero) {
                role = $("input[name='user']:checked").val();
                var pp = $("#phone").val() ? $("#phone").val() : "";
                if (pp !== "") {
                    if ((!(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(pp))&&!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(pp)))) {
                        layer.msg("请输入正确的电话格式！");
                        //规定电话号码格式，格式错误后面无法点击
                    } else {
                        //提交修改
                        var obj = {
                            // Id: row.Id,
                            Name: $("#username").val(),
                            Account: $("#account").val(),
                            AreaCode: code,
                            SystemRole: role,
                            Password: $("#psd").val(),
                            Remark: $("#remark").val(),
                            RoleId: roleId,
                            Phone: $("#phone").val()
                        };
                        //alert(JSON.stringify(obj));
                        $.ajax({
                            type: "post",
                            url: serverConfig.apiBase + "user/saveuser",
                            data: JSON.stringify(obj)
                        }).done(function (data) {
                            ////console.log(data);
                            if (data.success) {
                                layer.close(index); //如果设定了yes回调，需进行手工关闭
                                layer.msg("提交成功");
                                initTab();
                            } else {
                                layer.msg(data.message, { time: 3000 });
                            }
                        });
                    }
                } else {
                    var obj = {
                        // Id: row.Id,
                        Name: $("#username").val(),
                        Account: $("#account").val(),
                        AreaCode: code,
                        SystemRole: role,
                        Password: $("#psd").val(),
                        Remark: $("#remark").val(),
                        RoleId: roleId,
                        Phone: $("#phone").val()
                    };
                    //alert(JSON.stringify(obj));
                    $.ajax({
                        type: "post",
                        url: serverConfig.apiBase + "user/saveuser",
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        ////console.log(data);
                        if (data.success) {
                            layer.close(index); //如果设定了yes回调，需进行手工关闭
                            layer.msg("提交成功");
                            initTab();
                        } else {
                            layer.msg(data.message, { time: 3000 });
                        }
                    });
                }
            },
            end: function (index, layero) {
                layer.close(index);
            }
        });
    }
}

//删除用户
function delUser(row) {
    var ids = new Array;
    ids.push(row.Id);
    // alert(JSON.stringify(ids));
    layer.confirm('是否删除？', {
        btn: ['确实', '取消'] //按钮
    }, function () {
        //console.log(ids);
        $.ajax({
            type: "delete",
            url: serverConfig.apiBase + "user/deleteuser",
            data: JSON.stringify(ids)
        }).done(function (data) {
            // //console.log(data);
            if (data.success) {
                initTab();
                layer.msg('删除成功！');
            } else {
                layer.msg(data.message, { time: 3000 });
            }
        });
    }, function (index) {
        layer.close(index);
    });
}

//查询用户
function queryUser() {
    var qName = $("#username0").val();
    var qAccount = $("#account0").val();
    var qCode = $("#adminArea").find("option:selected").val();
    var qSystemrole = $("#system0").find("option:selected").val();
    // alert(qName + ":" + qAccount + ":" + qCode + ":" + qSystemrole);
    $.ajax({
        type: "get",
        url: serverConfig.apiBase + "user/getuser",
        data: {
            Name: qName,
            Account: qAccount,
            AreaCode: qCode,
            SystemRole: qSystemrole
        }
    }).done(function (data2) {
        // //console.log(data2);
        if (data2.success) {
            table = $('#example').DataTable({
                language: reportLanguage,
                scrollX: true,
                scrollCollapse: true,
                lengthChange: false,
                ordering: false,
                searching: false,
                aaData: data2.data,
                bDestroy: true,
                columns: [
                    { "data": null },
                    { "data": "Name" },
                    { "data": "Account" },
                    { "data": "AreaName" },
                    { "data": "RoleName" },
                    { "data": "SystemRole" },
                    { "data": "Phone" },
                    { "data": "Remark" },
                    { "data": null }
                ],
                columnDefs: [{
                    targets: 8,
                    render: function (data, type, row, meta) {
                        var aa = JSON.stringify(row).replace(/\"/g, "'");
                        return '<button type="button" class="btn btn-xs set" onclick="setUser(' + aa + ')"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button><button type="button" class="btn btn-xs btn-del" onclick="delUser(' + aa + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                    }
                }],
                fnDrawCallback: function () { //解决序号列没法生成的问题
                    var api = this.api();
                    var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
                    api.column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = startIndex + i + 1;
                    });
                }
            });
        }
        else {
            table = $('#example').DataTable({
                language: reportLanguage,
                scrollX: true,
                scrollCollapse: true,
                lengthChange: false,
                ordering: false,
                searching: false,
                aaData: null,
                bDestroy: true,
                columns: [
                    { "data": null },
                    { "data": "Name" },
                    { "data": "Account" },
                    { "data": "AreaName" },
                    { "data": "RoleName" },
                    { "data": "SystemRole" },
                    { "data": "Phone" },
                    { "data": "Remark" },
                    { "data": null }
                ],
                columnDefs: [{
                    targets: 8,
                    render: function (data, type, row, meta) {
                        var aa = JSON.stringify(row).replace(/\"/g, "'");
                        return '<button type="button" class="btn btn-xs btn-info" onclick="setUser(' + aa + ')">修改</button><button type="button" class="btn btn-xs btn-info" onclick="delUser(' + aa + ')">删除</button>';
                    }
                }],
                fnDrawCallback: function () { //解决序号列没法生成的问题
                    var api = this.api();
                    var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
                    api.column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = startIndex + i + 1;
                    });
                }
            });
        }
    })
}