document.getElementById('desc-show-hours').innerText = chrome.i18n.getMessage('showHours');

var cbshowHours = document.getElementById('cb-show-hours')
chrome.storage.sync.get('showHours', function(response) {
  cbshowHours.checked = (response.showHours == 1) ? true : false;
});
cbshowHours.addEventListener('change', function() {
  var showHours = this.checked ? 1 : 0;
  chrome.storage.sync.set({ showHours: showHours }, function(response) {
  });
});
