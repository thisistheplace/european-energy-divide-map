import React, { useRef, useState, Suspense, useEffect } from 'react'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls, OrthographicCamera} from '@react-three/drei'
import * as THREE from 'three'
extend(THREE)


import {Lights} from '../three/lights'
import { UpdateCamera, Camera } from './camera'
import { Controls } from './controls'
import { bounds } from 'leaflet'

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  useEffect(() => {
    if (ref.current && props.position) {
      const [x, y, z] = props.position
      ref.current.position.set(x, y, z)
    }
  }, [props.position])
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      // {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[10, 10, 10]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Model = (props) => {
    return (
        <>
            <Box position={props.position}/>
            {/* <Box position={[0., 0., 0.]}/> */}
        </>
    )
}

const ResizeRenderer = (props) => {
  const {gl} = useThree()
  useEffect(() => {
    gl.setSize(props.size.x, props.size.y)
  }, [props.size])
  return null
}

const Cyclist = (props) => {
  const [position, setPosition] = useState([props.position.x, props.position.y, -5])
  const [renderSize, setRenderSize] = useState({x:0, y:0})

  useEffect(() => {
    setPosition([props.position.x, props.position.y, -5])
    console.log(position)
  }, [props.position])

  useEffect(() => {
    if (props.bounds){
      const x = props.bounds.max.x - props.bounds.min.x
      const y = props.bounds.max.y - props.bounds.min.y
      console.log(x, y)
      setRenderSize({x: x, y: y})
    }
  }, [props.bounds])

  return (
    <div style={{"position": "absolute", "zIndex":"1000", "top":"0px", "left":"0px", "width":"100%", "height":"100%"}}>
      <Canvas shadows style={{'background':'clear'}}>
          <Lights/>
          {/* <Camera position={position}/> */}
          <OrbitControls/>
          {/* <ResizeRenderer size={renderSize}/> */}
          <axesHelper />
          <OrthographicCamera makeDefault position={position}>
          <Suspense fallback={null}>
            <Model position={position}/>
          </Suspense>
          </OrthographicCamera>
      </Canvas>
    </div>
  )
}

export { Cyclist }