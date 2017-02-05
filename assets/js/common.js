// Highcharts.setOptions({
//     global: {
//         useUTC: false
//     }
// });

var sources = [
    "http://10.244.53.34:5778",
    "http://10.244.53.34:5779",
    "http://10.244.53.42:5779"
];

var ws = new WebSocket("ws://" + window.location.hostname + ":8080");
currentRoom = 0;
var millisecondsToWait = 500;
var c = 1;
var frames = [];
const roomLink = {
    "101": "room1",
    "102": "room2",
    "103": "room3",
    "104": "room4",
    "105": "room5",
    "106": "room6"
}

const mapRooms = {
    "101": "101",
    "102": "101",
    "103": "102",
    "104": "102",
    "105": "102",
    "106": "103"
}

var i = 1;
sources.forEach(function (source) {
    var frame = $("<video/>", {
        id: 100 + (c++),
        src: source,
        width: "100%",
        height: "100%",
        style: "height:100%;width:100%"
    });
    frames.push(frame);
    $("#room" + i).append(frame);
    i++;
});

$("#map").find("td[colspan!=2]").each(function (index, el) {
    $(el).click(function () {
        $("#mainvideo").empty();
        var video = $(el);
        try {
            var frm = frames.find(function (ele) {
                return roomLink[$(ele).attr("id")] == video.attr("id");
            }).show();
            $("#mainvideo").append(frm);
        } catch (e) {

        }
    });
});

setRoom(currentRoom);

var time = 1000;
var counter = 0;
var users = [];
var i = 0;
var uniqueUsers = {};

var selectedusr;

function selectUser(sender, user) {
    $(sender).addClass("active");
    selectedusr = user;
}

ws.onmessage = function (message) {

    try {
        var payload = JSON.parse(message.data);
        i++;
        if (i > 20) {
            payload.beacons.forEach(function (beacon) {
                counter++;
            });


            if (users.indexOf(payload.user) == -1) {
                users.push(payload.user);
                var li = $("<li/>").append($("<a/>", {
                    href: "javascript:selectUser(this, '" + payload.user + "')",
                    text: payload.user,
                    class: "list-group-item"
                }));
                $("#users").append(li);
            }

            if (payload.room == 0) {
                users.splice(users.indexOf(payload.user), 1);
                $("#users").empty();
                users.forEach(function (user) {
                    var li = $("<li/>").append($("<a/>", {
                        href: "javascript:selectUser(this, '" + user + "')",
                        text: user,
                        class: "list-group-item"
                    }));
                    $("#users").append(li);
                });
            }
            i = 0;
        }
        if (typeof selectedusr !== "undefined") {
            if (payload.user === selectedusr) {
                if (payload.room != currentRoom) {
                    currentRoom = payload.room;
                    setRoom(currentRoom);
                }
            }
        } else {
            if (payload.room != currentRoom) {
                currentRoom = payload.room;
                setRoom(currentRoom);
            }
        }

    } catch (e) {
        console.log('malformed message' + message.data);
    }
}

function setRoom(room) {
    $("#pos").empty();
    if (room == 0) {
        $("#pos").append($("<h3/>", {
            text: "No Actors in the area."
        }));
        frames.forEach(function (frame) {
            frame.hide();
        })

        Object.keys(roomLink).forEach(function (key) {
            $("#" + roomLink[key]).css({
                "background-color": "white"
            });
        })
        return;
    }

    try {
        $("#mainvideo").empty();
        var frame = frames.find(function (el) {
            var id = $(el).attr("id");
            return id == mapRooms[room];
        }).show().css({
            "width": "100%",
            'height': '',
            "margin": "auto"
        });
        $("#mainvideo").append(frame);
        frame.get(0).play();
    } catch (e) {
        console.log(e);
    }
    Object.keys(roomLink).forEach(function (key) {
        if (key == room) {
            $("#" + roomLink[key]).css({
                "background-color": "green"
            });
        } else {
            $("#" + roomLink[key]).css({
                "background-color": "white"
            });
        }
    });
    $("#pos").append($("<h3/>", {
        text: "Room " + room
    }));

}