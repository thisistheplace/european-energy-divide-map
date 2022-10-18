import React, {useRef, useEffect, useState} from 'react';
import { extend, useThree } from '@react-three/fiber'
import { MapControls, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
extend(THREE)

const Controls = (props) => {
  const {camera} = useThree()
  // const [scale, setScale] = useState(new THREE.Vector3(1, 1, 1))
  const [x, y, z] = props.target
  const [target, setTarget] = useState(new THREE.Vector3(x, y, z))
  // useEffect(() => {
  //   setScale(new THREE.Vector3(props.scale, props.scale, props.scale))
  // }, [props.scale])

  useEffect(() => {
    const [x, y, z] = props.target
    setTarget(new THREE.Vector3(x, y, z))
    console.log(target)
  }, [props.target])

  return (
      <MapControls camera={camera} enableRotate={true} enableZoom={true} enablePan={true} screenSpacePanning={true} target={target}/>
  )
}

export {Controls}