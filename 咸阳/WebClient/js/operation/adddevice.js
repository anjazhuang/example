//日期格式化
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//设置安装和报废时间
function discarded_time_set(starttime_id, endtime_id, terms_id) {
    var terms = parseInt($('#' + terms_id).val()),
        starttime = new Date($('#' + starttime_id).val()),
        endtime = new Date(starttime.setFullYear(starttime.getFullYear() + terms)).format("yyyy-MM-dd");
    $('#' + endtime_id).val(endtime);
}

$(function () {
    //设置结束和开始时间
    $(".date").datetimepicker({
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        weekStart: 1,
        todayBtn: true,
        autoclose: true,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        pickerPosition: "left",
    }).on('changeDate', function () {
        //时间控件改变时间时触发事件
        discarded_time_set('installation_time', 'discarded_time', 'warranty_period');
    });

    //安装年份不可为空，不然无法提交
    $('#warranty_period').on('click', function () {
        var installation_time_value = $('#installation_time').val();
        if (installation_time_value == null || installation_time_value == undefined || installation_time_value == '') {
            layer.msg('请选择安装时间!');
        } else {
            //时间控件改变时间时触发事件
            discarded_time_set('installation_time', 'discarded_time', 'warranty_period');
        }
    });
});

