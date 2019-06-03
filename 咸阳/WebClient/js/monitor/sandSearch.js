//监测查询参数
var params = {
    type: "sand",
    startime: "",
    querytp: "0",
    endtime: ""
}

var html = "";
var myChart = "";
var option = "";
var table = "";
var resizeWorldMapContainer = "";
var title = "沙情";
var title1 = "输水总量";
var unit = "输水总量（万吨）";
var subtitle = "";
var powers = [];
$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata(5);
    //初始化监测站点数据
    initCode(5);
    //下拉框combox
    $(".leftNav select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(5, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert($("#stcode").val());
    //     initTreedata(5, $("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(5, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(5, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(5, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(5, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
    });
    //右边图表自适应方法
    resizeWorldMapContainer = function () {
        document.getElementById('chart').style.width = (window.innerWidth - 253) + 'px';
        document.getElementById('chart').style.height = (window.innerHeight - 130) + 'px';
    };
    //右边图表自适应方法
    resizeWorldMapContainer();
    //右边图表初始化容器
    myChart = echarts.init(document.getElementById('chart'));
    window.onresize = function () {
        //重置容器高宽
        resizeWorldMapContainer();
        myChart.resize();
    };

    //查询类型
    $("#queryType").on("change",function () {
       params.querytp=$(this).val();
    });
    //导出事件
    $("#exportFile").click(function () {
        if (params.type === "soil") {
            params.startime = $("#s-date").find("input").val();
            params.endtime = $("#e-date").find("input").val();
            if ($(".tab0:first ").hasClass("active")) {
                powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
                //console.log(powers);
            } else if ($(".tab0:last").hasClass("active")) {
                powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
                //console.log(powers);
            }
            var obj = {
                Type: 'post',
                Uri: '/data/exportsoildata',
                SessionId: $.cookie("sessionid"),
                Parameter: {
                    Codes: powers,
                    StartTime: params.startime + ":00",
                    EndTime: params.endtime + ":00"
                }
            };
            DownLoadFile({
                url: serverConfig.soilExportApi,
                data: obj
            });
        }
    });
    //统计查询方法
    $("#tongji").click(function () {
        initSand();
    });
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
    initSand();
    $("#dataType").change(function () {
        if ($(this).val() == "输沙总量") {
            html = "<option value='输沙总量'>输沙总量</option><option value='输水总量'>输水总量</option>";
            charfunc(1,0)
        } else {
            html = "<option value='输水总量'>输水总量</option><option value='输沙总量'>输沙总量</option>";
            charfunc(0,0)
        }
    })
});

//获取日期
function getDate(datestr) {
    var temp = datestr.split("-");
    var date = new Date(temp[0], temp[1], temp[2]);
    return date;
}

function daysBetween(sDate1, sDate2) {
//Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
    var time1 = Date.parse(new Date(sDate1));
    var time2 = Date.parse(new Date(sDate2));
    var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
    return nDays;
};


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


function initSand() {
    if (timeValidcheck($("#s-date").find("input").val().split(" ")[0]) && timeValidcheck($("#e-date").find("input").val().split(" ")[0])) {
        //开始时间
        params.startime = $("#s-date").find("input").val();
        //结束时间
        params.endtime = $("#e-date").find("input").val();
        //行政区域站点查询
        if ($(".tab0:first ").hasClass("active")) {
            powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoCity'), $.fn.zTree.getZTreeObj('treeDemoCity').getNodes(), []);
            //console.log(powers);
            //console.log(powers.join(","));
        } else if ($(".tab0:last").hasClass("active")) {
            //流域站点查询
            powers = GetNodeIds($.fn.zTree.getZTreeObj('treeDemoRiver'), $.fn.zTree.getZTreeObj('treeDemoRiver').getNodes(), []);
            //console.log(powers);
        }
        if (params.startime !== "" && params.endtime !== "" && powers.length !== 0) {
            //查询时图形报表总是显示
            $(".tab-pane").eq(0).addClass("active in").siblings().removeClass("in active");
            $(".navtab li").eq(0).addClass("active").siblings().removeClass("active");
            html = "<option value='输水总量'>输水总量</option><option value='输沙总量'>输沙总量</option>";
            charfunc(0,params.querytp);
        } else {
            layer.msg("请选择站点以及开始和结束时间!")
        }
    } else {
        layer.msg("输入时间格式有误")
    }

}

function charfunc(tp,n) {
    //alert(tp);
    if(n==0){
        $('a[href="#chart0"]').parent("li").removeAttr("style");
        $('a[href="#chart0"]').css("pointer-events", "visible");
        var loading = "";
        //沙情查询参数
        var obj = {
            Type: 'post',
            Uri: '/data/getsanddata',
            Parameter: {
                Codes: powers,
                StartTime: params.startime + ":00",
                EndTime: params.endtime + ":00"
            }
        };
        ////console.log(obj);
        $.ajax({
            url: serverConfig.soilApi,
            data: JSON.stringify(obj),
            beforeSend: function (request) {
                loading = layer.load(2, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            }
        }).done(function (data) {
            if (data.success) {
                console.log(data);
                layer.close(loading);
                var x_soil_data = [], stationame = [], chartsData = [];
                //console.log(data.data);
                $("#sandtab").removeClass("hidden").siblings().addClass("hidden");
                //墒情数据类型
                $("#dataType").html(html);
                title = "沙情";
                if (tp == 0) {
                    title1 = "输水总量";
                    unit = "输水总量（百万立方米）";
                } else {
                    title1 = "输沙总量";
                    unit = "输沙总量（万吨）";
                }
                //墒情数据分类
                $.each(data.data, function (key, obj) {
                    x_soil_data.push(obj.IDTM.replace("T", " "))
                });
                //沙情图表option
                for (var i = 0; i < powers.length; i++) {
                    var tt = $.grep(data.data, function (d) {
                        return d.STCD == powers[i];
                    });
                    if (tt.length !== 0) {
                        var stationdata = [];
                        //console.log("找到的站点编码:" + powers[i]);
                        if (tp == 0) {
                            $.each(tt, function (key, obj) {
                                if (obj.WRNF !== null) {
                                    var aa = {
                                        name: obj.IDTM,
                                        value: [obj.IDTM, obj.WRNF]
                                    }
                                    stationdata.push(aa);
                                }
                            });
                        } else {
                            $.each(tt, function (key, obj) {
                                if (obj.STW !== null) {
                                    var aa = {
                                        name: obj.IDTM,
                                        value: [obj.IDTM, obj.STW]
                                    }
                                    stationdata.push(aa);
                                }
                            });
                        }
                        var chartsobj = {
                            name: tt[0].STNM,
                            type: 'line',
                            symbol: 'circle',
                            smooth:'true',
                            symbolSize: 6,
                            data: stationdata
                        };
                        chartsData.push(chartsobj);
                        stationame.push(tt[0].STNM)
                    }
                }
                //console.log(chartsData);
                // //console.log("找到的所有站点编码名组合:" + stationname);
                // myChart.refresh;
                if (chartsData.length == 0) {
                    layer.msg("没有找到沙情相关数据")
                }
                myChart.setOption({
                    title: {
                        text: title + title1 + "过程图",
                        subtext: params.startime + ":00 - " + params.endtime + ":00",
                        left: 'center',
                        textStyle: {
                            fontSize: 16
                        },
                        itemGap: 6
                    },
                    //墒情图表位置
                    grid: {
                        left: '5%',
                        right: '5%',
                        top: "80",
                        bottom: "80"
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0,
                            end: 100
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 0,
                            end: 100
                        }
                    ],
                    toolbox: {
                        right: 100,
                        feature: {
                            saveAsImage: {
                                title: "保存为图片",
                                iconStyle: {
                                    normal: {
                                        textAlign: "left"
                                    }
                                },
                                excludeComponents: ["dataZoom", "toolbox"]
                            }
                        }
                    },
                    legend: {
                        data: stationame,
                        type: 'scroll',
                        top: 40
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            animation: false,
                            label: {
                                backgroundColor: '#9BCD9B'
                            }
                        },
                        backgroundColor: '#9BCD9B',
                        padding: 5,
                        formatter: function (params, ticket, callback) {
                            var oo = [];
                            for (var ii = 0; ii < params.length; ii++) {
                                //console.log(params[ii]);
                                var res = params[ii].seriesName + ': 时间:' + params[ii].data.value[0].replace("T", " ") + '  数据:' + params[ii].data.value[1] + "<br/>";
                                oo.push(res);
                            }
                            return oo.join(" ")
                        }
                    },
                    xAxis: {
                        name: '时间/h',
                        type: 'time',
                        splitLine: {
                            show: false
                        }
                    },
                    yAxis: {
                        name: unit,
                        type: 'value',
                        inverse: false
                    },
                    series: chartsData
                }, true);

                var intervalSandHtml = "<div class='tabletitle'>输沙输水总量表</div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                    "<div class='bunits'><span class='total'>输沙总量：万吨 输水总量：百万立方米 总记录数：" + data.data.length + "</span></div></div>";
                intervalSandHtml += '<div class="tablediv1"><table id="sandtable"  class="sandtable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                intervalSandHtml += '<thead>' +
                    '<tr>' +
                    '<th>序号</th>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>时间</th>' +
                    '<th>统计时段标志</th>' +
                    '<th>输水总量</th>' +
                    '<th>输沙总量</th>' +
                    '</thead><tbody>';
                if (data.data.length > 0) {
                    $.each(data.data, function (key, obj) {
                        intervalSandHtml += '<tr>' +
                            '<td>' + (key+1) + '</td>' +
                            '<td>' + obj.STCD + '</td>' +
                            '<td>' + obj.STNM + '</td>' +
                            '<td>' + obj.IDTM.replace("T", " ") + '</td>' +
                            '<td>' + obj.STTDRCD + '</td>' +
                            '<td>' + (obj.WRNF == null ? "" : obj.WRNF) + '</td>' +
                            '<td>' + (obj.STW == null ? "" : obj.STW) + '</td>' +
                            '</tr>';
                    });
                } else {
                    intervalSandHtml += '<tr>' +
                        '<td colspan="7">无数据</td>' +
                        '</tr>';
                }
                intervalSandHtml += '</tbody></table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#sandtab").html(intervalSandHtml);
            } else {
                //提示错误信息
                layer.msg(data.message, { time: 3000 });
                layer.close(loading);
            }
        });
    }else {
        $('a[href="#chart0"]').parent("li").css({
            "cursor": "not-allowed",
            "background": "#e0e0e0",
            "opacity": "0.5"
        });
        $('a[href="#chart0"]').css("pointer-events", "none");
        var loading = "";
        //沙情查询参数
        var obj = {
            Type: 'post',
            Uri: '/data/getsiltdata',
            Parameter: {
                Codes: powers,
                StartTime: params.startime + ":00",
                EndTime: params.endtime + ":00"
            }
        };
        ////console.log(obj);
        $.ajax({
            url: serverConfig.soilApi,
            data: JSON.stringify(obj),
            beforeSend: function (request) {
                loading = layer.load(2, {
                    shade: [0.5, '#fff'] //0.1透明度的白色背景
                });
            }
        }).done(function (data) {
            if (data.success) {
                console.log(data);
                layer.close(loading);
                var x_soil_data = [], stationame = [], chartsData = [];
                //console.log(data.data);
                $("#sandtab").removeClass("hidden").siblings().addClass("hidden");
                //墒情数据类型
                // $("#dataType").html(html);
                // title = "沙情";
                // if (tp == 0) {
                //     title1 = "输水总量";
                //     unit = "输水总量（百万立方米）";
                // } else {
                //     title1 = "输沙总量";
                //     unit = "输沙总量（万吨）";
                // }
                //墒情数据分类
                // $.each(data.data, function (key, obj) {
                //     x_soil_data.push(obj.IDTM.replace("T", " "))
                // });

                var intervalSandHtml = "<div class='tabletitle'>含沙量表</div>" +
                    "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                    "<div class='bunits'><span class='total'>含沙量：千克/立方米 总记录数：" + data.data.length + "</span></div></div>";
                intervalSandHtml += '<div class="tablediv1"><table id="sandtable"  class="sandtable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                intervalSandHtml += '<thead>' +
                    '<tr>' +
                    '<th>序号</th>' +
                    '<th>测站编码</th>' +
                    '<th>测站名称</th>' +
                    '<th>时间</th>' +
                    '<th>含沙量</th>' +
                    '<th>含沙量特征码</th>' +
                    '<th>含沙量测法</th>' +
                    '</thead><tbody>';
                if (data.data.length > 0) {
                    $.each(data.data, function (key, obj) {
                        intervalSandHtml += '<tr>' +
                            '<td>' + (key+1) + '</td>' +
                            '<td>' + obj.STCD + '</td>' +
                            '<td>' + obj.STNM + '</td>' +
                            '<td>' + obj.TM.replace("T", " ") + '</td>' +
                            '<td>' + obj.S + '</td>' +
                            '<td>' + (obj.SCHRCD == "未知" ? "" : obj.SCHRCD) + '</td>' +
                            '<td>' + (obj.SMT == null ? "" : obj.SMT) + '</td>' +
                            '</tr>';
                    });
                } else {
                    intervalSandHtml += '<tr>' +
                        '<td colspan="6">无数据</td>' +
                        '</tr>';
                }
                intervalSandHtml += '</tbody></table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                $("#sandtab").html(intervalSandHtml);
            } else {
                //提示错误信息
                layer.msg(data.message, { time: 3000 });
                layer.close(loading);
            }
        });
    }
}

//导出表格
var aclick = function (aa) {
    if ($('#sandtable tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        if(params.querytp==0){
            $(aa).attr("download", "输沙输水总量表.xls");
            //alert(params.querytp+jst+total);
            exportExcel(aa, 'sandtable', '输沙输水总量表', jst, total, time, company, 1)
        }else {
            $(aa).attr("download", "含沙总量表.xls");
            //alert(params.querytp+jst+total);
            exportExcel(aa, 'sandtable', '含沙总量表', jst, total, time, company, 1)
        }

    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}