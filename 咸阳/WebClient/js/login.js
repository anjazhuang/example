//判断是否为空
var isNull = function (string) {
        if (string == null || string == undefined || string == '' || string == 'null') {
            return true;
        } else {
            return false;
        }
    },

    //相关输入是否为空
    iputNUll = function (id, msg) {
        id = '#' + id;
        var value = $(id).val();
        if (isNull(value)) {
            layer.msg(msg,{time:3000});
            return true;
        } else {
            return false;
        }
    },


    login = function () {
        var username = $('#username').val(),
            password = $('#password').val(),
            loginSysUrl = serverConfig.apiBase + "user/login?account=" + username + "&password=" + password;

        if ((!iputNUll('username', '请输入用户名！')) && (!iputNUll('password', '请输入密码！'))) {
            var geturl = $.ajax({
                type: "get",
                url: loginSysUrl
                //headers: { Authorization: "Basic " + Base64.encode(username + ":" + password) },
            }).done(function (data) {
                if (data.success) {
                    var userinfo = JSON.stringify(data.data.User),
                        memnuid_array = [];
                    $.each(data.data.Power, function (key, obj) {
                        memnuid_array.push(obj.Selector);
                    });
                    $.cookie("user", userinfo);
                    $.cookie("sessionid", data.data.User.SessionId);
                    $.cookie("userdata", memnuid_array);
                    location.href = 'index.html';
                } else {
                    layer.msg('登录失败！请检查用户名和密码！');
                }

            }).fail(function (data) {
                layer.msg(data.message,{time:3000});
            });
        }
    };


$(function () {
    $("#username").val("");
    $("#password").val("");
    $(document).keyup(function (event) {
        if (event.keyCode == 13) {
            login();
        }
    });
    $("#log_btn").click(function () {
        login();
    });
});

