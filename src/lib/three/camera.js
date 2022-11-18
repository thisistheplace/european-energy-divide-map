import React, {useRef, useEffect, useState} from 'react';
import {extend, useFrame, useThree} from '@react-three/fiber'
import { OrthographicCamera, useHelper } from '@react-three/drei'
import * as THREE from 'three'
import { CameraHelper } from 'three';

extend(THREE)

function Camera(props) {
  const ref = useRef()
  const set = useThree((state) => state.set)
  const [target, setTarget] = useState(props.target)
  // This makes sure that size-related calculations are proper
  // Every call to useThree will return this camera instead of the default camera 
  useEffect(() => {
    set({ camera: ref.current })
  }, [])

  useEffect(() => {
    if (props.position != null){
      const [x, y, z] = props.position
      const posVec = new THREE.Vector3(x, y, z)
      ref.current.position.lerp(posVec, 0.05)
      ref.current.updateProjectionMatrix()
      console.log("updated camera position", props.position)
    }
  }, [props.position])

  useEffect(() => {
    setTarget(props.target)
  }, [props.target])

  useFrame((state) => {
    if (target != null){
      const [x, y, z] = target
      state.camera.lookAt(x, y, z)
      state.camera.updateProjectionMatrix()
    }
  }, [target])

  // useFrame(() => {

  // }

  // useHelper(ref, CameraHelper, 1, 'hotpink')

  return <OrthographicCamera ref={ref} {...props}/>
}

export {Camera}