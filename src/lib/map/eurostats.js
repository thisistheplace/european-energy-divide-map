import React, {useState, useEffect} from 'react'
import { GeoJSON } from 'react-leaflet'
import { getJsonData } from './loadjson'

const EuroStats = (props) => {
  const [euroStatData, setEuroStatData] = useState()

  const interceptData = (data) => {
    setEuroStatData(data)
  }

  useEffect(()=>{
    getJsonData('/assets/eurostats_0.json', interceptData)
  },[])

  return (
    <>
      {euroStatData && (
        <GeoJSON attribution="https://ec.europa.eu/eurostat" data={euroStatData} style={{color: "blue", weight: 0.2}}/>
      )}
    </>
  )
}

export {EuroStats}