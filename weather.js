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
        let temp = Math.round(object.list[offsetHour].main.temp);
        document.getElementById("temp-1").textContent = temp + "° F";

        // weather icon
        let iconPath = "assets/" + generateIconFileName(loadCurrentHour(), object.list[offsetHour].weather[0].main);
        let iconFileName = generateIconFileName(loadCurrentHour(), object.list[offsetHour].weather[0].main);
        document.getElementById("logo").src = iconPath;
        document.getElementById("logo").alt = iconFileName;

        // view 2
        offsetHour++;
        for (offsetHour; offsetHour < 6; offsetHour++) {
          // update variables on every iteration.
          let hour = loadCurrentHour() + offsetHour;
          let formattedTime = hourFormatting(hour);
          let temp = Math.round(object.list[offsetHour].main.temp);
          let iconPath = "assets/" + generateIconFileName(hour, object.list[offsetHour].weather[0].main);
          let iconFileName = generateIconFileName(hour, object.list[offsetHour].weather[0].main);

          // update view 2 HTML
          document.getElementById("icon-"+offsetHour).src = iconPath;
          document.getElementById("icon-"+offsetHour).alt = iconFileName;
          document.getElementById("tempCell-"+offsetHour).textContent = temp + "° F";
          document.getElementById("hour-"+offsetHour).textContent = formattedTime.hour + " " + formattedTime.text.toLowerCase();

          // //debug
          // console.log("view 2 hour: " + hour);
          // console.log("view 2 formatted hour: " + formattedTime.hour);
          // console.log("view 2 icon: " + iconPath);
          // console.log("view 2 temp: " + temp);
        }
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

  if (inputHour >= 24) {
    inputHour = inputHour - 24;
  }

  if ((inputHour < 6) || (inputHour == 0)) {
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

function hourFormatting(inputHour) {
  let timeHour = {
      hour: inputHour,
      text: ""
  }

  // convert 24-hour to 12-hour format
  if (timeHour.hour < 12) {
    if (timeHour.hour == 0) {
      timeHour.hour = 12; //midnight
    }
    timeHour.text = "AM";
    return timeHour;
  }

  if (timeHour.hour <= 23) {
    if (timeHour.hour != 12) {
      timeHour.hour = timeHour.hour - 12;
    }
    timeHour.text = "PM";
    return timeHour;
  }

  else { // over 24 hours
    timeHour.hour = timeHour.hour - 24;
    let recursion = hourFormatting(timeHour.hour);
    return recursion;
  }
}

// show default weather info (Davis, CA) when page is loaded.
function loadUI() {
  //receives Davis, CA from the search fill box.
  let defaultInput = document.getElementById("textfield").placeholder;
  let hour = loadCurrentHour();
  let formattedTime = hourFormatting(hour);
  // console.log(formattedTime.hour + " " + formattedTime.text); //debug
  document.getElementById("current_time").textContent = formattedTime.hour + " " + formattedTime.text;
  //make request to the server and outputs weather data to HTML.
  makeCorsRequest(defaultInput, 0);
}

//reload the page with weather info after user clicked the submit button.
function updateUI() {
  let input = document.getElementById("textfield").value;
  makeCorsRequest(input, 0);
}

document.getElementById("submit").addEventListener('click', function() {
  updateUI();
});

// swipe up vs down
function loadView1() {
  document.getElementById("view1").style.display = "flex";
  document.getElementById("view2").style.display = "none";
}

function loadView2() {
  document.getElementById("view1").style.display = "none";
  document.getElementById("view2").style.display = "flex";
}

document.getElementById("s-up").addEventListener('click', function() {
  loadView2();
});

document.getElementById("s-down").addEventListener('click', function() {
  loadView1();
});


// run this code to make request when this script file gets executed 
loadUI();
