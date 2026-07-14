(function () {
  'use strict';

  if (!document.getElementById('ZN_6gjEvJcjoHFtKJH')) {
    var container = document.createElement('div');
    container.id = 'ZN_6gjEvJcjoHFtKJH';
    container.innerHTML = '<!--DO NOT REMOVE-CONTENTS PLACED HERE-->';
    document.body.appendChild(container);
  }

  var g = function (src) {
    this.go = function () {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      if (document.body) {
        document.body.appendChild(script);
      }
    };

    this.start = function () {
      var self = this;
      if (document.readyState !== 'complete') {
        if (window.addEventListener) {
          window.addEventListener('load', function () {
            self.go();
          }, false);
        } else if (window.attachEvent) {
          window.attachEvent('onload', function () {
            self.go();
          });
        }
      } else {
        self.go();
      }
    };
  };

  try {
    (new g('https://zn6gjevjcjohftkjh-qdemo.siteintercept.qualtrics.com/SIE/?Q_ZID=ZN_6gjEvJcjoHFtKJH')).start();
  } catch (error) {
    // Qualtrics loader failed silently, matching vendor snippet behavior.
  }
})();
