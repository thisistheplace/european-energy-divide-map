import React, {useState, useEffect} from 'react'
import { MapContainer, TileLayer, Pane, GeoJSON, Marker, Popup } from 'react-leaflet'

const EuroMap = (props) => {
  const [euCountries, setEuCountries] = useState();
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
        return response.json()
      })
      .then(function(myJson) {
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
      {/* <TileLayer
        attribution={cartodbAttribution}
        url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
        pane="labels"
      /> */}
      {euCountries && (
        <GeoJSON attribution="test attribution" data={euCountries}/>
      )}
      
    </MapContainer>
  )
}

export {EuroMap}