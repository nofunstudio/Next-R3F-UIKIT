"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Environment, OrbitControls, Bounds } from "@react-three/drei";

import * as THREE from "three";
import { useStore } from "./useStore"; // Corrected import path
import { Svg3D } from "./Svg3D";
import { Glb3D } from "./Glb3D";
import { DropzoneWrapper } from "./dropzone-wrapper";
import { Image3D } from "./Image3D";
import { Word3D, UI } from "./Word3D";

export const ThreeScene = () => {
	const { backgroundColor, writing, texts, svgData, glbData, imageData } =
		useStore();

	return (
		<>
			<UI />
			<DropzoneWrapper>
				<Canvas camera={{ position: [0, 0, 150] }} style={{ height: "100vh" }}>
					<color attach="background" args={[backgroundColor]} />
					<OrbitControls makeDefault />
					<Environment preset="city" />
					<ambientLight intensity={0.25} />
					<Bounds fit clip observe>
						{svgData && <Svg3D />}

						{glbData && <Glb3D />}

						{imageData && <Image3D />}
						<Word3D />
					</Bounds>
				</Canvas>
			</DropzoneWrapper>
			<UI />
		</>
	);
};
