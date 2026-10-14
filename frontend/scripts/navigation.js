/*
 * Mobile navigation: hamburger button open/close, aria-expanded sync,
 * Escape key, outside click, and closing after a link is chosen.
 * Markup expected: .site-header containing .nav-toggle and #primary-nav.
 */
(function () {
  "use strict";

  // Enable the collapsed-menu styles (they only apply when JS is running).
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  var MOBILE_QUERY = window.matchMedia("(max-width: 1079.98px)");

  function setupHeader(header) {
    var toggle = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".primary-nav");
    if (!toggle || !nav) {
      return;
    }

    var label = toggle.querySelector(".nav-toggle__label");

    function isOpen() {
      return header.classList.contains("is-open");
    }

    function setOpen(open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (label) {
        label.textContent = open ? "Close menu" : "Menu";
      }
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen());
      if (isOpen()) {
        var firstLink = nav.querySelector("a");
        if (firstLink) {
          firstLink.focus();
        }
      }
    });

    // Close after choosing a link (the page is about to change or scroll).
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        setOpen(false);
      }
    });

    // Escape closes the menu and returns focus to the toggle.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen()) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Tapping outside the header closes the menu.
    document.addEventListener("click", function (event) {
      if (isOpen() && !header.contains(event.target)) {
        setOpen(false);
      }
    });

    // Reset state when the window grows to desktop width.
    function handleBreakpoint() {
      if (!MOBILE_QUERY.matches && isOpen()) {
        setOpen(false);
      }
    }
    if (MOBILE_QUERY.addEventListener) {
      MOBILE_QUERY.addEventListener("change", handleBreakpoint);
    } else {
      MOBILE_QUERY.addListener(handleBreakpoint);
    }

    setOpen(false);
  }

  var headers = document.querySelectorAll(".site-header");
  for (var i = 0; i < headers.length; i++) {
    setupHeader(headers[i]);
  }
})();
