import React, {useRef, useEffect} from 'react';
import {useThree} from '@react-three/fiber'

const UpdateCamera = (props) => {
  
  const {camera} = useThree()

  useEffect(() => {
    if (camera != null){
      const [x, y, z] = props.cameraPosition
      camera.position.set(x, y, z)
    }
  }, [props.cameraPosition])

  return (null)
}

export {UpdateCamera}