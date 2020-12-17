

var wether_api = "https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/9e411566d6fc4b4fa39a10ddca219d30/";
var location_api = "https://api.opencagedata.com/geocode/v1/json?key=93436822ece84058b8bcedfab7954719&q=";
var temperature,summary, icon;


$(document).ready(function(){
   
  $('#citylist').hide();

  $('#citySearch').keypress(function (e) {
     var key = e.which;
     var citySearch = $("#citySearch").val();
     if(key == 13)  
      {
         $.getJSON(location_api+ citySearch, function(data){
             $('#citylist').show();
             for(let i = 0; i < data.results.length; i++) {
                let newElement = document.createElement("li");
                newElement.innerHTML = data.results[i].formatted;
                newElement.classList.add("city");
                newElement.id = i;
                document.getElementById("citylist").appendChild(newElement);
             }
            
             $('.city').click(function (e) {
                $('#citylist').hide();
                getAddress(data.results[e.currentTarget.id].geometry.lat , data.results[e.currentTarget.id].geometry.lng);
                getWeatherData(data.results[e.currentTarget.id].geometry.lat, data.results[e.currentTarget.id].geometry.lng);
                $('.city').remove();
             });

        
      });
      }
    });
  
  
  
  clock();
  $("#app").hide();
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      
      getAddress(lat , long);
      getWeatherData(lat, long);
    
    });
  }
});


function getAddress(lat, long) {
  
   $.getJSON(location_api+ lat +","+long, function(data){
         var city = data.results[0].components.city || data.results[0].components.town;
         var state = data.results[0].components.state;

         console.log(data);


      
        $("#city").html(city);
        $("#state").html(state);
      });
}


function getWeatherData(lat, long) {
      $.getJSON(wether_api+ lat +","+long, function(data){
        $("#loading").hide();
        $("#app").show();
        temperature = Math.round(data.currently.temperature);
        summary = data.currently.summary;
        icon = data.currently.icon;
        $("#temperature").html(temperature);
        $("#summary").html(summary);
        var skycons = new Skycons({"color": "white"});
        skycons.add("today-icon", icon);
         
        for(var i = 1; i<= 6; i++){
          var timestamp = data.daily.data[i].time;
          var temperatureMax =  Math.round(data.daily.data[i].temperatureMax);
          var temperatureMin =  Math.round(data.daily.data[i].temperatureMin);
          icon = data.daily.data[i].icon;
          var day_name = getDay(timestamp);
          var day_reference = "#day_"+i;
          var day_temp_high_reference = "#day-temp_" + i+ "_h";
          var day_temp_low_reference = "#day-temp_" + i+ "_l";
          var icon_reference = "icon_"+i;
          $(day_reference).html(day_name);
          $(day_temp_high_reference).html(temperatureMax);
          $(day_temp_low_reference).html(temperatureMin);
          skycons.add(icon_reference, icon);
          skycons.play();
        }
       
      });
}


function getDay(timestamp){
  timestamp *= 1000;
  var date = new Date(timestamp);
  var day = date.getDay();
  switch(day){
    case 0:
      return "SUN";
      break;
    case 1:
      return "MON";
      break;
    case 2:
      return "TUE";
      break;
    case 3:
      return "WED";
      break;
    case 4:
      return "THU";
      break;
    case 5:
      return "FRI";
      break;
    default:
      return "SAT";
      break;
  }
}

function clock(){
  var date = new Date();
  var today = date.toDateString();
  $("#time").html(today);
}

function showTime(){
    var date = new Date();
    var h = date.getHours(); // 0 - 23
    var m = date.getMinutes(); // 0 - 59
    var s = date.getSeconds(); // 0 - 59
    var session = "AM";
    
    if(h == 0){
        h = 12;
    }
    
    if(h > 12){
        h = h - 12;
        session = "PM";
    }
    
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;
    
    var time = h + ":" + m + ":" + s + " " + session;
    document.getElementById("MyClockDisplay").innerText = time;
    document.getElementById("MyClockDisplay").textContent = time;
    
    setTimeout(showTime, 1000);
    
}

showTime();