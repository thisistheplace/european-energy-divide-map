import React, {useRef, useEffect, useState} from 'react';
import {extend, useThree} from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'

extend(THREE)

function Camera(props) {
  
  const ref = useRef()
  const set = useThree((state) => state.set)
  // This makes sure that size-related calculations are proper
  // Every call to useThree will return this camera instead of the default camera 
  useEffect(() => {
    set({ camera: ref.current })
  }, [])

  return <orthographicCamera ref={ref} {...props}/>
}

const UpdateCamera = (props) => {
  
  const {camera} = useThree()

  useEffect(() => {
    if (props.position != null){
      const [x, y, z] = props.position
      camera.position.set(x, y, z)
    }
  }, [props.position])

  return (null)
}

export {UpdateCamera, Camera}