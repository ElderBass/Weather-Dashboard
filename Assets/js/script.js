

//note that the above is just for the city of Bujumbura, so we'll need to link it to user searches and the current city
//console.log(navigator)//.getCurrentPosition(coords.latitude));
//Use this ajax to grab the entire weather app object so we can navigate through it down below

/*
function citySearch (position) {
  console.log('hello there');
  //var userSearch = $('#searchInput').val()
  //var latlon = position.coords.latitude + "," + position.coords.longitude;
  var img_url = "https://maps.googleapis.com/maps/api/staticmap?center=44.999933,-93.267978&zoom=14&size=400x300&sensor=false&key=AIzaSyDQX54VilPKn8Z-CVrHrLqmQM6eMctX27I";
  var imageDiv = $('<img>');
  imageDiv.attr('src', img_url)
  $("#mapholder").append(imageDiv)
  console.log(latlon);
  console.log(img_url);

}
function getLocation() {

  if(navigator.geolocation) {
     
     // timeout at 60000 milliseconds (60 seconds)
     //var options = {timeout:60000};
     navigator.geolocation.getCurrentPosition(citySearch);
  } else {
     alert("Sorry, browser does not support geolocation!");
  }
}

$(document).ready(getLocation());
*/
//$('#searchBtn').on('click', getLocation)
var currentCity;




function citySearch (event) {
event.preventDefault();
//hide the default text contained in the div where the search results will appear
$('.defaultText').attr('class', 'hide');
$('.nextFiveDays').removeClass('hide');
//set the city entered by the user to a variable
  var userSearch = $('#searchInput').val().trim();

//make a call for the api by city name, using the user's choice for the query in the URL
$.ajax({
  url: "https://api.openweathermap.org/data/2.5/weather?q="+userSearch+",Burundi&units=imperial&appid=57a5bd55c9410499ffe772185f8645e8",
  method: "GET"
}).then(function(response) {
  console.log(response);
 //declare a variable for a new h2 element, in which will set the user's city's name
 var cityName = $('<h2>');
 //I left some space in here to separate the name from the weather icon that will be displayed
 cityName.text(response.name+"   ");

//declare a variable as a new image element
 var icon = $('<img>');
 //set the source attribute to this new <img> as the api url with the current city's weather icon id,
 //so that when the city is queried, an icon depicted its current conditions will pop up next to the name. Pretty neat IMO.
 icon.attr('src', "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
 //append this cute icon to the cityName <h2>
 cityName.append(icon);
 
 
 //I amended the above API to have 'imperial' units, so temperature is in Fahrenheit already and we don't convert from Kelvin
 var temperature = $('<p>');
 //declare a var temperature to a new p element and have that p contain the temperature given from the API of that city
 temperature.text("Temperature: "+response.main.temp.toFixed(0)+" F")

//do the same as we did above for humidity and wind speed of user's searched city
 var humidity = $('<p>');
 humidity.text('Humidity: '+response.main.humidity+'%')
 var windSpeed = $('<p>');
 windSpeed.text('Wind Speed: '+response.wind.speed+' mph')

 
 //declaring these variables as equal to the latitude and longitude coordinates of the searched city to be used to grab the UV index
 var lat = response.coord.lat;
 var lon = response.coord.lon;

var uvIndex = function () {
  var UV  = $('<p>');
 $.ajax({
   url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=57a5bd55c9410499ffe772185f8645e8`,
   method: 'GET'
 }).then(function(responseTwo) {
   console.log(responseTwo);
   UV.text('UV Index: '+responseTwo.value);
 })
 
 return UV;
}
currentCity = response.name
var currentCityDisplay = $('#currentCity')
currentCityDisplay.append(cityName, temperature, humidity, windSpeed, uvIndex())

})
}

$('#searchBtn').on('click', citySearch)





// PSEUDO CODE AND NOTES

//$(document).on("click", ".movie", displayMovieInfo);

//might need to implement this trick above. Basically after all of the document has loaded, we will add
//a click function everything with the movie class

//if user hits a fav button or something, it saves that cities data to local storage in favorites
//