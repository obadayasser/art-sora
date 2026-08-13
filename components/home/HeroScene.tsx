'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D hero scene — two rows of floating golden frames displaying
 * real product artwork from /public/img. Loaded lazily (client-only)
 * so the Three.js bundle never blocks first paint.
 */

const FRAME_IMAGES = [
  '1.jpeg',
  '2.jpeg',
  '3.jpeg',
  '4.jpeg',
  '5.jpeg',
  '6.jpeg',
  '7.jpeg',
  '8.jpeg',
  '12.jpeg',
  'frame_1c1dbc24-918f-419e-beac-6f2f8e98f561.webp',
];

interface FrameCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  delay: number;
  imageIndex: number;
  direction: 1 | -1;
}

function FrameCard({ position, rotation, delay, imageIndex, direction }: FrameCardProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      `/img/${FRAME_IMAGES[imageIndex % FRAME_IMAGES.length]}`,
      (loadedTexture) => {
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTexture);
      },
      undefined,
      () => setTexture(null),
    );
  }, [imageIndex]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      // Gentle float + sway, direction alternates per row.
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3) * direction * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Outer frame — dark wood */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 2.3, 0.08]} />
          <meshStandardMaterial color="#1a1611" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Inner frame — antique gold */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1.7, 2.2, 0.04]} />
          <meshStandardMaterial
            color="#c9a227"
            metalness={0.9}
            roughness={0.15}
            emissive="#c9a227"
            emissiveIntensity={hovered ? 0.2 : 0}
          />
        </mesh>

        {/* Matte backing */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.55, 2.05]} />
          <meshStandardMaterial color="#f4f1ea" />
        </mesh>

        {/* Artwork */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.55, 2.05]} />
          {texture ? (
            <meshBasicMaterial map={texture} />
          ) : (
            <meshStandardMaterial color="#241f17" emissive="#c9a227" emissiveIntensity={0.08} />
          )}
        </mesh>
      </group>
    </Float>
  );
}

function SceneContents() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" castShadow />
      <pointLight position={[-3, 3, 2]} intensity={0.7} color="#c9a227" />
      <pointLight position={[3, -3, 2]} intensity={0.6} color="#f4f1ea" />

      {/* Top row — drifts right */}
      <FrameCard position={[-5, 3.5, -3]} rotation={[0, 0.4, 0]} delay={0} imageIndex={0} direction={1} />
      <FrameCard position={[-2, 3, -2.5]} rotation={[0, 0.3, 0]} delay={0.5} imageIndex={1} direction={1} />
      <FrameCard position={[1, 3.2, -3]} rotation={[0, 0.2, 0]} delay={1} imageIndex={2} direction={1} />
      <FrameCard position={[4, 3.5, -2.5]} rotation={[0, 0.1, 0]} delay={1.5} imageIndex={3} direction={1} />
      <FrameCard position={[6.5, 3, -3]} rotation={[0, 0.05, 0]} delay={2} imageIndex={4} direction={1} />

      {/* Bottom row — drifts left */}
      <FrameCard position={[-6.5, -3, -3]} rotation={[0, -0.1, 0]} delay={0} imageIndex={5} direction={-1} />
      <FrameCard position={[-4, -3.5, -2.5]} rotation={[0, -0.2, 0]} delay={0.5} imageIndex={6} direction={-1} />
      <FrameCard position={[-1, -3, -3]} rotation={[0, -0.3, 0]} delay={1} imageIndex={7} direction={-1} />
      <FrameCard position={[2, -3.5, -2.5]} rotation={[0, -0.4, 0]} delay={1.5} imageIndex={8} direction={-1} />
      <FrameCard position={[5, -3, -3]} rotation={[0, -0.5, 0]} delay={2} imageIndex={9} direction={-1} />

      <Stars radius={100} depth={50} count={800} factor={4} />
      <Environment preset="studio" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        minDistance={5}
        maxDistance={18}
      />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 10], fov: 55 }}>
      <Suspense fallback={null}>
        <SceneContents />
      </Suspense>
    </Canvas>
  );
}
