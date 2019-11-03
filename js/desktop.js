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
        content: `
         <h2>Top 10 Ip Addresses by property</h2>
<p>Select the property value</p>

<div class="dropdown">
  <button class="dropbtn">Property</button>
  <div class="dropdown-content">
    <li><a href="http://10.164.27.117:5005/InDegree">InDegree</a></li>
    <li><a href="http://10.164.27.117:5005/OutDegree">OutDegree</a></li>
    <li><a href="http://10.164.27.117:5005/ClosenessC">ClosenessC</a></li>
    <li><a href="http://10.164.27.117:5005/DegreeC">DegreeC</a></li>
    <li><a href="http://10.164.27.117:5005/BetweennessC">BetweennessC</a></li>
    <li><a href="http://10.164.27.117:5005/EigenVectorC">EigenVectorC</a> </li>
  </div>
</div> 
   `
    });

  //  setTimeout(function () {
    //    w.setContent("New window content");
    //}, 3000);
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
        content: ` <section class="network-graph-video" id="vim">
          <div id="vim" width="2000" height="700"></div>
        </section>`
    });
    
    var timestamps = ["20-10-2019","21-10-2019","22-10-2019","23-10-2019","24-10-2019","25-10-2019"];

    var i;
    for (i = 0; i < timestamps.length; i++)
    {
        (function(i){
        setTimeout(function(){
         
         draw_range(timestamps[i]);
         
         }, i * 8000);
        })(i);
    }
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
        content: `<section class="network-graph-wrapper" id="vid">
        <input type="text" id="cypherBox" class="bar" wrap="hard" style="width:100%;  align:center;" class="form-control" > 
        
        <div id="vid" width="2000" height="700"></div>
        </section>`,
        clsContent: "bg-dark"
    });
    draw_live(1);
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
        axios.get('http://localhost:8081/ml-ai/data/data.json')
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
        content: `<div class="searchbox"  id="searchbox" value="">
        <input class="input" size="50" type="text" placeholder="English Query" id="englishTextBoxId">
        <button onclick="myFunction()">Search in Cypher</button>
        <section class="network-graph-wrapper" id="viz">
        <input type="text" id="cypherBox" class="bar" wrap="hard" style="width:100%;  align:center;" class="form-control" > 
        
        <div id="viz" width="2000" height="700"></div>
        </section>
        `,
        clsContent: "bg-light"
    });
    
     draw("1");                 
                   var codeMirrorEditor = CodeMirror.fromTextArea(document.getElementById("cypherBox"), {
                        mode:'cypher',
                        lineNumbers: false,
                        lineWrapping: false,
                        scrollbarStyle: "native",
                        theme: 'neo'
                    });
                      var code = 
                    ``;
                    if(document.getElementById("insert") != null){
                    document.getElementById("insert").innerHTML = codeMirrorEditor.getValue(code);
                    } 
}

 
 function myFunction(codeMirrorEditor){
      if(document.getElementById("insert") != null){
                    document.getElementById("insert").innerHTML = englishParser("englishTextBoxId", codeMirrorEditor);   
      }                    
                    cypher_set = englishParser("englishTextBoxId", codeMirrorEditor);
                    draw(cypher_set);
                    };
                    
                    
function createNodeDiff() {
    Desktop.createWindow({
        resizeable: true,
        draggable: true,
        width: 700,
        icon: "<span class='mif-done_all'></span>",
        title: "Node comparison",
        content: `
        <input type="date" id="graphDate1">
        <input type="date" id="graphDate2">
        <input type="submit" onclick="createTimeGraph()"><br><br>
        <div width="400" height="400" id="date1" class="timeSvg"></div><div width="400" height="400" id="date2" class="timeSvg"></div>
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


$("#notification").on("click", function () {
    setAlert();
    getAlerts();
});



var notificationExist = localStorage.getItem('notificationList');
function setAlert() {
    var inputs = $(".set-alert .input-area");
    var notificationsList = [];
    
    if(notificationExist) {
        notificationsList = notificationExist;
        console.log('type', typeof notificationsList);
        notificationsList = notificationsList.split(",");
        console.log('type', typeof notificationsList);
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
        }

        getAlerts();
    });
}

function getAlerts() {
    
    if (notificationExist) {
        var notificationsList = notificationExist.split(',');
        console.log('notificationsList', notificationsList);
        for (var i = 0; i < notificationsList.length; i++) {
            $(".alerts-listing").append('<p>' + notificationsList[i] + '</p>');
        }
    } else {
        alert('Create alert first');
    }
}

/* Just to experiments
(() => {
    createSearchBar();
})()
*/