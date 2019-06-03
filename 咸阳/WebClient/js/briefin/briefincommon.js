var user = JSON.parse($.cookie("user"));
var areaName = user.AreaName;
//生成表格
var generatingTable = function (set,data) {
    var tablehtml = '<table class="table-bordered dataTable" align="center" id='+ set.table +'>';
    var arrCell = set.cell;
    var tdnum = (arrCell+1)*2;
    var tdwidth = Math.round(100/tdnum);
    // tablehtml = tablehtml + '<tr><th colspan="'+ tdnum +'"><strong>'+ str +'</strong></th></tr>';
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

//导出
var aclick = function (aa) {
    var jst = $("#resultDate").text();
    var total = $("#resultUnit").text();
    var time = $(".maketabtime").text();
    var company = $(".maketabcom").text();
    $(aa).attr("download", "雨情简报.xls");
    exportExcel(aa, 'rainMes_table', '雨情简报', jst, total, time, company, 0)
}

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
                            /*+'<tr><th>简报信息</th></tr>'*/
                            +'<tr><td><div class="briefinmes"><strong>'+ v.Value +'</strong></div></td></tr>'
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