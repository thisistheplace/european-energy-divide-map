import React, {useRef, useEffect, useState} from 'react';
import {extend, useThree} from '@react-three/fiber'
import * as THREE from 'three'

extend(THREE)

function Camera(props) {
  console.log(props)
  const ref = useRef()
  const set = useThree((state) => state.set)
  // This makes sure that size-related calculations are proper
  // Every call to useThree will return this camera instead of the default camera 
  useEffect(() => {
    set({ camera: ref.current })
  }, [])

  return <orthographicCamera ref={ref} position={props.position} target={props.lookAt} />
}

const UpdateCamera = (props) => {
  
  const {camera} = useThree()

  useEffect(() => {
    if (props.position != null){
      const [x, y, z] = props.position
      camera.position.set(x, y, z)
      console.log(camera)
    }
  }, [props.position])

  return (null)
}

export {UpdateCamera, Camera}