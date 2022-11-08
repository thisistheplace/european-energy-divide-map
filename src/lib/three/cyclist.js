import React, { useRef, useState, Suspense, useEffect, useLayoutEffect } from 'react'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls} from '@react-three/drei'
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

function Line(props) {
  const ref = useRef()

  useEffect(() => {
    // console.log("updating geom")
    ref.current.geometry.setFromPoints(props.points)
  }, [props.update])

  return (
    <line ref={ref}>
      <bufferGeometry />
      <lineBasicMaterial color="hotpink" />
    </line>
  )
}

const Route = (props) => {
  const [points, setPoints] = useState([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)])
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    if (props.data){
      props.data.forEach(element => {
        element.add(props.change)
      });
      // console.log(props.data[0])
      // console.log("setting points")
      setPoints(props.data)
      setUpdate(!update)
    }
  }, [props.data])

  // useFrame

  return <Line
    points={points}
    update={update}
  />
}

const Model = (props) => {
  return (
      <>
          {/* <Box position={props.position}/> */}
          <Route data={props.routeData} change={props.change}/>
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
  const [position, setPosition] = useState(props.position)
  const [changePosition, setChangePosition] = useState(new THREE.Vector3(0, 0, 0))
  const [center, setCenter] = useState(props.center)
  const [cameraPosition, setCameraPosition] = useState([props.position.x, props.position.y, 2000])
  const [target, setTarget] = useState(new THREE.Vector3(position[0], position[1], position[2]))
  const [renderSize, setRenderSize] = useState({x:0, y:0})

  useEffect(() => {
    if (props.bounds){
      const x = props.bounds.max.x - props.bounds.min.x
      const y = props.bounds.max.y - props.bounds.min.y
      // console.log(x, y)
      setRenderSize({x: x, y: y})
    }
  }, [props.bounds])

  useEffect(() => {
    // console.log(props.center, center)
    const change = {x: props.center.x - center.x, y: props.center.y - center.y}
    // console.log("change:", change)
    // setCameraPosition([cameraPosition[0] + change.x, cameraPosition[1] + change.y, cameraPosition[2]])
    changePosition.x = change.x
    changePosition.y = change.y
    setChangePosition(new THREE.Vector3().copy(changePosition))
    // console.log("position:", position)
    // console.log("changePosition:", changePosition)
    // setTarget(new THREE.Vector3(target.x + change.x, target.y + change.y, target.z))
    setCenter(props.center)
    console.log('renderSize:', renderSize)
  }, [props.center])

  // useEffect(() => {
  //   setCameraPosition()
  // })

  // console.log(renderSize)

  return (
    <div style={{"position": "absolute", "zIndex":"1000", "top":"0px", "left":"0px", "width":"100%", "height":"100%", "pointerEvents": "none"}}>
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
            far={1000000}
          />
          <OrbitControls/>
          {/* <ResizeRenderer size={renderSize}/> */}
          <axesHelper />
          {/* <OrthographicCamera makeDefault position={position}> */}
          <Suspense fallback={null}>
            <Model routeData={props.routeData} change={changePosition}/>
          </Suspense>
          {/* </OrthographicCamera> */}
      </Canvas>
    </div>
  )
}

export { Cyclist }