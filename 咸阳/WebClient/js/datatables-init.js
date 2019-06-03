function paramConvert(data) {
    var newData;
    if (data && data.length > 0) {
        newData = {};
        var columns;
        for (var i = 0; i < data.length; i++) {
            var key = data[i]["name"];
            if (key == "columns") {
                columns = data[i]["value"];
            }
        }
        for (var i = 0; i < data.length; i++) {
            var key = data[i]["name"];
            var val = data[i]["value"];
            if (typeof val == "string" || typeof val == "number") {
                newData[key] = val;
            } else {
                if (key == "order") {
                    var order = [];
                    var orderdir = [];
                    for (var j = 0; j < val.length; j++) {
                        var index = val[j]["column"];
                        order.push(columns[index]["data"]);
                        orderdir.push(val[j]["dir"]);
                    }
                    newData["order"] = order.join();
                    newData["orderdir"] = orderdir.join();
                }
            }
        }
    } else {
        newData = data;
    }
    var newData2 = {};
    for (var key in newData) {
        var val = newData[key];
        if (val && val.length > 0 && val.indexOf('请选择') === -1 && val.indexOf('全部') === -1) {
            newData2[key] = val;
        }
    }
    return newData2;
}

//获得数据
function getdata(url, param, callback) {
    var res;

    $.ajax({
        type: "get",
        async: true,
        url: url,    //请求发送到TestServlet处
        async: false,
        data: param,
        dataType: "json",        //返回数据形式为json
        success: function (result) {
            if (result) {
                res = result;
                callback(res);
            }
        },
        error: function (errorMsg) {
            layer.msg('数据请求失败!');
        }
    })
    return res;
}

//Datatbles初始化

function datatableinit(data, tablename, datatablesoption, dataTable) {
    /* if (datatablesoption.bPaginate == null || datatablesoption.bPaginate  == undefined || datatablesoption.bPaginate  == '') {
         datatablesoption.bPaginate = false;
     }

     if (datatablesoption.iDisplayLength == null || datatablesoption.iDisplayLength  == undefined || datatablesoption.iDisplayLength  == '') {
         datatablesoption.iDisplayLength = 10;
     }
 */
    $.dataTablesSettings = {
        data: data,
        language: datatablesoption.language?datatablesoption.language:datatablesLanguage,
        // lengthMenu: '每页显示信息数量： _MENU_ ',//左上角的分页大小显示。
        "bAutoWidth": false, //禁止自动列宽的计算
        "bDeferRender": true, //延迟渲染
        "paging": false,
        "bInfo":datatablesoption.bInfo, //页脚信息
        "bPaginate": datatablesoption.bPaginate, //翻页功能
        /*"sAjaxSource": serverConfig.apiBase +'base/niandujixiao/search3',*/
        /*"bServerSide": true,*/ //是否启动服务器端数据导入
        "bSort": false,//排序功能
        "bDestroy": datatablesoption.bDestroy, //如果已经存在，则销毁（配置和数据），成为一个全新的Datatables实例
        "bLengthChange": false, //是否开启一页显示多少条数据的下拉菜单
        "iDisplayLength": datatablesoption.iDisplayLength?datatablesoption.iDisplayLength:10,
        searching: datatablesoption.searching,//是否显示搜索框
        "aaSorting": datatablesoption.aaSorting, //列默认的排序方式
        "columnDefs": datatablesoption.columnDefs, //自定义相关列显示内容
        "columns": datatablesoption.columns, //绑定列
    }
    /*if (typeof(dataTable) != "undefined") {
        dataTable.fnClearTable();//清空一下table
        dataTable.fnDestroy();  //还原初始化了的datatable
    }*/
    dataTable = $(tablename).DataTable($.dataTablesSettings);
    //dataTable.fnPageChange(0);
    return dataTable;
}

var datatablesLanguage = {
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

