'use client'

import { useRef, useMemo, Suspense, useSyncExternalStore } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, RoundedBox, Box, Octahedron, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function FloatingElements({ isMobile = false }: { isMobile?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  // Gentle idle rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.03) * 0.05
    }
  })

  // Materials with neon purple / academic cyan accents
  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    roughness: 0.1,
    transmission: 0.9,
    thickness: 1.2,
    transparent: true,
    opacity: 0.85,
    color: new THREE.Color('#a855f7'),
    emissive: new THREE.Color('#581c87'),
    emissiveIntensity: 0.2,
  }), [])

  const accentMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8b5cf6'),
    roughness: 0.2,
    metalness: 0.8,
    emissive: new THREE.Color('#6d28d9'),
    emissiveIntensity: 0.3,
  }), [])

  const secondaryMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#06b6d4'),
    roughness: 0.3,
    metalness: 0.6,
    emissive: new THREE.Color('#0891b2'),
    emissiveIntensity: 0.2,
  }), [])

  return (
    <group ref={groupRef} scale={isMobile ? 0.75 : 1} position={isMobile ? [0, 0, 0] : [0, 0, 0]}>
      {/* 1. Main floating abstract paper / slate */}
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5} position={isMobile ? [1.5, 2, -3] : [4, 2, -2]}>
        <RoundedBox args={[2.5, 3.2, 0.15]} radius={0.1} smoothness={4} material={glassMaterial}>
          <MeshDistortMaterial
            color="#8b5cf6"
            distort={0.15}
            speed={1.5}
            roughness={0.2}
            metalness={0.4}
            transparent
            opacity={0.65}
          />
        </RoundedBox>
      </Float>

      {/* 2. Floating geometric cubes representing data/records */}
      <Float speed={2.5} rotationIntensity={2} floatIntensity={2} position={isMobile ? [-2, 1, -4] : [-4.5, 1.5, -4]}>
        <Octahedron args={[1.2]} material={accentMaterial} />
      </Float>

      <Float speed={1.8} rotationIntensity={1} floatIntensity={1.5} position={isMobile ? [-1.5, -3, -4] : [-3, -3, -3]}>
        <Box args={[1.4, 1.4, 1.4]} material={secondaryMaterial} />
      </Float>

      {/* 3. Orbiting glass spheres */}
      <Float speed={3} rotationIntensity={3} floatIntensity={2.5} position={isMobile ? [2, -2, -5] : [5, -2, -5]}>
        <Sphere args={[0.8, 32, 32]} material={glassMaterial} />
      </Float>

      <Float speed={1.2} rotationIntensity={1} floatIntensity={1} position={[-5, 0, -6]}>
        <Sphere args={[0.5, 16, 16]} material={accentMaterial} />
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={0.8} position={[3, -5, -6]}>
        <Box args={[0.5, 0.5, 0.5]} material={secondaryMaterial} />
      </Float>
    </group>
  )
}

function subscribe(callback: () => void) {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

function getClientSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return !prefersReducedMotion
}

function getServerSnapshot(): boolean {
  return false
}

export default function Hero3DScene() {
  const shouldRender = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)

  if (!shouldRender) return null

  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-75 sm:opacity-70">
      <Suspense fallback={null}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: isMobile ? 55 : 45 }} 
          dpr={isMobile ? [1, 1] : [1, 1.5]}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[10, 10, 5]} intensity={2.0} color="#ffffff" />
          <directionalLight position={[-10, -10, -5]} intensity={1.2} color="#8b5cf6" />
          <pointLight position={[0, 0, 5]} intensity={1.5} color="#c084fc" />
          <FloatingElements isMobile={isMobile} />
        </Canvas>
      </Suspense>
    </div>
  )
}
