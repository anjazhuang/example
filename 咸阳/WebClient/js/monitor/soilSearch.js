//监测查询参数
var params = {
    type: "soil",
    startime: "",
    endtime: ""
}

var html = "";
var myChart = "";
var option = "";
var table = "";
var resizeWorldMapContainer = "";
var title = "墒情";
var title1 = "重量含水率（%）";
var unit = "重量含水率（%）";
var subtitle = "";
var powers = [];
$(function () {
    //初始化ajax
    init();
    //初始化树形插件数据
    initTreedata(4);
    //初始化监测站点数据
    initCode(4);
    //下拉框combox
    $(".leftNav select").select2();
    $("#bxlevel").select2().val(['1', '2', '3']).trigger('change');
    $("#stcode").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(4, evt.params.data.id, $("#bxlevel").val(), $("#cztp").val())
    });
    // $("#bxlevel").on("select2:select", function (evt) {
    //     //这里是选中触发的事件
    //     //evt.params.data 是选中项的信息
    //     //alert($("#stcode").val());
    //     initTreedata(4, $("#stcode").val(), evt.params.data.id, $("#cztp").val())
    // });
    $("#bxlevel").on("change", function (evt) {
        if ($(this).val() !== null) {
            if ($(this).val().length > 5)
                initTreedata(4, $("#stcode").val(), "", $("#cztp").val())
            else
                initTreedata(4, $("#stcode").val(), $(this).val(), $("#cztp").val())
        } else {
            initTreedata(4, $("#stcode").val(), "", $("#cztp").val())
        }
    });
    $("#cztp").on("select2:select", function (evt) {
        //这里是选中触发的事件
        //evt.params.data 是选中项的信息
        //alert(evt.params.data.id);
        initTreedata(4, $("#stcode").val(), $("#bxlevel").val(), evt.params.data.id)
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

    //右边图表自适应方法
    window.onresize = function () {
        //重置容器高宽
        resizeWorldMapContainer();
        myChart.resize();
    };

    //统计查询方法
    $("#tongji").click(function () {
        initSoil();
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
    initSoil();
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

function initSoil() {
    if (timeValidcheck($("#s-date").find("input").val().split(" ")[0]) && timeValidcheck($("#e-date").find("input").val().split(" ")[0])) {
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
        //查询条件不能为空
        if (params.startime !== "" && params.endtime !== "" && powers.length !== 0) {
            //查询时图形报表总是显示
            $(".tab-pane").eq(0).addClass("active in").siblings().removeClass("in active");
            $(".navtab li").eq(0).addClass("active").siblings().removeClass("active");
            var loading = "";
            //墒情查询参数
            var obj = {
                Type: 'post',
                Uri: '/data/getsoildata',
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
                    layer.close(loading);
                    var x_soil_data = [], stationame = [], chartsData = [];
                    //console.log(data.data);
                    $("#soiltab").removeClass("hidden").siblings().addClass("hidden");
                    //墒情数据类型
                    html = "<option value='重量含水率（%）'>重量含水率</option>";
                    $("#dataType").html(html);
                    $("#dataType").removeAttr("class");
                    title = "墒情";
                    title1 = "重量含水率（%）";
                    unit = "重量含水率（%）";
                    //墒情数据分类
                    $.each(data.data, function (key, obj) {
                        x_soil_data.push(obj.Time.replace("T", " "))
                    });
                    //墒情图表option
                    for (var i = 0; i < powers.length; i++) {
                        var tt = $.grep(data.data, function (d) {
                            return d.Code == powers[i];
                        });
                        if (tt.length !== 0) {
                            var stationdata = [];
                            //console.log("找到的站点编码:" + powers[i]);
                            $.each(tt, function (key, obj) {
                                if (obj.MA !== null) {
                                    var aa = {
                                        name: obj.Time,
                                        value: [obj.Time, obj.MA]
                                    }
                                    stationdata.push(aa);
                                }
                            });
                            var chartsobj = {
                                name: tt[0].Name,
                                type: 'line',
                                symbol: 'circle',
                                symbolSize: 6,
                                data: stationdata
                            };
                            chartsData.push(chartsobj);
                            stationame.push(tt[0].Name)
                        }
                    }
                    //console.log(chartsData);
                    // //console.log("找到的所有站点编码名组合:" + stationname);
                    // myChart.refresh;
                    if (chartsData.length == 0) {
                        layer.msg("没有找到墒情相关数据")
                    }
                    myChart.setOption({
                        title: {
                            text: "土壤重量含水量过程图",
                            subtext: params.startime + ":00 -" + params.endtime + ":00",
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
                    //墒情数据列表
                    // table = $('#soil-tab').DataTable({
                    //     aaData: data.data,
                    //     lengthChange: false,
                    //     searching: false,
                    //     destroy: true,
                    //     "iDisplayLength": 15,
                    //     language: reportLanguage,
                    //     ordering: false,
                    //     columns: [
                    //         {"data": null, "targets": 0},
                    //         {"data": "Time"},
                    //         {"data": "Code"},
                    //         {"data": "Name"},
                    //         {"data": "AreaName"},
                    //         {"data": "RiverSystemName"},
                    //         {"data": "RiverName"},
                    //         {"data": "R10"},
                    //         {"data": "R20"},
                    //         {"data": "R40"},
                    //         {"data": "RA"}
                    //     ],
                    //     fnDrawCallback: function () { //解决序号列没法生成的问题
                    //         var api = this.api();
                    //         var startIndex = api.context[0]._iDisplayStart;//获取到本页开始的条数(适用于后台分页)
                    //         api.column(0).nodes().each(function (cell, i) {
                    //             cell.innerHTML = 1 + i;
                    //             //适用于后台分页 cell.innerHTML =  1 + i+startIndex;
                    //         });
                    //         api.column(1).nodes().each(function (cell, i) {
                    //             cell.innerHTML = cell.innerHTML.replace("T", " ");
                    //         });
                    //     }
                    // });
                    var intervalSoilHtml = "<div class='tabletitle'>含水率土壤墒情信息表</div>" +
                        "<div><div class='btime'><strong>检索时间: </strong>" + $("#s-date input").val() + " 至 " + $("#e-date input").val() + "</div>" +
                        "<div class='bunits'><span class='total'>重量含水率：% 总记录数：" + data.data.length + "</span></div></div>";
                    intervalSoilHtml += '<div class="tablediv1"><table id="soiltable" class="soiltable stripe row-border order-column nowrap table-bordered text-center" width="100%" cellspacing="0">';
                    intervalSoilHtml += '<thead>' +
                        '<tr>' +
                        '<th rowspan="2">序号</th>' +
                        '<th rowspan="2">测站编号</th>' +
                        '<th rowspan="2">测站名称</th>' +
                        '<th rowspan="2">时间</th>' +
                        '<th rowspan="2">表层含水率</th>' +
                        '<th colspan="4" rowspan="1">重量含水量</th>' +
                        '<th rowspan="2">作物种类</th>' +
                        '<th rowspan="2">作物生长期</th>' +
                        '<th rowspan="2">作物受灾原因</th>' +
                        '<th rowspan="2">土壤含水率测法</th>' +
                        '</tr>' +
                        '<tr>' +
                        '<th rowspan="1">10cm</th>' +
                        '<th rowspan="1">20cm</th>' +
                        '<th rowspan="1">40cm</th>' +
                        '<th rowspan="1">均值</th>' +
                        '</tr>' +
                        '</thead><tbody>';
                    if (data.data.length > 0) {

                        $.each(data.data, function (key, obj) {
                            intervalSoilHtml += '<tr>' +
                                '<td>' + (key+1) + '</td>' +
                                '<td>' + obj.Code + '</td>' +
                                '<td>' + obj.Name + '</td>' +
                                '<td>' + obj.Time.replace("T", " ") + '</td>' +
                                '<td>' + (obj.SRLSLM == null ? "" : obj.SRLSLM) + '</td>' +
                                '<td>' + (obj.M10 == null ? "" : obj.M10) + '</td>' +
                                '<td>' + (obj.M20 == null ? "" : obj.M20) + '</td>' +
                                '<td>' + (obj.M40 == null ? "" : obj.M40) + '</td>' +
                                '<td>' + (obj.MA == null ? "" : obj.MA) + '</td>' +
                                '<td>' + (obj.CRPTY == "未知" ? "" : obj.CRPTY) + '</td>' +
                                '<td>' + (obj.CRPGRWPRD == "未知" ? "" : obj.CRPGRWPRD) + '</td>' +
                                '<td>' + (obj.HITRSN == "未知" ? "" : obj.HITRSN) + '</td>' +
                                '<td>' + (obj.SLMMMT == "未知" ? "" : obj.SLMMMT) + '</td>' +
                                '</tr>';
                        });
                    } else {
                        intervalSoilHtml += '<tr>' +
                            '<td colspan="13">无数据</td>' +
                            '</tr>';
                    }
                    intervalSoilHtml += '</tbody></table></div><div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
                    $("#soiltab").html(intervalSoilHtml);
                } else {
                    //提示错误信息
                    layer.msg(data.message, { time: 3000 });
                    layer.close(loading);
                }
            });
        } else {
            layer.msg("请选择站点以及开始和结束时间!")
        }
    } else {
        layer.msg("输入时间格式有误!")
    }
}

//导出表格
var aclick = function (aa) {
    if ($('#soiltable tr:last').find('td').text() !== "无数据") {
        var jst = $(".btime").text();
        var total = $(".total").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "含水率土壤墒情信息表.xls");
        //alert(params.querytp+jst+total);
        exportExcel(aa, 'soiltable', '含水率土壤墒情信息表', jst, total, time, company, 2)
    }
    else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}
