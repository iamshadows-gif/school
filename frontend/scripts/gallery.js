/*
 * Gallery category filter.
 * Markup: buttons with [data-filter] inside .filter-bar, items with [data-category].
 * Buttons use aria-pressed; a live region announces how many items are shown.
 */
(function () {
  "use strict";

  var bar = document.querySelector(".filter-bar");
  var items = document.querySelectorAll("[data-gallery-item]");
  var status = document.getElementById("gallery-status");
  if (!bar || !items.length) {
    return;
  }

  var buttons = bar.querySelectorAll("[data-filter]");

  function applyFilter(category) {
    var shown = 0;
    for (var i = 0; i < items.length; i++) {
      var match = category === "all" || items[i].getAttribute("data-category") === category;
      items[i].hidden = !match;
      if (match) { shown++; }
    }

    for (var j = 0; j < buttons.length; j++) {
      var active = buttons[j].getAttribute("data-filter") === category;
      buttons[j].setAttribute("aria-pressed", active ? "true" : "false");
    }

    if (status) {
      status.textContent = "Showing " + shown + (shown === 1 ? " placeholder" : " placeholders") +
        (category === "all" ? "" : " in " + bar.querySelector('[data-filter="' + category + '"]').textContent.trim()) + ".";
    }
  }

  for (var k = 0; k < buttons.length; k++) {
    buttons[k].addEventListener("click", function (event) {
      applyFilter(event.currentTarget.getAttribute("data-filter"));
    });
  }

  applyFilter("all");
})();
