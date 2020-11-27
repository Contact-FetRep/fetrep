'use strict';

let voteeRegex = new RegExp('^.*/users/([0-9]+).*$');

function getVoterId() {
    let voterId;
    for (const scriptElement of document.getElementsByTagName('script')) {
        for (const scriptElementHtmlLine of scriptElement.innerHTML.split("\n")) {
            if (scriptElementHtmlLine.includes("FetLife.currentUser.id")) {
                voterId = scriptElementHtmlLine.match("^\\s*FetLife.currentUser.id\\s+=\\s+(\\d+);\\s*$")[1];
            } else if (scriptElementHtmlLine.includes("FL.user")) {
                voterId = scriptElementHtmlLine.match("^.*FL.user.*\"id\":([0-9]+).*$")[1];
            }
            if (voterId) {
                return voterId;
            }
        }
    }
    return voterId;
}

function getUserId(userString) {
    try {
        return userString.match(voteeRegex)[1];
    } catch (err) {
        return null;
    }
}

function getVoteeId(tabUrl) {
    let voteeId;
    if (tabUrl) {
        voteeId = getUserId(tabUrl);
    }
    if (voteeId) {
        return voteeId
    }
    let voteeElement = document.getElementsByClassName("db")[0];
    if (voteeElement) {
        let voteeIdHref = voteeElement.getAttribute("href");
        voteeId = getUserId(voteeIdHref);
    }
    return voteeId;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    try {
        let voteeId = getVoteeId(request.tab_url);
        let voterId = getVoterId();
        // if we have a correctly set voter and votee id send message back to background for processing
        if (voteeId && voterId) {
            chrome.runtime.sendMessage({voter_id: voterId, votee_id: voteeId});
        }
    } catch (err) {
    }
});
