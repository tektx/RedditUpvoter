// ==UserScript==
// @name       Reddit Upvoter
// @author     T. Knight
// @version    5
// @description  Upvotes Reddit posts made in a defined list of subreddits for purposes of increasing post visibility in smaller subs
// @include      /https?://www\.reddit\.com*/
// @exclude     https?://www.reddit.com/r/*/comments*
// ==/UserScript==

//var vUpvote = document.getElementsByClassName("arrow upmod login-required");
//alert(vUpvote.length);

// Populate this array with the subreddits to upvote
var Subs = ["cscareerquestions", "tasker", "personalfinance", "Ubuntu"];

//debug();

if (window.location.href.match(/https?:\/\/www\.reddit\.com\/?$/)) {
	//console.log("Debug: Frontpage");
	window.setInterval(function() { upvotePosts("frontpage");}, 2000);
} else if(window.location.href.match(/www\.reddit\.com\/r\/[a-zA-Z0-9]+\/?(#page=[0-9]+)?$/)) {
	//console.log("Debug: Subreddit");
	addVotingButtons();
	window.setTimeout(addTagButton, 1000);
	for(i=0; i<Subs.length; i++) {
        var regexSubreddit = new RegExp('\\/r\\/' + Subs[i] + '\\/?', "i");
		if(window.location.href.match(regexSubreddit)) {
			window.setInterval(upvotePosts, 2000);
		}
	}
} else if(window.location.href.match("/comments/")) {
	//console.log("Debug: Comments section");
	window.setTimeout(addTagButton, 1000);
	window.setInterval(checkComments, 500);
}

function upvotePosts(whichSubreddit) {
	var voteButtons = document.getElementsByClassName("midcol unvoted");
    if(voteButtons.length > 0) {
		var i = Math.floor(Math.random() * voteButtons.length);
		var nextSib = voteButtons[i].nextSibling;
		// Check that this vote isn't in the Recently Viewed Links section
		if(!nextSib.className.match("reddit-entry")) {
			if(nextSib.className.match("thumbnail")) {
				nextSib = nextSib.nextSibling;
			}
			var childVal = 1;
			var dateSubmittedVal = 0;
			var subRedditVal = 5;
			// Check if there's a thumbnail button
			if(nextSib.children[1].className.match("collapsed")) {
				childVal++;
			}
			// Check if there was an edit
			if(nextSib.children[childVal].children[1].className == "edited-timestamp") {
				subRedditVal++;
			}
			var dateSubmitted = nextSib.children[childVal].children[dateSubmittedVal];
			var subReddit = nextSib.children[childVal].children[subRedditVal];
			// Check that the post is not too old to upvote and that the current post score is >0
			if(!dateSubmitted.innerText.match("year") && !dateSubmitted.innerText.match("months") && voteButtons[i].children[0].className == "arrow up login-required" && voteButtons[i].children[2].innerText != "0") {
				// Loop through the list of declared subs if this is the frontpage
				if(whichSubreddit == "frontpage") {
					for(k = 0; k<Subs.length; k++) {
						if(subReddit.innerText.match("/r/" + Subs[k])) {
							voteButtons[i].children[0].click();
						}
					}
				} else {
					voteButtons[i].children[0].click();
				}
			}
		}
	}
}

function checkComments() {
	var commentBox = document.getElementsByClassName("midcol unvoted");
	var randomNum = Math.floor(Math.random() * commentBox.length);
	//commentBox[randomNum].style.backgroundColor = 'blue';
	// Don't vote on comments in the Recently Viewed Links frame
	if(commentBox[randomNum].nextSibling.className == "entry unvoted") {
		var commentPost = commentBox[randomNum].nextSibling;
		var userTag = commentPost.children[0].children[2];
		var unvotedScore = getCommentScore(userTag);
		if(userTag && userTag.className == "RESUserTag" && userTag.innerText.match("upvote") && unvotedScore.charAt(0) != "-" && unvotedScore.charAt(0) != "0") {
			commentBox[randomNum].children[0].click();
			//console.log("Score is: " + unvotedScore.charAt(0));
		}
	}
}

function addVotingButtons() {
	var subredditControls = document.getElementsByClassName("titlebox");
	var subscribeDiv = subredditControls[0].children[2];
	//subscribeDiv.style.backgroundColor = 'green';
	var voteButtonsDiv = document.createElement('div');
	subredditControls[0].insertBefore(voteButtonsDiv, subscribeDiv);
	var selectNone = document.createElement('input');
	selectNone.setAttribute('type', "radio");
	selectNone.setAttribute('name', "voteBehavior");
	selectNone.setAttribute('value', "novoteSub");
	var selectNoneLabel = document.createElement('label');
	selectNoneLabel.innerText = "Don't autovote";
	var selectLikeSub = document.createElement('input');
	selectLikeSub.setAttribute('type', "radio");
	selectLikeSub.setAttribute('name', "voteBehavior");
	selectLikeSub.setAttribute('value', "upvoteSub");
	var selectLikeSubLabel = document.createElement('label');
	selectLikeSubLabel.innerText = "Auto-Upvote posts";
	var selectDislikeSub = document.createElement('input');
	selectDislikeSub.setAttribute('type', "radio");
	selectDislikeSub.setAttribute('name', "voteBehavior");
	selectDislikeSub.setAttribute('value', "downvoteSub");
	var selectDislikeSubLabel = document.createElement('label');
	selectDislikeSubLabel.innerText = "Auto-Downvote posts";
	var addBreak1 = document.createElement('br');
	var addBreak2 = document.createElement('br');
	voteButtonsDiv.appendChild(selectNone);
	voteButtonsDiv.appendChild(selectNoneLabel);
	voteButtonsDiv.appendChild(addBreak1);
	voteButtonsDiv.appendChild(selectLikeSub);
	voteButtonsDiv.appendChild(selectLikeSubLabel);
	voteButtonsDiv.appendChild(addBreak2);
	voteButtonsDiv.appendChild(selectDislikeSub);
	voteButtonsDiv.appendChild(selectDislikeSubLabel);
}

function debug() {
	//console.log("Subs: " + Subs);
	localStorage.likedSubs = JSON.stringify(Subs);
	var localSubs = JSON.parse(localStorage.likedSubs);
	console.log("Localsubs: " + localSubs);
}

function tagUsers() {
	var subName = window.location.href.split("/")[4];
	var userTags = document.getElementsByClassName("RESUserTag");
	for(var i=0; i<userTags.length; i++) {
		var currentTag = userTags[i].children[0].innerText;
		var unvotedScore = getCommentScore(userTags[i]);
		// Tag users that don't have a negative karma post, because if the karma is negative, they may not be regular posters
		if(!currentTag.match(subName) && (unvotedScore.charAt(0) != "-" && unvotedScore.charAt(0) != "0")) { //|| !unvotedScore) {
			userTags[i].children[0].click();
			if(!userTags[i].children[0].innerText) {
				document.getElementById("userTaggerTag").value = subName;
			} else {
				document.getElementById("userTaggerTag").value = currentTag + ", " + subName;
			}
			document.getElementById("userTaggerSave").click();
		}
	}
}

function addTagButton() {
	// Add links to the top bar
	var shortcutsBar = document.getElementById("RESStaticShortcuts");
	var spanElement = document.createElement('span');
	var tagButton = document.createElement('a');
	spanElement.setAttribute('class', "separator");
	spanElement.innerText = "-";
	tagButton.innerHTML = "TagUsers";
	tagButton.onclick = tagUsers;
	tagButton.setAttribute('style', "cursor: pointer");
	shortcutsBar.appendChild(spanElement);
	shortcutsBar.appendChild(tagButton);
}

function getCommentScore(resTagElement) {
	var unvotedScore = $(resTagElement).next().next().next().next().text();
	return unvotedScore;
}