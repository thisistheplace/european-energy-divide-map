import React, {useState, useEffect} from 'react'
import { MapContainer, TileLayer, Pane, GeoJSON, Marker, Popup } from 'react-leaflet'

const EuroMap = (props) => {
  const [euCountries, setEuCountries] = useState([]);
  const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

  const getData=()=>{
    fetch('/assets/eu-countries.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setEuCountries(myJson)
      });
  }
  useEffect(()=>{
    getData()
  },[])

  return (
    <MapContainer center={[47.040182144806664, 9.667968750000002]} zoom={4} style={{"height":"100%", "width":"100%"}}>
      <Pane name="labels" style={{ zIndex: 650, pointerEvents: 'none' }} />
      <TileLayer
        attribution={cartodbAttribution}
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
      />
      <TileLayer
        attribution={cartodbAttribution}
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
        pane="labels"
      />
      <GeoJSON data={euCountries}></GeoJSON>
      
    </MapContainer>
  )
}

export {EuroMap}

// var map = L.map('map');

// map.createPane('labels');

// // This pane is above markers but below popups
// map.getPane('labels').style.zIndex = 650;

// // Layers in this pane are non-interactive and do not obscure mouse/touch events
// map.getPane('labels').style.pointerEvents = 'none';

// var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

// var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
//   attribution: cartodbAttribution
// }).addTo(map);

// var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
//   attribution: cartodbAttribution,
//   pane: 'labels'
// }).addTo(map);

// /* global euCountries */
// var geojson = L.geoJson(euCountries).addTo(map);

// geojson.eachLayer(function (layer) {
//   layer.bindPopup(layer.feature.properties.name);
// });

// map.setView({lat: 47.040182144806664, lng: 9.667968750000002}, 4);