getStations(function (dataset) {
  var stations = dataset.features;
  document.getElementById('city').innerHTML = '';
  for (var i = 0; i < stations.length; i++) {
    var thisone = stations[i];
    var option = document.createElement('option');
    option.value = thisone.properties.id;
    option.innerHTML = thisone.properties.name;
    document.getElementById('city').appendChild(option);
  }
  city.addEventListener('change', function (evt) {
    var selected_weather_station = evt.target.value;
    getStationData(selected_weather_station, function (weatherdata) {
      if (weatherdata.features.length == 0) {
        window.alert(
          'You better check the city because we cant get a connection with them :O '
        );
      } else {
        var temperature = null;
        var humidity = null;
        var wind = null;
        // var cityName =
        for (var i = 0; i < weatherdata.features.length; i++) {
          var cw = weatherdata.features[i];
          if (cw.properties.temperature.value != null) {
            temperature = cw.properties.temperature.value;
          }
          if (cw.properties.windSpeed.value != null) {
            wind = cw.properties.windSpeed.value;
          }
          if (cw.properties.relativeHumidity.value != null) {
            humidity = cw.properties.relativeHumidity.value;
          }
        }
        console.log(
          'We seem to get some information about ' +
            evt.target.options[evt.target.selectedIndex].text +
            '... it is ' +
            temperature +
            'C , humidity ' +
            humidity +
            '% wind ' +
            wind +
            ' km/h '
        );
      }
    });
  });
});

function getStations(onfinished) {
  const ourheaders = new Headers();
  ourheaders.append('Accept', 'application/geo+json');
  fetch('https://api.weather.gov/radar/stations', {
    method: 'GET',
    headers: ourheaders,
    mode: 'cors',
  })
    .then(function (data) {
      return data.json().then(function (jsonobject) {
        onfinished(jsonobject);
      });
    })
    .catch(function (ex) {
      console.error('Sadly, this is not working :( ', ex);
    });
}

function getStationData(stationid, onfinished) {
  const ourheaders = new Headers();
  ourheaders.append('Accept', 'application/geo+json');
  fetch(`https://api.weather.gov/stations/${stationid}/observations?limit=5`, {
    method: 'GET',
    headers: ourheaders,
    mode: 'cors',
  })
    .then(function (data) {
      return data.json().then(function (jsonobject) {
        onfinished(jsonobject);
      });
    })
    .catch(function (ex) {
      console.error('Sadly, this is not working :( ', ex);
    });
}
