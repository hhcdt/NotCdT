function userIsInGroup(groupId) {
  return window.location.toString().indexOf("facebook.com/groups/" + groupId) > -1;
}

var cdtGroups = [
  'HHCirqueDuTwerque',
  'CdTPoRusski',
  '1693588754259442', // Swift
  '1735685370005125', // Ohio
  '1756785557888301', // Kanye
  '1140775155942036', // Gamers
  'CdTChicks',
  '1196924153654960', // Cats
  'cdtHousing',
  '1633871026865938', // Dumpyard
  'hhsneks',
  '482425228622242' // Les Canadiens
];

function userFeelsAtHome() {
  // true if the user is in any of the hardcoded cdt groups
  return cdtGroups
      .map(function(groupId) {
        return userIsInGroup(groupId);
      })
      .reduce(function(inGroupLeft, inGroupRight) {
        return inGroupLeft || inGroupRight;
      })
}


// Banner at top of page

var $banner = null;

function updateBanner() {
  var $body = $('body');

  if (!userFeelsAtHome()) {
    if ($banner == null) {
      $banner = $('<div></div>')
          .text("You are OUTSIDE of CdT. This is not a drill. This is not a drill.")
          .css({
            backgroundColor: '#ffbbbb',
            color: '#444444',
            position: 'absolute',
            top: 52,
            left: 0,
            width: '100%',
            padding: 20,
            fontSize: '2em',
            textAlign: 'center'
          });
    }

    $body.append($banner);

    var isOnNewsfeed = window.location.pathname == '/';

    var paddingTop = 92;
    if (isOnNewsfeed) {
      paddingTop = 78;
    }
    $body.css({paddingTop: paddingTop});
  } else {
    if ($banner != null) {
      $banner.remove();
      $body.css({paddingTop: 0});
    }
  }
}


// Helper function to livequery for elements being added to the page.
(function (win) {
  'use strict';

  var listeners = [],
      doc = win.document,
      MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
      observer;

  function ready(selector, fn) {
    // Store the selector and callback to be monitored
    listeners.push({
      selector: selector,
      fn: fn
    });
    if (!observer) {
      // Watch for changes in the document
      observer = new MutationObserver(check);
      observer.observe(doc.documentElement, {
        childList: true,
        subtree: true
      });
    }
    // Check if the element is currently in the DOM
    check();
  }

  function check() {
    // Check the DOM for elements matching a stored selector
    for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
      listener = listeners[i];
      // Query for elements matching the specified selector
      elements = doc.querySelectorAll(listener.selector);
      for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
        element = elements[j];
        // Make sure the callback isn't invoked with the
        // same element more than once
        if (!element.ready) {
          element.ready = true;
          // Invoke the callback with the element
          listener.fn.call(element, element);
        }
      }
    }
  }

  // Expose `ready`
  win.ready = ready;

})(window);

function process(element) {
  updateBanner();

  var elementIsOnCdT = $(element)
          .find('a')
          .toArray()
          .map(function (link) {
            return $(link).text();
          })
          .indexOf('Cirque du Twerque') > -1;

  if (!userFeelsAtHome() && !elementIsOnCdT) {
    var css = {backgroundColor: '#ffeeee'};

    $(element).css(css);
    $(element).find('form div').css(css);
    $(element).find('form span').css(css);

    // Trying to update placeholder on comment boxes.
    //console.log($(element).find('.UFIAddCommentInput div'));
    //$(element).find('.UFIAddCommentInput div').each(function(div) {
    //  console.log($(div).text());
    //  if ($(div).text().indexOf('Write a comment') == 0) {
    //    $(div).text('Write a comment (WARNING: This is outside of CdT.');
    //  }
    //});
  }
}

// Listeners
ready('.userContentWrapper', function (element) {
  process(element);
});

// Trying to update placeholder on comment boxes.
//ready('.UFIAddCommentInput', function(element) {
//  var commentWrapper = $(this).closest('.userContentWrapper');
//  process(commentWrapper);
//});

ready('#contentArea', updateBanner);
