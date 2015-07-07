// ==UserScript==
// @name       Reddit Upvoter
// @author     T. Knight
// @version    2
// @description  Upvotes Reddit posts made in a defined list of subreddits for purposes of increasing post visibility in smaller subs
// @include      /https?://www\.reddit\.com*/
// @exclude     https?://www.reddit.com/r/*/comments*
// ==/UserScript==

//var vUpvote = document.getElementsByClassName("arrow upmod login-required");
//alert(vUpvote.length);

var Subs = ["cscareerquestions", "tasker", "personalfinance", "Ubuntu"];

if (window.location.href.match(/https?:\/\/www\.reddit\.com\/?$/)
{
    window.setInterval(function () {
        var vAll = document.getElementsByTagName("*");
        for(i=0; i<vAll.length; i++) {
            if(vAll[i].className == "arrow up login-required") {
                for(j=14; j<25; j++) {
                    if(vAll[i+j].className == "subreddit hover may-blank") {
                        //vAll[i+j].style.backgroundColor = "yellow";
                        for(k=0; k<Subs.length; k++) {
                            if(vAll[i+j].textContent == "/r/" + Subs[k]) {
                                vAll[i].click();
                                break;
                            }
                        }
                    }
                }
            }
        }
    }, 10000);
}
else if(window.location.href.match(/www\.reddit\.com\/r\/[a-zA-Z]+(#page=[0-9]+)?/)) {
    for(i=0; i<Subs.length; i++) {
        if(window.location.href.match(/www.reddit.com\/r\// + Subs[i] + /\/?/)) {
            console.log("Match!");
            window.setInterval(function() {
                var vAll = document.getElementsByTagName("*");
                for(j=0; j<vAll.length; j++) {
                    if(vAll[j].className == "arrow up login-required") {
                        vAll[j].click();
                        break;
                    }
                }
            }, 2000);
        }
    }
}
/*else if(window.location.href.match("/comments/")) {
    var vSub = document.getElementsByClassName("hover")[0].textContent.toLowerCase();
    for(a=0; a<Subs.length; a++) {
        if(Subs[a] == vSub) {
            var vUpvotes = document.getElementsByClassName("arrow up login-required");
            var n, i = vUpvotes.length;
            while(n = vUpvotes[--i]) {
                if(n.className == "arrow up login-required") {
                    n.click();
                }
            }
        }
    }
}*/