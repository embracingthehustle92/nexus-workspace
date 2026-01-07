import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Text, RoundedBox, MeshDistortMaterial } from "@react-three/drei";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";

interface ModuleBoxProps {
  position: [number, number, number];
  color: string;
  icon: string;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

function ModuleBox({ position, color, icon, label, onClick, isActive }: ModuleBoxProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.1), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <RoundedBox args={[1.8, 1.8, 0.3]} radius={0.15} smoothness={4}>
            <MeshDistortMaterial
              color={color}
              speed={2}
              distort={hovered ? 0.2 : 0.1}
              transparent
              opacity={isActive ? 1 : 0.85}
            />
          </RoundedBox>
        </mesh>
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2"
        >
          {icon}
        </Text>
        <Text
          position={[0, -1.2, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff2"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function CentralOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.8, 2]} />
      <MeshDistortMaterial
        color="#8b5cf6"
        speed={3}
        distort={0.4}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

interface Workspace3DProps {
  onModuleSelect: (module: string) => void;
  activeModule?: string;
}

export default function Workspace3D({ onModuleSelect, activeModule }: Workspace3DProps) {
  const modules = [
    { id: "notes", position: [-3, 2, 0] as [number, number, number], color: "#6366f1", icon: "📝", label: "Notes" },
    { id: "crm", position: [0, 2, 0] as [number, number, number], color: "#8b5cf6", icon: "👥", label: "CRM" },
    { id: "content", position: [3, 2, 0] as [number, number, number], color: "#a855f7", icon: "📁", label: "Content" },
    { id: "projects", position: [-3, -1, 0] as [number, number, number], color: "#d946ef", icon: "📊", label: "Projects" },
    { id: "email", position: [0, -1, 0] as [number, number, number], color: "#ec4899", icon: "✉️", label: "Email" },
    { id: "code", position: [3, -1, 0] as [number, number, number], color: "#f43f5e", icon: "💻", label: "Code" },
  ];

  return (
    <div className="w-full h-full canvas-container">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0a0a0f"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
        
        <Suspense fallback={null}>
          <ParticleField />
          <CentralOrb />
          
          {modules.map((module) => (
            <ModuleBox
              key={module.id}
              position={module.position}
              color={module.color}
              icon={module.icon}
              label={module.label}
              onClick={() => onModuleSelect(module.id)}
              isActive={activeModule === module.id}
            />
          ))}
        </Suspense>
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
