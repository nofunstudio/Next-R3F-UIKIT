"use client";

import { Suspense, useLayoutEffect, useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useStore } from "./useStore";
import { useBounds } from "@react-three/drei";
import { PivotWrapper } from "./PivotWrapper";
export function Glb3D() {
	const { glbData } = useStore();
	const gltf = useLoader(GLTFLoader, glbData);
	const gltfSceneRef = useRef();
	const bounds = useBounds();
	useLayoutEffect(() => {
		if (gltfSceneRef.current) {
			gltfSceneRef.current.traverse((obj) => {
				if (obj.isMesh) {
					obj.castShadow = obj.receiveShadow = true;
					obj.material.envMapIntensity = 0.8;
				}
			});
			bounds.refresh(gltfSceneRef.current).clip().fit();
		}
	}, [gltf]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PivotWrapper>
				<primitive ref={gltfSceneRef} object={gltf.scene} />
			</PivotWrapper>
		</Suspense>
	);
}
