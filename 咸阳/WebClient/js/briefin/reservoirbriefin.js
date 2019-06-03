var user = JSON.parse($.cookie("user"));
var areaName = user.AreaName;
var stationstring = [];

//初始化站点方法
function initCode0() {
    var obj = {
        Type: 'get',
        Uri: '/station/getmapstation',
        Parameter: {
            areaCode: user.AreaCode,
            state: 0
        }
    };
    $.ajax({
        async:false,
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        stationstring = data.data;
    })
}

//获取数据

var getData = function () {
    var allData = [];
    if (timeValidcheck($("#start-time input").val().split(" ")[0])) {
        var sttm = $("#start-time input").val();
        var edtm = $("#end-time input").val();
        $('.load-wrapp').removeClass('hidden');
        $('#resultconcent').addClass('hidden');
        // $("#printRiverBtn").attr("disabled", true);
        var obj = {
            Type: 'get',
            Uri: '/aControl/RsvrSimpleReportControl/rsvrCount',
            Parameter: {
                "waterInfo.adcd": user.AreaCode,
                "waterInfo.startTm": sttm + ':00',
                "waterInfo.endTm": sttm+ ':00'
            }
        };
        $.ajax({
            url: serverConfig.rainfallfloodApi,
            data: JSON.stringify(obj)
        }).done(function (data) {

            $.each(data.data.bz1000, function (key, obj) {
                allData.push(obj);
            });
            $.each(data.data.z100, function (key, obj) {
                allData.push(obj);
            });
            $.each(data.data.z200, function (key, obj) {
                allData.push(obj);
            });
            $.each(data.data.z300, function (key, obj) {
                allData.push(obj);
            });
            $.each(data.data.z500, function (key, obj) {
                allData.push(obj);
            });
            $.each(data.data.z1000, function (key, obj) {
                allData.push(obj);
            });

            // var briefin=[];
            // briefin = briefin.concat(default1(weihe),default1(jinhe),default1(other));
            // var levelString = [], levelCode = [], matchSta = [];
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
            //         levelCode.push(matchSta[vv].Code);
            //     }
            //     // console.log(levelCode);
            //     //筛选去除不符合所选报讯等级返回的站码序列返回的数组
            //
            //     for (var i = 0; i < allData.length; i++) {
            //         if (levelCode.indexOf(allData[i].stcd) == -1) {
            //             allData.splice(i, 1);
            //             i -= 1
            //         }
            //     }
            // }
            var filter=["羊毛湾","金盆","石头河","冯家山","王家崖","段家峡"];
            if($("#levelSelect").val().length==1){
                if($("#levelSelect").val()=="1"){
                    for (var i = 0; i < allData.length; i++) {
                        if (filter.indexOf(allData[i].stnm) == -1) {
                            allData.splice(i, 1);
                            i -= 1
                        }
                    }
                }
            }
            var rivername=[];
            var reservoirSearch = $.grep(allData, function (d) {
                return d.tm !== "" && d.tm !== null;
            });
            for(var t=0;t<reservoirSearch.length;t++){
                if((reservoirSearch[t].rvnm.replace(/\s/g,"")!=="泾河"&&reservoirSearch[t].rvnm.replace(/\s/g,"")!=="渭河")){
                    rivername.push(reservoirSearch[t].rvnm.replace(/\s/g,""));
                }
            }
            rivername.distinct();
            var weihe=$.grep(reservoirSearch,function (d) {
                return d.rvnm.replace(/\s/g,"")==="渭河"
            });
            var jinhe=$.grep(reservoirSearch,function (d) {
                return d.rvnm.replace(/\s/g,"")==="泾河"
            });
            var other=$.grep(reservoirSearch,function (d) {
                return d.rvnm.replace(/\s/g,"")!=="泾河"&&d.rvnm.replace(/\s/g,"")!=="渭河"
            });
            var otherriver=[];
            for(var hh=0;hh<rivername.length;hh++){
                var list=$.grep(default1(other),function (d) {
                    return d.rvnm.replace(/\s/g,"")===rivername[hh]
                });
                var list_l={"name":rivername[hh],"data":list};
                otherriver.push(list_l);
            }

            $('.load-wrapp').addClass('hidden');
            $('#resultconcent').removeClass('hidden');
            var resultDate = "<strong>检索时间: </strong>" + sttm ;
            var resultUnit = "水位:米 流量：立方米每秒 蓄水量：百万立方米 总记录数：" +reservoirSearch.length;
            $('#resultDate').html(resultDate);
            $('#resultUnit').html(resultUnit);
            var resultTableBottom = '<div class="bottomRemark"><div class="maketabtime">制表时间：' + GetDateTimeStr() + '</div><div class="maketabcom">制表单位：' + tablemaker + '</div></div>';
            $('#resulttablebottom').html(resultTableBottom);

            var tableHtml = '<table class="table-bordered dataTable" align="center" id="Mes_table" style="width: 99%;">';
            tableHtml += "<tr style='line-height: 35px;'>" +
                // '<td><strong>水系</strong></td>' +
                '<td><strong>河流名称</strong></td>' +
                '<td><strong>站号</strong></td>' +
                '<td><strong>水库名称</strong></td>' +
                '<td><strong>站址</strong></td>' +
                // '<td><strong>时间</strong></td>' +
                '<td><strong>库水位</strong></td>' +
                '<td><strong>蓄水量</strong></td>' +
                '<td><strong>入库</strong></td>' +
                '<td><strong>出库</strong></td>' +
                '<td><strong>水势</strong></td>' +
                '<td><strong>汛限水位</strong></td>' +
                '<td><strong>设计水位</strong></td>' +
                '<td><strong>校核水位</strong></td>' +
                '</tr>';

            if (reservoirSearch.length == 0) {
                tableHtml += '<tr><td colspan="14">无数据</td></tr>';
            } else {
                $.each(default1(weihe), function (key, obj) {
                    if(key==0){
                        tableHtml += '<tr>' +
                            '<td rowspan="'+weihe.length+'">' + showDataNull(obj.rvnm, "") + '</td>' +
                            '<td>' + showDataNull(obj.stcd, "") + '</td>' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            '<td style="text-align: center">' + showDataNull(obj.name, "") + '</td>' +
                            // '<td>' + showDataNull(obj.tm, "") + '</td>' +
                            '<td>' + showDataNull(obj.rz, "") + '</td>' +
                            '<td>' + showDataNull(obj.w, "") + '</td>' +
                            '<td>' + formatFlow(obj.inq) + '</td>' +
                            '<td>' + formatFlow(obj.otq) + '</td>' +
                            '<td>' + showFlow(obj.rwptn) + '</td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '</tr>';
                    } else {
                        tableHtml += '<tr>' +
                            '<td>' + showDataNull(obj.stcd, "") + '</td>' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            '<td style="text-align: left">' + showDataNull(obj.name, "") + '</td>' +
                            // '<td>' + showDataNull(obj.tm, "") + '</td>' +
                            '<td>' + showDataNull(obj.rz, "") + '</td>' +
                            '<td>' + showDataNull(obj.w, "") + '</td>' +
                            '<td>' + formatFlow(obj.inq) + '</td>' +
                            '<td>' + formatFlow(obj.otq) + '</td>' +
                            '<td>' + showFlow(obj.rwptn) + '</td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '</tr>';
                    }
                });
                $.each(default1(jinhe), function (key, obj) {
                    if(key===0){
                        tableHtml += '<tr>' +
                            '<td rowspan="'+jinhe.length+'">' + showDataNull(obj.rvnm, "") + '</td>' +
                            '<td>' + showDataNull(obj.stcd, "") + '</td>' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            '<td style="text-align: left">' + showDataNull(obj.name, "") + '</td>' +
                            // '<td>' + showDataNull(obj.tm, "") + '</td>' +
                            '<td>' + showDataNull(obj.rz, "") + '</td>' +
                            '<td>' + showDataNull(obj.w, "") + '</td>' +
                            '<td>' + formatFlow(obj.inq) + '</td>' +
                            '<td>' + formatFlow(obj.otq) + '</td>' +
                            '<td>' + showFlow(obj.rwptn) + '</td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '</tr>';
                    }else {
                        tableHtml += '<tr>' +
                            '<td>' + showDataNull(obj.stcd, "") + '</td>' +
                            '<td>' + showDataNull(obj.stnm, "") + '</td>' +
                            '<td style="text-align: left">' + showDataNull(obj.name, "") + '</td>' +
                            // '<td>' + showDataNull(obj.tm, "") + '</td>' +
                            '<td>' + showDataNull(obj.rz, "") + '</td>' +
                            '<td>' + showDataNull(obj.w, "") + '</td>' +
                            '<td>' + formatFlow(obj.inq) + '</td>' +
                            '<td>' + formatFlow(obj.otq) + '</td>' +
                            '<td>' + showFlow(obj.rwptn) + '</td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '<td>  </td>' +
                            '</tr>';
                    }

                });
                $.each(otherriver, function (key, obj) {
                    $.each(obj.data,function (i,v) {
                        if(i==0){
                            tableHtml += '<tr>' +
                                '<td  rowspan="'+obj.data.length+'">' + showDataNull(v.rvnm, "") + '</td>' +
                                '<td>' + showDataNull(v.stcd, "") + '</td>' +
                                '<td>' + showDataNull(v.stnm, "") + '</td>' +
                                '<td style="text-align: left">' + showDataNull(v.name, "") + '</td>' +
                                // '<td>' + showDataNull(obj.tm, "") + '</td>' +
                                '<td>' + showDataNull(v.rz, "") + '</td>' +
                                '<td>' + showDataNull(v.w, "") + '</td>' +
                                '<td>' + formatFlow(v.inq) + '</td>' +
                                '<td>' + formatFlow(v.otq) + '</td>' +
                                '<td>' + showFlow(v.rwptn) + '</td>' +
                                '<td>  </td>' +
                                '<td>  </td>' +
                                '<td>  </td>' +
                                '</tr>';
                        } else {
                            tableHtml += '<tr>' +
                                '<td>' + showDataNull(v.stcd, "") + '</td>' +
                                '<td>' + showDataNull(v.stnm, "") + '</td>' +
                                '<td style="text-align: left">' + showDataNull(v.name, "") + '</td>' +
                                // '<td>' + showDataNull(obj.tm, "") + '</td>' +
                                '<td>' + showDataNull(v.rz, "") + '</td>' +
                                '<td>' + showDataNull(v.w, "") + '</td>' +
                                '<td>' + formatFlow(v.inq) + '</td>' +
                                '<td>' + formatFlow(v.otq) + '</td>' +
                                '<td>' + showFlow(v.rwptn) + '</td>' +
                                '<td>  </td>' +
                                '<td>  </td>' +
                                '<td>  </td>' +
                                '</tr>';
                        }
                    })
                });
            }
            tableHtml += '</table>';
            $('#resultTableDiv').html(tableHtml);
        });
    } else {
        layer.msg("输入时间格式有误")
    }

};
$('#load-rainwrapp').addClass('hidden');

//导出
var aclick = function (aa) {
    if ($('#Mes_table tr:last').find('td').text() !== "无数据") {
        var jst = $("#resultDate").text();
        var total = $("#resultUnit").text();
        var time = $(".maketabtime").text();
        var company = $(".maketabcom").text();
        $(aa).attr("download", "水库水情简报.xls");
        exportExcel(aa, 'Mes_table', '水库水情简报', jst, total, time, company, 0)
    } else {
        alert("无数据无法导出");
        $(aa).removeAttr("download");
    }
}

$(function () {
    init();
    $(".briefin-date").datetimepicker({
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
    initCode0();
    //时间控件更新
    var timeupdatevalue = new Date();
    // var timeupdatevalue2 = new Date();
    timeupdatevalue.setHours(8, 0);
    if (timeupdatevalue.getHours() < 8) {
        timeupdatevalue.setDate(timeupdatevalue.getDate() - 1, 0);
        timeupdatevalue.setHours(8, 0);
    } else {
        timeupdatevalue.setHours(8, 0);
    }
    //默认显示当前最新时间
    $("#start-time").datetimepicker("update", timeupdatevalue);
    //加载河道水情数据
    getData();
    //生成简报（河道水情数据)
    $("#runBtn").on("click", function () {
        getData();
    });
    $("#levelSelect").select2().val(['1', '2']).trigger('change');

});
