var today = moment().format('dddd, MMM Do');
var currentCity;

function citySearch (event) {
event.preventDefault();

  //this will clear the present entry from the div, if such an entry exists
  $('#currentCity').empty();

  //hide the default text contained in the div where the search results will appear
  $('.defaultText').attr('class', 'hide');

  //remove the hide class from the next five days div and the favorites button
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

  var todayDate = $('<h4>');
  todayDate.text(today);
  todayDate.attr('style', 'text-decoration: underline')
  
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

  function addToFavorites () {
    
    var favorites = JSON.parse(localStorage.getItem('favorites'));

    if (favorites) {
      $('.favoritesFiller').addClass('hide');

      for (var i = 0; i < favorites.length; i++) {
        if (favorites[i] === response.name) { //this is throwing the alert...but then pushing it into storage anyway...
          alert("that's already a favorite, yo!");
        }
        else {
          favorites.push(response.name);
          var favoriteSlot = $('<li>');
          favoriteSlot.text(response.name);
          favoriteSlot.attr('class', 'list-group-item');
        }
      }
    }
    else {
      $('.favoritesFiller').addClass('hide');

      favorites = [response.name]

      var favoriteSlot = $('<li>');
      favoriteSlot.text(response.name);
      favoriteSlot.attr('class', 'list-group-item');

      
      
    }
    $('.favoriteCities').append(favoriteSlot);
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }


  //for adding query search to the search history list; 
    var searchHistory = JSON.parse(localStorage.getItem('search history'));

    if (searchHistory) { //not sure I need the if/else
      $('.searchFiller').addClass('hide');

      for (var i = 0; i < searchHistory.length; i++) {
        
          searchHistory.push(response.name);
          var searchSlot = $('<li>');
          searchSlot.text(response.name);
          searchSlot.attr('class', 'list-group-item');
        }
      }
    
    else {
      $('.searchFiller').addClass('hide');

      searchHistory = [response.name]
      var searchSlot = $('<li>');
      searchSlot.text(response.name);
      searchSlot.attr('class', 'list-group-item');
     
      
    }
    $('#searchHistory').append(searchSlot);
    localStorage.setItem('search history', JSON.stringify(searchHistory))


  

  currentCity = response.name //gonna use this for the five-day forecast shit

  //create a favorite button that will save the current city to local Storage:
  var favorite = $('<button>')
  favorite.attr('id', 'favorite')
  favorite.text('Add to Favorites!')

  favorite.on('click', addToFavorites)
  favorite.on('click', function() {
    $('.favoritesFiller').addClass('hide');
  })

  //create a variable for the current city div from HTML and append all the above stuff we just made to it.
  var currentCityDisplay = $('#currentCity')
  currentCityDisplay.append(cityName, todayDate, temperature, humidity, windSpeed,/* uvIndex(), */ favorite)

})
}


/*I'll need some sort of function for when document.ready or onLoad or some shit to append the items from local storage
into our favorite cities list. JUST FYI YOU TWAT */
function displayFavorites () {

 if (localStorage.getItem('favorites')) {
  $('.favoritesFiller').addClass('hide');
  var favorites = JSON.parse(localStorage.getItem('favorites'));
  for (var i = 0; i < favorites.length; i++) {
    
    var favoriteSlot = $('<li>');
    favoriteSlot.text(favorites[i]);
    favoriteSlot.attr('class', 'list-group-item');
    $('.favoriteCities').append(favoriteSlot);
  }
}

}
  



function displaySearchHistory () {

  if (localStorage.getItem('search history')) {
    $('.searchFiller').addClass('hide');
    var searchHistory = JSON.parse(localStorage.getItem('search history'));

    for (var i = 0; i < searchHistory.length; i++) {
      
      var searchSlot = $('<li>');
      searchSlot.text(searchHistory[i]);
      searchSlot.attr('class', 'list-group-item');
      $('#searchHistory').append(searchSlot);
    }
  }

}

$(document).ready(
  displayFavorites(),
  displaySearchHistory()
)

$('#searchBtn').on('click', citySearch)

$('.forecastButton').on('click', function() {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q="+currentCity+",Burundi&units=imperial&appid=57a5bd55c9410499ffe772185f8645e8",
    method: "GET"
  }).then(function(response) {
    console.log(response);
})
})
// PSEUDO CODE AND NOTES -- see whiteboard, you slimy fuck!

//$(document).on("click", ".movie", displayMovieInfo);

//might need to implement this trick above. Basically after all of the document has loaded, we will add
//a click function everything with the movie class

//if user hits a fav button or something, it saves that cities data to local storage in favorites
//