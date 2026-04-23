import { useRef, useState, useMemo } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Constellation = ({ data, onClick }) => {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1 + data.position[0]) * 0.05;
      groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.08 + data.position[1]) * 0.03;
    }
  });

  const color = useMemo(() => new THREE.Color(data.color), [data.color]);
  const brightColor = useMemo(
    () => new THREE.Color(data.color).multiplyScalar(hovered ? 3 : 1.5),
    [data.color, hovered]
  );

  const linePoints = useMemo(() =>
    data.lines.map(([a, b]) => [
      new THREE.Vector3(...data.stars[a]),
      new THREE.Vector3(...data.stars[b]),
    ]),
    [data]
  );

  const hitbox = useMemo(() => {
    const xs = data.stars.map(p => p[0]);
    const ys = data.stars.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    return {
      w: maxX - minX + 1.5,
      h: maxY - minY + 1.5,
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
    };
  }, [data]);

  const labelPosition = [
    data.stars.reduce((s, p) => s + p[0], 0) / data.stars.length,
    data.stars.reduce((s, p) => s + p[1], 0) / data.stars.length - 0.8,
    0,
  ];

  return (
    <group
      ref={groupRef}
      position={data.position}
      onClick={(e) => { e.stopPropagation(); onClick(data); }}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      <mesh position={[hitbox.cx, hitbox.cy, 0]}>
        <planeGeometry args={[hitbox.w, hitbox.h]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {data.stars.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[hovered ? 0.12 : 0.08, 8, 8]} />
          <meshStandardMaterial
            color={brightColor}
            emissive={brightColor}
            emissiveIntensity={hovered ? 3 : 1.5}
          />
        </mesh>
      ))}

      {linePoints.map(([start, end], i) => {
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        const dir = new THREE.Vector3().subVectors(end, start);
        const len = dir.length();
        const quat = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          dir.clone().normalize()
        );
        return (
          <mesh key={i} position={mid} quaternion={quat}>
            <cylinderGeometry args={[0.008, 0.008, len, 4]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={hovered ? 1.5 : 0.5}
              transparent
              opacity={hovered ? 0.9 : 0.4}
            />
          </mesh>
        );
      })}

      <Html position={labelPosition} center distanceFactor={12} style={{ pointerEvents: "none" }}>
        <div className={`constellation-label${hovered ? " constellation-label--hovered" : ""}`}
          style={{ "--constellation-color": data.color }}>
          {data.symbol} {data.name}
        </div>
      </Html>
    </group>
  );
};

export default Constellation;
