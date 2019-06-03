//站点数组变量
var powers, powers1, powers2 = [];
var table = "";
var html = "";
var type, level = "";
var fileArray = [];
//图片接口连接
var picapi = $.cookie("picapi");
//图片显示src连接
var picapi1 = picapi.replace("/api", "");
$(function () {
    //ajax初始化
    init();
    //行政区域树形插件数据初始化
    initTreedata(0);
    //流域树形插件数据初始化
    initRiver();
    //行政区域数据下拉框初始化
    initArea();
    //查询条件监测站点数据初始化
    initCode(0);
    //下拉框combox
    $(".content-box select").select2();
    //站点列表数据初始化
    setTable();
    //查询按钮
    $("#queryStation").click(function () {
        level = $(".form-control").eq(0).find("option:selected").val() == "0" ? "" : $(".form-control").eq(0).find("option:selected").val();
        type = $(".form-control").eq(1).find("option:selected").val() == "" ? "" : $(".form-control").eq(1).find("option:selected").val();
        // alert(type+":"+level);
        setTable(type, level);
    });

    $("#sttp").on("change", function () {
        var stp = $(this).val();
        // if (stp == "ZQ" || stp == "ZZ") {
        //     $(this).css("width", "40%");
        //     $(".riwaterheight").css("display", "inline-block");
        //     $(".rewaterheight").css("display", "none");
        // } else if (stp == "RR") {
        //     $(this).css("width", "40%");
        //     $(".rewaterheight").css("display", "inline-block");
        //     $(".riwaterheight").css("display", "none");
        // } else {
        //     $(this).css("width", "90%");
        //     $(".rewaterheight").css("display", "none");
        //     $(".riwaterheight").css("display", "none");
        // }
    });
    $("#uploadDiv").on("click", function () {
        if ($(".photosbox").size() >= 4) {
            layer.msg("不能超过4张图片")
        } else {
            var uploadFile = '<div class="photosbox"><input name="files" id="uploaderInput" class="weui-uploader__input" type="file" accept="image/*"/></div>';
            $("#fileDiv").append($(uploadFile));
            $("#uploaderInput").bind("change", function (e) {
                //可以做一些其他的事，比如图片预览
                // var num = $('.img-add .smallpic').length;
                var files = $(this).get(0).files;
                var windowURL = window.URL || window.webkitURL;
                for (var i = 0; i < files.length; i++) {
                    var url = windowURL.createObjectURL(files[i]); //客户端图形缩略图预览路径
                    var dname = /\.([^\.]+)$/.exec(files[i].name); //文件后缀名
                    var pattern = /\.(jpg|gif|jpeg|png)+$/ig; //图片验证正则模式
                    $(this).parent('.photosbox').append('<span class="smallpic" ><img src="' + url + '"><i class="glyphicon glyphicon-remove-circle delete" ></i></span>');
                    // if (num > 2) {
                    //     $(".addbtnbox").hide();
                    //     return false;
                    // }
                    fileArray.push(files[i]);
                }
                $(this).removeAttr("id");
            });
            $("#uploaderInput").click();
        }
    });
    //添加图片，不能超过4张
    // $("#addpic").on("change", function () {
    //     var num = $('.img-add .smallpic').length;
    //     var files = $(this).get(0).files;
    //     var windowURL = window.URL || window.webkitURL;
    //     for (var i = 0; i < files.length; i++) {
    //         var url = windowURL.createObjectURL(files[i]); //客户端图形缩略图预览路径
    //         var dname = /\.([^\.]+)$/.exec(files[i].name); //文件后缀名
    //         var pattern = /\.(jpg|gif|jpeg|png)+$/ig; //图片验证正则模式
    //         $('.img-add').append('<span class="smallpic" ><img src="' + url + '"><i class="glyphicon glyphicon-remove-circle delete" ></i></span>');
    //         if (num > 2) {
    //             $(".addbtnbox").hide();
    //             return false;
    //         }
    //         fileArray.push(files[i]);
    //     }
    //     //console.log(fileArray);
    // });

    //监测站点选择触发筛选数据方法
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');

    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(0, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    //报讯等级选择触发筛选数据方法
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert(evt.params.data.id);
    //     initTreedata(0, $("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(0, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(0, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(0, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    //测站类型选择触发筛选数据方法
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(0, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
});

//搜索站点
// function keydownSearch() {
//     $("#searchAction").click();
// };
//
// function keydownSearch1() {
//     $("#searchAction1").click();
// };

//初始化及查询站点列表方法
function setTable(type, level) {
    // alert(type);
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        //console.log(powers);
    } else if ($(".tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        //console.log(powers);
    }
    //数据列表加载
    table = $('#example').DataTable({
        language: reportLanguage1,
        scrollX: true,
        scrollCollapse: true,
        lengthChange: false,
        ordering: false,
        serverSide: true,
        searching: false,
        bDestroy: true,
        // iDisplayLength: 15,
        paging: false,
        columns: [
            { "data": null, "targets": 0 },
            { "data": "Code" },
            { "data": "Name" },
            { "data": "AreaName" },
            { "data": "RiverAreaName" },
            { "data": "RiverSystemName" },
            { "data": "RiverName" },
            { "data": "Level" },
            { "data": "Type" },
            { "data": null }
        ],
        columnDefs: [
            {
                targets: 9,
                render: function (data, type, row, meta) {
                    var source = JSON.stringify(row).replace(/\"/g, "'");
                    return '<button type="button" class="btn btn-xs set" onclick="setStation(' + source + ')"><span class="glyphicon glyphicon-list-alt"></span>&nbsp;修改</button><button type="button" class="btn btn-xs btn-del" onclick="delete0(' + source + ')"><span class="glyphicon glyphicon-trash"></span>&nbsp;删除</button>';
                }
            }
        ],
        ajax: function (data, callback, settings) {
            //封装请求参数
            ////console.log(param);
            //ajax请求数据
            var obj = {
                Type: 'post',
                Uri: '/station/getstation',
                Parameter: {
                    Codes: powers ? powers : "",
                    Level: "",
                    Type: "",
                    // PageIndex: (data.start / data.length) + 1,//当前页码
                    // PageSize: data.length //页面显示记录条数，在页面显示每页显示多少项的时候
                    PageIndex: 1,//当前页码
                    PageSize: 99999 //页面显示记录条数，在页面显示每页显示多少项的时候
                }
            };
            $.ajax({
                url: serverConfig.soilApi,
                data: JSON.stringify(obj)
            }).done(function (database) {
                if (database.success) {
                    setTimeout(function () {
                        //封装返回数据

                        var result = database.data;
                        ////console.log(result);
                        var returnData = {};
                        returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.total;//返回数据全部记录
                        returnData.recordsFiltered = result.total;//后台不实现过滤功能，每次查询均视作全部结果
                        var ttall = [];
                        for (var i = 0; i < country.length; i++) {
                            var tt = $.grep(result.data, function (d) {
                                return d.AreaName == country[i]
                            });
                            for (var a = 0; a < tt.length; a++) {
                                ttall.push(tt[a]);
                            }
                        }
                        returnData.data = ttall;//返回的数据列表
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

//河流树形插件数据加载
function initRiver() {
    $.ajax({
        url: serverConfig.apiBase + "river/getriver",
        type: "get"
    }).done(function (data) {
        ////console.log(data);
        if (data.success) {
            ////console.log(data.data);
            var a0 = $.grep(data.data, function (d) {
                return d.RLevel == "3";
            });
            ////console.log(a0);
            var option = "<option value=''>请选择</option>";
            $.each(a0, function (i, v) {
                option += "<option value='" + v.Name + "'>" + v.Name + "</option>";
            });
            $("#rivername").html(option);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    })
}

//初始化测站编码
// function initCode() {
//     var user = JSON.parse($.cookie("user"));
//     var obj = {
//         Type: 'get',
//         Uri: '/station/getmapstation',
//         Parameter: {
//             areaCode: user.AreaCode
//         }
//     };
//     $.ajax({
//         url: serverConfig.soilApi,
//         data: JSON.stringify(obj)
//     }).done(function (data) {
//         var html0 = '<option value="">请选择</option>';
//         if (data.success) {
//             $.each(data.data, function (key, obj) {
//                 if (obj.Name !== "咸阳市") {
//                     html0 += "<option value='" + obj.Code + "'>" + obj.Code + "</option>";
//                 }
//             });
//             $("#stcode").html(html0);
//         } else {
//             layer.msg(data.message,{time:3000});
//         }
//     });
// }

//获取勾选站点编码
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

//导出测站
function exportStations() {
    level = $(".form-control").eq(0).find("option:selected").val() == "0" ? "" : $(".form-control").eq(0).find("option:selected").val();
    type = $(".form-control").eq(1).find("option:selected").val() == "" ? "" : $(".form-control").eq(1).find("option:selected").val();
    if ($(".tab0:first ").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
        //console.log(powers);
    } else if ($(".tab0:last").hasClass("active")) {
        powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
        //console.log(powers);
    }
    //console.log(level + type);
    var obj = {
        Type: 'post',
        Uri: '/data/exportststiondata',
        SessionId: $.cookie("sessionid"),
        Parameter: {
            Codes: powers,
            Level: level ? level : "",
            Type: type ? type : ""
        }
    };
    DownLoadFile({
        url: serverConfig.soilExportApi,
        data: obj
    });
}

//监测站点选择触发筛选数据方法
function initArea() {
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "area/getarea"
    }).done(function (data) {
        if (data.success) {
            html = "";
            $.each(data.data, function (key, obj) {
                if (obj.Name !== "咸阳") {
                    html += "<option value='" + obj.Code + "'>" + obj.Name + "</option>";
                }
            });
            $("#area").html(html);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//当参数为空时，为添加测站状态；当参数不为空时，为修改测站状态
function setStation(dd) {
    var longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
    var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
    if (dd === undefined) {
        $("body").on("click", ".delete", function () {
            //alert("dd");
            $(this).parents(".photosbox").remove();
            // //$(this).parent("span").remove();
            // if (!$(".addbtnbox").show()) {
            //     $(".addbtnbox").show();
            // }
        });
        $("#fileDiv").html("");
        $("#sttm").val("");
        $("#sttp").css("width", "90%");
        $(".rewaterheight").css("display", "none");
        $(".riwaterheight").css("display", "none");
        $("#area,#river,#sttp,#type").val("");
        //添加测站弹窗
        layer.open({
            type: 1,
            area: ['810px', '550px'], //宽高
            title: '添加测站',
            shade: 0.1,
            maxmin: false,
            resize: true,
            zIndex: 0,
            btn: ['保存', '关闭'],
            shadeClose: false,
            //offset: ['150px', '20px'],
            content: $('#addstation'),
            success: function () {
                // $("#addstation").reset();
                //表单重置
                $("#stcd").val("");
                $("#stnm").val("");
                initRiver();
                initArea();
                $("#type").find("option[value='0']").prop("selected", true);
                $("#sttp").find("option[value='0']").prop("selected", true);
                $("#lon").val("");
                $("#lat").val("");
                $("#staddr").val("");
                $(".riwaterheight input").val("");
                $(".rewaterheight input").val("");
            },
            yes: function (index, layero) {
                var filesrc = [];

                $(".photosbox .weui-uploader__input").each(function () {
                    filesrc.push($(this).get(0).files[0]);
                    //alert("dd");
                });
                console.log(filesrc);
                //判断必填项是否为空，空时鼠标自动聚焦
                var val = 0;
                $("#addstation .input,#addstation select").each(function () {
                    if ($(this).val() == "") {
                        $(this).focus();
                        var name = $(this).attr("name");
                        layer.msg(name + "不能为空");
                        return false;
                    } else {
                        val++;
                    }
                });
                //所有选项不为空时可以提交
                if (val === 10) {
                    var tt = $("#addstation .input").eq(0).val();
                    if (tt.length < 8 || !tt.replace(/[^\d\.]/g, '')) {
                        layer.msg("测站编码必须只能为8位数字");
                    } else {
                        if (longrg.test($("#lon").val()) && latreg.test($("#lat").val())) {
                            var loading = layer.load(2, {
                                shade: [0.5, '#fff']
                            });
                            //重新上传图片，提交照片成功后方可提交新数据
                            if (filesrc.length !== 0) {
                                // alert(filesrc.length);
                                var obj = {
                                    Type: 'post',
                                    Uri: '/station/add',
                                    Parameter: {
                                        stcd: $("#stcd").val(),
                                        locality: "",
                                        stnm: $("#stnm").val(),
                                        addvcd: $("#area").val(),
                                        rvnm: $("#rivername").val(),
                                        frgrd: $("#type").val(),
                                        sttp: $("#sttp").val(),
                                        lgtd: $("#lon").val(),
                                        lttd: $("#lat").val(),
                                        esstym: $("#sttm").val().replace("-", ""),
                                        // moditime: $("#sttm").val(),
                                        stlc: $("#staddr").val() ? $("#staddr").val() : "",
                                        fsltdz: $(".rewaterheight input").val() ? $(".rewaterheight input").val() : "",
                                        wrz: $(".riwaterheight input").val() ? $(".riwaterheight input").val() : ""
                                    }
                                };
                                ////console.log(obj);
                                $.ajax({
                                    url: serverConfig.operationApi,
                                    data: JSON.stringify(obj)
                                }).done(function (data) {
                                    //console.log(data);
                                    if (data.success) {
                                        for (var i = 0; i < filesrc.length; i++) {
                                            var imgdata = new FormData();
                                            imgdata.append('files[]', filesrc[i]);
                                            console.log(imgdata);
                                            $.ajax({
                                                async: false,
                                                url: picapi + '/station/addImage?stcd=' + $("#stcd").val(),
                                                data: imgdata,
                                                cache: false,
                                                contentType: false,
                                                dataType: "json",
                                                processData: false,
                                                type: 'POST',
                                                success: function (data) {
                                                    //console.log(data);

                                                },
                                                fail: function (data) {
                                                    layer.msg("图片上传失败，请重操作！", { time: 3000 })
                                                }
                                            });

                                        }
                                        initTreedata();
                                        setTable();
                                        layer.msg('保存成功!');
                                        layer.close(loading);
                                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    } else {
                                        layer.msg(data.message, { time: 3000 });
                                        layer.close(loading);
                                    }
                                });
                            } else {
                                //无上传图片，只提交数据
                                var obj = {
                                    Type: 'post',
                                    Uri: '/station/add',
                                    Parameter: {
                                        stcd: $("#stcd").val(),
                                        locality: "",
                                        stnm: $("#stnm").val(),
                                        addvcd: $("#area").val(),
                                        rvnm: $("#rivername").val(),
                                        frgrd: $("#type").val(),
                                        sttp: $("#sttp").val(),
                                        lgtd: $("#lon").val(),
                                        lttd: $("#lat").val(),
                                        esstym: $("#sttm").val().replace("-", ""),
                                        stlc: $("#staddr").val() ? $("#staddr").val() : "",
                                        fsltdz: $(".rewaterheight input").val() ? $(".rewaterheight input").val() : "",
                                        wrz: $(".riwaterheight input").val() ? $(".riwaterheight input").val() : ""
                                    }
                                };
                                //console.log(obj);
                                $.ajax({
                                    url: serverConfig.operationApi,
                                    data: JSON.stringify(obj)
                                }).done(function (data) {
                                    //console.log(data);
                                    if (data.success) {
                                        initTreedata();
                                        setTable();
                                        layer.close(loading);
                                        layer.msg('数据上传成功！');
                                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    } else {
                                        layer.msg(data.message, { time: 3000 });
                                        layer.close(loading);
                                    }
                                });
                            }
                        }
                        // if ($('#addpic')[0].files.length !== 0) {
                        //     for (var i = 0; i < $('#addpic')[0].files.length; i++) {
                        //         var imgdata = new FormData();
                        //         imgdata.append('files[]', $('#addpic')[0].files[i]);
                        //         //console.log(imgdata);
                        //         $.ajax({
                        //             async: false,
                        //             url: picapi + '/station/addImage?stcd=' + $("#stcd").val(),
                        //             data: imgdata,
                        //             cache: false,
                        //             contentType: false,
                        //             dataType: "json",
                        //             processData: false,
                        //             type: 'POST',
                        //             success: function (data) {
                        //                 //console.log(data);
                        //             }
                        //         });
                        //     }
                        // }
                        else if (!latreg.test($("#lat").val())) {
                            layer.msg("纬度格式有误，请重新填写");
                        } else if (!longrg.test($("#lon").val())) {
                            layer.msg("经度格式有误，请重新填写");
                        }
                    }
                }
            },
            end: function (index, layero) {
                layer.close(index);
                $("#addstation")[0].reset();
            }
        });
    } else {
        //修改测站信息
        if (dd.Type == "河道水位站") {
            var sttp = "ZZ"
        } else if (dd.Type == "河道水文站") {
            var sttp = "ZQ"
        } else if (dd.Type == "墒情站") {
            var sttp = "SS"
        } else if (dd.Type == "雨量站") {
            var sttp = "PP"
        } else if (dd.Type == "水库水文站") {
            var sttp = "RR"
        }
        var imgdel = [];
        $("body").on("click", ".delete", function () {
            // $(this).parent("span").remove();
            $(this).parents(".photosbox").remove();
            var imgid = $(this).data("id");
            // alert(imgid);
            // $("#addpic").val("");
            imgdel.push(imgid);
            //console.log(imgdel);
            // if (!$(".addbtnbox").show()) {
            //     $(".addbtnbox").show();
            // }
        });
        // $("#addstation")[0].reset();
        // $('.img-add').html("");
        // $("#addpic").val("");
        // if (!$(".addbtnbox").show()) {
        //     $(".addbtnbox").show();
        // }
        $("#fileDiv").html("");
        // $("#sttp,#type").val("");
        //打开修改站点弹窗
        layer.open({
            type: 1,
            area: ['810px', '550px'], //宽高
            title: '修改测站',
            shade: 0.1,
            maxmin: false,
            resize: true,
            zIndex: 0,
            btn: ['保存', '关闭'],
            shadeClose: false,
            //offset: ['150px', '20px'],
            content: $('#addstation'),
            success: function () {
                var user = JSON.parse($.cookie("user"));
                //获取单独站点信息
                var obj = {
                    Type: 'get',
                    Uri: '/station/load',
                    Parameter: {
                        stcd: dd.Code,
                        sttp: sttp
                    }
                };
                $.ajax({
                    url: serverConfig.operationApi,
                    data: JSON.stringify(obj)
                }).done(function (data) {
                    if (data.success) {
                        //获取修改站点信息
                        //console.log(data.data);
                        $("#stcd").val(data.data.data.stcd);
                        $("#stnm").val(data.data.data.stnm.replace(/[ ]/g, ""));
                        $("#area").find("option[value='" + data.data.data.addvcd + "']").prop('selected', true);
                        $("#rivername").find("option[value='" + data.data.data.rvnm.replace(/[ ]/g, "") + "']").prop('selected', true);
                        $("#type").find("option[value='" + data.data.data.frgrd + "']").prop('selected', true);
                        $("#sttp").find("option[value='" + data.data.data.sttp + "']").prop('selected', true);
                        if (data.data.data.sttp == "ZQ" || data.data.data.sttp == "ZZ") {
                            // $("#sttp").css("width", "40%");
                            $(".riwaterheight").css("display", "inline-block");
                            $(".riwaterheight input").val(data.data.data.wrz);
                            $(".rewaterheight input").val("");
                        } else if (data.data.data.sttp == "RR") {
                            // $("#sttp").css("width", "40%");
                            $(".rewaterheight").css("display", "inline-block");
                            $(".rewaterheight input").val(data.data.data.fsltdz);
                            $(".riwaterheight input").val("");
                        } else {
                            // $("#sttp").css("width", "90%");
                            $(".rewaterheight").css("display", "none");
                            $(".riwaterheight").css("display", "none");
                            $(".riwaterheight input").val("");
                            $(".rewaterheight input").val("");
                        }
                        $("#lon").val(data.data.data.lgtd);
                        $("#lat").val(data.data.data.lttd);
                        $("#sttm").val(data.data.data.esstym ? data.data.data.esstym.substring(0, 4) + "-" + data.data.data.esstym.substring(4) : "");
                        $("#staddr").val(data.data.data.stlc.replace(/[ ]/g, ""));
                    } else {
                        //监测站点选择触发筛选数据方法
                        layer.msg(data.message, { time: 3000 })
                    }
                });
                $.ajax({
                    async: false,
                    url: picapi + "/station/getStcdImage?stcd=" + dd.Code,
                    cache: false,
                    contentType: false,
                    dataType: "json",
                    processData: false,
                    type: 'GET',
                    success: function (data) {
                        //获取图片
                        console.log(data.data);
                        $.each(data.data.data, function (i, v) {
                            $("#fileDiv").append('<div class="photosbox"><span class="smallpic" ><img src="' + picapi1 + v.url + '"><i class="glyphicon glyphicon-remove-circle delete" data-id="' + v.id + '"></i></span></div> ');

                            // $('.img-add').append('<span class="smallpic" ><img src="' + picapi1 + v.url + '"><i class="glyphicon glyphicon-remove-circle delete" data-id="' + v.id + '"></i></span>');
                        });
                        //console.log(data.data);
                    }
                });

            },
            yes: function (index, layero) {

                var filesrc = [];
                $(".photosbox .weui-uploader__input").each(function () {
                    filesrc.push($(this).get(0).files[0]);
                    //alert("dd");
                });
                console.log(filesrc.length);
                var val = 0;
                $("#addstation .input,#addstation select").each(function () {
                    if ($(this).val() == "") {
                        $(this).focus();
                        var name = $(this).attr("name");
                        layer.msg(name + "不能为空");
                        return false;
                    } else {
                        val++;
                    }
                });
                //选项不为空，可以提交
                if (val === 10) {
                    //测站编码必须只能为8位数字，才能提交
                    var tt = $("#addstation .input").eq(0).val();
                    if (tt.length < 8 || !tt.replace(/[^\d\.]/g, '')) {
                        layer.msg("测站编码必须只能为8位数字");
                    } else {

                        //删除照片
                        for (var ii = 0; ii < imgdel.length; ii++) {
                            $.ajax({
                                async: false,
                                url: picapi + "/station/deleteImage?id=" + imgdel[ii],
                                cache: false,
                                contentType: false,
                                dataType: "json",
                                processData: false,
                                type: 'GET',
                                success: function (data) {
                                    //console.log(data.data);
                                }
                            });
                        }
                        //获取需要新上传图片
                        if (longrg.test($("#lon").val()) && latreg.test($("#lat").val())) {
                            var loading = layer.load(2, {
                                shade: [0.5, '#fff']
                            });
                            if (filesrc.length > 0) {
                                var obj = {
                                    Type: 'post',
                                    Uri: '/station/update',
                                    Parameter: {
                                        stcd: $("#stcd").val(),
                                        locality: "",
                                        stnm: $("#stnm").val(),
                                        addvcd: $("#area").val(),
                                        rvnm: $("#rivername").val(),
                                        frgrd: $("#type").val(),
                                        sttp: $("#sttp").val(),
                                        lgtd: $("#lon").val(),
                                        lttd: $("#lat").val(),
                                        esstym: $("#sttm").val().replace("-", ""),
                                        stlc: $("#staddr").val() ? $("#staddr").val() : "",
                                        fsltdz: $(".rewaterheight input").val() ? $(".rewaterheight input").val() : "",
                                        wrz: $(".riwaterheight input").val() ? $(".riwaterheight input").val() : ""
                                    }
                                };
                                //alert(JSON.stringify(obj));
                                $.ajax({
                                    url: serverConfig.operationApi,
                                    data: JSON.stringify(obj)
                                }).done(function (data) {
                                    if (data.success) {
                                        for (var i = 0; i < filesrc.length; i++) {
                                            var imgdata = new FormData();
                                            imgdata.append('files[]', filesrc[i]);
                                            console.log(imgdata);
                                            $.ajax({
                                                async: true,
                                                url: picapi + "/station/addImage?stcd=" + $("#stcd").val(),
                                                data: imgdata,
                                                cache: false,
                                                contentType: false,
                                                dataType: "json",
                                                processData: false,
                                                type: 'POST',
                                                success: function (data) {

                                                }
                                            });
                                        }
                                        initTreedata();
                                        setTable();
                                        layer.msg('上传站点数据成功!');
                                        layer.close(loading);
                                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    } else {
                                        layer.msg(data.message, { time: 3000 });
                                        layer.close(loading);
                                    }
                                });
                            }
                            else {
                                //无上传图片
                                var obj = {
                                    Type: 'post',
                                    Uri: '/station/update',
                                    Parameter: {
                                        stcd: $("#stcd").val(),
                                        locality: "",
                                        stnm: $("#stnm").val(),
                                        addvcd: $("#area").val(),
                                        rvnm: $("#rivername").val(),
                                        frgrd: $("#type").val(),
                                        sttp: $("#sttp").val(),
                                        lgtd: $("#lon").val(),
                                        lttd: $("#lat").val(),
                                        esstym: $("#sttm").val().replace("-", ""),
                                        stlc: $("#staddr").val() ? $("#staddr").val() : "",
                                        fsltdz: $(".rewaterheight input").val() ? $(".rewaterheight input").val() : "",
                                        wrz: $(".riwaterheight input").val() ? $(".riwaterheight input").val() : ""
                                    }
                                };
                                //alert(JSON.stringify(obj));
                                $.ajax({
                                    url: serverConfig.operationApi,
                                    data: JSON.stringify(obj)
                                }).done(function (data) {
                                    if (data.success) {
                                        initTreedata();
                                        setTable();
                                        layer.msg('上传站点数据成功!');
                                        layer.close(loading);
                                        layer.close(index); //如果设定了yes回调，需进行手工关闭
                                    } else {
                                        layer.msg(data.message, { time: 3000 });
                                        layer.close(loading);
                                    }
                                });
                            }
                        } else if (!longrg.test($("#lon").val())) {
                            layer.msg("经度格式有误，请重新填写");
                        } else if (!latreg.test($("#lat").val())) {
                            layer.msg("纬度格式有误，请重新填写");
                        }
                    }
                }
            },
            end: function (index, layero) {
                layer.close(index);
            }
        });
    }
}

//删除站点
function delete0(data) {
    // alert(JSON.stringify(ids));
    layer.confirm('是否删除？', {
        btn: ['确实', '取消'] //按钮
    }, function () {
        var obj = {
            Type: 'get',
            Uri: '/station/delete',
            Parameter: {
                stcd: data.Code
            }
        };
        $.ajax({
            url: serverConfig.operationApi,
            data: JSON.stringify(obj)
        }).done(function (data) {
            // //console.log(data);
            if (data.success) {
                initTreedata();
                setTable();
                layer.msg('删除成功！');
            } else {
                layer.msg(data.message, { time: 3000 });
            }
        });
        // $.ajax({
        //     type: "get",
        //     url: "http://172.16.5.92:7080/xianyang/api/station/delete?stcd=" + data.Code
        // })
    }, function (index) {
        layer.close(index);
    });
}

