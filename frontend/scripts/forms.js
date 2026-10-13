/*
 * Enquiry forms: client-side validation, accessible messages, and submission.
 *
 * IMPORTANT
 * - Browser validation is for user convenience only. The backend must validate
 *   every field again before storing anything.
 * - While HK_CONFIG.api.enquiryEndpoint is empty, forms run in DEMO MODE:
 *   nothing is sent, stored or delivered, and the success message says so.
 * - To connect a real backend later, see sendEnquiry() below and frontend/README.md.
 */
(function () {
  "use strict";

  var NAME_PATTERN = /^[\p{L}][\p{L}\p{M} .'\-]{1,79}$/u;
  var PHONE_PATTERN = /^\+?\d{10,13}$/;      // checked after spaces, dashes and brackets are removed
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var MESSAGE_MAX = 1000;
  var REQUEST_TIMEOUT_MS = 15000;

  function config() {
    return window.HK_CONFIG || { contact: {}, api: {} };
  }

  /* ---------- Validation rules ---------- */

  // Returns an error message string, or "" when the value is acceptable.
  function validateField(field) {
    var value = field.value.trim();
    var rule = field.getAttribute("data-rule");

    if (field.hasAttribute("required") && value === "") {
      return field.getAttribute("data-error-required") || "This field is required.";
    }
    if (value === "") {
      return ""; // optional and empty
    }

    if (rule === "name" && !NAME_PATTERN.test(value)) {
      return field.getAttribute("data-error-name") || "Please enter a valid name (letters only, 2 to 80 characters).";
    }
    if (rule === "phone") {
      var digits = value.replace(/[\s\-()]/g, "");
      if (!PHONE_PATTERN.test(digits)) {
        return "Please enter a valid contact number with 10 to 13 digits. Spaces and dashes are fine.";
      }
    }
    if (rule === "email" && !EMAIL_PATTERN.test(value)) {
      return "Please enter a valid email address, for example name@example.com.";
    }
    if (rule === "message" && value.length > MESSAGE_MAX) {
      return "Please keep your message to " + MESSAGE_MAX + " characters or fewer.";
    }
    return "";
  }

  /* ---------- Error display ---------- */

  function errorElementFor(field) {
    return document.getElementById(field.id + "-error");
  }

  function showFieldError(field, message) {
    var errorEl = errorElementFor(field);
    if (message) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
    if (errorEl) {
      errorEl.textContent = message; // textContent only, never innerHTML
    }
  }

  function setStatus(statusEl, type, message) {
    statusEl.className = "form-status form-status--" + type;
    statusEl.textContent = message;
  }

  /* ---------- Submission ---------- */

  function isApiConfigured() {
    var api = config().api || {};
    return Boolean(api.baseUrl && api.enquiryEndpoint);
  }

  // Sends the enquiry. Resolves with a result object; never assumes success
  // unless the backend answers with a 2xx status.
  function sendEnquiry(payload) {
    if (!isApiConfigured()) {
      // Demo mode: nothing is sent or stored.
      return Promise.resolve({ mode: "demo" });
    }

    // Future integration point (not active until the endpoint exists and is tested).
    var url = config().api.baseUrl.replace(/\/+$/, "") + config().api.enquiryEndpoint;
    var controller = typeof AbortController === "function" ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;

    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (timer) { clearTimeout(timer); }
      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }
      return { mode: "api" };
    }, function (error) {
      if (timer) { clearTimeout(timer); }
      throw error;
    });
  }

  function demoMessage() {
    var contact = config().contact || {};
    var contactPart = "";
    if (contact.phone || contact.email) {
      contactPart = " To enquire now, please contact the school";
      contactPart += contact.phone ? " on " + contact.phone : "";
      contactPart += contact.email ? " or at " + contact.email : "";
      contactPart += ".";
    } else {
      contactPart = " Contact details will be shown here once the school confirms them.";
    }
    return "Demo form: your details have NOT been sent or saved. This website is not yet connected to a school system." + contactPart;
  }

  /* ---------- Form wiring ---------- */

  function collectPayload(form) {
    var payload = { form: form.getAttribute("data-form-name") || "enquiry" };
    var fields = form.querySelectorAll("input, select, textarea");
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      if (!f.name || f.disabled) { continue; }
      payload[f.name] = f.value.trim();
    }
    return payload;
  }

  function setupForm(form) {
    var statusEl = form.querySelector(".form-status");
    var submitButton = form.querySelector('button[type="submit"]');
    var fields = form.querySelectorAll("input[id], select[id], textarea[id]");
    var submitted = false;

    // Live feedback: validate on leaving a field, and again while typing once an error is shown.
    for (var i = 0; i < fields.length; i++) {
      (function (field) {
        field.addEventListener("blur", function () {
          if (field.value.trim() !== "" || submitted) {
            showFieldError(field, validateField(field));
          }
        });
        field.addEventListener("input", function () {
          if (field.getAttribute("aria-invalid") === "true") {
            showFieldError(field, validateField(field));
          }
        });
      })(fields[i]);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      submitted = true;

      var firstInvalid = null;
      var errorCount = 0;
      for (var j = 0; j < fields.length; j++) {
        var message = validateField(fields[j]);
        showFieldError(fields[j], message);
        if (message) {
          errorCount++;
          if (!firstInvalid) { firstInvalid = fields[j]; }
        }
      }

      if (errorCount > 0) {
        setStatus(statusEl, "error",
          errorCount === 1
            ? "Please correct the highlighted field before sending."
            : "Please correct the " + errorCount + " highlighted fields before sending.");
        firstInvalid.focus();
        return;
      }

      var payload = collectPayload(form);
      var originalLabel = submitButton ? submitButton.textContent : "";
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Please wait…";
      }
      setStatus(statusEl, "info", "Checking your enquiry…");

      sendEnquiry(payload).then(function (result) {
        if (result.mode === "demo") {
          setStatus(statusEl, "info", demoMessage());
        } else {
          setStatus(statusEl, "success", "Thank you. Your enquiry has been submitted. The school will contact you using the details you provided.");
        }
        form.reset();
        submitted = false;
        for (var k = 0; k < fields.length; k++) {
          showFieldError(fields[k], "");
        }
      }, function () {
        setStatus(statusEl, "error",
          "Sorry, your enquiry could not be submitted right now. Please try again later or contact the school directly. Your entries are still on this page.");
      }).then(function () {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalLabel;
        }
      });
    });
  }

  var forms = document.querySelectorAll("form[data-enquiry-form]");
  for (var n = 0; n < forms.length; n++) {
    setupForm(forms[n]);
  }
})();
