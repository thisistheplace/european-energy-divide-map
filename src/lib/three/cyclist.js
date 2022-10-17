import React, { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, extend } from '@react-three/fiber'
import {Loader, OrbitControls, Environment} from '@react-three/drei'

import {Lights} from '../three/lights'

const Box = (props) => {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef()
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))
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
    const [rotation, setRotation] = useState(props.rotation);
    return (
        <>
            <Box />
        </>
    )
}

function SpillthebeansThreejs(props) {
    return (
      <>
        <Canvas shadows style={{'background':'white'}} camera={{position: [2, 1, 3]}}>
            <perspectiveCamera makeDefault position={[- 500, 500, 1500]} />
            <Lights/>
            <OrbitControls/>
            {/* <axesHelper /> */}
            <Suspense fallback={null}>
                <Model {...props}/>
                <Environment preset="warehouse" />
            </Suspense>
        </Canvas>
        <Loader />
      </>
    )
}

export {Cyclist}