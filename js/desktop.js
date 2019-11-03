var Desktop = {
    options: {
        windowArea: ".window-area",
        windowAreaClass: "",
        taskBar: ".task-bar > .tasks",
        taskBarClass: ""
    },

    wins: {},

    setup: function (options) {
        this.options = $.extend({}, this.options, options);
        return this;
    },

    addToTaskBar: function (wnd) {
        var icon = wnd.getIcon();
        var wID = wnd.win.attr("id");
        var item = $("<span>").addClass("task-bar-item started").html(icon);

        item.data("wID", wID);

        item.appendTo($(this.options.taskBar));
    },

    removeFromTaskBar: function (wnd) {
        var wID = wnd.attr("id");
        var items = $(".task-bar-item");
        var that = this;
        $.each(items, function () {
            var item = $(this);
            if (item.data("wID") === wID) {
                delete that.wins[wID];
                item.remove();
            }
        })
    },

    createWindow: function (o) {
        o.onDragStart = function () {
            win = $(this);
            $(".window").css("z-index", 1);

            if (!win.hasClass("modal")) {
                win.css("z-index", 3);
            }
        };
        o.onDragStop = function () {
            win = $(this);
            if (!win.hasClass("modal"))
                win.css("z-index", 2);
        };
        o.onWindowDestroy = function (win) {
            Desktop.removeFromTaskBar($(win));
        };

        var w = $("<div>").appendTo($(this.options.windowArea));
        var wnd = w.window(o).data("window");

        var win = wnd.win;
        var shift = Metro.utils.objectLength(this.wins) * 16;

        if (wnd.options.place === "auto" && wnd.options.top === "auto" && wnd.options.left === "auto") {
            win.css({
                top: shift,
                left: shift
            });
        }
        this.wins[win.attr("id")] = wnd;
        this.addToTaskBar(wnd);

        return wnd;
    }
};

Desktop.setup();

var w_icons = [
    'rocket', 'apps', 'cog', 'anchor'
];
var w_titles = [
    'rocket', 'apps', 'cog', 'anchor'
];

function createWindow() {
    var index = Metro.utils.random(0, 3);
    var w = Desktop.createWindow({
        resizeable: true,
        draggable: true,
        width: 300,
        icon: "<span class='mif-" + w_icons[index] + "'></span>",
        title: w_titles[index],
        content: "<div class='p-2'>This is desktop demo created with Metro 4 Components Library</div>"
    });

    setTimeout(function () {
        w.setContent("New window content");
    }, 3000);
}

function createWindowWithCustomButtons() {
    var index = Metro.utils.random(0, 3);
    var customButtons = [
        {
            html: "<span class='mif-rocket'></span>",
            cls: "sys-button",
            onclick: "alert('You press rocket button')"
        },
        {
            html: "<span class='mif-user'></span>",
            cls: "alert",
            onclick: "alert('You press user button')"
        },
        {
            html: "<span class='mif-cog'></span>",
            cls: "warning",
            onclick: "alert('You press cog button')"
        }
    ];
    Desktop.createWindow({
        resizeable: true,
        draggable: true,
        customButtons: customButtons,
        width: 360,
        icon: "<span class='mif-" + w_icons[index] + "'></span>",
        title: w_titles[index],
        content: "<div class='p-2'>This is desktop demo created with Metro 4 Components Library.<br><br>This window has a custom buttons in caption.</div>"
    });
}

function createWindowModal() {
    Desktop.createWindow({
        resizeable: false,
        draggable: true,
        width: 300,
        icon: "<span class='mif-cogs'></span>",
        title: "Modal window",
        content: "<div class='p-2'>This is desktop demo created with Metro 4 Components Library</div>",
        overlay: true,
        //overlayColor: "transparent",
        modal: true,
        place: "center",
        onShow: function (win) {
            var win = $(win);
            win.addClass("ani-swoopInTop");
            setTimeout(function () {
                $(win).removeClass("ani-swoopInTop");
            }, 1000);
        },
        onClose: function (win) {
            var win = $(win);
            win.addClass("ani-swoopOutTop");
        }
    });
}

function createWindowYoutube() {
    Desktop.createWindow({
        resizeable: true,
        draggable: true,
        width: 500,
        icon: "<span class='mif-youtube'></span>",
        title: "Youtube video",
        content: "https://youtu.be/ZlhUJ6QkvL8",
        clsContent: "bg-dark"
    });
}

function createSearchBar() {
    Desktop.createWindow({
        resizeable: true,
        draggable: true,
        width: 500,
        icon: "<span class='mif-youtube'></span>",
        title: "Youtube video",
        content: `
        <section class="search-area">
        <div class="search-wrapper">
            <input type="text" class="input-text" placeholder="Search or speak">
            <a href="#" class="btn btn-voice"><span class="mif-settings-voice"></span></a>
        </div>
    </section>
    <!-- Search are end here -->`,
        clsContent: "bg-dark"
    });
}

function createGraph() {
    const fetchUsers = () => {
        axios.get('http://localhost:4242/ml-ai/data/data.json')
            .then(response => {
                const users = response.data;
                console.log(`GET list data`, users);
                console.log(`GET list data`, users.length);
                for (let i = 0; i < users.length; i++) {
                    console.log(users[i]);
                    let _user = users[i];
                    document.querySelector('#results-data #tdata').innerHTML += '<tr><td>' + _user.IP_ADDRESS + '</td></tr>';
                }

            })
            .catch(error => console.error(error));
    };

    fetchUsers();

    Desktop.createWindow({
        resizeable: true,
        draggable: true,
        width: 700,
        icon: "<span class='mif-flow-parallel'></span>",
        title: "Data Graph",
        content: `<h2>Hidayt</h2> <hr>
        <table id="results-data">
            <thead>
            <tr>
                <th>IP Address</th>
                <th>Contact</th>
                <th>Country</th>
            </tr>
            </thead>
            <tbody id="tdata">
            </tbody>
        </table>
        `,
        clsContent: "bg-light"
    });
}


function createNodeDiff() {
    Desktop.createWindow({
        resizeable: false,
        draggable: false,
        width: '100vw',
        icon: "<span class='mif-done_all'></span>",
        title: "Node comparison",
        content: `
        <div class="diff-section">
        <h2 class="model-title">Node Diff. between 2 Dates</h2> <hr>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."</p>
        </div>
        `,
        clsContent: "bg-light"
    });
}



function openCharm() {
    var charm = $("#charm").data("charms");
    charm.toggle();
}

$(".window-area").on("click", function () {
    Metro.charms.close("#charm");
});

$(".charm-tile").on("click", function () {
    $(this).toggleClass("active");
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
    console.log('notificationEnable', notificationEnable);
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
        if (something3 == '') {
            alert('Please enter value');
        } else {
            var notification = something1 + ' of a ' + something2 + ' by ' + something3;
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
        alert('Create alert first');
    }
}


getAlerts();
setAlert();

/* Just to experiments
(() => {
    createSearchBar();
})()
*/