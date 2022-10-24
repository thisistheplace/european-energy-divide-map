import React, {useState, useEffect} from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import { getJsonData } from './loadjson'

const ProcessData = (props) => {
  const map = useMap()
  useEffect(()=>{
    // console.log(data)
    // const start = data.features[0].geometry.coordinates[0]
    // console.log(start)
    // console.log(map.latLngToLayerPoint({lat: start[0], lng: start[1]}))
    props.callback(map, props.data)
  },[props.data])

  return null
}

const GpxRoute = (props) => {
  const [gpxData, setGpxData] = useState()

  useEffect(()=>{
    getJsonData('/assets/route.json', setGpxData)
  },[])

  return (
    <>
      {gpxData && (
        <GeoJSON
          attribution="https://europeandividetrail.com"
          data={gpxData}
          style={{color: "black"}}     
        >
          <ProcessData data={gpxData} callback={props.passLoadedData}/>
        </GeoJSON>
      )}
    </>
  )
}

export {GpxRoute}