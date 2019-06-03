/*
 layui.define(['layer', 'jquery'], function(exports){
 var layer = layui.layer
 ,$ = layui.$;

 //$('body').append('hello jquery');

 exports('index', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
 });

 */

//退出系统
var goToLoginPage = function () {
        $.cookie("user", null);
        $.cookie("sessionid", null);
        $.cookie("userdata", null);
        localStorage.clear();
        window.location.href = 'login.html';
    },
    //cookie处理
    getCookieValue = function (name, v) {
        var r = $.cookie(name);
        if (!r) {
            $.cookie(name, v);
            r = v;
        }
        return r;
    },
    //判断是否为空
    isnull = function (string) {
        if (string == null || string == undefined || string == '' || string == 'null') {
            return true;
        } else {
            return false;
        }
    },

    //ajax默认设定
    ajaxinit = function () {
        $.ajaxSetup({
            async: true,
            headers: { Authorization: $.cookie("sessionid") },
            dataType: "json",
            error: function (jqXHR, textStatus, errorMsg) { // 出错时默认的处理函数
                layer.msg('用户未登录或登录有效期已过,请退出系统重新登录.', { time: 3000 });
                //setTimeout("goToLoginPage()",1500);
            }
        });
    },


    //判断是否登录
    logininit = function () {
        if (isnull($.cookie("sessionid")) || isnull($.cookie("user")) || isnull($.cookie("userdata"))) {
            goToLoginPage();
            return false;
        }
    },
    //退出系统
    logout = function () {
        clickCount++;
        $('#userinfo').popover("hide");
        layer.confirm('您确定要注销并退出系统吗？', {
            title: '退出系统',
            btn: ['退出', '取消']
        }, function () {
            if (isnull($.cookie("sessionid")) || isnull($.cookie("user")) || isnull($.cookie("userdata"))) {
                goToLoginPage();
            } else {
                $.ajax({
                    type: 'put',
                    headers: { Authorization: $.cookie("sessionid") },
                    url: serverConfig.apiBase + 'user/exit'
                }).done(function (data) {
                    if (data.success) {
                        goToLoginPage();
                        /* layer.msg('退出系统成功！');
                         setTimeout("goToLoginPage()",1500);*/
                    }
                }).fail(function () {
                    goToLoginPage();
                }).always(function () {
                    goToLoginPage();
                });
            }
        }, function (index) {
            layer.close(index);
        });
    },
    //显示用户名
    showuser = function () {
        var user = JSON.parse($.cookie("user"));
        $("#user").text(user.Name);
    },
    //菜单json
    get_menudata = function () {
        var SysMenuInfo = [
            {
                Name: "地图模式",
                Url: "module/map/map.html",
                'Selector': 'map-menu',
                'Haschildren': false,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-globe',
                Class: 'menuSideBar',
                BtnMenu:[
                    {
                        Name: "实时雨情",
                        Selector: "mapRain-menu"
                    },
                    {
                        Name: "实时水情",
                        Selector: "mapWater-menu"
                    },
                    {
                        Name: "实时墒情",
                        Selector: "mapSoil-menu"
                    },
                    {
                        Name: "运维监控",
                        Selector: "mapStation-menu"
                    },
                    {
                        Name: "报警信息",
                        Selector: "mapWarning-menu"
                    },
                    {
                        Name: "等值分析",
                        Selector: "mapAnalysis-menu"
                    }
                ]
            },
            {
                Name: "数据查询",
                Url: "javascript:void(0);",
                'Selector': 'data-menu',
                'Haschildren': true,
                'hidden': false,
                // 'Icon': 'glyphicon glyphicon-th-list',
                'Icon': 'glyphicon glyphicon-search',
                Class: 'dropdown',
                SubMenu: [
                    {
                        Name: "雨情查询",
                        Url: "module/monitor/rainSearch.html",
                        Selector: "rainSearch-menu",
                        'hidden': false
                    },
                    {
                        Name: "河道水情查询",
                        Url: "module/monitor/riverSearch.html",
                        Selector: "riverSearch-menu",
                        'hidden': false
                    },
                    {
                        Name: "水库水情查询",
                        Url: "module/monitor/reservoirSearch.html",
                        Selector: "reservoirSearch-menu",
                        'hidden': false
                    },
                    {
                        Name: "墒情查询",
                        Url: "module/monitor/soilSearch.html",
                        Selector: "soilSearch-menu",
                        'hidden': false
                    },
                    {
                        Name: "沙情查询",
                        Url: "module/monitor/sandSearch.html",
                        Selector: "sandSearch-menu",
                        'hidden': false
                    },
                    {
                        Name: "水温查询",
                        Url: "module/monitor/watertempertature.html",
                        Selector: "watertempertature-menu",
                        'hidden': false
                    }
                ]
            },
            {
                Name: "统计分析",
                Url: "javascript:void(0);",
                'Selector': 'analysis-menu',
                'Haschildren': true,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-stats',
                Class: 'dropdown',
                SubMenu: [
                    {
                        Name: "时段雨量统计",
                        Url: "module/count/timeRain.html",
                        Selector: "time-menu",
                        'hidden': false
                    },
                    {
                        Name: "累计雨量统计",
                        Url: "module/count/collectRain.html",
                        Selector: "collect-menu",
                        'hidden': false
                    },
                    {
                        Name: "降雨量距平分析",
                        Url: "module/count/yearRain.html",
                        Selector: "leveling-menu",
                        'hidden': false
                    },
                    // {
                    //     Name: "逐日雨量统计",
                    //     Url: "module/count/dateRain.html",
                    //     Selector: "day-menu",
                    //     'hidden': false
                    // },
                    {
                        Id: 7,
                        Name: "雨量对比",
                        Url: "module/count/rainfall.html",
                        Selector: "contrast-menu",
                        'hidden': false
                    },
                    {
                        Name: "水情特征值",
                        Url: "module/count/rivervalue.html",
                        Selector: "value-menu",
                        'hidden': false
                    }
                ]
            },
            {
                Name: "简报管理",
                Url: "javascript:void(0);",
                'Selector': 'briefing-menu',
                'Haschildren': true,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-book',
                Class: 'dropdown',
                SubMenu: [
                    { Name: "雨情简报", Url: "module/briefin/rainbriefin.html", Selector: "rainBriefin-menu", 'hidden': false },
                    { Name: "河道水情简报", Url: "module/briefin/riverbriefin.html", Selector: "riverBriefin-menu", 'hidden': false },
                    { Name: "水库水情简报", Url: "module/briefin/reservoirbriefin.html", Selector: "reservoirBriefin-menu", 'hidden': false },
                    { Name: "墒情简报", Url: "module/briefin/soilbriefin.html", Selector: "soilBriefin-menu", 'hidden': false },
                    // { Name: "生成简报", Url: "module/briefin/briefin.html", Selector: "generate-menu", 'hidden': false },
                    // { Name: "简报模板", Url: "", Selector: "mould-menu", 'hidden': false }
                ]
            },
            {
                Name: "监测报警",
                Url: "javascript:void(0);",
                'Selector': 'warning-menu',
                'Haschildren': true,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-exclamation-sign',
                Class: 'dropdown',
                SubMenu: [
                    { Name: "报警阈值设置", Url: "", Selector: "threshold-menu", 'hidden': false },
                    { Name: "报警信息处理", Url: "module/warning/warning.html", Selector: "handle-menu", 'hidden': false },
                ]
            },
            {
                Name: "运行维护",
                Url: "javascript:void(0);",
                'Selector': 'operation-menu',
                'Haschildren': true,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-wrench',
                Class: 'dropdown',
                SubMenu: [
                    {
                        Name: "站点管理",
                        Url: "module/operation/station.html",
                        Selector: "station-menu",
                        'hidden': false
                    },
                    {
                        Name: "设备登记",
                        Url: "module/operation/device.html",
                        Selector: "device-menu",
                        'hidden': false
                    },
                    {
                        Name: "维护计划",
                        Url: "module/operation/maintenceplan.html",
                        Selector: "plan-menu",
                        'hidden': false
                    },
                    {
                        Name: "维修流程",
                        Url: "module/operation/maintenance.html",
                        Selector: "fix-menu",
                        'hidden': false
                    },
                    {
                        Name: "工作考核",
                        Url: "module/operation/jobEvaluation.html",
                        Selector: "check-menu",
                        'hidden': false
                    },
                    {
                        Name: "设备运行数据",
                        Url: "module/operation/informationView.html",
                        Selector: "stationInfo-menu",
                        'hidden': false
                    }
                ]
            },
            {
                Name: "通讯录",
                Url: "module/address/address.html",
                'Selector': 'address-menu',
                'Haschildren': false,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-list-alt',
                Class: 'menuSideBar',
            },
            {
                Name: "权限管理",
                Url: "javascript:void(0);",
                'Selector': 'power-menu',
                'Haschildren': true,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-user',
                Class: 'dropdown',
                SubMenu: [
                    { Name: "用户管理", Url: "module/user/user.html", Selector: "user-menu", 'hidden': false },
                    { Name: "角色管理", Url: "module/user/role.html", Selector: "role-menu", 'hidden': false }
                ]
            },
            {
                Name: "系统参数",
                Url: "",
                'Selector': 'setting-menu',
                'Haschildren': false,
                'hidden': false,
                'Icon': 'glyphicon glyphicon-cog',
                Class: 'menuSideBar'
            }
        ];
        return SysMenuInfo;
    },
    //处理菜单json
    menuset = function () {
        var userdata_array = [],
            SysMenuInfo = get_menudata();
        $.each($.cookie("userdata").split(","), function (key, value) {
            userdata_array.push(value);
        });
        $.each(SysMenuInfo, function (key, obj) {
            if ($.inArray(obj.Selector, userdata_array) < 0) {
                SysMenuInfo[key].hidden = true;
                if (obj.hasOwnProperty("BtnMenu")) {
                    $.each(obj.BtnMenu, function (key2, obj2) {
                        if ($.inArray(obj2.Selector, userdata_array) >= 0) {
                            SysMenuInfo[key].hidden = false;
                        }
                    });
                }
                if (obj.Haschildren) {
                    if (obj.hasOwnProperty("SubMenu")) {
                        $.each(obj.SubMenu, function (key2, obj2) {
                            if ($.inArray(obj2.Selector, userdata_array) < 0) {
                                SysMenuInfo[key].SubMenu[key2].hidden = true;
                            } else {
                                SysMenuInfo[key].hidden = false;
                            }
                        });
                    }
                }
            }
        });
        return SysMenuInfo;
    },

    get_authorizeurl = function () {
        var SysMenuInfo = menuset();
    },

    //菜单初始化
    menuinit = function () {
        var SysMenuInfo = menuset(),
            authorizeurl = [],
            menuhtml = '<ul id="nav" class="nav navbar-nav">';

        $.each(SysMenuInfo, function (key, obj) {
            var caret = '', submenuhtml = '';
            if (obj.Haschildren) {
                caret = '\n<b class="caret"></b>';
                if (obj.hasOwnProperty("SubMenu")) {
                    submenuhtml = '<ul class="dropdown-menu menuSideBar">';
                    $.each(obj.SubMenu, function (key2, obj2) {
                        if (!obj2.hidden) {
                            submenuhtml = submenuhtml + '<li data-url="' + obj2.Url + '"><a href="javascript:;" id="' + obj2.Selector + '">' + obj2.Name + '</a></li>';
                            authorizeurl.push(obj2.Url);
                        }
                    });
                    submenuhtml = submenuhtml + '</ul>';
                    if (!obj.hidden) {
                        menuhtml = menuhtml + '<li class="' + obj.Class + '"><a href="javascript:void(0);" class="dropdown-toggle" data-toggle="dropdown" id="' + obj.Selector + '"><span class="' + obj.Icon + '"></span>&nbsp;<label>' + obj.Name + '</label>' + caret + '</a>' + submenuhtml + '</li>';
                        authorizeurl.push(obj.Url);
                    }
                }
            } else {
                if (!obj.hidden) {
                    menuhtml = menuhtml + '<li class="' + obj.Class + '" data-url="' + obj.Url + '"><a href="javascript:;" id="' + obj.Selector + '"><span class="' + obj.Icon + '"></span>&nbsp;<label>' + obj.Name + '</label></a></li>';
                    authorizeurl.push(obj.Url);
                }

            }
        });
        menuhtml = menuhtml + '</ul>';
        $.cookie("menu", authorizeurl);
        $('#menunav').html(menuhtml);

    };

var warningStationSettingList = [];

//测站检索
function searthInputChange() {
    var value = $("#searthInput").val();
    var inserHtml = "";
    if (value != null && value != "") {
        var ds = $.grep(warningStationSettingList, function (d) {
            return d.Code.indexOf(value) != -1 || d.Name.indexOf(value) != -1;
        })
        if (ds == null || ds.length == 0) {
            inserHtml = '<tr><td colspan="3">无相关数据</td></tr>';
        }
        for (var i = 0; i < ds.length; i++) {
            inserHtml += '<tr id="' + ds[i].Code + '"><td>' + ds[i].Code + '</td><td>' + ds[i].Name
                + '</td><td><input type="number" value="' + ds[i].Value
                + '" step="0.001" onchange="valueChange(this);"/></td></tr>';
        }
    } else {
        for (var i = 0; i < warningStationSettingList.length; i++) {
            inserHtml += '<tr id="' + warningStationSettingList[i].Code + '"><td>' + warningStationSettingList[i].Code + '</td><td>' + warningStationSettingList[i].Name
                + '</td><td><input type="number" value="' + warningStationSettingList[i].Value
                + '" step="0.001" onchange="valueChange(this);"/></td></tr>';
        }
    }
    $("#warningTableBody").html(inserHtml);
}

//水位阈值输入框处理
function valueChange(e) {
    var value = $(e).val();
    var code = $(e).parent().parent().attr("id");
    var ds = $.grep(warningStationSettingList, function (d) {
        return d.Code == code;
    })
    if (ds != null && ds.length == 1) {
        if (value > 0) {
            ds[0].Value = value;
        } else {
            ds[0].Value = "";
            $(e).val("");
        }
    }
}

$(function () {

    $("#warningSetting").click(function () {
        setWarningShow();
    });

    //显示特殊测站水位阈值设置界面
    function setWarningShow() {
        var inserHtml = "";
        warningStationSettingList = [];
        var user = JSON.parse($.cookie("user"));
        var obj = {
            Type: 'get',
            Uri: '/station/getmapstation',
            Parameter: {
                areaCode: user.AreaCode
            }
        };
        $.ajax({
            async: false,
            url: serverConfig.soilApi,
            data: JSON.stringify(obj)
        }).done(function (allStation) {
            var stationList = $.grep(allStation.data, function (d) {
                return d.Type == "河道水位站" || d.Type == "河道水文站" || d.Type == "水库水文站";
            })
            $.ajax({
                async: false,
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/getwarningsetting",
                type: "GET"
            }).done(function (data) {
                if (data.success) {
                    for (var i = 0; i < data.data.length; i++) {
                        var obj = {
                            Code: data.data[i].Code,
                            Name: data.data[i].Name,
                            Value: data.data[i].Value,
                        }
                        warningStationSettingList.push(obj);
                    }
                    for (var i = 0; i < stationList.length; i++) {
                        var ds = $.grep(warningStationSettingList, function (d) {
                            return d.Code == stationList[i].Code;
                        })
                        if (ds == null || ds.length == 0) {
                            var obj = {
                                Code: stationList[i].Code,
                                Name: stationList[i].Name,
                                Value: "",
                            }
                            warningStationSettingList.push(obj);
                        }
                    }

                    for (var i = 0; i < warningStationSettingList.length; i++) {
                        inserHtml += '<tr id="' + warningStationSettingList[i].Code + '"><td>' + warningStationSettingList[i].Code + '</td><td>' + warningStationSettingList[i].Name
                            + '</td><td><input type="number" value="' + warningStationSettingList[i].Value
                            + '" step="0.001" onchange="valueChange(this);"/></td></tr>';
                    }
                    if (stationList.length == 0) {
                        inserHtml = '<tr><td colspan="3">无相关数据</td></tr>';
                    }
                } else {
                    layer.msg(data.message, { time: 3000 });
                }
            });
        });


        var searthHtml = '<div><label>&nbsp;&nbsp;&nbsp;&nbsp;检索：</label><input style="width:130px;" id="searthInput" onkeyup="searthInputChange();"></div>';
        var clickHtml = '<div style="text-align:right"><button type="button" style="background-color:#009d89;color:white" id="setConfirm">提交</button><button type="button" class="btn btn-default" id="setCancel">取消</button></div>';
        var html = '<div style="width:300px;height:500px;">' + searthHtml + '<div style="height:450px;overflow:auto;text-align:center" ><table class="table table-striped"><thead><tr><th style="text-align:center">测站编码</th><th style="text-align:center">测站名称</th><th style="text-align:center">水位阈值</th></tr></thead><tbody id="warningTableBody">' + inserHtml + '</tbody></table></div>' + clickHtml + '</div>';
        $("#warningSetting").popover({
            trigger: "manual",
            placement: "left",
            html: true,
            title: "特殊测站水位阈值设置",
            content: html
        });
        $("#warningSetting").popover('toggle');
        $("#searthInput").focus();

        //列显示弹出框确定按钮点击事件
        $("#setConfirm").click(function () {
            var model = [];
            for (var i = 0; i < warningStationSettingList.length; i++) {
                if (warningStationSettingList[i].Value != null && warningStationSettingList[i].Value != "" && warningStationSettingList[i].Value != "0") {
                    var obj = {
                        Code: warningStationSettingList[i].Code,
                        Value: warningStationSettingList[i].Value
                    };
                    model.push(obj);
                }
            }

            $.ajax({
                headers: { Authorization: $.cookie("sessionid") },
                contentType: "application/json;charset=utf-8",
                cache: false,
                dataType: "json",
                url: serverConfig.apiBase + "setting/savewarningsetting",
                type: "POST",
                data: JSON.stringify(model)
            }).done(function (data) {
                if (data.success) {
                    $("#warningSetting").popover('destroy');
                } else {
                    layer.msg(data.message, { time: 3000 });
                }
            });
        });

        //列显示弹出框取消按钮点击事件
        $("#setCancel").click(function () {
            $("#warningSetting").popover('destroy');
        });
    };
});

//运行
ajaxinit();
logininit();
menuset();
menuinit();
showuser();
//console.log($.cookie("user"));

