import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Pane, useMap, useMapEvents, Marker } from 'react-leaflet'

import { extend } from '@react-three/fiber'
import * as THREE from 'three'
extend(THREE)

import { GpxRoute } from './gpx.js'
import { EuroStats } from './eurostats.js'
import { Cyclist } from '../three/cyclist'


function calcMapCenter(map) {
  const origin = new L.latLng(0, 0)
  var centerXCalc = map.getCenter()
  centerXCalc.lng = 0
  const centerX = map.distance(centerXCalc, origin) * Math.sign(centerXCalc.lat)
  var centerYCalc = map.getCenter()
  centerYCalc.lat = 0
  const centerY = map.distance(centerYCalc, origin) * Math.sign(centerYCalc.lng)
  return {x: centerY, y: centerX}
}

function calcMapBounds(map, scale) {
  var bounds1 = map.getBounds()._southWest
  var bounds2 = map.getBounds()._northEast
  bounds1.lat = 0
  bounds2.lat = 0
  const boundsX = map.distance(bounds1, bounds2)

  bounds1 = map.getBounds()._southWest
  bounds2 = map.getBounds()._northEast
  bounds1.lng = 0
  bounds2.lng = 0
  const boundsY = map.distance(bounds1, bounds2)
  return {x: boundsX / scale, y: boundsY / scale}
}

const MonitorMapCentre = (props) => {
  const map = useMapEvents({
    click: () => {
      const northEast = map.getBounds()._northEast
      const southWest = map.getBounds()._southWest
      const northWest = map.getBounds()._northEast
      northWest.lat = southWest.lat
      const southEast = map.getBounds()._southWest
      southEast.lng = northEast.lng
      props.storeNorthEast(northEast)
      props.storeSouthWest(southWest)
    },
    drag: () => {
      const center = map.getCenter()
      props.storeLatLngCenter(center)
      props.storeCenter(calcMapCenter(map))
      props.storeBounds(calcMapBounds(map, props.scale))
      props.storeMarker(center)
    },
    dragend: () => {
      const center = map.getCenter()
      props.storeLatLngCenter(center)
      props.storeCenter(calcMapCenter(map))
      props.storeBounds(calcMapBounds(map, props.scale))
      props.storeMarker(center)
    },
    zoom: () => {
      const center = map.getCenter()
      props.storeLatLngCenter(center)
      props.storeCenter(calcMapCenter(map))
      props.storeBounds(calcMapBounds(map, props.scale))
      props.storeMarker(center)
    }
  })
  return null
}

const EuroMap = (props) => {
  const [markerPosition, setMarkerPosition] = useState({lat: props.mapCenter.y, lng: props.mapCenter.x})
  const [markerSouthWest, setMarkerSouthWest] = useState({lat: props.mapCenter.y, lng: props.mapCenter.x})
  const [markerNorthEast, setMarkerNorthEast] = useState({lat: props.mapCenter.y, lng: props.mapCenter.x})
  const [mapLatLngCenter, setMapLatLngCenter] = useState({lat: props.mapCenter.y, lng: props.mapCenter.x})
  const [mapCenter, setMapCenter] = useState(props.mapCenter)
  const [bounds, setBounds] = useState()
  const [routeData, setRouteData] = useState()
  const [scale, setScale] = useState(1000)
  const cartodbAttribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

  const SaveBounds = (map) => {
    setMapCenter(calcMapCenter(map))
    setBounds(calcMapBounds(map, scale))
  }

  const passLoadedData = (map, data) => {
    const threeRoute = []
    const origin = new L.latLng(0, 0)
    const xPosition = new L.latLng(0, 0)
    const yPosition = new L.latLng(0, 0)
    for (const feature of data.features){
      for (const coord of feature.geometry.coordinates){
        xPosition.lng = coord[0]
        yPosition.lat = coord[1]
        threeRoute.push(
          new THREE.Vector3(
            map.distance(xPosition, origin) / scale * Math.sign(xPosition.lng),
            map.distance(yPosition, origin) / scale * Math.sign(yPosition.lat),
            coord[2]
            // 0.
          )
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
        {/* <TileLayer
          attribution={cartodbAttribution}
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png"
        /> */}
        <TileLayer
          attribution={cartodbAttribution}
          url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        />
        {/* <TileLayer
          attribution={cartodbAttribution}
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png"
          pane="labels"
        /> */}
        <EuroStats {...props}/>
        <GpxRoute {...props} passLoadedData={passLoadedData}/>
        <MonitorMapCentre scale={scale} storeCenter={setMapCenter} storeLatLngCenter={setMapLatLngCenter} storeMarker={setMarkerPosition} storeBounds={setBounds} storeSouthWest={setMarkerSouthWest} storeNorthEast={setMarkerNorthEast}/>
        <Marker position={markerPosition}/>
        <Marker position={mapLatLngCenter}/>
        <Marker position={markerSouthWest}/>
        <Marker position={markerNorthEast}/>
        <Marker position={{lat: 0., lng: 0.}}/>
      </MapContainer>
      {/* <Cyclist center={mapCenter} position={mapCenter} bounds={bounds}/> */}
      <Cyclist center={{x: mapCenter.x / scale, y: mapCenter.y / scale}} bounds={bounds} routeData={routeData} scale={scale}/>
    </>
  )
}

export {EuroMap}