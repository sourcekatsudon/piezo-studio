"use client";

import { useCallback, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Geometry } from "@/lib/types";
import { mToMm } from "@/calc/units";
import { deriveDomeGeometry } from "@/calc/models/dome";
import type { PlateHoleAnalysis } from "@/calc/models/plateCircularClampedWithHoles";

const LabelTag = ({ text }: { text: string }) => (
  <Html center>
    <div className="rounded-full border border-white/40 bg-white/80 px-2 py-1 text-[10px] text-slate-700 shadow">
      {text}
    </div>
  </Html>
);

const CylinderScene = ({ geom, showDimensions }: { geom: Extract<Geometry, { shape: "cylinder" }>; showDimensions: boolean }) => {
  const outerRadius = geom.Di_m / 2 + geom.t_m;
  const innerRadius = geom.Di_m / 2;
  const length = geom.L_m;
  const labelScale = 3;
  const plateThickness = geom.plate_t_m ?? geom.t_m;
  const profile = useMemo(() => {
    const outer = new THREE.Shape();
    outer.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const hole = new THREE.Path();
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    outer.holes.push(hole);
    return outer;
  }, [outerRadius, innerRadius]);
  const extrude = useMemo(
    () => ({
      depth: length,
      steps: 1,
      bevelEnabled: false,
      curveSegments: 64,
    }),
    [length],
  );
  const extrudedGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(profile, extrude);
    geo.translate(0, 0, -length / 2);
    return geo;
  }, [profile, extrude, length]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={extrudedGeometry} attach="geometry" />
        <meshStandardMaterial color="#cbd5f5" metalness={0.2} roughness={0.35} transparent opacity={0.7} />
      </mesh>
      {geom.hasPlate && (
        <>
          <mesh position={[0, length / 2 - plateThickness / 2, 0]}>
            <cylinderGeometry args={[innerRadius, innerRadius, plateThickness, 64]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.1} roughness={0.5} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, -length / 2 + plateThickness / 2, 0]}>
            <cylinderGeometry args={[innerRadius, innerRadius, plateThickness, 64]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.1} roughness={0.5} transparent opacity={0.7} />
          </mesh>
        </>
      )}
      {showDimensions && (
        <>
          <group position={[outerRadius * 0.65 * labelScale, 0, 0]}>
            <LabelTag text={`Di ${mToMm(geom.Di_m).toFixed(0)} mm`} />
          </group>
          <group position={[0, length * 0.35 * labelScale, 0]}>
            <LabelTag text={`L ${mToMm(geom.L_m).toFixed(0)} mm`} />
          </group>
          <group position={[outerRadius * 1.05 * labelScale, 0, 0]}>
            <LabelTag text={`t ${mToMm(geom.t_m).toFixed(1)} mm`} />
          </group>
        </>
      )}
    </group>
  );
};

const PlateScene = ({ geom, showDimensions }: { geom: Extract<Geometry, { shape: "plate" }>; showDimensions: boolean }) => {
  const labelScale = 3;
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[geom.radius_m, geom.radius_m, geom.t_m, 64]} />
      <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.4} transparent opacity={0.7} />
      </mesh>
      {showDimensions && (
        <group position={[geom.radius_m * 0.6 * labelScale, 0, 0]}>
          <LabelTag text={`a ${mToMm(geom.radius_m).toFixed(0)} mm`} />
        </group>
      )}
    </group>
  );
};

const PlateWithHolesScene = ({
  geom,
  holes,
  worstHole,
  showDimensions,
}: {
  geom: Extract<Geometry, { shape: "plate_penetrators" }>;
  holes: PlateHoleAnalysis["holes"];
  worstHole: PlateHoleAnalysis["worstHole"] | null;
  showDimensions: boolean;
}) => {
  const labelScale = 3;
  const plateShape = useMemo(() => {
    const outer = new THREE.Shape();
    outer.absarc(0, 0, geom.radius_m, 0, Math.PI * 2, false);
    holes.forEach((hole) => {
      const path = new THREE.Path();
      path.absarc(hole.x, hole.y, geom.hole_d_m / 2, 0, Math.PI * 2, true);
      outer.holes.push(path);
    });
    return outer;
  }, [geom.radius_m, geom.hole_d_m, holes]);

  const extrude = useMemo(
    () => ({
      depth: geom.t_m,
      steps: 1,
      bevelEnabled: false,
      curveSegments: 64,
    }),
    [geom.t_m],
  );
  const extrudedGeometry = useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(plateShape, extrude);
    geo.translate(0, 0, -geom.t_m / 2);
    return geo;
  }, [plateShape, extrude, geom.t_m]);

  return (
    <group>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <primitive object={extrudedGeometry} attach="geometry" />
          <meshStandardMaterial color="#e2e8f0" metalness={0.2} roughness={0.4} transparent opacity={0.7} />
        </mesh>
        {holes.map((hole, idx) => (
          <mesh key={`${hole.x}-${hole.y}-${idx}`} position={[hole.x, hole.y, geom.t_m / 2 + 1e-4]}>
            <circleGeometry args={[geom.hole_d_m * 0.15, 24]} />
            <meshStandardMaterial color="#0f172a" transparent opacity={0.35} />
          </mesh>
        ))}
        {worstHole && (
          <mesh position={[worstHole.x, worstHole.y, geom.t_m / 2 + 2e-4]}>
            <ringGeometry args={[geom.hole_d_m * 0.6, geom.hole_d_m * 0.75, 32]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
          </mesh>
        )}
      </group>
      {geom.attachToCylinder && (
        <mesh position={[0, -(geom.t_m / 2 + geom.cylinderLength_m / 2), 0]}>
          <cylinderGeometry args={[geom.radius_m, geom.radius_m, geom.cylinderLength_m, 64]} />
          <meshStandardMaterial color="#cbd5f5" metalness={0.2} roughness={0.35} transparent opacity={0.6} />
        </mesh>
      )}
      {showDimensions && (
        <group position={[geom.radius_m * 0.6 * labelScale, 0, 0]}>
          <LabelTag text={`a ${mToMm(geom.radius_m).toFixed(0)} mm`} />
        </group>
      )}
    </group>
  );
};

const BoxScene = ({ geom, showDimensions }: { geom: Extract<Geometry, { shape: "box" }>; showDimensions: boolean }) => {
  const labelScale = 3;
  return (
    <group>
      <mesh>
        <boxGeometry args={[geom.a_m, geom.t_m, geom.b_m]} />
      <meshStandardMaterial color="#e5e7eb" metalness={0.15} roughness={0.5} transparent opacity={0.7} />
      </mesh>
      {showDimensions && (
        <>
          <group position={[geom.a_m * 0.35 * labelScale, 0, 0]}>
            <LabelTag text={`a ${mToMm(geom.a_m).toFixed(0)} mm`} />
          </group>
          <group position={[0, 0, geom.b_m * 0.35 * labelScale]}>
            <LabelTag text={`b ${mToMm(geom.b_m).toFixed(0)} mm`} />
          </group>
        </>
      )}
    </group>
  );
};

const DomeScene = ({ geom }: { geom: Extract<Geometry, { shape: "dome" }>; showDimensions: boolean }) => {
  const derived = useMemo(() => deriveDomeGeometry(geom), [geom]);
  const profile = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const steps = 48;
    const center = derived.h_m - derived.Rm_m;
    for (let i = 0; i <= steps; i += 1) {
      const theta = (derived.theta0_rad * i) / steps;
      const r = derived.Rm_m * Math.sin(theta);
      const y = center + derived.Rm_m * Math.cos(theta);
      points.push(new THREE.Vector2(r, y));
    }
    return points;
  }, [derived]);

  const latheGeometry = useMemo(() => {
    const geo = new THREE.LatheGeometry(profile, 96);
    geo.translate(0, -derived.h_m / 2, 0);
    return geo;
  }, [profile, derived.h_m]);

  return (
    <group>
      <mesh>
        <primitive object={latheGeometry} attach="geometry" />
        <meshStandardMaterial color="#c7e2f1" metalness={0.15} roughness={0.35} transparent opacity={0.75} />
      </mesh>
      {geom.attachToCylinder && (
        <mesh position={[0, -derived.h_m / 2 - geom.cylinderLength_m / 2, 0]}>
          <cylinderGeometry args={[derived.a_m, derived.a_m, geom.cylinderLength_m, 64]} />
          <meshStandardMaterial color="#a7c7dd" metalness={0.15} roughness={0.4} transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
};

const DomeSectionOverlay = ({ geom }: { geom: Extract<Geometry, { shape: "dome" }> }) => {
  const derived = deriveDomeGeometry(geom);
  const a = derived.a_m;
  const h = derived.h_m;
  const Ri = derived.Ri_m;
  const thetaDeg = (derived.theta0_rad * 180) / Math.PI;
  const width = 220;
  const height = 160;
  const margin = 14;
  const baseX = width / 2;
  const baseY = height - margin;
  const scale = (width / 2 - margin) / a;
  const aPx = a * scale;
  const Rpx = Ri * scale;
  const centerY = baseY - (Ri - h) * scale;
  const arcPath = `M ${baseX - aPx} ${baseY} A ${Rpx} ${Rpx} 0 0 1 ${baseX + aPx} ${baseY}`;

  return (
    <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-white/60 bg-white/80 p-2 text-[10px] text-slate-700 shadow-sm">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path d={arcPath} fill="none" stroke="#1f2937" strokeWidth="1.4" />
        <line x1={baseX - aPx} y1={baseY} x2={baseX + aPx} y2={baseY} stroke="#1f2937" strokeWidth="1" />
        <line x1={baseX} y1={baseY} x2={baseX} y2={baseY - h * scale} stroke="#1f2937" strokeWidth="1" />
        <line x1={baseX + aPx + 8} y1={baseY} x2={baseX + aPx + 8} y2={baseY - geom.t_m * scale} stroke="#1f2937" strokeWidth="1" />
        <text x={baseX - 16} y={baseY + 12}>Di</text>
        <text x={baseX + 6} y={baseY - h * scale / 2}>h</text>
        <text x={baseX + aPx + 12} y={baseY - (geom.t_m * scale) / 2}>t</text>
        <text x={baseX - aPx + 6} y={centerY - 6}>R</text>
        <text x={baseX + 8} y={baseY - h * scale - 6}>theta0</text>
      </svg>
      <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1">
        <div>Di {mToMm(geom.Di_m).toFixed(0)} mm</div>
        <div>t {mToMm(geom.t_m).toFixed(1)} mm</div>
        <div>h {mToMm(h).toFixed(0)} mm</div>
        <div>R {mToMm(Ri).toFixed(0)} mm</div>
        <div>theta0 {thetaDeg.toFixed(1)} deg</div>
      </div>
    </div>
  );
};

export default function PressureCaseViewer({
  geometry,
  showDimensions,
  holeAnalysis,
}: {
  geometry: Geometry;
  showDimensions: boolean;
  holeAnalysis?: PlateHoleAnalysis;
}) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const setView = useCallback((position: [number, number, number]) => {
    const camera = cameraRef.current;
    if (!camera) return;
    camera.position.set(position[0], position[1], position[2]);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div className="relative h-[320px] w-full rounded-3xl border border-border bg-white/70">
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <button
          type="button"
          className="h-7 rounded-md bg-primary px-2 text-[11px] font-medium text-primary-foreground shadow-sm"
          onClick={() => setView([1.2, 0, 0])}
        >
          横
        </button>
        <button
          type="button"
          className="h-7 rounded-md bg-primary px-2 text-[11px] font-medium text-primary-foreground shadow-sm"
          onClick={() => setView([0.9, 0.6, 1.1])}
        >
          斜め
        </button>
        <button
          type="button"
          className="h-7 rounded-md bg-primary px-2 text-[11px] font-medium text-primary-foreground shadow-sm"
          onClick={() => setView([0, 1.3, 0])}
        >
          上
        </button>
      </div>
      <Canvas
        camera={{ position: [0.5, 0.35, 0.7], fov: 45 }}
        onCreated={({ camera }) => {
          cameraRef.current = camera as THREE.PerspectiveCamera;
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <directionalLight position={[-2, -1, 1]} intensity={0.4} />
        {geometry.shape === "cylinder" && (
          <CylinderScene geom={geometry} showDimensions={showDimensions} />
        )}
        {geometry.shape === "plate" && (
          <PlateScene geom={geometry} showDimensions={showDimensions} />
        )}
        {geometry.shape === "plate_penetrators" && (
          <PlateWithHolesScene
            geom={geometry}
            holes={holeAnalysis?.holes ?? []}
            worstHole={holeAnalysis?.worstHole ?? null}
            showDimensions={showDimensions}
          />
        )}
        {geometry.shape === "box" && (
          <BoxScene geom={geometry} showDimensions={showDimensions} />
        )}
        {geometry.shape === "dome" && (
          <DomeScene geom={geometry} showDimensions={showDimensions} />
        )}
        <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} minDistance={0.25} maxDistance={1.6} />
      </Canvas>
      {geometry.shape === "dome" && showDimensions && <DomeSectionOverlay geom={geometry} />}
    </div>
  );
}
