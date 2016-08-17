function userIsInGroup(groupId) {
  return window.location.toString().indexOf("facebook.com/groups/" + groupId) > -1;
}

var cdtGroups = [
  'HHCirqueDuTwerque',  // theonetruememegroup
  '583974418451912',	// Cirque du Tèque
  'CdTPoRusski',        // чеснок
  '1693588754259442',   // Swift
  '1009494602470511',   // Banta
  '1735685370005125',   // Ohio
  '1140775155942036',   // Gamers
  'CdTChicks',          // Chicks
  'cdtHousing',         // Housing
  '1633871026865938',   // Dumpyard
  'hhsneks',            // Sneks
  '1781290548766693',   // CdTunes
  '1337572992926694',   // CdT Music
  '502759859921045',	// Torque
  'realsingleshhct',    // Singles
  '482425228622242',    // Les Canadiens
  '2038973852994387',   // Cirque Deux Twerque
  '1010276182400796',   // Chicago
  '597901803695854',    // Headbang
  '1727016160910779',   // Michigan
  '1612723025673436',   // X86
  '791289227682248',    // Sysadmins
  '1719443741635503',   // SQUATS
  '1579614305670299',   // CdT Splinter
  '172429806482172',    // Blocked by &y
  '1121408874600723',   // Commies
  '1736701553240805',   // lambda
  '948306851915303',    // 3 C0ol 5 CdT
  '479066418951380',    // meetups
  '1756785557888301',   // Kanye (Real Yeezy Shills)
  '627486717419608',	// Real Muse shills
  '1640593699593115',   // Real Christians
  '1672687653001258',   // Real Dogs
  '1039017996185249',   // Real Ethnographers
  '849532438509900',    // Real Philosophers
  '1263057303723811',   // Real Monks
  '1196924153654960',   // Real Cats
  '1196451543722650',   // Real Grillz
  '187300784985717',    // Real Mods
  '372811302915528'     // Real Fake Couples
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
// TODO: (maybe?) instead of banner change FB top bar colour

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
            right: 0,
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
          .some(function (link) {
            var url = $(link).attr("href").replace(/\/\s*$/,'').split('/');
            return url.some(x => cdtGroups.indexOf(x) > -1);
          });

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
