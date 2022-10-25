import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Pane, useMap, useMapEvents, Marker } from 'react-leaflet'

import { extend } from '@react-three/fiber'
import * as THREE from 'three'
extend(THREE)

import { GpxRoute } from './gpx.js'
import { EuroStats } from './eurostats.js'
import { Cyclist } from '../three/cyclist'


const MonitorMapCentre = (props) => {
  const map = useMapEvents({
    drag: () => {
      const center = map.getCenter()
      const centerCoords = map.latLngToLayerPoint(center)
      props.storeCenter({x: centerCoords.x, y: centerCoords.y})
      props.storeMarker(center)
      // props.storeBounds(map.getPixelBounds())
    },
    dragend: () => {
      const center = map.getCenter()
      const centerCoords = map.latLngToLayerPoint(center)
      props.storeCenter({x: centerCoords.x, y: centerCoords.y})
      props.storeMarker(center)
      // props.storeBounds(map.getPixelBounds())
    },
    zoom: () => {
      const center = map.getCenter()
      const centerCoords = map.latLngToLayerPoint(center)
      props.storeCenter({x: centerCoords.x, y: centerCoords.y})
      props.storeMarker(center)
      // props.storeBounds(map.getPixelBounds())
    }
  })
  return null
}

const EuroMap = (props) => {
  const [markerPosition, setMarkerPosition] = useState({lat: props.mapCenter.x, lng: props.mapCenter.y})
  const [mapCenter, setMapCenter] = useState(props.mapCenter)
  const [bounds, setBounds] = useState()
  const [routeData, setRouteData] = useState()
  const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'

  const SaveBounds = (map) => {
    setBounds(map.getPixelBounds())
  }

  const passLoadedData = (map, data) => {
    const threeRoute = []
    const zAxis = new THREE.Vector3(0, 0, 1)
    // Get last point in segment 2
    const originLatLng = data.features[1].geometry.coordinates.slice(0)[0]
    const origin = map.latLngToContainerPoint({lat: originLatLng[0], lng: originLatLng[1]})
    const trans = new THREE.Vector3(origin.y, -origin.x, 0.)
    for (const feature of data.features){
      for (const coord of feature.geometry.coordinates){
        const xy = map.latLngToContainerPoint({lat: coord[0], lng: coord[1]})
          threeRoute.push(
            new THREE.Vector3(
              xy.x,
              xy.y,
              coord[2]
            ).applyAxisAngle(zAxis, Math.PI / 2)
            .add(trans)
          )
      }
    }
    setRouteData(threeRoute)
  }

  var southWest = L.latLng(30, -40)
  var northEast = L.latLng(72, 60)
  var maxBounds = L.latLngBounds(southWest, northEast)

  return (
    <>
      <MapContainer center={[props.mapCenter.x, props.mapCenter.y]} whenCreated={SaveBounds} zoomSnap={0.5} minZoom={1} zoom={4} style={{"height":"100%", "width":"100%"}} maxBounds={maxBounds} maxBoundsViscosity={1.}>
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
        <GpxRoute {...props} passLoadedData={passLoadedData}/>
        <MonitorMapCentre storeCenter={setMapCenter} storeMarker={setMarkerPosition} storeBounds={setBounds}/>
        <Marker position={markerPosition}/>
        <Marker position={{lat: 0., lng: 0.}}/>
      </MapContainer>
      {/* <Cyclist center={mapCenter} position={mapCenter} bounds={bounds}/> */}
      <Cyclist center={mapCenter} position={new THREE.Vector3(0, 0, 0)} bounds={bounds} routeData={routeData}/>
    </>
  )
}

export {EuroMap}