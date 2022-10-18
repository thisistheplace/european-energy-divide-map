import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Pane, useMapEvent } from 'react-leaflet'
import { GpxRoute } from './gpx.js'
import { EuroStats } from './eurostats.js'
import { Cyclist } from '../three/cyclist'

const MonitorMapCentre = (props) => {
  const map = useMapEvent('drag', () => {
    const center = map.getCenter()
    console.log("center", center)
    console.log(map.latLngToLayerPoint(center))
    props.storeCenter(center)
  })
  return null
}

const CalcCameraPosition = (cameraPosition, mapCenter) => {
  const [x, y, z] = cameraPosition
  if (typeof mapCenter === 'object' && !Array.isArray(mapCenter)){
    return [x + mapCenter.lat, y + mapCenter.lng, z]
  }
  else {
    return cameraPosition
  }
}

const EuroMap = (props) => {
  const [mapCenter, setMapCenter] = useState(props.mapCenter)
  const [cameraPosition, setCameraPosition] = useState([10, 10, 10])
  const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'

  var southWest = L.latLng(10, -40)
  var northEast = L.latLng(75, 50)
  var bounds = L.latLngBounds(southWest, northEast)

  useEffect(() => {
    const newPosition = CalcCameraPosition(cameraPosition, mapCenter)
    setCameraPosition(newPosition)
  }, [mapCenter])

  return (
    <>
      <MapContainer center={props.mapCenter} zoom={4} style={{"height":"100%", "width":"100%"}} maxBounds={bounds}>
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
      <Cyclist cameraPosition={cameraPosition} />
    </>
  )
}

export {EuroMap}