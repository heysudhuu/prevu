'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Box, Cone, Cylinder, Torus, Sphere } from '@react-three/drei'
import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import * as THREE from 'three'

// Abstract 3D Graduation Cap
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GradCap({ material, ...props }: any) {
  return (
    <group {...props}>
      <Box args={[1.6, 0.1, 1.6]} position={[0, 0.4, 0]} material={material} />
      <Cylinder args={[0.7, 0.7, 0.8, 32]} position={[0, 0, 0]} material={material} />
      <Box args={[0.05, 0.8, 0.05]} position={[0.6, 0.2, 0.6]} rotation={[0, 0, -Math.PI / 4]} material={new THREE.MeshStandardMaterial({ color: '#8b5cf6' })} />
    </group>
  )
}

// Abstract 3D Coffee Cup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CoffeeCup({ material, secondaryMaterial, ...props }: any) {
  return (
    <group {...props}>
      <Cylinder args={[0.6, 0.5, 1.4, 32]} material={material} />
      <Torus args={[0.35, 0.08, 16, 32]} position={[0.6, 0, 0]} material={secondaryMaterial} />
    </group>
  )
}

// Abstract 3D Pencil
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Pencil({ material, secondaryMaterial, ...props }: any) {
  return (
    <group {...props}>
      <Cylinder args={[0.15, 0.15, 2, 6]} rotation={[Math.PI / 2, 0, 0]} material={material} />
      <Cone args={[0.15, 0.4, 6]} position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]} material={new THREE.MeshStandardMaterial({ color: '#8b5cf6' })} />
      <Cone args={[0.04, 0.1, 6]} position={[0, 0, 1.45]} rotation={[Math.PI / 2, 0, 0]} material={new THREE.MeshStandardMaterial({ color: '#111827' })} />
      <Cylinder args={[0.15, 0.15, 0.3, 32]} position={[0, 0, -1.15]} rotation={[Math.PI / 2, 0, 0]} material={secondaryMaterial} />
    </group>
  )
}

// Abstract 3D Book stack
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BookStack({ material, secondaryMaterial, ...props }: any) {
  return (
    <group {...props}>
      <Box args={[1.8, 0.3, 1.4]} position={[0, 0, 0]} material={material} />
      <Box args={[1.7, 0.28, 1.3]} position={[0, 0, 0]} material={new THREE.MeshStandardMaterial({ color: 'white' })} />
      
      <Box args={[1.6, 0.25, 1.2]} position={[0.1, 0.3, 0.1]} rotation={[0, 0.2, 0]} material={secondaryMaterial} />
      <Box args={[1.5, 0.23, 1.1]} position={[0.1, 0.3, 0.1]} rotation={[0, 0.2, 0]} material={new THREE.MeshStandardMaterial({ color: 'white' })} />
    </group>
  )
}

function FloatingElements() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      (state.mouse.x * Math.PI) / 10,
      0.05
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      (state.mouse.y * Math.PI) / 10,
      0.05
    )
  })

  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8b5cf6', roughness: 0.3, metalness: 0.7 }), [])
  const secondaryMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#c084fc', roughness: 0.2, metalness: 0.5 }), [])
  const darkMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#27272a', roughness: 0.6 }), [])

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[-4.5, 1, -2]}>
        <BookStack material={darkMaterial} secondaryMaterial={material} />
      </Float>

      <Float speed={2.5} rotationIntensity={1.5} floatIntensity={1.5} position={[4.5, -1.5, -3]}>
        <GradCap material={darkMaterial} rotation={[0.2, -0.4, 0.1]} />
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={2} position={[-3, -3, -1]}>
        <CoffeeCup material={darkMaterial} secondaryMaterial={material} rotation={[-0.2, 0.4, -0.1]} />
      </Float>
      
      <Float speed={3} rotationIntensity={1.5} floatIntensity={1} position={[4, 3, -2]}>
        <Pencil material={secondaryMaterial} secondaryMaterial={material} rotation={[0, 0, Math.PI / 4]} />
      </Float>
      
      {/* Background scattered particles */}
      <Float speed={1} rotationIntensity={3} floatIntensity={0.5} position={[-2, 5, -8]}>
        <Sphere args={[0.3, 16, 16]} material={material} />
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={0.8} position={[3, -5, -6]}>
        <Box args={[0.5, 0.5, 0.5]} material={secondaryMaterial} />
      </Float>
    </group>
  )
}

export default function Hero3DScene() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const mobile = window.innerWidth < 768
      setReducedMotion(prefersReducedMotion)
      setIsMobile(mobile)
      setMounted(true)
    } catch {
      setMounted(true)
    }
  }, [])

  // Disable completely if reduced motion is requested, or if mobile (for performance)
  if (!mounted || reducedMotion || isMobile) return null

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-70">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={1.0} color="#8b5cf6" />
          <pointLight position={[0, 0, 5]} intensity={1.5} color="#c084fc" />
          <FloatingElements />
        </Canvas>
      </Suspense>
    </div>
  )
}
