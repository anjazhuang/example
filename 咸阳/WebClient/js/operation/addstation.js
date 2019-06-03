$(function () {
    //时间控件初始化
    $("#addstation .date").datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm',
        weekStart: 1,
        autoclose: true,
        todayBtn: true,
        todayHighlight: 1,
        startView: 3, //这里就设置了默认视图为年视图
        minView: 3, //设置最小视图为年视图
        forceParse: 0,
        pickerPosition: "bottom-right"
    });
    // $("#addpic").on("change", function () {
    //     var num = $('.img-add .smallpic').length;
    //     var files = $(this).get(0).files;
    //     var windowURL = window.URL || window.webkitURL;
    //     for (var i = 0; i < files.length; i++) {
    //         var url = windowURL.createObjectURL(files[i]); //客户端图形缩略图预览路径
    //         var dname = /\.([^\.]+)$/.exec(files[i].name); //文件后缀名
    //         var pattern = /\.(jpg|gif|jpeg|png)+$/ig; //图片验证正则模式
    //         $('.img-add').append('<span class="smallpic" ><img src="' + url + '"><i class="glyphicon glyphicon-remove-circle delete" ></i></span>');
    //         if (num > 2) {
    //             $(".addbtnbox").hide();
    //             return false;
    //         }
    //
    //         imgdata.append('file' + i, fileArray[i]);
    //     }
    // });

    // $("body").on("click", ".delete", function () {
    //     $(this).parent("span").remove();
    //     var imgid = $(this).data("id");
    //     // alert(imgid);
    //     $("#addpic").val("");
    //     imgdel.push(imgid);
    //     console.log(imgdel);
    //     // if (imgid !== undefined) {
    //     //     $.ajax({
    //     //         async: false,
    //     //         url: "http://172.16.5.92:7080/xianyang/api/station/deleteImage?id=" + imgid,
    //     //         cache: false,
    //     //         contentType: false,
    //     //         dataType: "json",
    //     //         processData: false,
    //     //         type: 'GET',
    //     //         success: function (data) {
    //     //             console.log(data.data);
    //     //         }
    //     //     });
    //     // }
    //     if (!$(".addbtnbox").show()) {
    //         $(".addbtnbox").show();
    //     }
    // });
    //点击查看大图方法
    $("body").on("click", ".smallpic img", function () {
        var img_src = $(this).attr("src");
        layer.open({
            type: 1,
            area: ['650px', '650px'], //宽高
            title: '查看图片',
            shade: 0.2,
            shadeClose: false,
            scrollbar: false,
            maxmin: true,
            content: '<img src="' + img_src + '">' //这里content是一个普通的String
        });
    })

});


