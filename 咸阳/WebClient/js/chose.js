$(document).ready(function () {
    //查询条件tab切换
    $(".chooseBox ul li").on("click", function () {
        var _this = $(this);
        var _index = $(this).index();
        _this.parent("ul").siblings(".tab").find(".tab0").eq(_index).addClass("active").siblings().removeClass("active");
        _this.addClass("active").siblings().removeClass("active");
        //tab切换总是显示勾选状态
        // $.fn.zTree.getZTreeObj('treeDemoCity').checkAllNodes(true);
        // $.fn.zTree.getZTreeObj('treeDemoRiver').checkAllNodes(true);
        // $.fn.zTree.getZTreeObj('raintreeDemoCity').checkAllNodes(false);
        // $.fn.zTree.getZTreeObj('raintreeDemoRiver').checkAllNodes(false);
        // $.fn.zTree.getZTreeObj('soiltreeDemoCity').checkAllNodes(false);
        // $.fn.zTree.getZTreeObj('soiltreeDemoRiver').checkAllNodes(false);
    });
});


