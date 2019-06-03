var printData = localStorage.getItem("printbriefin");
$("#printarea").html(printData);
html2canvas($("#printarea"), {
    onrendered: function (canvas) {
        var win = window.open();
        win.document.write("<div style='width:650px; margin:0 auto;'><img style='width:650px;' src='" + canvas.toDataURL() + "'/></div>");
        win.document.close();
        setTimeout(function () {
            win.print();
            win.close();
            localStorage.removeItem("printbriefin");
            window.close();
        }, 100);
    }
});
