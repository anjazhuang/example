var user = JSON.parse($.cookie("user"));
//图片接口连接
var picapi = $.cookie("picapi");
//图片显示src连接
var picapi1 = picapi.replace("/api", "");
var operationperson_table, operationperson_tab2,
    //运维人员工作考核表格option配置
    operationperson_table_option = {
        language: reportLanguage1,
        "aaSorting": [[0, "asc"]],
        "searching": false,
        "bPaginate": true,
        "bDestroy": true,
        "iDisplayLength": 15,
        "bInfo": true,
        columns: [
            {
                "data": "index",
                "render": function (data, type, row, meta) {
                    //自动排序
                    var startIndex = meta.settings._iDisplayStart;
                    return meta.row + 1;
                }
            },
            { "data": "name" },
            { "data": "addvnm" },
            { "data": "dealNum" },

            // {
            //     'data': 'maintenanceRate', 'class': 'text-center',
            //     fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
            //         $(nTd).html(sData * 100 + '%');
            //     }
            // },
            {
                "data": "dealTime",
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html(sData + 'h');
                }
            }
        ],
        columnDefs: [
            {
                targets: 5,
                //操作按钮
                render: function (data, type, row, meta) {
                    var aa = JSON.stringify(row).replace(/\"/g, "'");
                    return '<button type="button" class="btn btn-sm btn-primary" onclick="showpersonInfo((' + aa + '))";><span class="glyphicon glyphicon-list-alt"></span>&nbsp;详细</button>';
                }
            }
        ]
    },
    operationperson_table_option2 = {
        language: reportLanguage1,
        "aaSorting": [[0, "asc"]],
        "searching": false,
        "bPaginate": true,
        "bDestroy": true,
        "iDisplayLength": 15,
        "bInfo": true,
        columns: [
            { "data": "taskNo" },
            { "data": "stcd" },
            { "data": "STNM" },
            { "data": "AreaName" },
            {
                "data": "priorityStatus",
                "render": function (data, type, row, meta) {
                    if (data == 3) {
                        return '普通'
                    } else if (data == 2) {
                        return '优先'
                    } else if (data == 1) {
                        return '紧急'
                    }
                }
            },
            { "data": "reciveTime" }
        ],
        columnDefs: [
            {
                targets: 6,
                //操作按钮
                render: function (data, type, row, meta) {
                    var aa = JSON.stringify(row).replace(/\"/g, "'");
                    return '<button type="button" class="btn btn-sm btn-primary" onclick="seeRepaired((' + aa + '),2)"><span class="glyphicon glyphicon-list-alt"></span> 查看</button>';
                }
            }
        ]
    },
    operationperson_table_data = [];
var stationstring = [];


function efficiencyTable() {
    var obj = {
        Type: 'GET',
        Uri: '/statistics/efficiency',
        Parameter: {
            addvcd: user.AreaCode
        }
    };
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            var html = "";
            var data = data.data.data;
            var ttall = [];
            for (var i = 0; i < country.length; i++) {
                var tt = $.grep(data, function (d) {
                    return d.Name == country[i]
                });
                for (var a = 0; a < tt.length; a++) {
                    ttall.push(tt[a]);
                }
            }
            $.each(ttall, function (key, oData) {
                var avgDealTime;//平均维修时间
                if (!oData.dealNum || !oData.dealTime) {
                    avgDealTime = '0';
                } else {
                    avgDealTime = parseInt(oData.dealTime / oData.dealNum);
                }
                var avgResponseTime;//平均响应时间
                if (!oData.responseTime || !oData.responseNum) {
                    avgResponseTime = '0';
                } else {
                    avgResponseTime = parseInt(oData.responseTime / oData.responseNum);
                }

                var ensure = parseFloat(oData.dealNum / oData.responseNum).toFixed(2) * 100;//保证率
                if (isNaN(ensure)) {
                    ensure = '0';
                }
                html += "<tr><td>" + oData.Name + "</td><td>" + avgDealTime + "</td><td>" + avgResponseTime + "</td><td>" + ensure + "</td></tr>";
            });
            $("#efficiency").append(html);
        } else {
            layer.msg(data.message);
        }
    });
}


//历史维修记录详情查看
function seeRepaired(data, type) {
    var bool = true;
    layer.open({
        type: 1,
        area: ['800px', '450px'], //宽高
        title: '维修操作',
        shade: 0.1,
        maxmin: false,
        resize: false,
        shadeClose: true,
        content: $(".repaired"),
        success: function () {
            //打开窗口初始化
            // //console.log(data);
            $("#operaterTaskNo").html(data.taskNo);
            $("#operaterAddvcd").html(data.AreaName);
            $("#operaterName").html(data.maintName);
            $("#operaterStcd").html(data.stcd);
            $("#operaterStmn").html(data.STNM);
            $("#operaterPriorityName").html(data.priorityName);
            $("#operaterContent").html(data.content);

            if (type == 2) {
                //查看详情的话
                $("#process").css('display', 'block');
                $("#operate").css('display', 'none');
                //加载流程记录
                initProcess(data.taskNo);

            } else {
                $("#process").css('display', 'none');
                $("#operate").css('display', 'block');
                $("#journal").val('');
            }
        },
        // yes: function (index) {
        //     if ($('#addpic')[0].files.length !== 0) {
        //         //添加图片
        //         for (var i = 0; i < $('#addpic')[0].files.length; i++) {
        //             var imgdata = new FormData();
        //             imgdata.append('files[]', $('#addpic')[0].files[i]);
        //             //console.log(imgdata);
        //             $.ajax({
        //                 async: false,
        //                 url: "http://172.16.5.91:8088/xianyang/api/taskDealNode/addMedia?taskNo=" + data.taskNo + "&" + url,
        //                 data: imgdata,
        //                 cache: false,
        //                 contentType: false,
        //                 dataType: "json",
        //                 processData: false,
        //                 type: 'POST',
        //                 success: function (data) {
        //                     var a = 11;
        //                 }
        //             }).done(function (data) {
        //                 if (data.success) {
        //                     //layer.msg(data.message);
        //                 } else {
        //                     layer.msg(data.message);
        //                     bool = false;
        //                 }
        //             });
        //         }
        //     }
        //
        //     var journal = $("#journal").val();
        //     if (journal != "") {
        //         //添加日志
        //         var Parameter = {
        //             taskNo: data.taskNo,
        //             content: journal,
        //             dealType: 1,
        //         }
        //         // //console.log(JSON.stringify(Parameter));
        //         $.ajax({
        //             type: "post",
        //             url: "http://172.16.5.91:8088/xianyang/api/taskDealNode/addJournal?taskNo=" + data.taskNo + "&" + url,
        //             data: JSON.stringify(Parameter)
        //         }).done(function (data) {
        //             if (data.success) {
        //
        //
        //             } else {
        //                 layer.msg(data.message);
        //                 bool = false;
        //             }
        //         });
        //
        //     }
        //     if (bool) {
        //         layer.close(index);
        //         selectTaskTable();
        //     }
        // }
    });
}

//加载流程
function initProcess(taskNo) {
    $("#process").html("");
    var obj = {
        Type: 'GET',
        Uri: '/taskProcess/select',
        Parameter: {
            taskNo: taskNo
        }
    };
    // $.ajax({
    //     type: "GET",
    //     url: "http://172.16.5.91:8088/xianyang/api/taskProcess/select?taskNo=" + taskNo,
    // })
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            var html = "";
            var data = data.data.data;
            $.each(data, function (key, obj) {
                //流程节点
                html += '<div class="child"><span></span> <p class="state">' + obj.content + '</p><p class="tm">' + obj.operateTime + '</p></div>';
                if (obj.basTaskDealNodes.length > 0) {
                    //如果该节点有上传图片等信息
                    html += '<ul style="list-style: none;">';
                    $.each(obj.basTaskDealNodes, function (index, source) {
                        if (source.dealType == 1) {
                            //日志
                            html += '<li>' + source.content + ' ' + source.operateTime + '</li>';
                        }
                        if (source.dealType == 2) {
                            //图片
                            html += ' <li class="img-list" ><img src="' + picapi1 + source.url + '"></li>';
                        }
                        // //console.log(source.content);
                    });
                    html += '</ul>';
                }
            });
            $("#process").append(html);
        } else {
            layer.msg(data.message);
        }
    });
}


$(function () {
    //初始化ajax
    init();
    //初始化行政区域
    initArea();
    efficiencyTable();
    //初始化时间控件
    $("#s-date,#e-date").datetimepicker({
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        pickerPosition: "top-left",
        endDate: new Date()
    });

    $("#city_ct").datetimepicker({
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
    //初始化时间控件
    $("#s-date,#e-date,#city_ct").datetimepicker('update', new Date());

    $("#s-date input").val(moment().add('days', -7).format('YYYY-MM-DD'));
    $("#e-date input").val(moment().format('YYYY-MM-DD'));
    initXY("Name");
    //初始化管理业务工作考核折线图和柱状图
    setChart();

    //初始化管理业务工作考核表格

    $("#selectAssessment").on("click", function () {
        showtabledata();
    });
    $("#AreaName").text(user.AreaName);
    $("#rate-query").click(function () {
        setChart();
    });
    $("#levelSelect").select2();
    $("#levelSelect").select2().val(['1', '2', '3']).trigger('change');
});

//运维人员考核表
function showtabledata() {
    var obj = {
        Type: 'GET',
        Uri: 'statistics/taskCount',
        Parameter: {
            'startTime': $("#s-date input").val(),
            'endTime': $("#e-date input").val(),
            'addvcd': $("#adminarea").val(),
            'maintName': $("#device_coding input").val()
        }
        //Uri: '/statistics/assessment',
        // Parameter: {
        //     startTime: $("#s-date input").val(),
        //     endTime: $("#e-date input").val(),
        //     addvcd: $("#adminarea").val(),
        //     maintName: $("#device_coding input").val()
        // }
    };
    // $.ajax({
    //     type: "GET",
    //     url: "http://172.16.5.91:8088/xianyang/api/statistics/efficiency",
    //     // data:{
    //     //     addvcd:user.AreaCode
    //     // }
    // })
    // $.ajax({
    //     type: "GET",
    //     url: "http://172.16.5.91:8088/xianyang/api/statistics/assessment",
    //     data: {
    //         startTime: $("#s-date input").val(),
    //         endTime: $("#e-date input").val(),
    //         addvcd: $("#adminarea").val(),
    //         maintName: $("#device_coding input").val()
    //     }
    // })
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            operationperson_table_data = data.data.data;
            console.log('operationperson_table_data:'+operationperson_table_data);
            operationperson_table = datatableinit(operationperson_table_data, '#operation_table', operationperson_table_option, operationperson_table);
        } else {
            layer.msg(data.message);
        }
    });


}

//维护记录
function showTaskHistory(id) {
    var obj = {
        Type: 'GET',
        Uri: '/task/select',
        Parameter: {
            SystemRole: "普通用户",
            taskStatus: "60",
            maintUserId: id
        }
    };
    // $.ajax({
    //     type: "GET",
    //     url: "http://172.16.5.91:8088/xianyang/api/task/select",
    //     data: {
    //         SystemRole: "普通用户",
    //         taskStatus: "60",
    //         maintUserId: id
    //     }
    // })
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        //console.log(data);
        if (data.success) {
            operationperson_tab2 = datatableinit(data.data.data, '#operationperson_tab', operationperson_table_option2, operationperson_tab2);
        } else {
            layer.message(data.message);
        }
    });
}

//运维人员工作考核表格详情按钮弹窗
function showpersonInfo(data) {
    layer.open({
        type: 1,
        area: ['700px', '600px'], //宽高
        title: '运维人员考核详细信息',
        shade: 0.1,
        maxmin: false,
        resize: false,
        btn: ['保存', '关闭'],
        shadeClose: true,
        //offset: ['150px', '20px'],
        content: $("#personinfo"),
        success: function () {
            //打开窗口初始化
            console.log(data);
            $("#o_name").text(data.name);
            $("#o_city").text(data.addvnm);
            $("#o_workrate").text(data.dealTime + "h");
            $("#o_quality").text(data.dealNum);
            showTaskHistory(data.userId);
        },
        yes: function (index, layero) {
            layer.msg('保存成功!');
            layer.close(index); //如果设定了yes回调，需进行手工关闭
        },
        end: function (index, layero) {
            layer.close(index);
        }
    });
}

//工作考核折线图和柱状图
function setChart() {
    var data1;
    var data2;
    //全市故障站统计趋势分析折线图
    var obj = {
        Type: 'GET',
        Uri: '/statistics/statisticsFault',
        Parameter: {
            addvcd: user.AreaCode
        }
    };
    // $.ajax({
    //     type: "GET",
    //     url: "http://172.16.5.91:8088/xianyang/api/statistics/statisticsFault",
    //     // data:{
    //     //     addvcd:user.AreaCode
    //     // }
    // })
    $.ajax({
        url: serverConfig.operationApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            data1 = data;
            //各区县畅通率统计
            var obj0 = {
                Type: 'GET',
                Uri: '/statistics/unobstructed',
                Parameter: {
                    addvcd: user.AreaCode,
                    checkDate: $("#city_ct input").val() + ":00",
                    frgrd:$("#levelSelect").val().join()
                }
            };
            $.ajax({
                url: serverConfig.operationApi,
                data: JSON.stringify(obj0)
            }).done(function (data) {
                if (data.success) {
                    // var levelString = [], levelName = [], matchSta = [];
                    // levelString = $("#levelSelect").val();
                    // if (levelString !== null) {
                    //     for (var i = 0; i < levelString.length; i++) {
                    //         var sst = $.grep(stationstring, function (d) {
                    //             console.log(Typest(levelString[i]));
                    //             return d.Level == Typest(levelString[i])
                    //         });
                    //         $.merge(matchSta, sst);
                    //     }
                    //     for (var vv = 0; vv < matchSta.length; vv++) {
                    //         levelName.push(matchSta[vv].AreaName);
                    //     }
                    //     // console.log(levelCode);
                    //     //筛选去除不符合所选报讯等级返回的站码序列返回的数组
                    //

                    // }
                    for (var i = 0; i < data.data.data.length; i++) {
                        if ($.stationstring.indexOf(data.data.data[i].name) == -1) {
                            data.data.data.splice(i, 1);
                            i-=1
                        }
                    }
                    data2 = data.data.data;
                    initChart(data1, data2);
                } else {
                    layer.msg(data.message);
                }
            });
        } else {
            layer.msg(data.message);
        }
    });
}

//管理业务工作考核折线图和柱状图方法
function initChart(data1, data2) {
    var date = new Array()
    var faultNum = new Array();
    data1.data.data.sort(function(a,b){
        return Date.parse(a.date) - Date.parse(b.date);//时间正序
    });
    $.each(data1.data.data, function (index, obj) {
        date[index] = obj.date;
        faultNum[index] = obj.faultNum;
    });
    var name = new Array()
    var error = new Array()
    var normal = new Array();
    var ttall = [];
    for (var i = 0; i < country.length; i++) {
        var tt = $.grep(data2, function (d) {
            return d.name == country[i]
        });
        for (var a = 0; a < tt.length; a++) {
            ttall.push(tt[a]);
        }
    }
    $.each(ttall, function (index, obj) {
        name[index] = obj.name;
        error[index] = obj.error;
        normal[index] = obj.normal;
    });
    // //console.log(name);
    //alert($(".box").height() - 30);
    $("#errorstationanalysis").width($(".box0").width());
    $("#errorstationanalysis").height($(".box0").height() - 25);
    $("#normaloperationrate").height($(".box").height() - 50);
    $("#normaloperationrate").width($(".box").width());
    var myChart0 = echarts.init(document.getElementById('errorstationanalysis'));
    var myChart1 = echarts.init(document.getElementById('normaloperationrate'));
    //全市故障站统计趋势分析
    myChart0.setOption({
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '5%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            name: "时间",
            type: 'category',
            // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            data: date,
        },
        yAxis: {
            name: "数量/个",
            type: 'value'
        },
        series: [
            {
                name: '故障站数',
                type: 'line',
                stack: '总量',
                // data: [26, 24, 27, 25, 26, 25, 27, 28, 29, 25, 26, 23]
                data: faultNum,
            }
        ]
    });

    //各区县上报率统计
    myChart1.setOption({
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            // formatter: '{a0}: {c0} 站<br />{a1}: {c1} 站'
            formatter: function (params, ticket, callback) {
                console.log(params);
                return params[0].seriesName + "：" + params[0].data + " 站<br/>" + params[1].seriesName + "：" + params[1].data + " 站<br/>" +
                    "报送率：" + ((params[0].data / (params[0].data + params[1].data) * 100) == "0" ? "0" : (params[0].data / (params[0].data + params[1].data) * 100).toFixed(1)) + "%"
            }
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        legend: {
            data: ['正常', '未上报']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'category',
                data: name,
                // axisLabel: {
                //     rotate: 15
                // }
                inverse: true
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '正常',
                type: 'bar',
                stack: '广告',
                itemStyle: {
                    normal: {
                        color: '#1fd800',
                        lineStyle: {
                            //color: '#009d89'
                            color: '#1fd800',
                        }
                    }
                },
                data: normal,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        // color: "#333"
                        // formatter: '{c}%'
                    }
                }
            },
            {
                name: '未上报',
                type: 'bar',
                stack: '广告',
                itemStyle: {
                    normal: {
                        color: '#f94a05',
                        lineStyle: {
                            //color: '#009d89'
                            color: '#f94a05',
                        }
                    }
                },
                data: error,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        // color: "#333"
                        // formatter: '{c1}%+{c2}'
                    }
                }
            }
        ]
    });
    //图表不同屏幕自适应
    window.onresize = function () {
        //重置容器高宽
        $("#errorstationanalysis").width($(".box0").width());
        // $("#errorstationanalysis").height($(".box").width());
        $("#normaloperationrate").width($(".box").width());
        // $("#errorstationanalysis").width($(".box").width());
        // document.getElementById('errorstationanalysis').style.height = (window.innerHeight*0.1) + 'px';
        // document.getElementById('normaloperationrate').style.width = (window.innerWidth - 1005) + 'px';
        // document.getElementById('normaloperationrate').style.height = (window.innerHeight - 580) + 'px';
        myChart0.resize();
        myChart1.resize();
    };
}

//行政区域数据获取方法
function initArea() {
    $.ajax({
        type: "GET",
        url: serverConfig.apiBase + "area/getarea"
    }).done(function (data) {
        if (data.success) {
            var html = "";
            area = data.data;
            $.each(area, function (key, obj) {
                if(obj.ALevel!==4) {
                    html += "<option value='" + obj.Code + "'>" + obj.Name + "</option>";
                }
            });
            $("#adminarea").html(html);
            showtabledata();
        } else {
            layer.msg(data.message);
        }
    });
}

//导出
var aclick = function (aa) {
    $(aa).attr("download", "运维效率评估.xls");
    exportExcel(aa, 'efficiencytab', '运维效率评估', "", "", "","", 0)
}