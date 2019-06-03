//datatable设置
datatablesLanguage = {
    lengthMenu: '每页显示信息数量： _MENU_ ',//左上角的分页大小显示。
    search: '<span>搜索：</span>',//右上角的搜索文本，可以写html标签
    paginate: {//分页的样式内容。
        previous: "上一页",
        next: "下一页",
        first: "第一页",
        last: "最后一页"
    },
    zeroRecords: "没有相关数据!",//table tbody内容为空时，tbody的内容。
    info: "",
    infoEmpty: "",//筛选为空时左下角的显示。
    infoFiltered: ""//筛选之后的左下角筛选提示，
};
//datatable设置
reportLanguage = {
    processing: "正在加载中...",
    lengthMenu: "页记录数 _MENU_",
    zeroRecords: "无数据",
    info: "",
    infoEmpty: "",
    infoFiltered: "(由 _MAX_ 项结果过滤)",
    infoPostFix: "",
    url: "",
    paginate: {
        first: "<<",
        previous: "<",
        next: ">",
        last: ">>"
    }
};
//datatable设置
reportLanguage1 = {
    processing: "正在加载中...",
    search: '<span>检索：</span>',//右上角的搜索文本，可以写html标签
    lengthMenu: "页记录数 _MENU_",
    zeroRecords: "无数据",
    // info: "共计 _TOTAL_",
    // infoEmpty: "共计 0，当前 0 至 0",
    info: "共计 _TOTAL_条记录",
    infoEmpty: "",
    infoFiltered: "(由 _MAX_ 项结果过滤)",
    infoPostFix: "",
    url: "",
    paginate: {
        first: "<<",
        previous: "<",
        next: ">",
        last: ">>"
    }
};

//初始化设置
var init = function () {
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
    },

    //post请求下载文件
    DownLoadFile = function (options) {
        var config = $.extend(true, { method: 'post' }, options);
        var $iframe = $('<iframe id="down-file-iframe" />');
        var $form = $('<form target="down-file-iframe" method="' + config.method + '" />');
        $form.attr('action', config.url);
        for (var key in config.data) {
            if (key == "Parameter") {
                $form.append('<input type="hidden" name="' + key + '" value="' + JSON.stringify(config.data[key]).replace(/\"/g, "'") + '" />');
            } else {
                $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
            }
        }
        $iframe.append($form);
        $(document.body).append($iframe);
        $form[0].submit();
        $iframe.remove();
    },

    //数据显示处理
    notnull = function (string) {
        if (string !== null && string !== undefined && string !== '') {
            return string;
        } else {
            return "/";
        }
    },

    //数据显示处理2
    showDataNull = function (string, value) {
        if (string !== null && string !== undefined && string !== '') {
            return string;
        } else {
            return value;
        }
    },

    //判断是否为空
    isNull = function (string) {
        if (string == null || string == undefined || string == '' || string == 'null') {
            return true;
        } else {
            return false;
        }
    },

    //数组排序
    compare = function (propertyName) {
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            return value1.localeCompare(value2);
        };
    },

    //相关输入是否为空
    iputNUll = function (id, msg) {
        id = '#' + id;
        var value = $(id).val();
        if (isNull(value)) {
            layer.msg(msg, { time: 3000 });
            return true;
        } else {
            return false;
        }
    },

    //前往登录页
    goToLoginPage = function () {
        $.cookie("user", null);
        $.cookie("sessionid", null);
        $.cookie("userdata", null);
        window.parent.location.href = '../../login.html';
    },

    //登录初始化
    logininit = function () {
        if ($.cookie("sessionid") === undefined || $.cookie("user") === undefined || $.cookie("userdata") === undefined) {
            goToLoginPage();
            return false;
        }
    },

    //获得权限
    getauthorizeurl = function () {
        var url = '',
            localurl = window.location.href,
            url_array = localurl.split('/');
        for (var i = 1; i < url_array.length; i++) {
            if (i >= (url_array.length - 3)) {
                url = url + url_array[i] + '/';
            }
        }
        url = url.substr(0, url.length - 1);
        return url;
    },

    //获得权限
    getauthorizestate = function (array, url) {
        var authorize_state = false;
        $.each(array, function (key, value) {
            if (value == url) {
                authorize_state = true;
                return false;
            }
        });
        return authorize_state;

    },

    //登录
    loginvalidate = function () {
        var url = getauthorizeurl(),
            authorizeurl_array = $.cookie("menu").split(","),
            state = getauthorizestate(authorizeurl_array, url);
        if (!state) {
            goToLoginPage();
            return false;
        }
        ////console.log(authorizeurl_array);
        ////console.log(url);
    };

//登录验证
logininit();
loginvalidate();

//初始化查询条件数据树
function initTreedata(state, code, level, type) {
    var user = JSON.parse($.cookie("user"));
    var obj = {
        Type: 'post',
        Uri: '/station/getstationtree',
        Parameter: {
            AreaCode: user.AreaCode,
            Code: code ? code : null,  //测站编码
            Level: level ? level.join(",") : "1,2,3", //报汛级别
            Type: type ? type : null,   //测站类型
            State: state ? state : 0
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj),
        async: false
    }).done(function (data) {
        if (data.success) {
            //console.log(data.data);
            //树形插件配置
            var treeList = eval(data.data.area);
            var setting = {
                check: {
                    enable: true,
                    chkboxType: { "Y": "ps", "N": "ps" }
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
            //初始化数据
            $.fn.zTree.init($("#treeDemoCity"), setting, data.data.area);
            $.fn.zTree.init($("#treeDemoRiver"), setting, data.data.river);
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoCity");
            //默认展开和选择
            // treeObj.checkAllNodes(true);
            //勾选状态
            for (var i = 0; i < treeList.length; i++) {
                if (treeList[i].isCheck) {
                    treeObj.checkNode(treeObj.getNodeByParam("id", treeList[i].id), true);
                }
            }
            // treeObj.getNodesByParam("pId", "610100", null);
            treeObj.expandNode(treeObj.getNodes()[0], true);
            var treeObjr = $.fn.zTree.getZTreeObj("treeDemoRiver");
            //默认展开和选择
            treeObjr.expandNode(treeObjr.getNodes()[0], true);
            treeObjr.checkAllNodes(true);
            powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
            //console.log(powers);
        } else {
            //弹出错误提示
            layer.msg(data.message, { time: 3000 });
        }
    });
}

// 雨量对比日旬雨量
function initTreedatadd(state, code, level, type) {
    var user = JSON.parse($.cookie("user"));
    var obj = {
        Type: 'post',
        Uri: '/station/getstationtree',
        Parameter: {
            AreaCode: user.AreaCode,
            Code: code ? code : null,  //测站编码
            Level: level ? level.join(",") :"1,2,3", //报汛级别
            Type: type ? type : null,   //测站类型
            State: state ? state : 0
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj),
        async: false
    }).done(function (data) {
        if (data.success) {
            //console.log(data.data);
            //树形插件配置
            var setting = {
                check: {
                    enable: true,
                    chkboxType: { "Y": "ps", "N": "ps" }
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
            //初始化数据
            $.fn.zTree.init($("#treeDemoCity1"), setting, data.data.area);
            $.fn.zTree.init($("#treeDemoRiver1"), setting, data.data.river);
            var treeObj1 = $.fn.zTree.getZTreeObj("treeDemoCity1");
            //默认展开和选择
            // treeObj1.checkAllNodes(true);
            // treeObj.getNodesByParam("pId", "610100", null);
            for (var i = 0; i < data.data.area.length; i++) {
                if (data.data.area[i].isCheck) {
                    treeObj1.checkNode(treeObj1.getNodeByParam("id", data.data.area[i].id), true);
                }
            }
            treeObj1.expandNode(treeObj1.getNodes()[0], true);
            var treeObjr1 = $.fn.zTree.getZTreeObj("treeDemoRiver1");
            //默认展开和选择
            treeObjr1.expandNode(treeObjr1.getNodes()[0], true);
            treeObjr1.checkAllNodes(true);
            powers1 = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity1'), $.fn.zTree.getZTreeObj('treeDemoCity1').getNodes(), []);
            //console.log("日旬" + powers1);
        } else {
            //弹出错误提示
            layer.msg(data.message, { time: 3000 });
        }
    });
}

// 雨量对比旬月雨量
function initTreedatamm(state, code, level, type) {
    var user = JSON.parse($.cookie("user"));
    var obj = {
        Type: 'post',
        Uri: '/station/getstationtree',
        Parameter: {
            AreaCode: user.AreaCode,
            Code: code ? code : null,  //测站编码
            Level: level ? level.join(",") : null, //报汛级别
            Type: type ? type : null,   //测站类型
            State: state ? state : 0
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj),
        async: false
    }).done(function (data) {
        if (data.success) {
            //console.log(data.data);
            //树形插件配置
            var setting = {
                check: {
                    enable: true,
                    chkboxType: { "Y": "ps", "N": "ps" }
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
            //初始化数据
            $.fn.zTree.init($("#treeDemoCity2"), setting, data.data.area);
            $.fn.zTree.init($("#treeDemoRiver2"), setting, data.data.river);
            var treeObj2 = $.fn.zTree.getZTreeObj("treeDemoCity2");
            //默认展开和选择
            // treeObj2.checkAllNodes(true);
            // treeObj.getNodesByParam("pId", "610100", null);
            for (var i = 0; i < data.data.area.length; i++) {
                if (data.data.area[i].isCheck) {
                    treeObj2.checkNode(treeObj2.getNodeByParam("id", data.data.area[i].id), true);
                }
            }
            treeObj2.expandNode(treeObj2.getNodes()[0], true);
            var treeObjr2 = $.fn.zTree.getZTreeObj("treeDemoRiver2");
            //默认展开和选择
            treeObjr2.expandNode(treeObjr2.getNodes()[0], true);
            treeObjr2.checkAllNodes(true);
            powers2 = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity2'), $.fn.zTree.getZTreeObj('treeDemoCity2').getNodes(), []);
            //console.log("旬月" + powers2);
        } else {
            //弹出错误提示
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//初始化查询条件树形插件数据
function initTreedata0(code, level, type) {
    var user = JSON.parse($.cookie("user"));
    var obj = {
        Type: 'post',
        Uri: '/station/getstationtree',
        Parameter: {
            AreaCode: user.AreaCode,
            Code: code ? code : null,  //测站编码
            Level: level ? level : null, //报汛级别
            Type: type ? type : null   //测站类型
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj),
        async: false
    }).done(function (data) {
        if (data.success) {
            //console.log(data.data);
            var setting = {
                check: {
                    enable: true,
                    chkboxType: { "Y": "ps", "N": "ps" }
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
            $.fn.zTree.init($("#treeDemoCity"), setting, data.data.area);
            $.fn.zTree.init($("#treeDemoRiver"), setting, data.data.river);
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoCity");
            treeObj.expandNode(treeObj.getNodes()[0], true);
            var treeObjr = $.fn.zTree.getZTreeObj("treeDemoRiver");
            treeObjr.expandNode(treeObjr.getNodes()[0], true);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//初始化查询条件测站编码
function initCode(state) {
    var user = JSON.parse($.cookie("user"));
    var obj = {
        Type: 'get',
        Uri: '/station/getmapstation',
        Parameter: {
            areaCode: user.AreaCode,
            state: state ? state : 0
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        var html0 = '<option value="">全部</option>';
        if (data.success) {
            $.each(data.data, function (key, obj) {
                if (obj.Name !== "咸阳市") {
                    html0 += "<option value='" + obj.Code + "'>" + obj.Name + "(" + obj.Code + ")</option>";
                }
            });
            $("#stcode").html(html0);
            $("#stcode1").html(html0);
            $("#stcode2").html(html0);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//显示水势
function showFlow(data) {
    var stateValue = "";
    switch (data) {
        case null:
            stateValue = "";
            break;
        case "4":
            stateValue = "落";
            break;
        case "5":
            stateValue = "涨";
            break;
        case "6":
            stateValue = "平";
            break;
    }
    return stateValue;
}

//天气
function showeather(data) {
    var weather = "";
    switch (data) {
        case "5":
            weather = "雪"
            break;
        case "6":
            weather = "雨夹雪"
            break;
        case "7":
            weather = "雨"
            break;
        case "8":
            weather = "阴"
            break;
        case "9":
            weather = "晴"
            break;
    }
    return weather;
}

//雨量小数位
function rainData(data) {
    if (!isNull(data)) {
        var d = parseFloat(data);
        if (d != 0) {
            return d.toFixed(1)
        } else {
            return d;
        }
    } else {
        return ""
    }

}

//水位小数位
function waterLevelData(data) {
    if (!isNull(data)) {
        var d = parseFloat(data);
        if (d != 0) {
            return d.toFixed(2)
        } else {
            return d;
        }
    } else {
        return ""
    }
}

//流量小数位
function flowData(data) {
    if (!isNull(data)) {
        var d = parseFloat(data);
        if (d != 0) {
            return d.toFixed(3)
        } else {
            return d;
        }
    } else {
        return ""
    }
}

//警报流量小数位
function flowDataw(data) {
    if (!isNull(data)) {
        var d = parseFloat(data);
        if (d != 0) {
            return d.toFixed(0)
        } else {
            return d;
        }
    } else {
        return ""
    }
}

//年距平百分比
function YearRainPercent(data) {
    if (!isNull(data)) {
        var d = parseFloat(data);
        if (d != 0) {
            return (d * 100).toFixed(1)
        } else {
            return d;
        }
    } else {
        return ""
    }
}

//时间蹉互换
function timestampToTime(timestamp) {
    var date = new Date(timestamp),//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-',
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
        D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ',
        h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':',
        m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':',
        s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
}

//等值分析树形图
// function initTreedata1(code, level, type) {
//     var user = JSON.parse($.cookie("user"));
//     var obj = {
//         Type: 'post',
//         Uri: '/station/getstationtree',
//         Parameter: {
//             AreaCode: user.AreaCode,
//             Code: code ? code : null,  //测站编码
//             Level: level ? level : null, //报汛级别
//             Type: type ? type : null   //测站类型
//         }
//     };
//     $.ajax({
//         url: serverConfig.soilApi,
//         data: JSON.stringify(obj),
//         async: false
//     }).done(function (data) {
//         if (data.success) {
//             //console.log(data.data);
//             var setting = {
//                 check: {
//                     enable: true,
//                     chkboxType: { "Y": "ps", "N": "ps" }
//                     //chkboxType: { "Y": "ps", "N": "ps" },
//                 },
//                 data: {
//                     simpleData: {
//                         enable: true,
//                         idKey: "id", // id编号命名
//                         pIdKey: "pId", // 父id编号命名
//                         rootPId: 0
//                     }
//                 },
//                 view: {
//                     showIcon: true
//                 }
//             };
//             $.fn.zTree.init($("#raintreeDemoCity"), setting, data.data.area);
//             $.fn.zTree.init($("#raintreeDemoRiver"), setting, data.data.river);
//             $.fn.zTree.init($("#soiltreeDemoCity"), setting, data.data.area);
//             $.fn.zTree.init($("#soiltreeDemoRiver"), setting, data.data.river);
//             var treeObj = $.fn.zTree.getZTreeObj("raintreeDemoCity");
//             treeObj.expandAll(true);
//             var treeObjr = $.fn.zTree.getZTreeObj("raintreeDemoRiver");
//             treeObjr.expandAll(true);
//             var treeObj1 = $.fn.zTree.getZTreeObj("soiltreeDemoCity");
//             treeObj1.expandAll(true);
//             var treeObj1r = $.fn.zTree.getZTreeObj("soiltreeDemoRiver");
//             treeObj1r.expandAll(true);
//         } else {
//             layer.msg(data.message,{time:3000});
//         }
//     });
// }

//获取前天当天制表时间函数
function GetDateTimeStr() {
    var dd = new Date();
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;//获取当前月份的日期
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
    var hh = dd.getHours();
    var ii = dd.getMinutes() < 10 ? "0" + (dd.getMinutes()) : dd.getMinutes();
    return y + "-" + m + "-" + d + " " + hh + ":" + ii;
}

var tablemaker = "陕西省咸阳水文水资源勘测局";

//降雨量时段长数据格式
function timeLength(data) {
    if (!isNull(data)) {
        return parseFloat(data);
    } else {
        return ""
    }
}

//判断时间合法性
function timeValidcheck(date) {
    return (new Date(date).getDate() == date.substring(date.length - 2));
}

// alert(check("2012-04-31"));

//流量数据格式化
var formatFlow = function (num) {
    if (!isNull(num)) {
        var num = parseFloat(num);
        if (num >= 100) {
            return num.toFixed(0);
        } else if (num >= 10 && num < 100) {
            return num.toFixed(1);
        } else if (num >= 1 && num < 10) {
            return num.toFixed(2);
        } else if (num == 0) {
            return num;
        } else {
            return num.toFixed(3);
        }
    } else {
        return "";
    }
};

function default0(items) {
    items.sort(function (a, b) {
        return SortByProps(a, b, { "stcd": "ascending", "tm": "ascending" });
    });
    console.log(items)
    return items
}

function default2(items) {
    items.sort(function (a, b) {
        return SortByProps(a, b, { "tm": "descending" });
    });
    console.log(items)
    return items
}

function default3(items) {
    items.sort(function (a, b) {
        return SortByProps(a, b, { "createTime": "descending" });
    });
    console.log(items)
    return items
}


//测站编码进行排序
function default1(items) {
    items.sort(function (a, b) {
        return SortByProps(a, b, { "stcd": "ascending"});
    });
    console.log(items)
    return items
}

//以下函数排序属性并未写死，可直接拿去用自定义属性
function SortByProps(item1, item2, obj) {
    var props = [];
    if (obj) {
        props.push(obj)
    }
    var cps = []; // 存储排序属性比较结果。
    // 如果未指定排序属性(即obj不存在)，则按照全属性升序排序。
    // 记录下两个排序项按照各个排序属性进行比较得到的结果
    var asc = true;
    if (props.length < 1) {
        for (var p in item1) {
            if (item1[p] > item2[p]) {
                cps.push(1);
                break; // 大于时跳出循环。
            } else if (item1[p] === item2[p]) {
                cps.push(0);
            } else {
                cps.push(-1);
                break; // 小于时跳出循环。
            }
        }
    }
    else {
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            for (var o in prop) {
                asc = prop[o] === "ascending";
                if (item1[o] > item2[o]) {
                    cps.push(asc ? 1 : -1);
                    break; // 大于时跳出循环。
                } else if (item1[o] === item2[o]) {
                    cps.push(0);
                } else {
                    cps.push(asc ? -1 : 1);
                    break; // 小于时跳出循环。
                }
            }
        }
    }

    // 根据各排序属性比较结果综合判断得出两个比较项的最终大小关系
    for (var j = 0; j < cps.length; j++) {
        if (cps[j] === 1 || cps[j] === -1) {
            return cps[j];
        }
    }
    return false;
}

// var country = ["秦都区", "渭城区", "兴平市", "武功县", "乾县", "礼泉县", "泾阳县", "三原县", "永寿县", "彬县", "长武县", "旬邑县", "淳化县", "杨陵示范区", "其它区域"];
var country = $.cookie("countysort").split(",");

function sortName(data) {
    var ttall = [];
    for (var i = 0; i < country.length; i++) {
        var tt = $.grep(data, function (d) {
            return d.addvnm == country[i]
        });
        for (var a = 0; a < tt.length; a++) {
            ttall.push(tt[a]);
        }
    }
    return ttall
}

//统计时段长标志
function timeLength0(d) {
    switch (d) {
        case "1":
            return "一日";
            break;
        case "2":
            return "三日";
            break;
        case "3":
            return "一候";
            break;
        case "4":
            return "一旬";
            break;
        case "5":
            return "一月";
            break;
        case "6":
            return "一年";
            break;
    }

}

function Acreage(data) {
    if (!isNull(data)) {
        var d = parseFloat(data);
        if (d != 0) {
            return d.toFixed(1)
        } else {
            return d;
        }
    } else {
        return ""
    }
}

var Typest = function (d) {
    var levelww = "";
    switch (d) {
        case "1":
            levelww = "中央报汛站"
            break;
        case "2":
            levelww = "省级重点报汛站"
            break;
        case "3":
            levelww = "省级一般报汛站"
            break;
        case "4":
            levelww = "其它报汛站"
            break;
        case "5":
            levelww = "山洪站"
            break;
    }
    return levelww
}

//遍历选择的树形节点
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

//获取指定日期的前一个月
function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2;
    return t2;
}

//获取指定日期的后一个月
function getAfterMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份
    var year2 = year;
    var month2 = parseInt(month) + 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2;
    return t2;
}


//时间格式化函数
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

//获取指定日期的前n分钟和后n分钟
function getNMinutes(date,n) {
    var dt=new Date(date.replace(/-/,"/"));//将传入的日期格式的字符串转换为date对象 兼容ie
// var dt=new Date(dateStr);//将传入的日期格式的字符串转换为date对象 非ie
    var ndt=new Date(dt.getTime()+n*60000).format("yyyy-MM-dd hh:mm");//将转换之后的时间减去两秒
    return ndt;
}

Array.prototype.distinct = function (){
    var arr = this,
        i,
        j,
        len = arr.length;
    for(i = 0; i < len; i++){
        for(j = i + 1; j < len; j++){
            if(arr[i] == arr[j]){
                arr.splice(j,1);
                len--;
                j--;
            }
        }
    }
    return arr;
};


//初始化咸阳本市区域
$.stationstring=[];
function initXY(n) {
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "area/getarea"
    }).done(function (data) {
        if (data.success) {
            $.each(data.data,function (i,v) {
                if(v.ALevel!==4){
                    //排除其他区域行测编码
                    if(n=="Name"){
                        $.stationstring.push(v.Name);
                    } else {
                        $.stationstring.push(v.Code);
                    }
                }
            });
            // console.log(data.data);
        } else {
            layer.msg(data.message, { time: 3000 });
        }
    });
}

//数组去重
function unique(arr){
    var res = [arr[0]];
    for(var i=1; i<arr.length; i++){
        var repeat = false;
        for(var j=0; j<res.length; j++){
            if(arr[i] === res[j]){
                repeat = true;
                break;
            }
        }
        if(!repeat){
            res.push(arr[i]);
        }
    }
    return res;
}
// console.log('------------方法一---------------');
//
// console.log(unique([1,1,2,3,5,3,1,5,6,7,4]));