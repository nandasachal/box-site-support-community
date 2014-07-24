/*global $, HelpCenter */

var BoxHelp = (function () {

  'use strict';

  var DEFAULT_LOCALE = 'en-us',
      JAPANESE_LOCALE = 'ja',
      USER_ROLE_ANONYMOUS = 'anonymous',
      PREMIERE_USER_TAG = 'premiere',
      BUSINESS_USER_TAG = 'level_business';

  var phoneNumbers = {
    'en-us': {
      'free': '1-877-729-4269',
      'business': '1-855-570-4130',
      'premier': '1-800-875-8230',
    },
    'fr': {
      'free': '1-877-729-4269',
      'business': '1-855-570-4130',
      'premier': '1-800-875-8230',
    },
    'de': {
      'free': '1-877-729-4269',
      'business': '1-855-570-4130',
      'premier': '1-800-875-8230',
    },
    'ja': {
      'free': '1-877-729-4269',
      'business': '1-855-570-4130',
      'premier': '1-800-875-8230',
    },
  };


  //--------------------------------------------------------------------------
  // Private
  //--------------------------------------------------------------------------

  function isUserLoggedIn() {
    return (HelpCenter.user.role !== USER_ROLE_ANONYMOUS);
  }

  function isFreeUser() {
    return (isUserLoggedIn() && HelpCenter.user.organizations.length === 0);
  }

  function isPremierUser() {
    if (!isFreeUser()) {
      // the "premiere" tag can be at the organization level...
      var orgTags = HelpCenter.user.organizations[0].tags;
      for (var i = 0; i < orgTags.length; i++) {
        if (orgTags[i] === PREMIERE_USER_TAG) {
          return true;
        }
      }

      // ... or at the user level
      var userTags = HelpCenter.user.tags;
      for (var i = 0; i < userTags.length; i++) {
        if (userTags[i] === PREMIERE_USER_TAG) {
          return true;
        }
      }
    }

    return false;
  }

  function isBusinessUser() {
    if (!isFreeUser()) {
      var orgName = HelpCenter.user.organizations[0].name;
      if (orgName) {
        return true;
      }

      var userTags = HelpCenter.user.tags;
      for (var i = 0; i < userTags.length; i++) {
        if (userTags[i] === BUSINESS_USER_TAG) {
          return true;
        }
      }
    }

    return false;
  }

  function showSubmitRequestLinkIfLoggedIn() {
    if (isUserLoggedIn()) {
      $('.submit-a-request.logged-out').hide();
    }
    else {
      $('.submit-a-request').hide();
      $('.submit-a-request.logged-out').show();
    }
  }

  function getCurrentLocale() {
    return HelpCenter.current_session.locale;
  }

  function hidePhoneNumberContactIfNeeded() {
    var currentLocale = getCurrentLocale();

    // Hide JP phone number for now
    if (currentLocale === JAPANESE_LOCALE) {
      $('#call_us').hide();
    }
  }

  function showChatForFreeUsersIfAgentAvailable() {
    if (isFreeUser()) {
      SnapEngage.setUserEmail(HelpCenter.user.email, true);
      SnapEngage.getAgentStatusAsync(function (isOnline)
      {
        if (isOnline) {
          $('#OhSnap').css({'float': 'right', 'padding-right': '12px'});
          $('#call_us').hide();
        }
        else {
          $('#OhSnap').hide();
        }
      });
    }
  }

  function displayLocalizedPhoneNumber() {
    // only display phone number if the user is logged in
    if (isUserLoggedIn()) {

      var localizedPhoneNumber;

      if (isPremierUser()) {
        localizedPhoneNumber = getLocalizedPhoneNumber('premier');
      }
      else if (isBusinessUser()) {
        localizedPhoneNumber = getLocalizedPhoneNumber('business');
      }
      else {
        localizedPhoneNumber = getLocalizedPhoneNumber('free');
      }

      $('#number').text(localizedPhoneNumber);
    }
  }

  function getLocalizedPhoneNumber(accountType) {
    var locale = getCurrentLocale(),
        phoneNumber;

    if (locale in phoneNumbers) {
      if (accountType in phoneNumbers[locale]) {
        phoneNumber = phoneNumbers[locale][accountType];
      }
      else {
        phoneNumber = phoneNumbers[locale].free;
      }
    }
    else {
      phoneNumber = phoneNumbers[DEFAULT_LOCALE].free;
    }

    return phoneNumber;
  }


  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------

  return {

    init: function() {
      showSubmitRequestLinkIfLoggedIn();
      hidePhoneNumberContactIfNeeded();
      showChatForFreeUsersIfAgentAvailable();
      displayLocalizedPhoneNumber();
    }

  };

})();


// Init BoxHelp on DOM ready
$(function() {
  BoxHelp.init();
});
