import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {OrbitControls, OrthographicCamera} from '@react-three/drei'

import {Lights} from '../three/lights'
import { UpdateCamera, Camera } from './camera'

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
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
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

const Model = (props) => {
    return (
        <>
            <Box position={props.position}/>
            <Box position={[0., 0., 0.]}/>
        </>
    )
}

const Cyclist = (props) => {
  const [modelPosition, setModelPosition] = useState([props.modelPosition.x, props.modelPosition.y, 0])
  const [cameraPosition, setCameraPosition] = useState([props.cameraPosition.x, props.cameraPosition.y, 500])

  useEffect(() => {
    setCameraPosition([props.cameraPosition.x, props.cameraPosition.y, 500 / props.zoom])
  }, [props.cameraPosition, props.zoom])

  return (
    <div style={{"position": "absolute", "zIndex":"1000", "top":"0px", "left":"0px", "width":"100%", "height":"100%", "pointerEvents": "none"}}>
      <Canvas shadows style={{'background':'clear'}}>
          {/* <OrthographicCamera makeDefault position={cameraPosition}/> */}
          {/* <UpdateCamera position={cameraPosition}/> */}
          <Camera position={cameraPosition} lookAt={modelPosition}/>
          <Lights/>
          <OrbitControls/>
          <axesHelper />
          <Suspense fallback={null}>
            <Model position={modelPosition}/>
          </Suspense>
      </Canvas>
    </div>
  )
}

export { Cyclist }