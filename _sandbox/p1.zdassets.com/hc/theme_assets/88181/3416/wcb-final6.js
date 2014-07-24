
var count = 120;
var flag = 0;
var counter = 0;
validate_phone = function() {
    debugger;
    var phone = $('input[id="pnumber"]').val(),
        intRegex = /[0-9 -()+]+$/;
    if ((phone.length < 6) || (!intRegex.test(phone))) {
        alert('Please enter a valid phone number.');
        return false;
    } else {
        submit_request();
    }

}

submit_request = function() {

    var fn = document.getElementById("fname").value;
    var email = document.getElementById("email").value;
    var pnumber = document.getElementById("pnumber").value;
    var issue = document.getElementById("issue").value;
    var info = fn + " " + email + " " + pnumber + " " + issue;


    $.ajax({
        type: "POST",
        xhrFields: {
            withCredentials: true
        },
        url: 'https://support.box.com/api/v2/portal/requests.json',
        data: '{"request": {"subject": "Callback Requested", "comment": {"body": "Thank you for using web callback. Here is the information you submmited.' + info + '"},"tags" : ["callback_request"]}}',
        success: submit_success(),
        dataType: 'application/json',
        contentType: 'application/json'
    });
    submit_success();
}

submit_success = function() {
    counter = setInterval(timer_new, 1000);
    document.getElementById("callback_form").setAttribute("style", "display:none");
    document.getElementById("thank_you").setAttribute("style", "block");

}

timer_new = function() {
    count = count - 1;
    if (count <= 0) {
        clearInterval(counter);
        return;
    }
    if (count == 1) {
        document.getElementById("title").setAttribute("style", "display:none");
        document.getElementById("timer").innerHTML = " <b>We apologize if we haven't called you yet. </b> <br><br> We have created a ticket on your behalf and sent you an email.<br><br>Just call us at <b>1-800-875-8230</b> and mention the <b>ticket number</b> and we would be glad to help ! ";
        return;
    }

    document.getElementById("timer").innerHTML = count + " seconds";
}

checkDay = function() // Salman's Logic
{
    var init_date = new Date();
    // 0 is sunday 1 is monday .. 5 is friday 6 is saturday
    var init_day = init_date.getDay();
    var init_hours = init_date.getHours();
    var getUTCH = init_date.getUTCHours();

    //alert(getUTCH);
    var getUTCHD = init_date.getUTCDay();
    var utc = init_date.getTime() + (init_date.getTimezoneOffset() * 60000);
    var new_date = new Date(utc + (3600000 * (-7)));

    //var off = getUTCH-init_hours;
    if (getUTCHD == "1" && getUTCH < 14) return 0;
    else {
        if (getUTCH > "13" || getUTCH < "1") {
            //alert(getUTCH);
            if (getUTCHD != "0" || getUTCHD != "6") return 1;
        }
    }
    //7am  - 18 pm
    //if((init_day != 0 || init_day !=6) && init_hours > 6 && init_hours <19)
    //  return 1; 
    return 0;
}

getCallBackCount = function() {
    var response = $.ajax({
        type: "GET",
        url: "https://web-callback.herokuapp.com/ticket_count.php",
        async: false
    }).responseText;
    var result = parseInt(response);
    return result;
}

initializeCallback = function() {

    document.getElementById("fname").value = HelpCenter.user.name;
    document.getElementById("email").value = HelpCenter.user.email;
    var user_email = HelpCenter.user.email;

    var callBackQueue = 0;
    callBackQueue = getCallBackCount();
    var day = checkDay();
    if (callBackQueue !== undefined) {
        if (callBackQueue > 5 || user_email == null) {
            hidecallback();
        }
    }

}

hidecallback = function() {
    document.getElementById("callback_link").setAttribute("style", "display:none");;
    //document.getElementById("call_us").style.display = "block";
    flag = 1;
} 