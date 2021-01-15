/* I AM TRULY SORRY. I MISREAD THE DUE DATE AS FRIDAY AND NOT THURSDAY AND THUS MY CODE IS RUSHED
AND AN INFERNALLY HOT MESS. IF I HAD HAD MORE TIME I WOULD HAVE FAR MORE ANNOTATIONS EXPLAINING WHAT
I DID AS WELL AS WRITTEN JUST ONE QUERY FUNCTION INSTEAD WRITING OUT THE WHOLE DANG THING LITERALLY
NINE TIMES. I FEEL SO BAD YOU HAVE TO GRADE THIS.

 I'M SO SORRY. */


var today = moment().format('dddd, MMM Do');

//var moment=moment();
//var todayFormat = moment.now._d.getDate()



function citySearch (event) {
event.preventDefault();


  //this will clear the present entry from the div, if such an entry exists
  $('#currentCity').empty();

  //hide the default text contained in the div where the search results will appear
  $('.defaultText').attr('class', 'hide');
  $('#nextFiveDays').empty()
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
  
  
  //I amended the above API to have 'imperial' units, so temperature is in Fahrenheit already and we don't convert from Kelvin
  var temperature = $('<p>');
  //declare a var temperature to a new p element and have that p contain the temperature given from the API of that city
  temperature.text("Temperature: "+response.main.temp.toFixed(0)+" F");

  //do the same as we did above for humidity and wind speed of user's searched city
  var humidity = $('<p>');
  humidity.text('Humidity: '+response.main.humidity+'%');
  var windSpeed = $('<p>');
  windSpeed.text('Wind Speed: '+response.wind.speed+' mph');
    
  
  //declaring these variables as equal to the latitude and longitude coordinates of the searched city to be used to grab the UV index
  var lat = response.coord.lat;
  var lon = response.coord.lon;
  
      var uvIndex = function () {
        var UV  = $('<p>');
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=57a5bd55c9410499ffe772185f8645e8`,
        method: 'GET'
      }).then(function(responseTwo) {
        
        UV.text('UV Index: '+responseTwo.value);
        if (responseTwo.value >= 0 && responseTwo.value < 3) {
          UV.attr('style', 'background-color: green');
        }
        if (responseTwo.value >= 3 && responseTwo.value < 6) {
          UV.attr('style', 'background-color: yellow');
        }
        if (responseTwo.value >= 6 && responseTwo.value < 8) {
          UV.attr('style', 'background-color: orange');
        }
        if (responseTwo.value >= 8 && responseTwo.value < 11) {
          UV.attr('style', 'background-color: red; color: white');
        }
        if (responseTwo.value >= 11) {
          UV.attr('style', 'background-color: violet; color: white');
        }
      }) 
      
      return UV;
      } 

  //create a variable for the current city div from HTML and append all the above stuff we just made to it.
  var currentCityDisplay = $('#currentCity')
  currentCityDisplay.append(cityName, todayDate, temperature, humidity, windSpeed, uvIndex())

  
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/forecast?q="+userSearch+"&appid=57a5bd55c9410499ffe772185f8645e8",
      method: "GET"
    }).then(function(responseThree) {
      console.log(responseThree);
      for (var i = 0; i < 40; i+=8) {
        console.log(responseThree)
        var day = $('<div>');
        day.attr('style', 'border: solid 3px  rgba(2, 2, 155, 0.671); background-color:  rgb(99, 252, 39);')
        var date = $('<p>');
        var forecastDate = moment(responseThree.list[i].dt_txt).format("MMM Do")
        date.text(forecastDate+"   ")
        var temperature = $('<p>');
        tempF = (responseThree.list[i].main.temp - 273.15) * (9/5) + 32;
        temperature.text("Temperature: "+tempF.toFixed(0)+" F");
        var icon = $('<img>');
        icon.attr('src', "http://openweathermap.org/img/w/" + responseThree.list[i].weather[0].icon + ".png");
        var humidity = $('<p>');
        humidity.text('Humidity: '+responseThree.list[i].main.humidity+'%');
        date.append(icon);
        day.append(date, temperature, humidity)
        $('#nextFiveDays').append(day)
      }
  })

    //for adding query search to the search history list; 

    var searchHis = JSON.parse(localStorage.getItem('search history'));

    if (searchHis != null) { //not sure I need the if/else
      $('.searchFiller').addClass('hide');
      searchHis.unshift(response.name);
          
        var searchSlot = $('<button>');
        searchSlot.text(response.name);
        searchSlot.attr('class', 'list-group-item');
        //searchSlot.attr('id', response.name)
        $('#searchHistory').append(searchSlot);

        $(searchSlot).on('click', function() {
          $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather?q="+response.name+",Burundi&units=imperial&appid=57a5bd55c9410499ffe772185f8645e8",
            method: "GET"
          }).then(function(respo) {
        
            $('#nextFiveDays').empty()
          $('#currentCity').empty();
          $('.defaultText').attr('class', 'hide');
    
          var cityName = $('<h2>');
          cityName.text(respo.name+"   ");
    
          var icon = $('<img>');
          icon.attr('src', "http://openweathermap.org/img/w/" + respo.weather[0].icon + ".png");
          cityName.append(icon);
    
          var todayDate = $('<h4>');
          todayDate.text(today);
          var temperature = $('<p>');
          temperature.text("Temperature: "+respo.main.temp.toFixed(0)+" F");
          var humidity = $('<p>');
          humidity.text('Humidity: '+respo.main.humidity+'%');
          var windSpeed = $('<p>');
          windSpeed.text('Wind Speed: '+respo.wind.speed+' mph');
            
          
          var lat = respo.coord.lat;
          var lon = respo.coord.lon;
          
          var uvIndex = function () {
            var UV  = $('<p>');
          $.ajax({
            url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=57a5bd55c9410499ffe772185f8645e8`,
            method: 'GET'
          }).then(function(respoTwo) {
            
            UV.text('UV Index: '+respoTwo.value);
            if (respoTwo.value >= 0 && respoTwo.value < 3) {
              UV.attr('style', 'background-color: green');
            }
            if (respoTwo.value >= 3 && respoTwo.value < 6) {
              UV.attr('style', 'background-color: yellow');
            }
            if (respoTwo.value >= 6 && respoTwo.value < 8) {
              UV.attr('style', 'background-color: orange');
            }
            if (respoTwo.value >= 8 && respoTwo.value < 11) {
              UV.attr('style', 'background-color: red; color: white');
            }
            if (respoTwo.value >= 11) {
              UV.attr('style', 'background-color: violet; color: white');
            }
          }) 
          
          return UV;
          } 
    
          var currentCityDisplay = $('#currentCity')
          currentCityDisplay.append(cityName, todayDate, temperature, humidity, windSpeed, uvIndex())
    
          
            $.ajax({
              url: "https://api.openweathermap.org/data/2.5/forecast?q="+userSearch+"&appid=57a5bd55c9410499ffe772185f8645e8",
              method: "GET"
            }).then(function(respoThree) {
              console.log(respoThree);
              for (var i = 0; i < 40; i+=8) {
                console.log(respoThree)
                var day = $('<div>');
                day.attr('style', 'border: solid 3px  rgba(2, 2, 155, 0.671); background-color:  rgb(99, 252, 39);')
                var date = $('<p>');
                var forecastDate = moment(respoThree.list[i].dt_txt).format("MMM Do")
                date.text(forecastDate+"   ")
                var temperature = $('<p>');
                tempF = (respoThree.list[i].main.temp - 273.15) * (9/5) + 32;
                temperature.text("Temperature: "+tempF.toFixed(0)+" F");
                var icon = $('<img>');
                icon.attr('src', "http://openweathermap.org/img/w/" + respoThree.list[i].weather[0].icon + ".png");
                var humidity = $('<p>');
                humidity.text('Humidity: '+respoThree.list[i].main.humidity+'%');
                date.append(icon);
                day.append(date, temperature, humidity)
                $('#nextFiveDays').append(day)
              }
          })
          
         
    
        })
      })
    
    
    
    }
    else {
      $('.searchFiller').addClass('hide');
      
      searchHis = [response.name]
      localStorage.setItem('search history', JSON.stringify(searchHis));
      var searchSlot = $('<button>');
      searchSlot.text(response.name);
      searchSlot.attr('class', 'list-group-item');
      searchSlot.attr('id', response.name)
      $('#searchHistory').append(searchSlot);
      $(searchSlot).on('click', function() {
        $.ajax({
          url: "https://api.openweathermap.org/data/2.5/weather?q="+response.name+",Burundi&units=imperial&appid=57a5bd55c9410499ffe772185f8645e8",
          method: "GET"
        }).then(function(responseFour) {
          
          $('#nextFiveDays').empty()
        $('#currentCity').empty();
        $('.defaultText').attr('class', 'hide');
  
        var cityName = $('<h2>');
        cityName.text(responseFour.name+"   ");
  
        var icon = $('<img>');
        icon.attr('src', "http://openweathermap.org/img/w/" + responseFour.weather[0].icon + ".png");
        cityName.append(icon);
  
        var todayDate = $('<h4>');
        todayDate.text(today);
        var temperature = $('<p>');
        temperature.text("Temperature: "+responseFour.main.temp.toFixed(0)+" F");
        var humidity = $('<p>');
        humidity.text('Humidity: '+responseFour.main.humidity+'%');
        var windSpeed = $('<p>');
        windSpeed.text('Wind Speed: '+responseFour.wind.speed+' mph');
          
        
        var lat = responseFour.coord.lat;
        var lon = responseFour.coord.lon;
        
        var uvIndex = function () {
          var UV  = $('<p>');
        $.ajax({
          url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=57a5bd55c9410499ffe772185f8645e8`,
          method: 'GET'
        }).then(function(responseFive) {
          
          UV.text('UV Index: '+responseFive.value);
          if (responseFive.value >= 0 && responseFive.value < 3) {
            UV.attr('style', 'background-color: green');
          }
          if (responseFive.value >= 3 && responseFive.value < 6) {
            UV.attr('style', 'background-color: yellow');
          }
          if (responseFive.value >= 6 && responseFive.value < 8) {
            UV.attr('style', 'background-color: orange');
          }
          if (responseFive.value >= 8 && responseFive.value < 11) {
            UV.attr('style', 'background-color: red; color: white');
          }
          if (responseFive.value >= 11) {
            UV.attr('style', 'background-color: violet; color: white');
          }
        }) 
        
        return UV;
        } 
  
        var currentCityDisplay = $('#currentCity')
        currentCityDisplay.append(cityName, todayDate, temperature, humidity, windSpeed, uvIndex())
  
        
          $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast?q="+userSearch+"&appid=57a5bd55c9410499ffe772185f8645e8",
            method: "GET"
          }).then(function(responseSix) {
            console.log(responseSix);
            for (var i = 0; i < 40; i+=8) {
              console.log(responseSix)
              var day = $('<div>');
              day.attr('style', 'border: solid 3px  rgba(2, 2, 155, 0.671); background-color:  rgb(99, 252, 39);')
              var date = $('<p>');
              var forecastDate = moment(responseSix.list[i].dt_txt).format("MMM Do")
              date.text(forecastDate+"   ")
              var temperature = $('<p>');
              tempF = (responseSix.list[i].main.temp - 273.15) * (9/5) + 32;
              temperature.text("Temperature: "+tempF.toFixed(0)+" F");
              var icon = $('<img>');
              icon.attr('src', "http://openweathermap.org/img/w/" + responseSix.list[i].weather[0].icon + ".png");
              var humidity = $('<p>');
              humidity.text('Humidity: '+responseSix.list[i].main.humidity+'%');
              date.append(icon);
              day.append(date, temperature, humidity)
              $('#nextFiveDays').append(day)
            }
        })
      
  })
  })
  }
  localStorage.setItem('search history', JSON.stringify(searchHis))
})
}




function displaySearchHistory () {

  if (localStorage.getItem('search history')) {
    $('.searchFiller').addClass('hide');
    $('#currentCity').empty();
    var searchHistory = JSON.parse(localStorage.getItem('search history'));


    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/weather?q="+searchHistory[0]+",Burundi&units=imperial&appid=57a5bd55c9410499ffe772185f8645e8",
      method: "GET"
    }).then(function(response) {


      var cityName = $('<h2>');
      cityName.text(response.name+"   ");

      var icon = $('<img>');
      icon.attr('src', "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
      //append this cute icon to the cityName <h2>
      cityName.append(icon);

      var todayDate = $('<h4>');
      todayDate.text(today);
      var temperature = $('<p>');
      temperature.text("Temperature: "+response.main.temp.toFixed(0)+" F");
      var humidity = $('<p>');
      humidity.text('Humidity: '+response.main.humidity+'%');
      var windSpeed = $('<p>');
      windSpeed.text('Wind Speed: '+response.wind.speed+' mph');
        
      
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      
      var uvIndex = function () {
        var UV  = $('<p>');
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=57a5bd55c9410499ffe772185f8645e8`,
        method: 'GET'
      }).then(function(responseTwo) {
        
        UV.text('UV Index: '+responseTwo.value);
        if (responseTwo.value >= 0 && responseTwo.value < 3) {
          UV.attr('style', 'background-color: green');
        }
        if (responseTwo.value >= 3 && responseTwo.value < 6) {
          UV.attr('style', 'background-color: yellow');
        }
        if (responseTwo.value >= 6 && responseTwo.value < 8) {
          UV.attr('style', 'background-color: orange');
        }
        if (responseTwo.value >= 8 && responseTwo.value < 11) {
          UV.attr('style', 'background-color: red; color: white');
        }
        if (responseTwo.value >= 11) {
          UV.attr('style', 'background-color: violet; color: white');
        }
      }) 
      
      return UV;
      } 

      var currentCityDisplay = $('#currentCity')
      currentCityDisplay.append(cityName, todayDate, temperature, humidity, windSpeed, uvIndex())

      
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q="+searchHistory[0]+"&appid=57a5bd55c9410499ffe772185f8645e8",
        method: "GET"
      }).then(function(responseThree) {

        $('#nextFiveDays').empty()

        for (var i = 0; i < 40; i+=8) {
          console.log(responseThree)
          var day = $('<div>');
          day.attr('style', 'border: solid 3px  rgba(2, 2, 155, 0.671); background-color:  rgb(99, 252, 39);')
          var date = $('<p>');
          var forecastDate = moment(responseThree.list[i].dt_txt).format("MMM Do")
          date.text(forecastDate+"   ")
          var temperature = $('<p>');
          tempF = (responseThree.list[i].main.temp - 273.15) * (9/5) + 32;
          temperature.text("Temperature: "+tempF.toFixed(0)+" F");
          var icon = $('<img>');
          icon.attr('src', "http://openweathermap.org/img/w/" + responseThree.list[i].weather[0].icon + ".png");
          var humidity = $('<p>');
          humidity.text('Humidity: '+responseThree.list[i].main.humidity+'%');
          date.append(icon);
          day.append(date, temperature, humidity)
          $('#nextFiveDays').append(day)
        }
  
      
      var searchSlot = $('<button>');
      searchSlot.text(searchHistory[0]);
      searchSlot.attr('class', 'list-group-item');
      $('#searchHistory').append(searchSlot);
      
      $(searchSlot).on('click', function() {
        $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q="+searchHistory[0]+",Burundi&units=imperial&appid=57a5bd55c9410499ffe772185f8645e8",
        method: "GET"
      }).then(function(responseThree) {
        console.log(responseThree);
      
        
      $('#currentCity').empty();
      $('.defaultText').attr('class', 'hide');

      var cityName = $('<h2>');
      cityName.text(responseThree.name+"   ");

      var icon = $('<img>');
      icon.attr('src', "http://openweathermap.org/img/w/" + responseThree.weather[0].icon + ".png");
      //append this cute icon to the cityName <h2>
      cityName.append(icon);

      var todayDate = $('<h4>');
      todayDate.text(today);
      var temperature = $('<p>');
      temperature.text("Temperature: "+responseThree.main.temp.toFixed(0)+" F");
      var humidity = $('<p>');
      humidity.text('Humidity: '+responseThree.main.humidity+'%');
      var windSpeed = $('<p>');
      windSpeed.text('Wind Speed: '+responseThree.wind.speed+' mph');
        
      
      var lat = responseThree.coord.lat;
      var lon = responseThree.coord.lon;
      
      var uvIndex = function () {
        var UV  = $('<p>');
      $.ajax({
        url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=57a5bd55c9410499ffe772185f8645e8`,
        method: 'GET'
      }).then(function(responseFour) {
        
        UV.text('UV Index: '+responseFour.value);
        if (responseFour.value >= 0 && responseFour.value < 3) {
          UV.attr('style', 'background-color: green');
        }
        if (responseFour.value >= 3 && responseFour.value < 6) {
          UV.attr('style', 'background-color: yellow');
        }
        if (responseFour.value >= 6 && responseFour.value < 8) {
          UV.attr('style', 'background-color: orange');
        }
        if (responseFour.value >= 8 && responseFour.value < 11) {
          UV.attr('style', 'background-color: red; color: white');
        }
        if (responseFour.value >= 11) {
          UV.attr('style', 'background-color: violet; color: white');
        }
      }) 
      
      return UV;
      } 

      var currentCityDisplay = $('#currentCity')
      currentCityDisplay.append(cityName, todayDate, temperature, humidity, windSpeed, uvIndex())

      
        $.ajax({
          url: "https://api.openweathermap.org/data/2.5/forecast?q="+userSearch+"&appid=57a5bd55c9410499ffe772185f8645e8",
          method: "GET"
        }).then(function(responseFive) {
          
          for (var i = 0; i < 40; i+=8) {
            console.log(responseFive)
            var day = $('<div>');
            day.attr('style', 'border: solid 3px  rgba(2, 2, 155, 0.671); background-color:  rgb(99, 252, 39);')
            var date = $('<p>');
            var forecastDate = moment(responseFive.list[i].dt_txt).format("MMM Do")
            date.text(forecastDate+"   ")
            var temperature = $('<p>');
            tempF = (responseFive.list[i].main.temp - 273.15) * (9/5) + 32;
            temperature.text("Temperature: "+tempF.toFixed(0)+" F");
            var icon = $('<img>');
            icon.attr('src', "http://openweathermap.org/img/w/" + responseFive.list[i].weather[0].icon + ".png");
            var humidity = $('<p>');
            humidity.text('Humidity: '+responseFive.list[i].main.humidity+'%');
            date.append(icon);
            day.append(date, temperature, humidity)
            $('#nextFiveDays').append(day)
          }
      })
    })
  })
  })
})
}
}
         
        


$(document).ready(
  
  displaySearchHistory()
)

$('#searchBtn').on('click', citySearch)

/*
// PSEUDO CODE AND NOTES -- see whiteboard, you slimy fuck!

//$(document).on("click", ".movie", displayMovieInfo);

//might need to implement this trick above. Basically after all of the document has loaded, we will add
//a click function everything with the movie class

//if user hits a fav button or something, it saves that cities data to local storage in favorites
*/