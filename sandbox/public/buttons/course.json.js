/**
Copyright (C) 2013 Moko365 Inc. All Rights Reserved. 

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at 

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software 
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and 
limitations under the License.
*/

function myVideoPlay() {
    $('.video-control-buttons').videoPlay();
}

function myVideoPause() {
    $('.video-control-buttons').videoPause();
}

function myFullScreen() {
    $('.video-control-buttons').requestFullScreen();
}

function myExitFullScreen() {
    $('.video-control-buttons').cancelFullScreen();
}

function myToggleFullScreen() {
    $('.video-control-buttons').toggleFullScreen();
}

function myVideoStop() {
    $('.video-control-buttons').videoStop();
}

function myVideoNote() {
    $('.video-note').videoNote();
}

var _vv =
{
    "prepared": {
        "buttons": {
            "red" : { "title": "Play Video", "state": "play", "callback": myVideoPlay },
            "yellow" : { "title": "--", "state": null, "callback": null },
            "green": { "title": "--", "state": null, "callback": null },
            "blue": { "title": "--", "state": null, "callback": null }
        }
    },

    "play": {
        "buttons": {
            "red" : { "title": "Stop Video", "state": "prepared", "callback": myVideoStop },
            "yellow" : { "title": "Pause Video", "state": "prepared", "callback": myVideoPause },
            "green": { "title": "Full Screen", "state": "play", "callback": myToggleFullScreen },
            "blue": { "title": "Share with Friends", "state": "prepared", "callback": myVideoNote }
        }
    },
};

