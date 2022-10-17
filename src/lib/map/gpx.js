import React, {useState, useEffect} from 'react'
import { GeoJSON } from 'react-leaflet'
import { getJsonData } from './loadjson'

const GpxRoute = (props) => {
  const [gpxData, setGpxData] = useState()

  useEffect(()=>{
    getJsonData('/assets/route.json', setGpxData)
  },[])

  return (
    <>
      {gpxData && (
        <GeoJSON attribution="https://europeandividetrail.com" data={gpxData} style={{color: "black"}}/>
      )}
    </>
  )
}

export {GpxRoute}