// ==UserScript==
// @name         Neopets TVW Notify
// @version      2024-07-10-v2
// @description  Sends you a notification when your Neopet has finished volunteering!
// @author       Daniel Law
// @match        https://www.neopets.com/*
// @icon         https://www.neopets.com/favicon.ico
// @downloadURL  https://github.com/daniel-law/neopets-tvw-notify/raw/master/script.user.js
// @updateURL  https://github.com/daniel-law/neopets-tvw-notify/raw/master/script.user.js
// @grant        none
// ==/UserScript==

(function() {
'use strict';

        Date.prototype.addSeconds = function(seconds) {this.setSeconds(this.getSeconds() + seconds);return this;};
        Date.prototype.addMinutes = function(minutes) {this.setMinutes(this.getMinutes() + minutes);return this;};
        Date.prototype.addHours = function(hours) {this.setHours(this.getHours() + hours);return this;};

        let shiftEnd = localStorage.getItem("tvw-bfbi-shiftend");
        let alerts = document.querySelector("#alerts > ul");

        // Clear out the text as we are adding our own notification.
        document.querySelector("#alerts > ul > .alerts-none__2020").innerHTML = ""

        function updateNotificationsNumber() {
            let notificationsNumber = parseInt(document.getElementById("NavAlertsNotif").innerHTML);
            let notificationsEl = document.getElementById("NavAlertsNotif");

            if (notificationsNumber) {
                notificationsNumber++;
            } else {
                notificationsNumber = 1;
            }

            // Add the new number and style.
            notificationsEl.innerHTML = notificationsNumber;
            notificationsEl.style.display = "block";
            notificationsEl.style.background = "#FF46FF";
        }

        function getNotification(state) {
            if (state == "noprogress") {
                return "<a id='tvw-notification' href='https://www.neopets.com/hospital/volunteer.phtml'><li style='border-image: url(https://images.neopets.com/plots/tvw/home/images/summary-backing.png) calc(150 / 3) calc(150 / 3) fill / 50px / 9px; color: white; padding-left: 2em; padding-top: 1em; padding-bottom: 1.5em; padding-right: 1em; margin-left: 4px; width: 96.5%;'><div class='vc-arrow right' style='width: 2.5em; height: 3.5em; background: url(https://images.neopets.com/plots/tvw/activities/void-collection/images/arrow.png) center / contain no-repeat; cursor: pointer; outline: none; z-index: 1; float: right;'></div><h4 style='color:white;'>Volunteering</h4><p style='color:white;'>Not in progress :(</p><br /></li></a>"
            }

            // Refresh end time.
            shiftEnd = localStorage.getItem("tvw-bfbi-shiftend");

            // Calculate end of shift datetime string.
            let endOfShift = new Date(shiftEnd);
            const options = {month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'};
            let endOfShiftText = endOfShift.toLocaleDateString('en-US', options);
            endOfShiftText = endOfShiftText.replaceAll(",", "").replaceAll("AM", "am").replaceAll("PM", "pm");
            const timeZoneAbbreviated=()=>{const{1:tz}=new Date().toString().match(/\((.+)\)/);if(tz.includes(" ")){return tz.split(" ").map(([first])=>first).join("")}else{return tz}};
            let finalEndOfShiftText = endOfShiftText + " " + timeZoneAbbreviated();

            if (state == "inprogress") {
                return "<a id='tvw-notification' href='https://www.neopets.com/hospital/volunteer.phtml'><li style='border-image: url(https://images.neopets.com/plots/tvw/home/images/summary-backing.png) calc(150 / 3) calc(150 / 3) fill / 50px / 9px; color: white; padding-left: 2em; padding-top: 1em; padding-bottom: 1.5em; padding-right: 1em; margin-left: 4px; width: 96.5%;'><div class='vc-arrow right' style='width: 2.5em; height: 3.5em; background: url(https://images.neopets.com/plots/tvw/activities/void-collection/images/arrow.png) center / contain no-repeat; cursor: pointer; outline: none; z-index: 1; float: right;'></div><h4 style='color:white;'>Volunteering</h4><p style='color:white;'>In progress.</p><h5>" + finalEndOfShiftText + "</h5></li></a>"
            }

            if (state == "completed") {
                return "<a id ='tvw-notification' href='https://www.neopets.com/hospital/volunteer.phtml'><li style='border-image: url(https://images.neopets.com/plots/tvw/home/images/summary-backing.png) calc(150 / 3) calc(150 / 3) fill / 50px / 9px; color: white; padding-left: 2em; padding-top: 1em; padding-bottom: 1.5em; padding-right: 1em; margin-left: 4px; width: 96.5%;'><div class='vc-arrow right' style='width: 2.5em; height: 3.5em; background: url(https://images.neopets.com/plots/tvw/activities/void-collection/images/arrow.png) center / contain no-repeat; cursor: pointer; outline: none; z-index: 1; float: right;'></div><h4 style='color:white;'>Volunteering</h4><p style='color:white;'>Finished, go restart!</p><h5>" + finalEndOfShiftText + "</h5></li></a>"
            }
        }

        function createJob() {
            // Create an object that matches the remaining time.
            let shiftEnd = new Date();
            shiftEnd.addHours(6);

            // Store for the future!
            localStorage.setItem("tvw-bfbi-shiftend", shiftEnd);

            document.getElementById("tvw-notification").innerHTML = getNotification("inprogress");
        }

        function cancelJob() {
            localStorage.removeItem("tvw-bfbi-shiftend");
            document.getElementById("tvw-notification").innerHTML = getNotification("noprogress");
        }

        function finishJob() {
            localStorage.removeItem("tvw-bfbi-shiftend");
        }

        if (window.location.href == "https://www.neopets.com/hospital/volunteer.phtml") {

            // Hook into initial create event.
            document.getElementById("VolunteerJoinButton").addEventListener("click", async function(event){
                event.preventDefault();
                createJob();
            });

            // Hook into cancel event.
            document.getElementById("VolunteerCancelButton").addEventListener("click", async function(event){
                event.preventDefault();
                cancelJob();
            });

            // Hook into finish event.
            document.getElementById("VolunteerButton3").addEventListener("click", async function(event){
                event.preventDefault();
                finishJob();
            });

            // IN PROGRESS JOB.
            // Pull remaining time from the page.
            if(document.querySelector('#VolunteerFight3 > div.vc-fight-details > div.vc-fight-status > span > script') !== null) {
                let clockCode = document.querySelector("#VolunteerFight3 > div.vc-fight-details > div.vc-fight-status > span > script").innerHTML;
                let clockDigits = (clockCode.split("new vcClock(").pop()).split(")")[0];
                let clock = clockDigits.split(", ");
                let clockHours = clock[0];
                let clockMinutes = clock[1];
                let clockSeconds = clock[2];

                // Create an object that matches the remaining time.
                let shiftEnd = new Date();
                shiftEnd.addHours(parseInt(clockHours)).addMinutes(parseInt(clockMinutes)).addSeconds(parseInt(clockSeconds));

                // Store for the future!
                localStorage.setItem("tvw-bfbi-shiftend", shiftEnd);

                alerts.insertAdjacentHTML("afterbegin", getNotification("inprogress"));
            } else {
                // NO PROGRESS JOB
                // Since there is no clock, must be no job in progress.
                alerts.insertAdjacentHTML("afterbegin", getNotification("noprogress"));
            }

        } else {
            if ((new Date(shiftEnd) < Date.now()) && (shiftEnd !== null)) {
                updateNotificationsNumber();
                alerts.insertAdjacentHTML("afterbegin", getNotification("completed"));
            } else if ((new Date(shiftEnd) > Date.now()) && (shiftEnd !== null)) {
                alerts.insertAdjacentHTML("afterbegin", getNotification("inprogress"));
            } else {
                alerts.insertAdjacentHTML("afterbegin", getNotification("noprogress"));
            }
        }

})();
