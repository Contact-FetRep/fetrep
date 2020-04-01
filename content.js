'use strict';

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        // see if we are on person's profile page
        let voterElement = document.getElementsByClassName("fl-avatar__link")[0];

        // if we are on pictures/videos/etc page, get by title
        if (!voterElement) {
            voterElement = document.querySelector('[title=\"View Profile\"]');
        }

        // parse the voter's id out
        let voterIdHref = voterElement.getAttribute("href");
        let voterRegex = new RegExp('/users/([0-9]+)');
        let voterId = voterIdHref.match(voterRegex)[1];
        let voteeIdHref = request.tab_url;
        let voteeRegex = new RegExp('.*/users/([0-9]+)');
        let voteeId = voteeIdHref.match(voteeRegex)[1];
        chrome.runtime.sendMessage({voter_id: voterId, votee_id: voteeId});
    });
