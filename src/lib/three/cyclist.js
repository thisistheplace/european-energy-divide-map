import React, { useRef, useState, Suspense, useEffect } from 'react'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls, Line} from '@react-three/drei'
import * as THREE from 'three'
extend(THREE)

import {Lights} from '../three/lights'
import { Camera } from './camera'

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

const Route = (props) => {
  const [points, setPoints] = useState([[0, 0, 0], [0, 0, 0]])

  useEffect(() => {
    if (props.data){
      console.log("making geometry")
      console.log(props.data)
      setPoints(props.data)
    }
  }, [props.data])

  return (<Line
    points={points}
  />)
}

const Model = (props) => {
  return (
      <>
          {/* <Box position={props.position}/> */}
          <Route data={props.routeData}/>
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
  const [cameraPosition, setCameraPosition] = useState([props.position.x, props.position.y, 50])
  const [target, setTarget] = useState(new THREE.Vector3(position[0], position[1], position[2]))
  const [renderSize, setRenderSize] = useState({x:0, y:0})


  useEffect(() => {
    setPosition([props.position.x, props.position.y, -5])
    setCameraPosition([props.position.x, props.position.y, 5000])
    setTarget(new THREE.Vector3(position[0], position[1], position[2]))
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
          <Camera
            position={cameraPosition}
            target={target}
            left={renderSize.x / -2}
            right={renderSize.x / 2}
            top={renderSize.y / 2}
            bottom={renderSize.y / -2}
            near={1}
            far={10000}
          />
          <OrbitControls/>
          {/* <ResizeRenderer size={renderSize}/> */}
          <axesHelper />
          {/* <OrthographicCamera makeDefault position={position}> */}
          <Suspense fallback={null}>
            <Model position={position} routeData={props.routeData}/>
          </Suspense>
          {/* </OrthographicCamera> */}
      </Canvas>
    </div>
  )
}

export { Cyclist }