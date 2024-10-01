"use client";

import { MeshProps, useLoader, extend } from "@react-three/fiber";
import { useMemo, Suspense, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { useStore } from "./useStore";
import { useBounds } from "@react-three/drei";
export function Svg3D() {
	const { svgData } = useStore();
	const svgDataLoader = useLoader(SVGLoader, svgData);
	const shapes = useMemo(() => {
		return svgDataLoader.paths.map((p) => p.toShapes(true));
	}, [svgDataLoader]);
	const bounds = useBounds();
	const svgRef = useRef();
	useLayoutEffect(() => {
		if (svgDataLoader) {
			bounds.refresh(svgRef.current).clip().fit();
		}
	}, [svgDataLoader]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<mesh
				scale={0.01}
				rotation={[Math.PI, 0, 0]}
				position={[-1.7, 2.5, 0]}
				ref={svgRef}
			>
				{shapes.map((s, i) => (
					<mesh key={i} position={[0, 0, 0]}>
						<extrudeGeometry
							args={[
								s,
								{
									curveSegments: 12,
									steps: 10,
									depth: 50,
									bevelEnabled: true,
									bevelThickness: 20,
									bevelSize: 15,
									bevelOffset: -1,
									bevelSegments: 30,
								},
							]}
						/>
						<meshStandardMaterial
							color={svgDataLoader.paths[i].color}
							side={THREE.DoubleSide}
							roughness={0.1}
							metalness={0.2}
							emissiveIntensity={10.8}
						/>
					</mesh>
				))}
			</mesh>
		</Suspense>
	);
}
