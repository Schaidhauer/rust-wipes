var warningId = 'notification.warning';

function hideWarning(done) {
  chrome.notifications.clear(warningId, function() {
    if (done) done();
  });
}

function showWarning(title,subtitle,txt) {
  hideWarning(function() {
    chrome.notifications.create(warningId, {
      iconUrl: chrome.runtime.getURL('images/icon-48.png'),
      title: title,
      type: 'basic',
      message: subtitle+' \n'+txt,
      buttons: [{ title: 'More' }],
      isClickable: true,
      priority: 2,
    }, function() {});
  });
}

function openWarningPage() {
  chrome.tabs.create({
    url: 'https://www.battlemetrics.com/servers/search?dir=desc&game=rust&page=1&sort=details.rust_last_wipe'
  });
}


function interval(func, wait, times){
    var interv = function(w, t){
        return function(){
            //if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            //}
        };
    }(wait, times);

    setTimeout(interv, wait);
};

var totalCommits = 0;

function go(){

	
	
	getCommits();
	
	interval(function(){
		
		getCommits();
	}, 30000, 9999);

}


function getCommits() {
	
        console.log("getWipes");
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://www.battlemetrics.com/servers/search?dir=desc&game=rust&page=1&sort=details.rust_last_wipe', true);
		
		xhr.onload = function(e) {
			//for debug/test
			//totalCommits = totalCommits -1;
			
			var tempDom = $('<output>').append($.parseHTML(this.response));
			var allCommits = $('.server', tempDom);
			if (totalCommits < allCommits.length){
				//update totalCommits for the new value
				totalCommits = allCommits.length;

				//get last commit
				var lastCommitHTML = allCommits[0].innerHTML;
				var tempDom2 = $('<lastout>').append($.parseHTML(lastCommitHTML));
				
				var srv_Name = $('.server-name', tempDom2);
				var srv_Wipe = $('.server-wipe', tempDom2);
				var srv_LocationTmp = $('.server-location', tempDom2);
				var srv_Location = $('img', srv_LocationTmp);
				
				//console.log(srv_LocationTmp);
				console.log(srv_Location);
				
				var srvName = srv_Name[0].innerText.toString();
				var srvWipe = srv_Wipe[0].innerText.toString();
				var srvLocation = srv_Location[0].attributes[3].nodeValue;
				
				console.log(srvLocation);
				
				showWarning(srvName,srvWipe,srvLocation);
				
			}else{
				//no new commits
			}
			
		};
		
		xhr.send();

	
	
}

//chrome.browserAction.setBadgeBackgroundColor({ color: '#FF0000' });
//chrome.browserAction.setBadgeText({ text: '!' });
chrome.browserAction.onClicked.addListener(openWarningPage);
chrome.notifications.onClicked.addListener(openWarningPage);
chrome.notifications.onButtonClicked.addListener(openWarningPage);

//chrome.notifications.create("getCommits", {periodInMinutes:1});

chrome.runtime.onInstalled.addListener(go);
//chrome.runtime.onInstalled.addListener(showWarning);


