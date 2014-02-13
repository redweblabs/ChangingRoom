var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var filter = require("sdk/page-mod");

var tabs = require("sdk/tabs");

var keyword = "men",
	icon = data.url('icon_male.png');

var ss = require("sdk/simple-storage");
	ss.storage.sites = [];

var workers = [];

filter.PageMod({
	include: "*",
	contentScriptFile : [data.url("bounce.js"), data.url("levenshtein.js")],
	onAttach: function(worker) {
	    worker.port.emit("message", JSON.stringify([keyword, JSON.stringify(ss.storage.sites)]));
	    workers.push(worker);
	}

});

var settingsPanel = require("sdk/panel").Panel({
	width: 220,
	height: 125,
	contentURL : data.url('index.html'),
	include: "*",
    contentScriptFile: data.url('panel.js')
});

settingsPanel.port.on('sexchange', function(sex) {

    keyword = sex;
    if(keyword == "men"){
    	widget.contentURL = icon = data.url('icon_male.png');
    } else if(keyword == "women"){	
    	widget.contentURL = icon = data.url('icon_female.png');;
    }

    for(var w = 0; w < workers.length; w += 1){

    	workers[w].port.emit('sexchange', keyword);

    }

});

tabs.on('open', function(tab){

	var currentURL = tab.url;

	tab.on('ready', function(tab){
		console.log(tab.url);

		if(tab.url !== "about:newtab"){
			ss.storage.sites.push(tab.url);	
		}
		
		currentURL = tab.url;
		settingsPanel.hide();
	});

	tab.on('close', function(tab){
		console.log("PEAR");
		console.log(currentURL);
		for(var x = 0; x < ss.storage.sites.length; x += 1){

			var thisSite = ss.storage.sites[x].split('/');
			if(currentURL.indexOf(thisSite[2]) > -1){
				ss.storage.sites.splice(x, 1);
				x -= 1;
			}

		}
		settingsPanel.hide();
		console.log(ss.storage.sites);

	});

});

var widget = widgets.Widget({
	id: "changing-rooms",
	label: "Show preferences for Changing Rooms",
	contentURL: icon,
	contentScriptWhen : "ready",
	onClick: function() {
		settingsPanel.show();
	}
});