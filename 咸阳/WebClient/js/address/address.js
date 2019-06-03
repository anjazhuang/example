var user = JSON.parse($.cookie("user"));
var rData = null;

//初始化通讯录列表
function setTable() {
    rData = null;
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "setting/getaddresslist"
    }).done(function (data) {
        if (data.success) {
            rData = data.data;
            var name_search = $("#name_search").val();
            var department_search = $("#department_search").val();
            var phone_search = $("#phone_search").val();
            if (name_search != null && name_search != "") {
                rData = $.grep(rData, function (v) {
                    return v.Name.indexOf(name_search) != -1;
                });
            }
            if (department_search != null && department_search != "") {
                rData = $.grep(rData, function (v) {
                    return v.Department.indexOf(department_search) != -1;
                });
            }
            if (phone_search != null && phone_search != "") {
                rData = $.grep(rData, function (v) {
                    return v.Phone.indexOf(phone_search) != -1;
                });
            }
            table = $('#address_table').DataTable({
                language: reportLanguage,
                scrollX: true,
                scrollCollapse: true,
                lengthChange: false,
                ordering: false,
                searching: false,
                aaData: rData,
                bDestroy: true,
                paging: false,
                columns: [
                    { "data": null, "targets": 0 },
                    { "data": "Name" },
                    { "data": "Department" },
                    { "data": "Phone" },
                    { "data": "Remark" },
                    { "data": null }
                ],
                columnDefs: [{
                    targets: 5,
                    render: function (data, type, row, meta) {
                        return '<button type="button" class="btn btn-sm set" onclick=setAddress("' + row.Id + '")><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button>' +
                            '<button type="button" class="btn btn-sm btn-del" onclick=delAddress("' + row.Id + '")><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
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
}

//设置通讯录新增修改弹窗事件
function setAddress(id) {
    if (isNull(id)) {
        layer.open({
            type: 1,
            area: ['400px', '400px'], //宽高
            title: '新增',
            shade: 0.1,
            maxmin: false,
            resize: false,
            zIndex: 0,
            btn: ['保存', '关闭'],
            shadeClose: true,
            content: $('#add_address'),
            success: function () {
                $("#name_txt").val("");
                $("#department_txt").val("");
                $("#phone_txt").val("");
                $("#remark_txt").val("");
            },
            yes: function (index, layero) {
                var check = true;
                $("#name_txt,#department_txt,#phone_txt").each(function () {
                    if ($(this).val() == "") {
                        $(this).focus();
                        var name = $(this).attr("name");
                        layer.msg(name + "不能为空");
                        check = false;
                    }
                });
                if (check) {
                    //新增
                    var obj = {
                        Name: $("#name_txt").val(),
                        Department: $("#department_txt").val(),
                        Phone: $("#phone_txt").val(),
                        Remark: $("#remark_txt").val()
                    };

                    $.ajax({
                        type: "post",
                        url: serverConfig.apiBase + "setting/saveaddresslist",
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        if (data.success) {
                            setTable();
                            layer.msg('添加成功!');
                            layer.close(index);
                        } else {
                            layer.msg(data.message, { time: 3000 });
                        }
                    });
                }
            },
            end: function (index, layero) {
                layer.close(index);
                $("#add_address")[0].reset();
            }
        });
    }
    else {
        // initstation('stnm');
        layer.open({
            type: 1,
            area: ['400px', '400px'], //宽高
            title: '修改',
            shade: 0.1,
            maxmin: false,
            resize: false,
            zIndex: 0,
            btn: ['保存', '关闭'],
            shadeClose: true,
            content: $('#add_address'),
            success: function () {
                var mData = $.grep(rData, function (v) {
                    return v.Id == id;
                });
                $("#name_txt").val(mData[0].Name);
                $("#department_txt").val(mData[0].Department);
                $("#phone_txt").val(mData[0].Phone);
                $("#remark_txt").val(mData[0].Remark);

                var obj = {
                    Type: 'get',
                    Uri: '/device/select',
                    Parameter: {
                        id: id
                    }
                };
            },
            yes: function (index, layero) {
                var check = true;
                $("#name_txt,#department_txt,#phone_txt").each(function () {
                    if ($(this).val() == "") {
                        $(this).focus();
                        var name = $(this).attr("name");
                        layer.msg(name + "不能为空");
                        check = false;
                    }
                });
                if (check) {
                    //修改
                    var obj = {
                        Id: id,
                        Name: $("#name_txt").val(),
                        Department: $("#department_txt").val(),
                        Phone: $("#phone_txt").val(),
                        Remark: $("#remark_txt").val()
                    };

                    $.ajax({
                        type: "post",
                        url: serverConfig.apiBase + "setting/saveaddresslist",
                        data: JSON.stringify(obj)
                    }).done(function (data) {
                        if (data.success) {
                            setTable();
                            layer.msg('修改成功!');
                            layer.close(index);
                        } else {
                            layer.msg(data.message, { time: 3000 });
                        }
                    });
                }
            },
            end: function (index, layero) {
                layer.close(index);
                $("#add_address")[0].reset();
            }
        });
    }

}

//删除通讯录
function delAddress(id) {
    var ids = new Array;
    ids.push(id);
    layer.confirm('是否删除？', {
        btn: ['确实', '取消'] //按钮
    }, function () {
        $.ajax({
            type: "delete",
            url: serverConfig.apiBase + "setting/deleteaddresslist",
            data: JSON.stringify(ids)
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

$(function () {
    //初始化列表
    init();
    setTable();

    //查询
    $("#searchBtn").click(function () {
        setTable();
    });

    //添加通讯录按钮触发弹窗
    $('#address_add_btn').on('click', function () {
        setAddress();
    });
});
