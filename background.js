'use strict';

let voteeId;
let voterId;
let voteDirection;
let tabUrl;

function processVotes(votesJson) {
    chrome.runtime.sendMessage(votesJson);
}

function getVotes() {
    const getRepUrl = `http://www.fetrep.com/api/vote/${voteeId}/`;
    fetch(getRepUrl).then(response => response.json()).then(json => {
        processVotes(json);
    })
}

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostEquals: 'fetlife.com'},
                }),
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // set variables
    if (request.votee_id) {
        voteeId = request.votee_id;
    }
    if (request.voter_id) {
        voterId = request.voter_id;
    }
    if (request.vote_direction) {
        voteDirection = request.vote_direction;
    }

    // refresh on opening popup if asked
    if (request.refresh && voteeId) {
        getVotes();
    }

    // if we just have an id, get his reputation
    if (request.votee_id) {
        getVotes();
    }

    // if we have a vote and all is ok, send it
    if (request.vote_direction && voteeId && voterId) {
        const req = new XMLHttpRequest();
        const makeVoteUrl = "http://www.fetrep.com/api/vote/";
        const urlParams = `votee_id=${voteeId}&voter_id=${voterId}&value=${voteDirection}`;

        // response callback
        req.onreadystatechange = function () {
            if (req.readyState == XMLHttpRequest.DONE) {
                let response = req.responseText;
                processVotes(response);
            }
        };

        // make the vote
        req.open("POST", makeVoteUrl, true);
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.send(urlParams);
    }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    if (activeInfo) {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            if (tab) {
                tabUrl = tab.url;
                if (tabUrl) {
                    chrome.tabs.sendMessage(activeInfo.tabId, {tab_url: tabUrl});
                }
            }
        });
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tabId) {
        chrome.tabs.get(tabId, function (tab) {
            if (tab) {
                tabUrl = tab.url;
                if (tabUrl) {
                    chrome.tabs.sendMessage(tabId, {tab_url: tabUrl});
                }
            }
        });
    }
});

