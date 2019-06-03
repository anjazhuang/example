var user = JSON.parse($.cookie("user"));

//生成表格
var generatingTable = function (set,data,str) {
    var tablehtml = '<table class="table-bordered dataTable" align="center" id='+ set.table +'>';
    var arrCell = set.cell;
    var tdnum = (arrCell+1)*2;
    var tdwidth = Math.round(100/tdnum);
    tablehtml = tablehtml + '<tr><th colspan="'+ tdnum +'"><strong>'+ str +'</strong></th></tr>';
    $.each(set.addvnm, function (key, value) {
        var arr =  $.grep(data, function (data) { return data[set.name] == value; });
        var arrTDNum = Math.ceil(arr.length/arrCell);
        var arrConcrete,arrStation;

        for (var trnum=0;trnum<arrTDNum;trnum++) {
            arrConcrete = arr[trnum];
            tablehtml = tablehtml + '<tr>';
            if (trnum == 0) {
                tablehtml = tablehtml + ' <td width="'+ tdwidth*2 +'%" rowspan='+ arrTDNum +'><strong>'+ arrConcrete[set.name]  +'</strong></td>';
            }
            for (var tdnum=trnum*arrCell;tdnum<trnum*arrCell+arrCell;tdnum++) {
                var countValue;
                arrStation = arr[tdnum];
                arrStation[set.value]  === null ? countValue='' : countValue = arrStation[set.value];
                tablehtml = tablehtml +   ' <td width="'+ tdwidth +'%">'+  arrStation[set.stnm]   +'</td>' + ' <td width="'+ tdwidth +'%">'+ countValue  +'</td>';
                if (tdnum == (arr.length -1)) {
                    if (((tdnum+1)%arrCell) > 0) {
                        var tdcolspan = (arrCell - ((tdnum+1)%arrCell))*2;
                        tablehtml = tablehtml +   '<td colspan="'+ tdcolspan  +'" width="'+tdcolspan*tdwidth+'%"></td>';
                    }
                    break;
                }
            }
            tablehtml = tablehtml + '</tr>'
        }
    });
    tablehtml = tablehtml + '</table>';
    return tablehtml;
};

//获取简报模板数据
var getMoudle = function(type,obj,id) {
    var res;
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
                    case type:
                        res =  '<table class="table-bordered dataTable mouldTable" align="center">'
                                +'<tr><th>简报信息</th></tr>'
                                +'<tr><td><div class="briefinmes">'+ v.Value +'</div></td></tr>'
                                +'</table>';
                        res = res.replace(/\n|\r\n/g,"<br/>");
                        res = res.replace("{count}", obj.count);
                        res = res.replace("{max}", obj.max);
                        res = res.replace("{min}", obj.min);
                        res = res.replace("{avg}", obj.avg);

                        $('#'+id).html(res);
                        break;
                }
            });
        }
    });
};


//获取雨情数据
var getRainData = function() {
    var sttm = $("#start-time input").val();
    var edtm = $("#end-time input").val();
    $('#load-rainwrapp').removeClass('hidden');
    $('#resultconcent').addClass('hidden');
    $("#printRainBtn").attr("disabled", true);
    $("#printRainJbBtn").attr("disabled", true);
    var obj = {
        Type: 'get',
        Uri: '/aControl/RainReportControl/getRainCountReport',
        Parameter: {
            "rainCount.adcd": user.AreaCode,
            "rainCount.startTm": sttm +':00',
            "rainCount.endTm": edtm +':59'
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            var allArray = [],
                rainAvg = (parseFloat(data.data.avg)).toFixed(1),
                nullData = data.data.nullData.length,
                totalbcm100 = data.data.bcm100.length,
                totalcm100 = data.data.cm100.length,
                totalcm50 = data.data.cm50.length,
                totalcm10 = data.data.cm10.length;
            $.each(data.data.bcm100, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.cm10, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.cm50, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.cm100, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.nullData, function (key, obj) {
                allArray.push(obj);
            });
            var rainSortArray = allArray.sort(compare("addvnm"));

            var arrAddvnm=[];
            $.each(rainSortArray, function (key, obj) {
                if(arrAddvnm.indexOf(obj.addvnm) == -1){
                    arrAddvnm.push(obj.addvnm);
                }
            });

            var config ={
                "table": "rainMes_table",
                "addvnm": arrAddvnm,
                "cell": 5,
                "name": "addvnm",
                "value" : "drp",
                "stnm" : "stnm"
            };
            var tablehtml = generatingTable(config,rainSortArray,"累计降雨量（mm）");
            $('#resultTableDiv').html( tablehtml );
            $('#resultTitle').html( areaName + '雨情简报  （' + sttm +' 至 ' + edtm +' ）');
            $('#load-rainwrapp').addClass('hidden');
            $('#resultconcent').removeClass('hidden');
            $("#printRainBtn").attr("disabled", false);
            $("#printRainJbBtn").attr("disabled", false);
            var modleData = {
                "count": data.data.sum,
                "max": data.data.max,
                "min": data.data.min,
                "avg": rainAvg
            };
            getMoudle("BRIEFING_RAIN",modleData,"rainMoudle");
            $('#rainTotal').html(data.data.sum);
            $('#rainMax').html(data.data.max);
            $('#rainMin').html(data.data.min);
            $('#rainAvg').html(rainAvg);
            $('#rainb100').html(totalbcm100+'/个');
            $('#rainc100').html(totalcm100+'/个');
            $('#rainc50').html(totalcm50+'/个');
            $('#rainc10').html(totalcm10+'/个');
            $('#nulldata').html(nullData+'/个');
        } else {
            layer.msg(data.message);
        }
    });
};

//获取河道水情数据
var getRiverData = function() {
    var riverSttm = $("#river-start-time input").val();
    var riverEdtm = $("#river-end-time input").val();
    $('#load-riverwrapp').removeClass('hidden');
    $('#riverconcent').addClass('hidden');
    $("#printRiverBtn").attr("disabled", true);
    var obj = {
        Type: 'get',
        Uri: '/aControl/RiverSimpleReportControl/riverCount',
        //Uri: '/aControl/RiverSimpleReportControl/riverCount',
        Parameter: {
            "waterInfo.adcd": user.AreaCode,
            "waterInfo.startTm": riverSttm +':00',
            "waterInfo.endTm": riverEdtm +':59'
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj)
        }).done(function (data) {
            //console.log(data);
            var allArray = [],
                maxz = data.data.maxz,
                minz = data.data.minz,
                z100 = data.data.z100.length,
                z200 = data.data.z200.length,
                z300 = data.data.z300.length,
                z500 = data.data.z500.length,
                z1000 = data.data.z1000.length,
                bz1000 = data.data.bz1000.length,
                unreported = data.data.unreported.length;
            $.each(data.data.z100, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.z200, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.z300, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.z500, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.z1000, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.unreported, function (key, obj) {
                allArray.push(obj);
            });
            var riverSortArray = allArray.sort(compare("name"));
            var arrAddvnm=[];
            $.each(riverSortArray, function (key, obj) {
                if(arrAddvnm.indexOf(obj.name) == -1){
                    arrAddvnm.push(obj.name);
                }
            });
            var config ={
                "table": "riverMes_table",
                "addvnm": arrAddvnm,
                "cell": 5,
                "name": "name",
                "value" : "z",
                "stnm" : "stnm"
            };
            var tablehtml = generatingTable(config,riverSortArray,"水位(m)");

            var modleData = {
                "max": data.data.maxz,
                "min": data.data.minz
            };
            getMoudle("BRIEFING_RIVER",modleData,"riverMoudle");

            $('#riverTableDiv').html( tablehtml );
            $('#river_maxz').html( maxz );
            $('#river_minz').html( minz );
            $('#river_bz1000').html( bz1000 );
            $('#river_z1000').html( z1000 );
            $('#river_z500').html( z500 );
            $('#river_z300').html( z300 );
            $('#river_z200').html( z200 );
            $('#river_z100').html( z100 );
            $('#river_unreported').html( unreported );
            $('#riverTitle').html( areaName + '河道水情简报  （' + riverSttm +' 至 ' + riverEdtm +' ）');
            $('#load-riverwrapp').addClass('hidden');
            $('#riverconcent').removeClass('hidden');
            $("#printRiverBtn").attr("disabled", false);
    });

};

//获取水库水情数据
var getReservoirData = function() {
    var reservoirSttm = $("#reservoir-start-time input").val();
    var reservoirEdtm = $("#reservoir-end-time input").val();
    $('#load-reservoirwrapp').removeClass('hidden');
    $('#reservoirconcent').addClass('hidden');
    $("#printReservoirBtn").attr("disabled", true);
    $("#printReservoirJbBtn").attr("disabled", true);
    var obj = {
        Type: 'get',
        Uri: '/aControl/RsvrSimpleReportControl/rsvrCount',
        Parameter: {
            "waterInfo.adcd": user.AreaCode,
            "waterInfo.startTm": reservoirSttm +':00',
            "waterInfo.endTm": reservoirSttm +':59'
        }
    };
    $.ajax({
        url: serverConfig.rainfallfloodApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        var allArray = [],
            maxz = data.data.maxz,
            minz = data.data.minz,
            z100 = data.data.z100.length,
            z200 = data.data.z200.length,
            z300 = data.data.z300.length,
            z500 = data.data.z500.length,
            z1000 = data.data.z1000.length,
            bz1000 = data.data.bz1000.length,
            unreported = data.data.unreported.length;
        $.each(data.data.z100, function (key, obj) {
            allArray.push(obj);
        });
        $.each(data.data.z200, function (key, obj) {
            allArray.push(obj);
        });
        $.each(data.data.z300, function (key, obj) {
            allArray.push(obj);
        });
        $.each(data.data.z500, function (key, obj) {
            allArray.push(obj);
        });
        $.each(data.data.z1000, function (key, obj) {
            allArray.push(obj);
        });
        $.each(data.data.unreported, function (key, obj) {
            allArray.push(obj);
        });

        var reservoirArray = allArray.sort(compare("name"));
        var arrAddvnm=[];
        $.each(reservoirArray, function (key, obj) {
            if(arrAddvnm.indexOf(obj.name) == -1){
                arrAddvnm.push(obj.name);
            }
        });
        var config ={
            "table": "reservoir_table",
            "addvnm": arrAddvnm,
            "cell": 5,
            "name": "name",
            "value" : "rz",
            "stnm" : "stnm"
        };
        var tablehtml = generatingTable(config,reservoirArray,"库上水位(m)");

        var modleData = {
            "max": data.data.maxz,
            "min": data.data.minz
        };
        getMoudle("BRIEFING_RESERVOIR",modleData,"reservoirMoudle");

        $('#riverTableDiv').html( tablehtml );
        $('#reservoir_maxz').html( maxz );
        $('#reservoir_minz').html( minz );
        $('#reservoir_bz1000').html( bz1000 );
        $('#reservoir_z1000').html( z1000 );
        $('#reservoir_z500').html( z500 );
        $('#reservoir_z300').html( z300 );
        $('#reservoir_z200').html( z200 );
        $('#reservoir_z100').html( z100 );
        $('#reservoir_unreported').html( unreported );


        $('#reservoirTableDiv').html( tablehtml );
        $('#reservoirTitle').html( areaName + '水库水情简报  （' + reservoirSttm +' 至 ' + reservoirEdtm +' ）');
        $('#load-reservoirwrapp').addClass('hidden');
        $('#reservoirconcent').removeClass('hidden');
        $("#printReservoirBtn").attr("disabled", false);
        $("#printReservoirJbBtn").attr("disabled", false);
    });
};

//获取墒情数据
var getSoilData = function() {
    var soilSttm = $("#soil-start-time input").val();
    var soilEdtm = $("#soil-end-time input").val();
    $('#load-soilwrapp').removeClass('hidden');
    $('#soilconcent').addClass('hidden');
    $("#printSoilBtn").attr("disabled", true);
    $("#printSoilJbBtn").attr("disabled", true);
    var obj = {
        Type: 'post',
        Uri: '/data/getsoilreport',
        Parameter: {
            "AreaCode": user.AreaCode,
            "StartTime": soilSttm +' :00',
            "EndTime": soilEdtm +' :59'
        }
    };
    $.ajax({
        url: serverConfig.soilApi,
        data: JSON.stringify(obj)
    }).done(function (data) {
        if (data.success) {
            var allArray = [],
                dataMax,
                dataMin,
                dataAvg,
                nullData = data.data.NullData.length,
                level1Data = data.data.Level1Data.length,
                level2Data = data.data.Level2Data.length,
                level3Data = data.data.Level3Data.length,
                level4Data = data.data.Level4Data.length,
                level5Data = data.data.Level5Data.length;
            data.data.Max === null ? dataMax = 0 : dataMax = data.data.Max;
            data.data.Min === null ? dataMin = 0 : dataMin = data.data.Min;
            data.data.Avg === null ? dataAvg = 0 : dataAvg = data.data.Avg;
            $.each(data.data.Level1Data, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.Level2Data, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.Level3Data, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.Level4Data, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.Level5Data, function (key, obj) {
                allArray.push(obj);
            });
            $.each(data.data.NullData, function (key, obj) {
                allArray.push(obj);
            });

            var soilSortArray = allArray.sort(compare("AreaName"));

            var arrAreaName=[];
            $.each(soilSortArray, function (key, obj) {
                if(arrAreaName.indexOf(obj.AreaName) == -1){
                    arrAreaName.push(obj.AreaName);
                }
            });


            var config ={
                "table": "soilMes_table",
                "addvnm": arrAreaName,
                "cell": 5,
                "name": "AreaName",
                "value" : "RA",
                "stnm" : "Name"
            };
            var tablehtml = generatingTable(config,soilSortArray,"相对湿度均值（%）");

            $('#soilTableDiv').html( tablehtml );

            $('#soilTitle').html( areaName + '墒情简报  （' + soilSttm +' 至 ' + soilEdtm +' ）');
            $('#load-soilwrapp').addClass('hidden');
            $('#soilconcent').removeClass('hidden');
            $("#printSoilBtn").attr("disabled", false);
            $("#printSoilJbBtn").attr("disabled", false);
            var modleData = {
                "max": dataMax,
                "min": dataMin,
                "avg": dataAvg
            };
            getMoudle("BRIEFING_SOIL",modleData,"soilMoudle");

            $('#soilMax').html(dataMax);
            $('#soilMin').html(dataMin);
            $('#soilAvg').html(dataAvg);
            $('#soilLevel1').html(level1Data + '/个');
            $('#soilLevel2').html(level2Data + '/个');
            $('#soilLevel3').html(level3Data + '/个');
            $('#soilLevel4').html(level4Data + '/个');
            $('#soilLevel5').html(level5Data + '/个');
            $('#soilLevel6').html(nullData + '/个');

/*            var soilMes_table = $('#soilMes_table').DataTable({
                language: reportLanguage1,
                lengthChange: false,
                "bDestroy": true,
                "aaData": allArray,
                "bAutoWidth": false,
                "bSort": false,
                "bInfo":false, //页脚信息
                "bPaginate": false, //翻页功能
                "searching": false,//是否显示搜索框
                "aaSorting": [[0, "asc"]],
                "columns": [
                    { "data": "AreaName" },
                    { "data": "Name" },
                    { "data": "Code" },
                    { "data": "M10" },
                    { "data": "M20" },
                    { "data": "M40" },
                    { "data": "MA" },
                    { "data": "RiverAreaName" },
                    { "data": "RiverName" },
                    { "data": "RiverAreaName" }
                ]
            });
            if(level1Data > 0) {
                $("#soilothertablediv ul li").eq(0).removeClass('hidden');
                var soillevel1_table = $('#soillevel1_table').DataTable({
                    language: reportLanguage1,
                    lengthChange: false,
                    "bDestroy": true,
                    "aaData": data.data.Level1Data,
                    "bAutoWidth": false,
                    "bSort": false,
                    "bInfo": false, //页脚信息
                    "bPaginate": false, //翻页功能
                    "searching": false,//是否显示搜索框
                    "aaSorting": [[0, "asc"]],
                    "columns": [
                        {"data": "Name"},
                        {"data": "M10"},
                        {"data": "M20"},
                        {"data": "M40"},
                        {"data": "MA"}
                    ]
                });
            } else {
                $("#soilothertablediv ul li").eq(0).addClass('hidden');
            }
            if(level2Data > 0) {
                $("#soilothertablediv ul li").eq(1).removeClass('hidden');
                var soillevel2_table = $('#soillevel2_table').DataTable({
                    language: reportLanguage1,
                    lengthChange: false,
                    "bDestroy": true,
                    "aaData": data.data.Level3Data,
                    "bAutoWidth": false,
                    "bSort": false,
                    "bInfo": false, //页脚信息
                    "bPaginate": false, //翻页功能
                    "searching": false,//是否显示搜索框
                    "aaSorting": [[0, "asc"]],
                    "columns": [
                        {"data": "Name"},
                        {"data": "M10"},
                        {"data": "M20"},
                        {"data": "M40"},
                        {"data": "MA"}
                    ]
                });
            } else {
                $("#soilothertablediv ul li").eq(1).addClass('hidden');
            }
            if(level3Data > 0) {
                $("#soilothertablediv ul li").eq(2).removeClass('hidden');
                var soillevel3_table = $('#soillevel3_table').DataTable({
                    language: reportLanguage1,
                    lengthChange: false,
                    "bDestroy": true,
                    "aaData": data.data.Level3Data,
                    "bAutoWidth": false,
                    "bSort": false,
                    "bInfo": false, //页脚信息
                    "bPaginate": false, //翻页功能
                    "searching": false,//是否显示搜索框
                    "aaSorting": [[0, "asc"]],
                    "columns": [
                        {"data": "Name"},
                        {"data": "M10"},
                        {"data": "M20"},
                        {"data": "M40"},
                        {"data": "MA"}
                    ]
                });
            } else {
                $("#soilothertablediv ul li").eq(2).addClass('hidden');
            }
            if(level4Data > 0) {
                $("#soilothertablediv ul li").eq(3).removeClass('hidden');
                var soillevel4_table = $('#soillevel4_table').DataTable({
                    language: reportLanguage1,
                    lengthChange: false,
                    "bDestroy": true,
                    "aaData": data.data.Level4Data,
                    "bAutoWidth": false,
                    "bSort": false,
                    "bInfo": false, //页脚信息
                    "bPaginate": false, //翻页功能
                    "searching": false,//是否显示搜索框
                    "aaSorting": [[0, "asc"]],
                    "columns": [
                        {"data": "Name"},
                        {"data": "M10"},
                        {"data": "M20"},
                        {"data": "M40"},
                        {"data": "MA"}
                    ]
                });
            } else {
                $("#soilothertablediv ul li").eq(3).addClass('hidden');
            }
            if(level5Data > 0) {
                $("#soilothertablediv ul li").eq(4).removeClass('hidden');
                var soillevel5_table = $('#soillevel5_table').DataTable({
                    language: reportLanguage1,
                    lengthChange: false,
                    "bDestroy": true,
                    "aaData": data.data.Level5Data,
                    "bAutoWidth": false,
                    "bSort": false,
                    "bInfo": false, //页脚信息
                    "bPaginate": false, //翻页功能
                    "searching": false,//是否显示搜索框
                    "aaSorting": [[0, "asc"]],
                    "columns": [
                        {"data": "Name"},
                        {"data": "M10"},
                        {"data": "M20"},
                        {"data": "M40"},
                        {"data": "MA"}
                    ]
                });
            } else {
                $("#soilothertablediv ul li").eq(4).addClass('hidden');
            }*/


        }  else {
            layer.msg(data.message);
        }
    });
};
var areaName = user.AreaName;
$('#load-rainwrapp').addClass('hidden');
$('#load-riverwrapp').addClass('hidden');
$('#load-reservoirwrapp').addClass('hidden');
$('#load-soilwrapp').addClass('hidden');

//打印表格
var printTable = function(title,mesid,mouldid,url) {
    var mestable = "<div class='title'>"+$("#"+title).html()+ "</div>" + $("#"+mesid).html(),
        mouldid = "#"+mouldid + " "+".briefinmes" ;
        briefinmes = "<div class='title'>"+$("#"+title).html()+ "</div>"  + $(mouldid).html();
    localStorage.setItem("print",mestable);
    localStorage.setItem("printbriefin",briefinmes);
    var win = window.open(url);
    //var win = window.open('printbriefin.html');
};

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

    var timeupdatevalue = new Date();
    //timeupdatevalue.setDate(timeupdatevalue.getDate() - 7);
    timeupdatevalue.setHours(0,0);
    //默认显示当前最新时间
    $("#start-time,#river-start-time,#reservoir-start-time,#soil-start-time").datetimepicker("update",  timeupdatevalue);
    $("#end-time,#river-end-time,#reservoir-end-time,#soil-end-time").datetimepicker("update",  new Date());


    //加载雨情数据
    getRainData();

    //加载河道水情数据
    getRiverData();

    //加载水库水情简报
    getReservoirData();

    //加载墒情数据
    getSoilData();

    //生成简报（雨情)
    $("#runRainBtn").on("click", function () {
        getRainData();
    });
    //打印(雨情)
    $("#printRainBtn").on("click", function () {
        var title ="resultTitle",
            mesid="resultTableDiv",
            mouldid ="rainMoudle",
            url ="printtable.html";
        printTable(title,mesid,mouldid,url);
    });
    $("#printRainJbBtn").on("click", function () {
        var title ="resultTitle",
            mesid="resultTableDiv",
            mouldid ="rainMoudle",
            url ="printbriefin.html";
        printTable(title,mesid,mouldid,url);
    });

    //生成简报（河道水情)
    $("#runRiverBtn").on("click", function () {
        getRiverData();
    });
    //打印(河道水情)
    $("#printRiverBtn").on("click", function () {
        var title ="riverTitle",
            mesid="riverTableDiv",
            mouldid ="riverMoudle",
            url ="printtable.html";
        printTable(title,mesid,mouldid,url);
    });
    $("#printRiverJbBtn").on("click", function () {
        var title ="riverTitle",
            mesid="riverTableDiv",
            mouldid ="riverMoudle",
            url ="printbriefin.html";
        printTable(title,mesid,mouldid,url);
    });


    //生成简报 （水库水情简报）
    $("#runReservoirBtn").on("click", function () {
        getReservoirData();
    });
    //打印(水库水情)
    $("#printReservoirBtn").on("click", function () {
        var title ="reservoirTitle",
            mesid="reservoirTableDiv",
            mouldid ="reservoirMoudle",
            url ="printtable.html";
        printTable(title,mesid,mouldid,url);
    });
    $("#printReservoirJbBtn").on("click", function () {
        var title ="reservoirTitle",
            mesid="reservoirTableDiv",
            mouldid ="reservoirMoudle",
            url ="printbriefin.html";
        printTable(title,mesid,mouldid,url);
    });

    //生成简报（墒情)
    $("#runSoilBtn").on("click", function () {
        getSoilData();
    });
    //打印（墒情）
    $("#printSoilBtn").on("click", function () {
        var title ="soilTitle",
            mesid="soilTableDiv",
            mouldid ="soilMoudle",
            url ="printtable.html";
        printTable(title,mesid,mouldid,url);
    });
    $("#printSoilJbBtn").on("click", function () {
        var title ="soilTitle",
            mesid="soilTableDiv",
            mouldid ="soilMoudle",
            url ="printbriefin.html";
        printTable(title,mesid,mouldid,url);
    });
});
