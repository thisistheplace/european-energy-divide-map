import React, { useRef, useState, Suspense, useEffect, useLayoutEffect } from 'react'
import { extend, Canvas, useFrame, useThree } from '@react-three/fiber'
import {OrbitControls, Points} from '@react-three/drei'
import * as THREE from 'three'
extend(THREE)

import {Lights} from '../three/lights'
import { Camera } from './camera'
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
      ref.current.position.set(props.position.x, props.position.y, 0)
      // console.log("set box position", props.position)
    }
  }, [props.position])
  // console.log("box props", props)
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      // {...props}
      ref={ref}
      scale={clicked ? 1.5 : 100}
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

// const Route = (props) => {
//   const [points, setPoints] = useState([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)])
//   const [update, setUpdate] = useState(false)

//   useEffect(() => {
//     if (props.data){
//       props.data.forEach(element => {
//         element.add(props.change)
//       });
//       // console.log(props.data[0])
//       // console.log("setting points")
//       setPoints(props.data)
//       setUpdate(!update)
//     }
//   }, [props.data])

//   // useFrame

//   return <Line
//     points={points}
//     update={update}
//   />
// }

const Route = (props) => {
  const [points, setPoints] = useState(new Float32Array([0,0,0,1000,1000,0]))
  const [update, setUpdate] = useState(false)

  useEffect(() => {
    if (props.data){
      const newPoints = []
      props.data.forEach(element => {
        newPoints.push(element.x, element.y, element.z)
      });
      // console.log(props.data[0])
      // console.log("setting points")
      setPoints(new Float32Array(newPoints))
      console.log(points)
      setUpdate(!update)
    }
  }, [props.data])

  // useFrame

  return (
    <Points positions={points}>
      <pointsMaterial color={"blue"}/>
    </Points>
  )
}

const Model = (props) => {
  return (
      <>
          {/* <Box position={props.position}/> */}
          {/* <Box /> */}
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
  // console.log(props.center)
  const [changePosition, setChangePosition] = useState(new THREE.Vector3(0, 0, 0))
  const [center, setCenter] = useState(props.center)
  const [cameraPosition, setCameraPosition] = useState([props.center.x, props.center.y, 1e4])
  const [target, setTarget] = useState(new THREE.Vector3(props.center.x, props.center.y, 0))
  const [renderSize, setRenderSize] = useState(props.center)

  useEffect(() => {
    if (props.bounds){
      console.log("cyclist bounds", props.bounds)
      setRenderSize(props.bounds)
    }
  }, [props.bounds])

  useEffect(() => {
    if (props.center){
      setCameraPosition([props.center.x, props.center.y, 1e4])
      setTarget(new THREE.Vector3(props.center.x, props.center.y, 0))
      // console.log("center", center)
      // console.log("cameraPosition", cameraPosition)
    }
  }, [props])

  // useEffect(() => {
  //   // console.log(props.center, center)
  //   const change = {x: props.center.x - center.x, y: props.center.y - center.y}
  //   // console.log("change:", change)
  //   // setCameraPosition([cameraPosition[0] + change.x, cameraPosition[1] + change.y, cameraPosition[2]])
  //   changePosition.x = change.x
  //   changePosition.y = change.y
  //   setChangePosition(new THREE.Vector3().copy(changePosition))
  //   // console.log("position:", position)
  //   // console.log("changePosition:", changePosition)
  //   // setTarget(new THREE.Vector3(target.x + change.x, target.y + change.y, target.z))
  //   setCenter(props.center)
  //   console.log('renderSize:', renderSize)
  // }, [props.center])

  // useEffect(() => {
  //   setCameraPosition()
  // })

  // console.log(renderSize)

  console.log(props)

  return (
    <div style={{"position": "absolute", "zIndex":"1000", "top":"0px", "left":"0px", "width":"100%", "height":"100%", "pointerEvents": "none"}}>
    {/* <div style={{"position": "absolute", "zIndex":"1000", "top":"0px", "left":"0px", "width":"100%", "height":"100%"}}> */}
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
            far={1e6}
          />
          <OrbitControls
            zoomSpeed={0.5}
          />
          {/* <ResizeRenderer size={renderSize}/> */}
          <axesHelper scale={100000}/>
          {/* <OrthographicCamera makeDefault position={position}> */}
          <Suspense fallback={null}>
            <Model routeData={props.routeData} change={changePosition} position={props.center}/>
          </Suspense>
          {/* </OrthographicCamera> */}
      </Canvas>
    </div>
  )
}

export { Cyclist }