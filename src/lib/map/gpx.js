import React, {useState, useEffect} from 'react'
import { GeoJSON, useMap } from 'react-leaflet'
import { getJsonData } from './loadjson'

const ProcessData = (props) => {
  const map = useMap()
  useEffect(()=>{
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