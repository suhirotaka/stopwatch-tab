window.onload = function() {
  var bg = chrome.extension.getBackgroundPage(),
      actCont,
      actReset,
      actWrapper,
      alertStart,
      alertStop,
      timerManager;
  chrome.tabs.getSelected(null, function(tab) {
    if (!tab.url.match(/^https?:\/\//)) {
      window.close();
      return false;
    }
    timerManager = new bg.TimerManager(tab);
    if (timerManager.hasStarted()) {
      alertStop = document.getElementById('alert-stop');
      alertStop.style.display = '';
      timerManager.stop();
      setTimeout(function() {
        window.close(); 
      }, 1500);
    }else if (timerManager.isInitialState()) {
      alertStart = document.getElementById('alert-start');
      alertStart.style.display = '';
      timerManager.start();
      setTimeout(function() {
        window.close(); 
      }, 1500);
    }else {
      actCont = document.getElementById('action-continue');
      actReset = document.getElementById('action-reset');
      actWrapper = document.getElementById('action-wrapper');
      actWrapper.style.display = '';
      actCont.addEventListener('click', function() {
        timerManager.start();
        window.close();
      });
      actReset.addEventListener('click', function() {
        timerManager.reset();
        window.close();
      });
    }
  });
};
