"strict mode";

// Do a CORS request to get Davis weather hourly forecast

// Create the XHR object.
function createCORSRequest(method, url) {
  let xhr = new XMLHttpRequest();
  xhr.open(method, url, true);  // call its open method
  return xhr;
}

// Make the actual CORS request.
function makeCorsRequest(city, offsetHour) {

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
      // console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted

      //API Message
      let message = object.message;
      if (message == "city not found") {
        document.getElementById("errorMessage").style.display = "block";
      }
      else {
        //modify HTML output here.
        document.getElementById("errorMessage").style.display = "none";

        // temp
        document.getElementById("temp-1").textContent = Math.round(object.list[offsetHour].main.temp) + "° F";

        // weather icon
        document.getElementById("logo").src = "assets/" + generateIconFileName(loadCurrentHour() + offsetHour, object.list[offsetHour].weather[0].main);
        document.getElementById("logo").alt = generateIconFileName(loadCurrentHour() + offsetHour, object.list[offsetHour].weather[0].main);
      }
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  // Actually send request to server
  xhr.send();
}

// generate icon file name
function generateIconFileName(inputHour, inputDescription) {
  // assume sun rises at 6am; sets at 6pm.
  let dayNight = "";
  if (inputHour < 6) {
    dayNight = "-night";
  }

  else if ((inputHour >= 6) && (inputHour < 18)) {
    dayNight = "-day"
  }

  else if ((inputHour >= 18) && (inputHour <= 23)) {
    dayNight = "-night";
  }

  switch (inputDescription) {
    case "Clouds":
      return "fewclouds"+dayNight+".svg";
      break;
    case "Clear":
      return "clear"+dayNight+".svg";
      break;
    case "Rain":
      return "rain" +dayNight+".svg";
      break;
    case "Snow":
      return "snow.svg";
      break;
    case "Thunderstorm":
      return "thunderstorm.svg";
      break;
  }
}


function loadCurrentHour() {
  //load current hour
  let today = new Date();
  let hour = today.getHours();
  return hour;
}

// show default weather info (Davis, CA) when page is loaded.
function loadUI() {
  //receives Davis, CA from the search fill box.
  let defaultInput = document.getElementById("textfield").placeholder;

  let hour = loadCurrentHour();

  // convert 24-hour to 12-hour format
  if (hour < 12) {
    if (hour == 0) {
      hour = 12; //midnight
    }
    document.getElementById("current_time").textContent = hour + " AM";
  }
  else {
    hour = hour - 12;
    document.getElementById("current_time").textContent = hour + " PM";
  }

  //make request to the server and outputs weather data to HTML.
  makeCorsRequest(defaultInput, 0);
}

//reload the page with weather info after user clicked the submit button.
document.getElementById("submit").addEventListener('click', function() {
  updateUI();
});
function updateUI() {
  let input = document.getElementById("textfield").value;
  makeCorsRequest(input, 0);
}

// run this code to make request when this script file gets executed 
loadUI();
