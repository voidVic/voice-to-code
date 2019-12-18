'use strict';

var app = angular.module('piccolo', []);

// app.config(['$routeProvider', function ($routeProvider) {
//   $routeProvider
//     // Home
//     //.when("/", {templateUrl: "partials/home.html", controller: "homeController as homeCtrl"})
//     // Pages
//     // else 404
//     //.otherwise("/404", {templateUrl: "partials/404.html"});
// }]);

app.factory('appService', ['$http', function ($http) {
    var appFactory = {};
    appFactory.sendCommand = function (text, cbs, cbe) {
        $http({
            url: "classify/text",
            method: "POST",
            data: { 'what': text, 'webApp': true },
            json: true
        })
            .then(function (data) {
                console.log(data);
                if (data.err) {
                    return cbe();
                }
                return cbs(data);
            });
    }
    
    appFactory.getDevices = function(cb){
        //  $http({
        //     url: "classify/get-available-devices",
        //     method: "GET",
        //     json: true
        // })
        //     .then(function (data) {
        //         console.log(data);
        //         return cb(data.data);
        //     });
    }

    return appFactory;
}]);

app.controller('mainController', ['appService', function (appService) {
    var ctrl = this;
    var recognition;
    var lastCommand = "";
    var freshCommand = true;
    var init = function () {
        ctrl.error = "";
        getDevices();
        initSpeechLong();
        initSpeechShort();
        recognition.start();
        recognition.onresult = function (event) {
            var speech = event.results[event.resultIndex][0].transcript;
            if (haveWakeWord(speech)) {
                freshCommand = false;
                console.log("starting short");
                ctrl.command = "";
                ctrl.error = "";
                ctrl.result = "";
                recognitionShort.start();
            }
        }
        recognitionShort.onresult = function (event) {
            //console.log(event);
            var speech = event.results[event.resultIndex][0].transcript;
            console.log(speech);
            ctrl.command = speech;
            appService.sendCommand(speech, function (data) {
                console.log(data.status);
                if(data.status == 222){
                    console.log('received an Image');
                    ctrl.result = "here is the person at your door";
                    speak("here is the image of the person at your door");
                    $('#doorImage').append('<img src="'+ data.data +'" alt="person" />');
                }else{
                    console.log(data);
                    ctrl.result = data.data;
                    speak(data.data.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, ''));
                }
               
            }, function (err) {
                ctrl.error = err;
                console.log(err);
            });
        };
        recognition.onend = function () {
            if (freshCommand) {
                console.log("restarted");
                lastCommand = "";
                recognition.start();
            }
        };
        recognitionShort.onend = function () {
            freshCommand = true;
            console.log("starting long again");
            recognition.start();
        }

    }
    var recognition, recognitionShort;
    var actionSpeech = "";
    var initSpeechLong = function () {

        if (!('webkitSpeechRecognition' in window)) {
            //Speech API not supported here…
            ctrl.error = "Bro ure missing something, Speech not recognized";
        } else { //Let’s do some cool stuff :)
            recognition = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process. 
            recognition.continuous = true;   //Suitable for dictation. 
            recognition.interimResults = true;  //If we want to start receiving results even if they are not final.
            //Define some more additional parameters for the recognition:
            recognition.lang = "en-US";
            recognition.maxAlternatives = 1; //Since from our experience, the highest result is really the best...

        }
    }

    var initSpeechShort = function () {

        if (!('webkitSpeechRecognition' in window)) {
            //Speech API not supported here…
            ctrl.error = "Bro ure missing something, Speech not recognized";
        } else { //Let’s do some cool stuff :)
            recognitionShort = new webkitSpeechRecognition(); //That is the object that will manage our whole recognition process. 
            recognitionShort.continuous = false;   //Suitable for dictation. 
            recognitionShort.interimResults = false;  //If we want to start receiving results even if they are not final.
            //Define some more additional parameters for the recognition:
            recognitionShort.lang = "en-US";
            recognitionShort.maxAlternatives = 1; //Since from our experience, the highest result is really the best...

        }
    }

    var haveWakeWord = function (text) {
        if(text.toLowerCase().indexOf('vegeta') >= 0) {
            return true;
        }
        return false;
    }

    var speak = function(msg){
        msg = new SpeechSynthesisUtterance(msg);
        msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Microsoft Zira Desktop - English (United States)'; })[0];
        speechSynthesis.speak(msg);
    }

    var getDevices = function(){
        appService.getDevices(function(data){
            ctrl.devices = data;
        })
    }

    ctrl.triggerAction = function(){
        var speech = ctrl.voiceText;
        ctrl.voiceText = '';
        appService.sendCommand(speech, function (data) {
            if(data.status===222){
                console.log('received an Image');
                ctrl.result = "here is the person at your door";
                speak("here is the image of the person at your door");
                var encoded = btoa (unescape(encodeURIComponent(data.data)));
                var dataURL="data:image/jpeg;base64,"+encoded;
                document.getElementById('doorImage').innerHTML = '<img src="'+ dataURL +'" alt="person" />';
                //$('#doorImage').append('<img src="'+ data.data +'" alt="person" />');
            }else{
                console.log(data.data.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, ''));
                ctrl.result = data.data;
                speak(data.data.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, ''));
            }
                
            }, function (err) {
                ctrl.error = err;
                console.log(err);
            });
    }



    init();

}]);

(function () {
    console.log("hello world");
})();