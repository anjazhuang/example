var table = "";
var html = "";

//初始化角色列表
function initTab() {
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "role/getrole"
    }).done(function (data) {
        if (data.success) {
            //角色列表
            table = $('#example').DataTable({
                language: reportLanguage,
                scrollX: true,
                scrollCollapse: true,
                lengthChange: false,
                ordering: false,
                searching: false,
                aaData: data.data,
                bDestroy: true,
                columns: [
                    { "data": null },
                    { "data": "Name" },
                    { "data": "Remark" },
                    { "data": null }
                ],
                columnDefs: [{
                    targets: 3,
                    render: function (data, type, row) {
                        var id = row.Id;
                        var name = row.Name;
                        var rem = row.Remark;
                        var power = row.PowerIds;
                        return '<button type="button" class="btn btn-xs set"  data-power="' + power + '" data-id="' + id + '" data-name="' + name + '" data-rem="' + rem + ' " onclick="roleSet(this)"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button>' +
                            '<button type="button" class="btn btn-xs btn-del" onclick="delRole(this)" data-id="' + id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                    }
                }
                ],
                fnDrawCallback: function () { //解决序号列没法生成的问题
                    var api = this.api();
                    var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
                    api.column(0).nodes().each(function (cell, i) {
                        cell.innerHTML = startIndex + i + 1;
                    });
                }
            }).draw();
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

$(function () {
    //ajax初始化
    init();
    //数据列表初始化
    initTab();
    //创建角色
    $('#creatRole').on('click', function () {
        //添加及修改角色弹窗
        roleSet();
    });
    //下拉框combox
    $("select").select2();
    //查询角色
    $("#queryRole").click(function () {
        var roleName = $(".roleName").val();
        $.ajax({
            type: "get",
            url: serverConfig.apiBase + "role/getrole",
            data: {
                roleName: roleName
            }
            //timeout: 1000,
        }).done(function (data) {
            if (data.success) {
                //重新加载角色列表
                table = $('#example').DataTable({
                    language: reportLanguage,
                    scrollX: true,
                    scrollCollapse: true,
                    lengthChange: false,
                    ordering: false,
                    searching: false,
                    aaData: data.data,
                    bDestroy: true,
                    columns: [
                        { "data": null },
                        { "data": "Name" },
                        { "data": "Remark" },
                        { "data": null }
                    ],
                    columnDefs: [{
                        targets: 3,
                        render: function (data, type, row) {
                            var id = row.Id;
                            var name = row.Name;
                            var rem = row.Remark;
                            var power = row.PowerIds;
                            return '<button type="button" class="btn btn-xs set" data-power="' + power + '" data-id="' + id + '" data-name="' + name + '" data-rem="' + rem + ' " onclick="roleSet(this)"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button>' +
                                '<button type="button" class="btn btn-xs btn-del" onclick="delRole(this)" data-id="' + id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                        }
                    }
                    ],
                    fnDrawCallback: function () { //解决序号列没法生成的问题
                        var api = this.api();
                        var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数
                        api.column(0).nodes().each(function (cell, i) {
                            cell.innerHTML = startIndex + i + 1;
                        });
                    }
                });
            } else {
                // layer.msg(data.message,{time:3000});
                table = $('#example').DataTable({
                    language: reportLanguage,
                    scrollX: true,
                    scrollCollapse: true,
                    lengthChange: false,
                    ordering: false,
                    searching: false,
                    aaData: [],
                    bDestroy: true,
                    columns: [
                        { "data": null },
                        { "data": "Name" },
                        { "data": "Remark" },
                        { "data": null }
                    ],
                    columnDefs: [{
                        targets: 3,
                        render: function (data, type, row) {
                            var id = row.Id;
                            var name = row.Name;
                            var rem = row.Remark;
                            var power = row.PowerIds;
                            return '<button type="button" class="btn btn-xs set" data-power="' + power + '" data-id="' + id + '" data-name="' + name + '" data-rem="' + rem + ' " onclick="roleSet(this)"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button>' +
                                '<button type="button" class="btn btn-xs btn-del" onclick="delRole(this)" data-id="' + id + '"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                        }
                    }
                    ],
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
    });
    // $(".roleName").keyup(function () {
    //     if ($(this).val() == null || $(this).val() == "") {
    //         $("#queryRole").trigger("click");
    //     }
    // });
});

//删除角色
function delRole(which) {
    var ids = new Array;
    ids.push($(which).data("id"));
    layer.confirm('是否删除？', {
        btn: ['确实', '取消'] //按钮
    }, function () {
        //console.log(ids);
        $.ajax({
            type: "delete",
            url: serverConfig.apiBase + "role/deleterole",
            data: JSON.stringify(ids)
            //timeout: 1000,
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

//添加及修改角色
function roleSet(which) {
    if (which) {
        var ids = $(which).data("id");
        var names = $(which).data("name");
        var rems = $(which).data("rem");
        $.ajax({
            type: "GET",
            url: serverConfig.apiBase + "power/getpowertree",
            data: {
                roleId: ids
            }
        }).done(function (data) {
            if (data.success) {
                var treelist = data.data;
                layer.open({
                    type: 1,
                    area: ['350px', '500px'], //宽高
                    title: '创建角色',
                    shade: 0.1,
                    maxmin: false,
                    resize: false,
                    btn: ['保存', '关闭'],
                    shadeClose: true,
                    //offset: ['150px', '20px'],
                    content: $("#layerform"),
                    success: function (layero, index) {
                        var setting = {
                            check: {
                                enable: true,
                                chkboxType: { "Y": "ps", "N": "ps" },
                                //chkboxType: { "Y": "ps", "N": "ps" },
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id", // id编号命名
                                    pIdKey: "pId", // 父id编号命名
                                    rootPId: 0
                                }
                            },
                            view: {
                                showIcon: true
                            }
                        };
                        //获取角色权限数据
                        $.fn.zTree.init($("#treeDemoRole"), setting, treelist);
                        var zTree = $.fn.zTree.getZTreeObj('treeDemoRole');
                        for (var i = 0; i < treelist.length; i++) {
                            if (treelist[i].isCheck) {
                                zTree.checkNode(zTree.getNodeByParam("id", treelist[i].id), true);
                            }
                        }
                        //展开
                        zTree.expandNode(zTree.getNodes()[0], true);
                        $("#roleName").val(names);
                        $("#roleRem").val(rems);
                    },
                    yes: function (index, layero) {
                        //提交新加角色
                        var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRole'), $.fn.zTree.getZTreeObj('treeDemoRole').getNodes(), []);
                        var newName = $("#roleName").val();
                        var newRem = $("#roleRem").val();
                        // alert(newName+":"+newRem);
                        var obj = {
                            Id: ids,
                            Name: newName,
                            Remark: newRem,
                            PowerIds: powers
                        };
                        $.ajax({
                            type: "post",
                            url: serverConfig.apiBase + "role/saverole",
                            data: JSON.stringify(obj)
                            //timeout: 1000,
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
                    },
                    end: function (index, layero) {
                        layer.close(index);
                        //alert("hh");
                    }
                });
            }
        });
    } else {
        //修改角色
        $("#roleName").val('');
        $("#roleRem").val('');
        layer.open({
            type: 1,
            area: ['350px', '500px'], //宽高
            title: '创建角色',
            shade: 0.1,
            maxmin: false,
            resize: false,
            btn: ['保存', '关闭'],
            shadeClose: true,
            //offset: ['150px', '20px'],
            content: $("#layerform"),
            success: function (layero, index) {
                ////console.log(layero, index);
                $.ajax({
                    type: "GET",
                    url: serverConfig.apiBase + "power/allpowertree"
                }).done(function (data) {
                    var alltreelist = data.data;
                    if (data.success) {
                        var setting = {
                            check: {
                                enable: true,
                                chkboxType: { "Y": "s", "N": "" }
                            },
                            data: {
                                simpleData: {
                                    enable: true,
                                    idKey: "id", // id编号命名
                                    pIdKey: "pId", // 父id编号命名
                                    rootPId: 0
                                }
                            },
                            view: {
                                showIcon: true
                            }
                        };
                        //获取权限数据,
                        $.fn.zTree.init($("#treeDemoRole"), setting, alltreelist);
                        var zTree0 = $.fn.zTree.getZTreeObj('treeDemoRole');
                        zTree0.expandNode(zTree0.getNodes()[0], true);
                    }
                })
            },
            yes: function (index, layero) {
                //遍历获取勾选权限数据
                var powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRole'), $.fn.zTree.getZTreeObj('treeDemoRole').getNodes(), []);
                ////console.log(powers);
                var newName = $("#roleName").val();
                var newRem = $("#roleRem").val();
                //alert(newName + ":" + newRem);
                //提交修改数据
                var obj = {
                    Name: newName,
                    Remark: newRem,
                    PowerIds: powers
                };
                $.ajax({
                    type: "post",
                    url: serverConfig.apiBase + "role/saverole",
                    data: JSON.stringify(obj),
                    //timeout: 1000,
                }).done(function (data) {
                    ////console.log(data);
                    if (data.success) {
                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                        layer.msg("添加成功");
                        initTab();
                    } else {
                        layer.msg(data.message, { time: 3000 });
                    }
                });
            },
            end: function (index, layero) {
                layer.close(index);
            }
        });
    }
}

//获取勾选权限
function GetNodeIds(zTree, nodes, ids) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && !nodes[i].getCheckStatus().half) {
            ids.push(nodes[i].id)
        }
        if (nodes[i].children != null) {
            GetNodeIds(zTree, nodes[i].children, ids);
        }
    }
    return ids;
}
