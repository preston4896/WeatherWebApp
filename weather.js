"strict mode";

// Do a CORS request to get Davis weather hourly forecast

// Create the XHR object.
function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);  // call its open method
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(city) {

   let url = "http://api.openweathermap.org/data/2.5/forecast/hourly?q="+ city +",US&units=imperial&APPID=08a320da24b2e3001b8053f20ffe32a9"

  let xhr = createCORSRequest('GET', url);

  // checking if browser does CORS
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Load some functions into response handlers.
  xhr.onload = function() {
      let responseStr = xhr.responseText;  // get the JSON string 
      let object = JSON.parse(responseStr);  // turn it into an object
      console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // Actually send request to server
  xhr.send();

  return object;
}

// show weather info when page is loaded.
function loadUI() {
    let data = makeCorsRequest("Davis, CA");
    // document.getElementById("current_time").innerHTML = data.list.w
}

// run this code to make request when this script file gets executed 
loadUI();
