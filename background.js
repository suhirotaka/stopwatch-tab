var tabTimers = {};

var TabTimer = function(tab) {
  var timerId;
  var tabId = tab.id;
  this.present = 0;
  this.hasStarted = false;
  this.isInitialState = true;
  //this.originalTitle = tab.title;
  this.showHours = false;
  this.show = function() {
    var s = this.present % 60,
        m = Math.min(99, Math.floor(this.present / 60) % 60);
        //m = Math.floor(this.present / 60) % 60,
        h = Math.min(99, Math.floor(this.present / 60/ 60));
    s = ("0" + s).slice(-2);
    m = ("0" + m).slice(-2);
    h = ("0" + h).slice(-2);
    try {
      //if (!tab.url.match(/^https?:\/\//)) throw 'Invalid schema.';
      //chrome.tabs.executeScript(tabId, {code:'document.title = "' + [m, s].join(':') + ' | ' +  this.originalTitle + '";'});
      var clockVals = this.showHours ? [h, m, s] : [m, s]
      var test = chrome.tabs.executeScript(tabId, {code:'document.title = "' + clockVals.join(':') +  '";'});
    }catch (e) {
    }
  };
  this.start = function() {
    this.hasStarted = true;
    this.isInitialState = false;
    chrome.storage.sync.get('showHours', function(response) {
      var showHours = (response.showHours == 1) ? true : false;
      tabTimers[tab.id].showHours = showHours;
      tabTimers[tab.id].show();
    });
    timerId = setInterval(function() { // Fix me: global scope in setInterval
      tabTimers[tab.id].present += 1;
      tabTimers[tab.id].show();
    }, 1000);
  };
  this.stop = function() {
    this.hasStarted = false;
    clearInterval(timerId);
  };
  this.reset = function() {
    this.stop();
    chrome.tabs.executeScript(tabId, {code:'document.title = "' + '00:00' +  '";'});
  };
};

var TimerManager = function(tab) {
  var currTimer;
  var tabId = tab.id;
  if (typeof tabTimers[tabId] == 'undefined') tabTimers[tabId] = new TabTimer(tab);
  currTimer = tabTimers[tabId]; 
  this.start = function() {
    currTimer.start();
    chrome.browserAction.setBadgeText({text: 'Stop', tabId: tabId});
  };
  this.stop = function() {
    currTimer.stop();
    chrome.browserAction.setBadgeText({text: '', tabId: tabId});
  };
  this.reset = function() {
    currTimer.reset();
    delete(tabTimers[tabId]);
    chrome.browserAction.setBadgeText({text: '', tabId: tabId});
  };
  this.hasStarted = function() {
    return currTimer.hasStarted;
  };
  this.isInitialState = function() {
    return currTimer.isInitialState;
  };
};

chrome.tabs.onRemoved.addListener(function(tabId) {
  if (typeof tabTimers[tabId] != 'undefined') {
    tabTimers[tabId].stop();
    delete(tabTimers[tabId]);
  }
});
/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  tabTimers[tab.id].originalTitle = tab.title;
});
*/
