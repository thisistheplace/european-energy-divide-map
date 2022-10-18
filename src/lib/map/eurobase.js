import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Pane, useMapEvents, Marker } from 'react-leaflet'
import { GpxRoute } from './gpx.js'
import { EuroStats } from './eurostats.js'
import { Cyclist } from '../three/cyclist'

const MonitorMapCentre = (props) => {
  const map = useMapEvents({
    drag: () => {
      const center = map.getCenter()
      props.storeCenter(map.latLngToLayerPoint(center))
      props.storeMarker(center)
    },
    dragend: () => {
      const center = map.getCenter()
      props.storeCenter(map.latLngToLayerPoint(center))
      props.storeMarker(center)
    },
    zoom: () => {
      const center = map.getCenter()
      props.storeCenter(map.latLngToLayerPoint(center))
      props.storeMarker(center)
      props.storeZoom(map.getZoom())
    }
  })
  return null
}

const EuroMap = (props) => {
  const [markerPosition, setMarkerPosition] = useState({lat: props.mapCenter.x, lng: props.mapCenter.y})
  const [mapCenter, setMapCenter] = useState(props.mapCenter)
  const [storeZoom, setStoreZoom] = useState(4)
  const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'

  var southWest = L.latLng(30, -40)
  var northEast = L.latLng(72, 50)
  // var southWest = L.latLng(-90, 90)
  // var northEast = L.latLng(90, -90)
  var bounds = L.latLngBounds(southWest, northEast)

  return (
    <>
      <MapContainer center={[props.mapCenter.x, props.mapCenter.y]} zoomSnap={0.5} minZoom={1} zoom={4} style={{"height":"100%", "width":"100%"}} maxBounds={bounds} maxBoundsViscosity={1.}>
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
        <MonitorMapCentre storeCenter={setMapCenter} storeMarker={setMarkerPosition} storeZoom={setStoreZoom}/>
        <Marker position={markerPosition}/>
        <Marker position={{lat: 0., lng: 0.}}/>
      </MapContainer>
      <Cyclist modelPosition={props.mapCenter} cameraPosition={mapCenter} zoom={storeZoom}/>
    </>
  )
}

export {EuroMap}