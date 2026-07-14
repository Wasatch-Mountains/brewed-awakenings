(function (window, document) {
  'use strict';

  var dataLayer = window.dataLayer = window.dataLayer || [];

  var tags = [
    {
      id: 'ba-site-tracking',
      trigger: 'gtm.js',
      src: 'snippets/site-tracking.js'
    },
    {
      id: 'qualtrics-website-feedback',
      trigger: 'gtm.js',
      src: 'snippets/qualtrics-feedback.js'
    }
  ];

  var firedTags = {};

  function runTag(tag) {
    if (firedTags[tag.id]) {
      return;
    }
    firedTags[tag.id] = true;

    if (tag.src) {
      var script = document.createElement('script');
      script.async = true;
      script.src = tag.src;
      script.setAttribute('data-tag-id', tag.id);
      document.head.appendChild(script);
    }
  }

  function processEvent(eventData) {
    if (!eventData || !eventData.event) {
      return;
    }

    tags.forEach(function (tag) {
      if (eventData.event === tag.trigger) {
        runTag(tag);
      }
    });
  }

  dataLayer.forEach(processEvent);

  var originalPush = dataLayer.push;
  dataLayer.push = function () {
    var result = originalPush.apply(dataLayer, arguments);
    for (var i = 0; i < arguments.length; i++) {
      processEvent(arguments[i]);
    }
    return result;
  };
})(window, document);
