'use strict';

let upVoteButton = document.getElementById('upVote');
let downVoteButton = document.getElementById('downVote');

function makeVote(voteDirection) {
    chrome.runtime.sendMessage({vote_direction: voteDirection});
}

function getVotes() {
    chrome.runtime.sendMessage({refresh: "T"});
}

function displayVotes(reputationScore, totalVotes) {
    document.getElementById('reputationScoreElement').value = reputationScore;
    document.getElementById('totalVotesElement').value = totalVotes;
    if (reputationScore < 0) {
        document.getElementById('reputationScoreElement').style.color = '#ff0000';
    } else {
        document.getElementById('reputationScoreElement').style.color = '#FFFFFF';
    }
}

upVoteButton.onclick = function (element) {
    makeVote("T");
    getVotes();
};

downVoteButton.onclick = function (element) {
    makeVote("F");
    getVotes();
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        let votesList = request.vote_list;
        if (votesList) {
            let totalVotes = votesList.length;
            let reputationScore = 0;
            for (let index = 0; index < totalVotes; index++) {
                let voteJson = votesList[index];
                voteJson.value == "T" ? reputationScore++ : reputationScore--;
            }
            displayVotes(reputationScore, totalVotes);
        }
    }
);

window.onload = function () {
    getVotes();
};
