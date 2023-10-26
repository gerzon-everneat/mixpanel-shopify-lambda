// Set the values for diff and min
const diff = 500000; // Modulus divisor
const min = 999990; // Value to add

// Get the current time in seconds since the Unix epoch
const currentTimeInSeconds = Math.floor(Date.now() / 1000);

// Check if the customMixpanelDistinctId is already stored in local storage
var customMixpanelDistinctId = localStorage.getItem("customMixpanelDistinctId");
class Mixpanel {
  constructor(distinct_id) {
    this.distinct_id = distinct_id;
    this.header = {
      "Content-Type": "application/json",
      // Add any other headers if needed
    };
    this.url =
      "https://moaa7kb3umstqq5s47wg6qcm5u0gstdb.lambda-url.us-east-1.on.aws/";
  }
  send(jsonData) {
    fetch(this.url, {
      method: "POST",
      headers: this.headers,
      body: jsonData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON response
      })
      .then((data) => {
        console.log("POST request was successful:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  track(event_name, properties) {
    console.log("Lambda tracking ", event_name, properties);
    if (properties === undefined) {
      properties = {};
    }
    const data = {
      event_name: event_name,
      distinct_id: this.distinct_id,
      properties,
    };
    const jsonData = JSON.stringify(data);
    this.send(jsonData);
  }
}

function extractLiquidVariable(value) {
  return value;
}

// If it doesn't exist, generate and store a new identifier
if (
  customMixpanelDistinctId === null ||
  customMixpanelDistinctId.length === 0 ||
  customMixpanelDistinctId === undefined
) {
  // Calculate the customMixpanelDistinctId
  customMixpanelDistinctId =
    ((currentTimeInSeconds % diff) + min).toString() + "@mixpanel.com";
  localStorage.setItem("customMixpanelDistinctId", customMixpanelDistinctId);
  // mixpanel.identify(customMixpanelDistinctId);
  // Create the fetch request with the URL, method, headers, and body
  fetch(url, {
    method: "POST",
    headers: headers,
    body: jsonData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // Parse the JSON response
    })
    .then((data) => {
      console.log("POST request was successful:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} else {
  //  // If the user is already identified, check if they are logged in
  //  // Assuming you have a condition that checks if the user is logged in, and you have their new distinct ID
  //  const loggedInDistinctID = extractLiquidVariable({{customer.email | json}}); // Replace with the actual logged-in distinct ID
  // // Check if the user exists in Mixpanel
  //  if (mixpanel.get_distinct_id() === loggedInDistinctID) {
  //    // User exists in Mixpanel, so you can access their profile properties
  //    const userProfile = mixpanel.people.get(distinctID);
  //    console.log("User Profile:", userProfile);
  //  } else {
  //    console.log("User not found in Mixpanel.");
  //  }
  //  // Alias the anonymous user to the logged-in user if needed
  //      mixpanel.alias(loggedInDistinctID, customMixpanelDistinctId);
}

const mixpanel = new Mixpanel(customMixpanelDistinctId);

mixpanel.track("Loaded a page", {
  lambda: true,
  page: window.location.pathname,
});
