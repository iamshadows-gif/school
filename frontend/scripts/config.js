/*
 * Hello Kidz School — site configuration.
 *
 * This is the ONLY place to edit school details and the future API address.
 * Leave a value as an empty string ("") until the real information is confirmed:
 * the site then shows a clearly marked placeholder instead of a fake contact detail.
 *
 * Never put secrets, passwords, API keys or tokens in this file. Anything in
 * frontend JavaScript is visible to every visitor.
 */
window.HK_CONFIG = {
  schoolName: "Hello Kidz School",

  // Public contact details. Fill these in when confirmed by the school.
  // Example: phone: "+91 98765 43210", email: "office@example.org"
  contact: {
    phone: "",
    email: "",
    address: "",
    openingHours: ""
  },

  // Future FastAPI backend. Do NOT fill these in until the endpoint exists
  // and has been tested. While enquiryEndpoint is empty, forms run in demo mode
  // and nothing is sent anywhere.
  //   baseUrl example:         "https://api.your-school.example"
  //   enquiryEndpoint example: "/api/public/enquiries"
  api: {
    baseUrl: "",
    enquiryEndpoint: ""
  }
};
