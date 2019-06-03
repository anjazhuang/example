var printData = localStorage.getItem("print");
$("#printarea").html(printData);
html2canvas($("#printarea"), {
    onrendered: function (canvas) {
        var win = window.open();
        win.document.write("<div style='width:650px; margin:0 auto;'><img style='width:650px;' src='" + canvas.toDataURL() + "'/></div>");
        win.document.close();
        setTimeout(function () {
            win.print();
            win.close();
            localStorage.removeItem("print");
            window.close();
        }, 100);
    }
});