/*
 * Shared site behaviour:
 * - current year in the footer
 * - contact details: shows real values from config.js, otherwise a visible placeholder
 * - hides the logo gracefully if the image file is missing
 */
(function () {
  "use strict";

  var config = window.HK_CONFIG || { contact: {} };
  var contact = config.contact || {};

  /* Footer year */
  var yearEl = document.getElementById("current-year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /*
   * Contact hydration.
   * Elements such as <span data-contact="phone">[Phone number to be added]</span>
   * become a tel:/mailto: link only when the value is set in config.js.
   * Links are created with DOM methods (no innerHTML).
   */
  var hydrators = {
    phone: function (value) {
      var link = document.createElement("a");
      link.href = "tel:" + value.replace(/[\s()-]/g, "");
      link.textContent = value;
      return link;
    },
    email: function (value) {
      var link = document.createElement("a");
      link.href = "mailto:" + value;
      link.textContent = value;
      return link;
    },
    address: function (value) {
      var span = document.createElement("span");
      span.textContent = value;
      return span;
    },
    openingHours: function (value) {
      var span = document.createElement("span");
      span.textContent = value;
      return span;
    }
  };

  var contactEls = document.querySelectorAll("[data-contact]");
  for (var i = 0; i < contactEls.length; i++) {
    var el = contactEls[i];
    var key = el.getAttribute("data-contact");
    var value = contact[key];
    if (value && hydrators[key]) {
      el.textContent = "";
      el.appendChild(hydrators[key](value));
      el.classList.remove("todo");
    }
  }

  /* Logo: hide the broken-image icon if the file is not yet in images/ */
  var logos = document.querySelectorAll("img[data-logo]");
  function hideLogo(img) {
    img.hidden = true;
  }
  for (var j = 0; j < logos.length; j++) {
    (function (img) {
      img.addEventListener("error", function () { hideLogo(img); });
      if (img.complete && img.naturalWidth === 0) {
        hideLogo(img);
      }
    })(logos[j]);
  }
})();
