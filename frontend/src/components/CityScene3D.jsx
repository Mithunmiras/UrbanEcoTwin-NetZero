/**
 * CityScene3D — Three.js 3D digital twin of Chennai.
 *
 * Dynamically positions zones based on their lat/lng coordinates.
 * Building height ∝ CO₂ level, color = risk level.
 * Includes floating labels, pollution particles, and orbit controls.
 */

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Coordinate Mapping ───────────────────────────────────────── */
// Convert lat/lng to 3D scene positions
// Chennai roughly spans lat 12.85–13.25, lng 80.10–80.35
const LAT_CENTER = 13.03;
const LNG_CENTER = 80.22;
const SCALE = 22; // degrees → scene units multiplier

function latLngToScene(lat, lng) {
  return {
    x: (lng - LNG_CENTER) * SCALE,
    z: -(lat - LAT_CENTER) * SCALE, // negative because lat increases northward
  };
}

const RISK_COLORS = {
  Critical: '#ef4444',
  High: '#f97316',
  Medium: '#eab308',
  Low: '#22c55e',
};

/* ─── Building Component ────────────────────────────────────────── */

function Building({ position, height, color, opacity = 0.85 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.02;
      meshRef.current.scale.x = hovered ? 1.08 : 1;
      meshRef.current.scale.z = hovered ? 1.08 : 1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[position[0], height / 2, position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow receiveShadow
    >
      <boxGeometry args={[0.25, height, 0.25]} />
      <meshStandardMaterial
        color={color} transparent opacity={hovered ? 1 : opacity}
        emissive={color} emissiveIntensity={hovered ? 0.4 : 0.15}
        metalness={0.3} roughness={0.6}
      />
    </mesh>
  );
}

/* ─── Zone Cluster ──────────────────────────────────────────────── */

function ZoneCluster({ zone, position, isSelected, onSelect }) {
  const baseHeight = Math.max(0.8, ((zone.current_co2_ppm - 350) / 150) * 3 + 0.8);
  const riskColor = zone.risk_color || RISK_COLORS[zone.risk_level] || '#3b82f6';

  const buildings = useMemo(() => {
    const count = 5;
    const result = [];
    const seed = zone.id.charCodeAt(0) + zone.id.charCodeAt(zone.id.length - 1);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.25 + (((seed * (i + 1)) % 5) / 15);
      result.push({
        offset: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius],
        height: baseHeight * (0.4 + (((seed * (i + 3)) % 7) / 10)),
      });
    }
    return result;
  }, [zone.id, baseHeight]);

  return (
    <group
      position={[position.x, 0, position.z]}
      onClick={(e) => { e.stopPropagation(); onSelect(zone.id); }}
    >
      {buildings.map((b, i) => (
        <Building key={i} position={b.offset} height={b.height} color={riskColor}
          opacity={isSelected ? 1 : 0.8} />
      ))}

      {isSelected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.8, 1.0, 32]} />
          <meshBasicMaterial color={riskColor} transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.9, 32]} />
        <meshStandardMaterial color={riskColor} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>

      <Float speed={1.2} rotationIntensity={0} floatIntensity={0.3}>
        <Text position={[0, baseHeight + 0.8, 0]} fontSize={0.18} color="#e2e8f0"
          anchorX="center" anchorY="middle">
          {zone.name}
        </Text>
        <Text position={[0, baseHeight + 0.5, 0]} fontSize={0.12} color={riskColor}
          anchorX="center" anchorY="middle">
          {`AQI ${zone.current_aqi}  •  CO₂ ${zone.current_co2_ppm}`}
        </Text>
        <Text position={[0, baseHeight + 0.28, 0]} fontSize={0.1} color={riskColor}
          anchorX="center" anchorY="middle">
          {`${zone.avg_temperature_c?.toFixed(1) ?? '--'}°C  •  ${zone.risk_level}`}
        </Text>
      </Float>
    </group>
  );
}

/* ─── Pollution Particles ───────────────────────────────────────── */

function PollutionParticles({ zones }) {
  const particlesRef = useRef();
  const count = 800;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 5 + 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
      const zone = zones[i % zones.length];
      const intensity = Math.min((zone?.current_aqi || 50) / 200, 1);
      col[i * 3] = 0.9 * intensity + 0.2;
      col[i * 3 + 1] = 0.6 * (1 - intensity);
      col[i * 3 + 2] = 0.1;
    }
    return { positions: pos, colors: col };
  }, [zones]);

  useFrame((state) => {
    if (!particlesRef.current) return;
    const arr = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += 0.003 + Math.sin(state.clock.elapsedTime + i) * 0.001;
      arr[i * 3] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.1) * 0.002;
      if (arr[i * 3 + 1] > 6) arr[i * 3 + 1] = 0.5;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.5}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ─── Ground ────────────────────────────────────────────────────── */

function GroundGrid() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0a0f1a" metalness={0.2} roughness={0.8} />
      </mesh>
      <gridHelper args={[20, 40, '#1e293b', '#0f172a']} />
    </group>
  );
}

/* ─── Main Scene ────────────────────────────────────────────────── */

function Scene({ zones, selectedZoneId, onSelectZone }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[8, 12, 5]} intensity={0.8} castShadow />
      <pointLight position={[0, 8, 0]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[-5, 5, -5]} intensity={0.2} color="#22c55e" />
      <fog attach="fog" args={['#0a0f1a', 10, 25]} />

      <GroundGrid />

      {zones.map((zone) => {
        const pos = latLngToScene(zone.lat, zone.lng);
        return (
          <ZoneCluster key={zone.id} zone={zone} position={pos}
            isSelected={selectedZoneId === zone.id} onSelect={onSelectZone} />
        );
      })}

      <PollutionParticles zones={zones} />

      <OrbitControls enablePan enableZoom enableRotate
        maxPolarAngle={Math.PI / 2.2} minDistance={4} maxDistance={20}
        autoRotate autoRotateSpeed={0.3} />
    </>
  );
}

/* ─── Export ─────────────────────────────────────────────────────── */

export default function CityScene3D({ zones, selectedZoneId, onSelectZone }) {
  if (!zones || zones.length === 0) return null;
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [6, 7, 6], fov: 50 }}
        gl={{ antialias: true, alpha: false }} style={{ background: '#0a0f1a' }}
        onPointerMissed={() => onSelectZone(null)}>
        <Scene zones={zones} selectedZoneId={selectedZoneId} onSelectZone={onSelectZone} />
      </Canvas>
    </div>
  );
}
