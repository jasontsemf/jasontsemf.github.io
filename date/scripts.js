$(document).ready(function() { $(".heart").hide(); })
$("#basicDate").flatpickr({
    defaultDate: new Date(1996, 3, 29),
    enableTime: false,
    dateFormat: "F, d Y",
    onChange: function(selectedDates, dateStr, instance) {
        console.log(selectedDates);
        console.log(dateStr);
        var str = "June, 27 1995";
        if (dateStr === str) {
            console.log("success");
            $(".row").hide(1000);
            $(".heart").show(1000);
        }
    }
});