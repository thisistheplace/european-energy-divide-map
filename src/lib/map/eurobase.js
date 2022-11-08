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
    click: () => {
      console.log("loaded")
      console.log(map.getBounds())
      console.log(map.getPixelBounds())
      console.log(map.latLngToLayerPoint(map.getBounds()._southWest))
      console.log(map.latLngToLayerPoint(map.getBounds()._northEast))
      console.log(map.latLngToContainerPoint(map.getBounds()._southWest))
      console.log(map.latLngToContainerPoint(map.getBounds()._northEast))
      const northEast = map.getBounds()._northEast
      const southWest = map.getBounds()._southWest
      const northWest = map.getBounds()._northEast
      northWest.lat = southWest.lat
      const southEast = map.getBounds()._southWest
      southEast.lng = northEast.lng
      console.log(southEast, northWest)
      console.log(map.distance(southEast, northEast))
      console.log(map.distance(southEast, southWest))

      props.storeNorthEast(northEast)
      props.storeSouthWest(southWest)
    },
    drag: () => {
      const center = map.getCenter()
      const centerCoords = map.latLngToLayerPoint(center)
      props.storeCenter({x: centerCoords.x, y: centerCoords.y})
      props.storeMarker(center)
      // props.storeBounds(map.getPixelBounds())
    },
    dragend: () => {
      // console.log(map)
      const center = map.getCenter()
      const centerCoords = map.latLngToLayerPoint(center)
      props.storeCenter({x: centerCoords.x, y: centerCoords.y})
      props.storeMarker(center)
      // console.log(map.getBounds())
      // console.log(map.getPixelBounds())
      // console.log(map.latLngToLayerPoint(map.getBounds()._northEast))
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
  const [markerSouthWest, setMarkerSouthWest] = useState({lat: props.mapCenter.x, lng: props.mapCenter.y})
  const [markerNorthEast, setMarkerNorthEast] = useState({lat: props.mapCenter.x, lng: props.mapCenter.y})
  const [mapCenter, setMapCenter] = useState(props.mapCenter)
  const [bounds, setBounds] = useState()
  const [routeData, setRouteData] = useState()
  const cartodbAttribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'

  const SaveBounds = (map) => {
    setBounds(map.getPixelBounds())
  }

  const passLoadedData = (map, data) => {
    const threeRoute = []
    // const zAxis = new THREE.Vector3(0, 0, 1)
    // Get last point in segment 2
    const startData = data.features[1].geometry.coordinates.slice(0)[0]
    // const origin = map.latLngToLayerPoint({lat: startLatLng[0], lng: startLatLng[1]})
    const startLatLng = new L.latLng(startData[0], startData[1])
    console.log("origin:", origin, startLatLng)
    const distOrigin = map.distance(map.getCenter(), startLatLng)
    // const trans = new THREE.Vector3(origin.y, -origin.x, 0.)
    for (const feature of data.features){
      for (const coord of feature.geometry.coordinates){
        // Find distance in m of first point to origin using latLng
        // Find distance in m of next point to first point using latLng
        // Add distance in m to previous point


        threeRoute.push(
          new THREE.Vector3(
            xy.x,
            xy.y,
            coord[2]
          )
          // ).applyAxisAngle(zAxis, Math.PI / 2)
          // .add(trans)
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
        <MonitorMapCentre storeCenter={setMapCenter} storeMarker={setMarkerPosition} storeBounds={setBounds} storeSouthWest={setMarkerSouthWest} storeNorthEast={setMarkerNorthEast}/>
        <Marker position={markerPosition}/>
        <Marker position={markerSouthWest}/>
        <Marker position={markerNorthEast}/>
        <Marker position={{lat: 0., lng: 0.}}/>
      </MapContainer>
      {/* <Cyclist center={mapCenter} position={mapCenter} bounds={bounds}/> */}
      <Cyclist center={mapCenter} position={new THREE.Vector3(0, 0, 0)} bounds={bounds} routeData={routeData}/>
    </>
  )
}

export {EuroMap}