import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Pane, useMapEvents } from 'react-leaflet'
import { GpxRoute } from './gpx.js'
import { EuroStats } from './eurostats.js'
import { Cyclist } from '../three/cyclist'

const MonitorMapCentre = (props) => {
  const map = useMapEvents({
    drag: () => {
      const center = map.latLngToLayerPoint(map.getCenter())
      console.log("center", center)
      props.storeCenter(center)
    },
    zoom: () => {
      console.log(map.getZoom())
    }
  })
  return null
}

const EuroMap = (props) => {
  const [mapCenter, setMapCenter] = useState(props.mapCenter)
  const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'

  var southWest = L.latLng(30, -40)
  var northEast = L.latLng(72, 50)
  var bounds = L.latLngBounds(southWest, northEast)

  return (
    <>
      <MapContainer center={props.mapCenter} zoomSnap={0.5} minZoom={4} zoom={4} style={{"height":"100%", "width":"100%"}} maxBounds={bounds}>
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
        <EuroStats {...props}/>
        <GpxRoute {...props}/>
        <MonitorMapCentre storeCenter={setMapCenter}/>
      </MapContainer>
      <Cyclist position={mapCenter} />
    </>
  )
}

export {EuroMap}