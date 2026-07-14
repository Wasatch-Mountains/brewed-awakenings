(function (window) {
  'use strict';

  var dataLayer = window.dataLayer = window.dataLayer || [];
  var TRACKED_EVENTS = {
    page_view: true,
    quiz_step_change: true,
    subscription_complete: true
  };

  function send(eventName, payload) {
    var event = Object.assign({ event: eventName, source: 'tag-manager' }, payload);
    console.log('[TagManager] ' + eventName, event);
  }

  send('page_view', {
    page_title: document.title,
    page_path: window.location.pathname
  });

  var originalPush = dataLayer.push;
  dataLayer.push = function () {
    var result = originalPush.apply(dataLayer, arguments);

    for (var i = 0; i < arguments.length; i++) {
      var eventData = arguments[i];
      if (eventData && TRACKED_EVENTS[eventData.event]) {
        send(eventData.event, eventData);
      }
    }

    return result;
  };

  dataLayer.forEach(function (eventData) {
    if (eventData && TRACKED_EVENTS[eventData.event]) {
      send(eventData.event, eventData);
    }
  });
})(window);
