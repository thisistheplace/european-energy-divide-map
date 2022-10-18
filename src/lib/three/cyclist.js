import React, { useRef, useState, Suspense, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls, PerspectiveCamera} from '@react-three/drei'

import {Lights} from '../three/lights'

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
  useEffect(() => {
    console.log(props)
    if (ref.current && props.position) {
      ref.current.position.set(props.position.x, props.position.y, ref.current.position.z)
    }
  }, [props.position])
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
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
        </>
    )
}

const Cyclist = (props) => {
  return (
    <div style={{"position": "absolute", "zIndex":"1000", "top":"0px", "left":"0px", "pointerEvents": "none", "width":"100%", "height":"100%"}}>
      <Canvas shadows style={{'background':'clear'}}>
          <Lights/>
          <OrbitControls/>
          <axesHelper />
          <Suspense fallback={null}>
            <Model position={props.position}/>
          </Suspense>
      </Canvas>
    </div>
  )
}

export { Cyclist }