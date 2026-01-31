"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, Environment, Text3D, Center, Stars } from "@react-three/drei";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

// قائمة بأسماء الصور (بدون مسارات)
const FRAME_IMAGES = [
  "player1.webp",
  "frame_47.webp",
  "frame_1c1dbc24-918f-419e-beac-6f2f8e98f561.webp",
  "frame_39_004f4584-e849-45e8-96a3-42095e70fd06.webp",
  "frame_32_585e7ebd-cb9b-446f-bd2e-8dd47f392570.webp",
  "frame_47.webp",
  "player1.jpg",
  "39_20.webp",
  "framex_5.webp",
  "framex_8.webp"
];

// مكون الإطار مع صورة اللاعب
function FrameCard({ position, rotation, delay, imageIndex, direction }: any) {
  const meshRef = useRef<any>(null);

  // استخدام texture loader لتحميل الصور
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
      (error) => {

        setTexture(null);
      }
    );
  }, [imageIndex]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      // حركة عمودية عائمة
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
      // حركة دوران بناءً على الاتجاه
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
        {/* الإطار الخارجي - أسود */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 2.3, 0.08]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* الإطار الداخلي - ذهبي */}
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[1.7, 2.2, 0.04]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={0.9}
            roughness={0.1}
            emissive="#FFD700"
            emissiveIntensity={hovered ? 0.15 : 0}
          />
        </mesh>

        {/* طبقة خلفية للصورة */}
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.55, 2.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* الصورة - تملأ المساحة بالكامل */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[1.55, 2.05]} />
          {texture ? (
            <meshBasicMaterial map={texture} />
          ) : (
            <meshStandardMaterial
              color="#2a2a2a"
              emissive="#3b82f6"
              emissiveIntensity={0.1}
            />
          )}
        </mesh>
      </group>
    </Float>
  );
}



// المشهد الرئيسي
function HeroScene() {
  return (
    <>
      {/* الإضاءة */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[-3, 3, 2]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[3, -3, 2]} intensity={0.8} color="#10b981" />

      {/* إطارات الصور - الصف العلوي (تتحرك لليمين) */}
      <FrameCard position={[-5, 3.5, -3]} rotation={[0, 0.4, 0]} delay={0} imageIndex={0} direction={1} />
      <FrameCard position={[-2, 3, -2.5]} rotation={[0, 0.3, 0]} delay={0.5} imageIndex={1} direction={1} />
      <FrameCard position={[1, 3.2, -3]} rotation={[0, 0.2, 0]} delay={1} imageIndex={2} direction={1} />
      <FrameCard position={[4, 3.5, -2.5]} rotation={[0, 0.1, 0]} delay={1.5} imageIndex={3} direction={1} />
      <FrameCard position={[6.5, 3, -3]} rotation={[0, 0.05, 0]} delay={2} imageIndex={4} direction={1} />

      {/* إطارات الصور - الصف السفلي (تتحرك لليسار) */}
      <FrameCard position={[-6.5, -3, -3]} rotation={[0, -0.1, 0]} delay={0} imageIndex={5} direction={-1} />
      <FrameCard position={[-4, -3.5, -2.5]} rotation={[0, -0.2, 0]} delay={0.5} imageIndex={6} direction={-1} />
      <FrameCard position={[-1, -3, -3]} rotation={[0, -0.3, 0]} delay={1} imageIndex={7} direction={-1} />
      <FrameCard position={[2, -3.5, -2.5]} rotation={[0, -0.4, 0]} delay={1.5} imageIndex={8} direction={-1} />
      <FrameCard position={[5, -3, -3]} rotation={[0, -0.5, 0]} delay={2} imageIndex={9} direction={-1} />

      {/* النجوم الخلفية */}
      <Stars radius={100} depth={50} count={1000} factor={4} />

      <Environment preset="studio" />

      {/* التحكم في الكاميرا */}
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

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative min-h-[80vh] overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* نمط خلفية ديناميكي */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/30 to-gray-900" />
      </div>

      {/* Canvas 3D */}
      <div className="absolute inset-0">
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 55 }}>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </Canvas>
      </div>

      {/* المحتوى في الأسفل */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 px-4 pb-12 pt-8"
      >
        <div className="max-w-5xl mx-auto">
          {/* العنوان الرئيسي */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6"
          >
            <div className="relative inline-block">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-3 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-300 to-blue-500 animate-pulse">
                  Premium Frames
                </span>
              </h1>
              {/* تأثير توهج تحت العنوان */}
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-2xl lg:text-3xl font-bold text-white/95 tracking-wide"
            >
              Football • Music • Series • Art & More
            </motion.div>
          </motion.div>

          {/* الوصف */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Discover exclusive premium frames featuring football legends, music icons,
            TV series stars, and all your favorite moments. Own a piece of history
            in stunning golden frames.
          </motion.p>

          {/* الأزرار */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 10px 40px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              /* route to products page */
              onClick={() => window.location.href = '/products'}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 border border-blue-400/30"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2m2 0a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2m14 0a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6a2 2 0 012-2m2 0a2 2 0 012 2v12a2 2 0 01-2 2h-2a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
                Browse Collection
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0 10px 40px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 border border-emerald-400/30"

              /* route to products page */
              onClick={() => window.location.href = '/products'}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Shop Now
              </span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* مؤشر التمرير */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <div className="w-5 h-8 border border-blue-400/30 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-gradient-to-b from-blue-400 to-transparent rounded-full" />
          </div>
          <span className="text-xs text-white/40 mt-1">Scroll</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

