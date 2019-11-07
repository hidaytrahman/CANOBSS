function openNotificationBar() {
    $("#charm").addClass('showCharm');
};

$('.notifications-list').on("click", function () {
    $("#notification-container").toggleClass('showCharm');
});

function closeNotificationBar() {
    $("#notification-container").removeClass('showCharm');
}

$("#notification-container .close-button-notification").on("click", function () {
    closeNotificationBar();
});


var isNotificationOn = false;
$("#new-alert").on("click", function () {
    $('.set-alert-form').addClass('showIt');
});

$("#notification").on("click", function () {
    isNotificationOn = !isNotificationOn;
    console.log('isNotificationOn', isNotificationOn);
    if (isNotificationOn) {
        /*setAlert();
        getAlerts();*/
    }

});

var notificationExist = localStorage.getItem('notificationList');

var notificationEnable = localStorage.getItem('notificationEnable');
function notificationAppearance() {
    // notification appearance handling
    if (notificationEnable) {
        $('.alerts-listing').addClass('showing-feature');
        $('.show-notifications').prop('checked', true);
    } else {
        $('.alerts-listing').removeClass('showing-feature');
        $('.show-notifications').prop('checked', false);
    }
}
notificationAppearance();


function setAlert() {
    var inputs = $(".set-alert-form .input-area");
    var notificationsList = [];

    if (notificationExist) {
        notificationsList = notificationExist;
        notificationsList = notificationsList.split(",");
    } else {
        notificationsList = [];
    }

    $(".submit-button").on("click", function () {
        var something1 = inputs.find('.something1').val();
        var something2 = inputs.find('.something2').val();
        var something3 = inputs.find('.something3').val();
        var inc = inputs.find('.increase-decrease').val();
        if (something3 == '') {
            alert('Please enter value');
        } else {
            var notification = something1 + ' of a ' + something2 +' '+inc+' by ' + something3+' %';
            notificationsList.push(notification)
            localStorage.setItem('notificationList', notificationsList);
            $('.set-alert-form').removeClass('showIt');
            getAlerts();
        }
    });

    $(".show-notifications").on("click", function () {
        notificationEnable = !notificationEnable;
        localStorage.setItem('notificationEnable', notificationEnable);
        notificationAppearance();
    });

}

function getAlerts() {
    if (notificationExist) {
        var notificationsList = notificationExist.split(',');
        $(".alerts-listing").html('');
        for (var i = 0; i < notificationsList.length; i++) {
            const alertListHTML = document.createElement('div');
            alertListHTML.className = 'alert';
            const alert = document.createTextNode(notificationsList[i]);
            alertListHTML.appendChild(alert);
            $(".alerts-listing").append(alertListHTML);
        }

        setInterval(function () {
            var randomPosition = Math.floor(Math.random() * 4);
            $(".alerts-listing .alert").removeClass('highlighter');
            $(".alerts-listing .alert:nth-child(" + randomPosition + ")").addClass('highlighter');
        }, 1000);

    } else {
       
    }
}


getAlerts();
setAlert();