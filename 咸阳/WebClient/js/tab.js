$('a', $('.menuSideBar')).on('click', function (e) {
    //e.stopPropagation();
    var menuId = $(this).attr('id');
    var url = $(this).closest("li").attr('data-url');
    var title = $(this).text();
    $(".content-box").bTabsAdd(menuId, title, url);
    $(this).parents(".navbar-collapse").removeClass("in");
    $(this).parents(".navbar-collapse").siblings(".navbar-collapse").removeClass("in");
});
//初始化
$('.content-box').bTabs();


//简报模板（点击事件）
$('#mould-menu').on('click', function () {
    layer.open({
        type: 1,
        area: ['600px', '400px'], //宽高
        title: ['简报模板', 'font-size:14px;font-weight: bold;'],
        shade: [0.6, '#000'],
        move: false,
        resize: false,
        btn: ['保存', '关闭'],
        scrollbar: false,
        content: $(".mould_body_div"),
        success: function () {
            $.ajax({
                async: true,
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/getsetting",
                type: "GET"
            }).done(function (data) {
                if (data.success) {
                    $.each(data.data, function (i, v) {
                        switch (v.Name) {
                            case "BRIEFING_RAIN":
                                $("#rain_textarea").val(v.Value);
                                break;
                            case "BRIEFING_RIVER":
                                $("#river_textarea").val(v.Value);
                                break;
                            case "BRIEFING_RESERVOIR":
                                $("#reservoir_textarea").val(v.Value);
                                break;
                            case "BRIEFING_SOIL":
                                $("#soil_textarea").val(v.Value);
                                break;
                        }
                    })
                }
            });
        },
        yes: function (index, layero) {
            var obj = [
                {
                    Name: "BRIEFING_RAIN",
                    Value: $("#rain_textarea").val()
                },
                {
                    Name: "BRIEFING_RIVER",
                    Value: $("#river_textarea").val()
                },
                {
                    Name: "BRIEFING_RESERVOIR",
                    Value: $("#reservoir_textarea").val()
                },
                {
                    Name: "BRIEFING_SOIL",
                    Value: $("#soil_textarea").val()
                }
            ];
            $.ajax({
                async: true,
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/savesetting",
                type: "post",
                data: JSON.stringify(obj)
            }).done(function (data) {
                if (data.success) {
                    layer.msg('保存成功!', { time: 3000 });
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                } else {
                    layer.msg(data.message, { time: 3000 });
                }
            });
        },
        end: function (index, layero) {
            layer.close(index);
        }
    });
});

//系统参数（点击事件）
$('#setting-menu').on('click', function () {
    layer.open({
        type: 1,
        area: ['450px', '550px'], //宽高
        title: ['系统参数', 'font-size:14px;font-weight: bold;'],
        shade: [0.6, '#000'],
        move: false,
        resize: false,
        btn: ['保存', '关闭'],
        scrollbar: false,
        content: $(".setting_body_div"),
        success: function () {
            $.ajax({
                async: true,
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/getsetting",
                type: "GET"
            }).done(function (data) {
                if (data.success) {
                    console.log(data.data);
                    // $.each(data.data, function (i, v) {
                    //     $(".setting_body_div").find(".settting_content_input").eq(i).attr("name", v.Name);
                    //     $(".setting_body_div").find(".settting_content_input").eq(i).find("input").eq(0).val(v.Value.split("-")[0]);
                    //     $(".setting_body_div").find(".settting_content_input").eq(i).find("input").eq(1).val(v.Value.split("-")[1]);
                    // })
                    $.each(data.data, function (i, v) {
                        switch (v.Name) {
                            case "SESSION_TIME":
                                $("#SESSION_TIME").val(v.Value);
                                break;
                            case "RAIN_LEVEL1":
                                $("#RAIN_LEVEL1").val(v.Value.split("-")[0]);
                                $("#RAIN_LEVEL11").val(v.Value.split("-")[1]);
                                break;
                            case "RAIN_LEVEL2":
                                $("#RAIN_LEVEL2").val(v.Value.split("-")[0]);
                                $("#RAIN_LEVEL22").val(v.Value.split("-")[1]);
                                break;
                            case "RAIN_LEVEL3":
                                $("#RAIN_LEVEL3").val(v.Value.split("-")[0]);
                                $("#RAIN_LEVEL33").val(v.Value.split("-")[1]);
                                break;
                            case "RAIN_LEVEL4":
                                $("#RAIN_LEVEL4").val(v.Value.split("-")[0]);
                                $("#RAIN_LEVEL44").val(v.Value.split("-")[1]);
                                break;
                            case "RAIN_LEVEL5":
                                $("#RAIN_LEVEL5").val(v.Value.split("-")[0]);
                                $("#RAIN_LEVEL55").val(v.Value.split("-")[1]);
                                break;
                            case "RAIN_LEVEL6":
                                $("#RAIN_LEVEL6").val(v.Value.split("-")[0]);
                                $("#RAIN_LEVEL66").val(v.Value.split("-")[1]);
                                break;
                            case "WARNING_TIME":
                                $("#WARNING_TIME").val(v.Value);
                                $.WARNING_TIME=v.Value;
                                break;
                        }
                    })
                } else {
                    //提示错误信息
                    layer.msg(data.message, { time: 3000 });
                }
            })
        },
        yes: function (index, layero) {
            //修改数据后提交方法
            //河道水位安全范围:
            var obj = [
                {
                    //用户登录有效时间
                    Name: "SESSION_TIME",
                    Value: $("#SESSION_TIME").val()
                },
                {
                    //小雨范围
                    Name: "RAIN_LEVEL1",
                    Value: $("#RAIN_LEVEL1").val()+"-"+$("#RAIN_LEVEL11").val()
                },
                {
                    //中雨范围
                    Name: "RAIN_LEVEL2",
                    Value: $("#RAIN_LEVEL2").val()+"-"+$("#RAIN_LEVEL22").val()
                },
                {
                    //大雨范围
                    Name: "RAIN_LEVEL3",
                    Value: $("#RAIN_LEVEL3").val()+"-"+$("#RAIN_LEVEL33").val()
                },
                {
                    //暴雨范围
                    Name: "RAIN_LEVEL4",
                    Value: $("#RAIN_LEVEL4").val()+"-"+$("#RAIN_LEVEL44").val()
                },
                {
                    //大暴雨范围
                    Name: "RAIN_LEVEL5",
                    Value: $("#RAIN_LEVEL5").val()+"-"+$("#RAIN_LEVEL55").val()
                },
                {
                    //特大雨范围
                    Name: "RAIN_LEVEL6",
                    Value: $("#RAIN_LEVEL6").val()+"-"+$("#RAIN_LEVEL66").val()
                },
                {
                    //地图报警刷新时间
                    Name: "WARNING_TIME",
                    Value: $("#WARNING_TIME").val()
                }
            ];
            console.log(obj);
            $.ajax({
                async: true,
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/savesetting",
                type: "post",
                data: JSON.stringify(obj)
            }).done(function (data) {
                console.log(data);
                //提交成功
                if (data.success) {
                    layer.msg('保存成功!', { time: 3000 });
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                } else {
                    layer.msg(data.message, { time: 3000 });
                }
            });
        },
        end: function (index, layero) {
            layer.close(index);
        }
    });
});
//报警阀值（点击事件）
$("#threshold-menu").on("click", function () {
    layer.open({
        type: 1,
        area: ['500px', '710px'], //宽高
        title: ['报警阀值', 'font-size:14px;font-weight: bold;'],
        shade: [0.6, '#000'],
        move: false,
        resize: false,
        btn: ['保存', '关闭'],
        scrollbar: false,
        content: $(".warnning_body_div"),
        success: function () {
            $("#enbledwarn").off().on("click",function () {
                $(this).toggleClass("icon-kaiguan2");
            });
            $.ajax({
                async: true,
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/getsetting",
                type: "GET"
            }).done(function (data) {
                if (data.success) {
                    console.log(data.data);
                    $.each(data.data, function (i, v) {
                        switch (v.Name) {
                            //获取后台系统参数对应值
                            case "WARNING_ENABLE":
                                if (v.Value == 0) {
                                    $("#enbledwarn").removeClass("icon-kaiguan2");
                                } else if (v.Value == 1){
                                    $("#enbledwarn").addClass("icon-kaiguan2");
                                }
                                break;
                            case "WARNING_RAINFALL_1H":
                                $("#oneh").val(v.Value);
                                break;
                            case "WARNING_RAINFALL_3H":
                                $("#threeh").val(v.Value);
                                break;
                            case "WARNING_RAINFALL_6H":
                                $("#sixh").val(v.Value);
                                break;
                            case "WARNING_WATER_LEVEL":
                                $("#rw").val(v.Value);
                                break;
                            case "WARNING_SOIL_CONTENT":
                                $("#soilrate").val(v.Value.split("-")[0]);
                                $("#soilrate1").val(v.Value.split("-")[1]);
                                break;
                            case "WARNING_UNREPORTED":
                                $(".wun").val(v.Value);
                                break;
                            case "WARNING_VOLTAGE":
                                $(".wvo").val(v.Value.split("-")[0]);
                                $(".wvo1").val(v.Value.split("-")[1]);
                                break;
                        }
                    })
                }
            })
        },
        yes: function (index) {
            var obj = [
                {
                    //1h:
                    Name: "WARNING_RAINFALL_1H",
                    Value: $("#oneh").val(),
                },
                {
                    //3h
                    Name: "WARNING_RAINFALL_3H",
                    Value: $("#threeh").val()
                },
                {
                    //6h
                    Name: "WARNING_RAINFALL_6H",
                    Value: $("#sixh").val()
                },
                {
                    Name: "WARNING_WATER_LEVEL",
                    Value: $("#rw").val()
                },
                {
                    //重量含水量安全范围:
                    Name: "WARNING_SOIL_CONTENT",
                    Value: $("#soilrate").val() + "-" + $("#soilrate1").val()
                },
                {
                    //安全上报时间间隔:
                    Name: "WARNING_UNREPORTED",
                    Value: $(".wun").val()
                }, {
                    //安全电压范围:
                    Name: "WARNING_VOLTAGE",
                    Value: $(".wvo").val() + "-" + $(".wvo1").val()
                },
                {
                    //1h:
                    Name: "WARNING_ENABLE",
                    Value: $("#enbledwarn").hasClass("icon-kaiguan2")?1:0
                }
            ];
            console.log(obj);
            $.ajax({
                async: true,
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/savesetting",
                type: "post",
                data: JSON.stringify(obj)
            }).done(function (data) {
                console.log(data);
                //提交成功
                if (data.success) {
                    layer.msg('保存成功!', { time: 3000 });
                    layer.close(index); //如果设定了yes回调，需进行手工关闭
                } else {
                    layer.msg(data.message, { time: 3000 });
                }
            });
        }
    })
});

//数据显示处理
var notNull = function (string) {
    if (string !== null && string !== undefined && string !== '') {
        return string;
    } else {
        return "/";
    }
};

//获得用户数据
var getUserData = function () {
    var tablehtml, user = JSON.parse($.cookie("user"));
    tablehtml = '<table class="table table-bordered table-striped userinfotable"><tbody><tr><td class="text-right" width="50%"><label>用户名:</label></td><td><span>' + notNull(user.Name) + '</span></td></tr><tr><td class="text-right"><label>账号:</label></td><td><span >' + notNull(user.Account) + '</span></td></tr><tr><td class="text-right"><label>行政区域:</label></td><td><span>' + notNull(user.AreaName) + '</span></td></tr><tr><td class="text-right"><label>角色:</label></td><td><span>' + notNull(user.RoleName) + '</span></td></tr><tr><td class="text-right"><label>系统权限:</label></td><td><span>' + notNull(user.SystemRole) + '</span></td></tr></tbody></table>';
    tablehtml = tablehtml + "<div>" +
        "<div class='row'><div class='col-xs-2'></div><div class='col-xs-4'><button id='modifypwd' onclick='modifyPassword()' class='center-block btn btn-info' style='background-color:#009d89;border-color:#009d89;width: 75px;margin-bottom: 5px;padding-left:10px;'>修改密码</button></div>" +
        "<div class='col-xs-4'><button onclick='logout()' class='center-block btn btn-info' style='background-color:#009d89;border-color:#009d89;width: 75px;margin-bottom: 5px;padding-left:10px;'>退出系统</button></div><div class='col-xs-2'></div></div>";
    return tablehtml;
};
var clickCount = 0;
//用户信息
$('#userinfo').each(function () {
    var element = $(this);
    var id = element.attr('id');
    var txt = element.html();
    element.popover({
        trigger: 'manual',
        placement: 'bottom',
        title: "用户信息",
        html: 'true',
        content: getUserData()
    }).on("click", function () {
        var _this = this;
        clickCount++;
        if (clickCount % 2 !== 0) {
            $(this).popover("show");
        } else {
            $(_this).popover("hide");
        }
    });
});
//点击其他地方，不显示popover
$('body').click(function (event) {
    var target = $(event.target);       // 判断自己当前点击的内容
    if ((clickCount % 2 !== 0) && (!target.hasClass('dropdown-toggle')) && (!target.hasClass('fa-user')) && (!target.hasClass('username'))) {
        clickCount++;
        $('#userinfo').popover("hide");
    }
});

//输入是否为空
var iputNUll = function (id, msg) {
    id = '#' + id;
    var value = $(id).val();
    if (isnull(value)) {
        layer.msg(msg, { time: 3000 });
        return true;
    } else {
        return false;
    }
};

//输入值和确认值是否一致
var comfirmPassord = function (pwd, compwd) {
    if (pwd == compwd) {
        return true;
    } else {
        layer.msg('新密码和确认密码输入不一致。请重新确认密码！', { time: 3000 });
        return false;
    }
}


//检测密码
var checkPassword = function () {
    if (iputNUll('oldPassword', '请输入旧密码！') || iputNUll('newPassword', '请输入新密码！') || iputNUll('confirmPassword', '请确认密码！')) {
        return false;
    } else {
        if (comfirmPassord($('#newPassword').val(), $('#confirmPassword').val())) {
            return true;
        } else {
            return false;
        }
    }
};


//修改密码
var modifyPassword = function () {
    clickCount++;
    $('#userinfo').popover("hide");
    layer.open({
        type: 1,
        area: ['350px', '250px'], //宽高
        title: '修改密码',
        shade: [0.6, '#000'],
        move: false,
        resize: false,
        shadeClose: true,
        btn: ['修改', '取消'],
        content: $('#d_modifypwd'),
        success: function () {
            $('#d_modifypwd').removeClass('hidden');
        },
        yes: function (index, layero) {
            if (checkPassword()) {
                $.ajax({
                    type: 'put',
                    /*  data : {
                          oldPassword : $('#oldPassword').val(),
                          newPassword : $('#newPassword').val()
                      },*/
                    headers: { Authorization: $.cookie("sessionid") },
                    url: serverConfig.apiBase + 'user/modifypassword?oldPassword=' + $('#oldPassword').val() + '&newPassword=' + $('#newPassword').val()
                }).done(function (data) {
                    if (data.success) {
                        console.log(data);
                        layer.msg('修改密码成功!', { time: 3000 });
                        layer.close(index);
                    } else {
                        layer.msg('旧密码输入错误!', { time: 3000 });
                    }
                });
            }
        },
        btn2: function (index, layero) {
            layer.close(index);
        },
        end: function () {
            $('#d_modifypwd').addClass('hidden');
        }
    });
};

//用户信息
/*$('#userdata').on('click', function () {
    layer.open({
        type: 1,
        area: ['300px', '275px'], //宽高
        title: ['用户信息', 'font-size:14px;font-weight: bold;'],
        shade: [0.6, '#000'],
        move: false,
        resize: false,
        shadeClose: true,
        content: $('#d_userinfo'),
        success: function () {
            $('#d_userinfo').removeClass('hidden');
            var user = JSON.parse($.cookie("user"));
            $('#user_name').text(user.Name);
            $('#user_Account').text(user.Account);
            $('#user_AreaName').text(user.AreaName);
            $('#user_RoleName').text(user.RoleName);
            $('#user_SystemRole').text(user.SystemRole);
        },
        end: function () {
            $('#d_userinfo').addClass('hidden');
        }
    });
});*/
$(function () {
    init();
    picAPI();
    rainAPI();
    soilAPI();
    getCountySort();
});

function init() {
    $.ajaxSetup({
        async: true,
        headers: { Authorization: $.cookie("sessionid") },
        contentType: "application/json;charset=utf-8",
        type: "Post",
        cache: false,
        dataType: "json",
        error: function (jqXHR, textStatus, errorMsg) { // 出错时默认的处理函数
            layer.msg('用户未登录或登录有效期已过,请退出系统重新登录.', { time: 3000 });
            //setTimeout("goToLoginPage()",1500);
        }
    });
}


//登录平台后自动缓存站点图片接口前缀
var picAPI = function () {
    $.ajax({
        async: false,
        url: serverConfig.apiBase + 'setting/getoperationservice',
        cache: false,
        contentType: false,
        dataType: "json",
        processData: false,
        type: 'GET',
        success: function (data) {
            $.cookie("picapi", data.data);
            console.log($.cookie("picapi"))
        }
    });
};
//缓存雨水情服务url
var rainAPI = function () {
    $.ajax({
        async: false,
        url: serverConfig.apiBase + 'setting/getrainfallfloodservice',
        cache: false,
        contentType: false,
        dataType: "json",
        processData: false,
        type: 'GET',
        success: function (data) {
            $.cookie("rainapi", data.data);
            console.log($.cookie("rainapi"))
        }
    });
};
//缓存墒情服务url
var soilAPI = function () {
    $.ajax({
        async: false,
        url: serverConfig.apiBase + 'setting/getsoilservice',
        cache: false,
        contentType: false,
        dataType: "json",
        processData: false,
        type: 'GET',
        success: function (data) {
            $.cookie("soilapi", data.data);
            console.log($.cookie("soilapi"))
        }
    });
};

var getCountySort = function () {
    var obj = {
        Type: 'get',
        Uri: '/station/getcountysort',
        Parameter: {
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj),
        success: function (data) {
            $.cookie("countysort", data.data);
            console.log($.cookie("countysort"))
        }
    })
}





