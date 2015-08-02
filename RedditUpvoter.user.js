// ==UserScript==
// @name       Reddit Upvoter
// @author     T. Knight
// @version    4
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
	//debug();
	window.setInterval(upvoteFrontpageSubs, 2000);
} else if(window.location.href.match(/www\.reddit\.com\/r\/[a-zA-Z]+\/?(#page=[0-9]+)?$/)) {
	for(i=0; i<Subs.length; i++) {
        var regexSubreddit = new RegExp('\\/r\\/' + Subs[i] + '\\/?', "i");
		if(window.location.href.match(regexSubreddit)) {
			window.setInterval(upvoteDeclaredSubs, 2000);
		}
	}
} else if(window.location.href.match("/comments/")) {
	window.setInterval(checkComments, 500);
}

function upvoteFrontpageSubs() {
    var voteButtons = document.getElementsByClassName("midcol unvoted");
    if(voteButtons.length > 0) {
		//for(i=0; i<voteButtons.length; i++) {
		var i = Math.floor(Math.random() * voteButtons.length);
		var nextSib = voteButtons[i].nextSibling;
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
			//console.log("sub: " + subReddit.innerText);
			//dateSubmitted.style.backgroundColor = 'purple';
			//subReddit.style.backgroundColor = 'yellow';
			// Check that the post is not too old to upvote and that the current post score is >0
			if(!dateSubmitted.innerText.match("year") && !dateSubmitted.innerText.match("months") && voteButtons[i].children[0].className == "arrow up login-required" && voteButtons[i].children[2].innerText != "0") {
				// Loop through the list of declared subs
				for(k = 0; k<Subs.length; k++) {
					//console.log("/r/" + Subs[k]);
					if(subReddit.innerText.match("/r/" + Subs[k])) {
						//alert("found match");
						voteButtons[i].children[0].click();
					}
				}
			} else {
				//voteButtons[i].className = "midcol unv";
			}
		}
		//}
	}
}

function upvoteDeclaredSubs() {
	var voteButtons = document.getElementsByClassName("midcol unvoted");
	if(voteButtons.length > 0) {
        var randomNum = Math.floor(Math.random() * voteButtons.length);
		var dateSubmitted = voteButtons[randomNum].nextSibling.children[2].children[0];
        // Check that the post is not too old to upvote and that the current post score is >0
		if(!dateSubmitted.innerText.match("year") && !dateSubmitted.innerText.match("months") && voteButtons[randomNum].children[0] && voteButtons[randomNum].children[0].className == "arrow up login-required" && voteButtons[randomNum].children[3].innerText != "0") {
			voteButtons[randomNum].children[0].click();
		} else {
			//voteButtons[randomNum].className = "midcol unv";
		}
	}
}

function checkComments() {
	var commentBox = document.getElementsByClassName("midcol unvoted");
	var randomNum = Math.floor(Math.random() * commentBox.length);
	//commentBox[randomNum].style.backgroundColor = 'blue';
	var commentPost = commentBox[randomNum].nextSibling;
	var userTag = commentPost.children[0].children[2];
	if(userTag && userTag.className == "RESUserTag" && userTag.innerText.match("upvote")) {
		commentBox[randomNum].children[0].click();
	}
}

function debug() {
	var subRedditList = document.getElementById("srList");
	subRedditList.click();
	/*
	var subCount = subRedditList.children[1].children.length;
	console.log("subcount: " + subCount);
	// List all the subbed subreddits
	for(var i=0; i<subCount; i++) {
		//console.log("subcount: " + subCount);
	}
	*/
}