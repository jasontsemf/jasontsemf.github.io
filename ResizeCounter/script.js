let count = 0;
let target = 100;

function reportWindowSize() {
    // $("#height").html(window.innerHeight);
    // $("#width").html(window.innerWidth);
    count++;
    $("#count").fadeOut(function () {
        $(this).text(count).fadeIn("fast");
    });
    console.log("window resize fired");
    if (count >= target) {
        window.close();
        $("#count").fadeOut(function () {
            $(this).text("RELEASE").fadeIn("fast");
        });
        $("body").css({"background-color": "yellow"});
    }
}

$(document).ready(function () {
    intW = document.documentElement.clientWidth;
    intH = document.documentElement.clientHeight;
});

window.onresize = reportWindowSize;