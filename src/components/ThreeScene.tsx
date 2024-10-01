"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import {
	Center,
	Environment,
	OrbitControls,
	PivotControls,
	Shadow,
	Text3D,
	useGLTF,
	Bounds,
	Stage,
	useBounds,
} from "@react-three/drei";
import {
	Dispatch,
	SetStateAction,
	Suspense,
	useEffect,
	useLayoutEffect,
	useState,
	useRef,
} from "react";
import { easing } from "maath";
import * as THREE from "three";
import dynamic from "next/dynamic";
import { useStore } from "./useStore"; // Corrected import path
import { Svg3D } from "./Svg3D";
import { Glb3D } from "./Glb3D";

const possibleColors = [
	"#FF6347", // Tomato
	"#FFD700", // Gold
	"#B0B0B0", // Titanium
	"#1E90FF", // Dodger Blue
	"#32CD32", // Lime Green
	"#8A2BE2", // Blue Violet
	"#FF69B4", // Hot Pink
	"#A52A2A", // Brown
	"#2F4F4F", // Dark Slate Gray
	"#FF4500", // Orange Red
];

const UI = () => {
	const {
		backgroundColor,
		setBackgroundColor,
		writing,
		setWriting,
		addText,
		setSvgData,
		svgData,
		setGlbData, // Add setGlbData to destructuring
	} = useStore();
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, []);

	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const fileName = file.name.toLowerCase();
			const url = URL.createObjectURL(file);
			if (file.type === "image/svg+xml") {
				setSvgData(url);
			} else if (fileName.endsWith(".glb")) {
				setGlbData(url);
			}
		}
	};

	return (
		<div style={{ position: "absolute", top: 10, left: 10 }}>
			<div style={{ display: "flex", flexWrap: "wrap", marginBottom: 10 }}>
				{possibleColors.map((color, index) => (
					<div
						key={index}
						style={{
							backgroundColor: color,
							width: 24,
							height: 24,
							borderRadius: 5,
							border:
								color === backgroundColor
									? "2px solid white"
									: "2px solid transparent",
							cursor: "pointer",
							margin: 2,
						}}
						onClick={() => setBackgroundColor(color)}
					/>
				))}
			</div>
			<input
				ref={inputRef}
				value={writing}
				onChange={(e) => setWriting(e.target.value)}
				style={{
					padding: 10,
					borderRadius: 5,
					border: "1px solid #ccc",
					width: "100%",
					boxSizing: "border-box",
				}}
			/>
			<button
				onClick={() => addText(writing)}
				style={{
					marginTop: 10,
					padding: 10,
					borderRadius: 5,
					border: "1px solid #ccc",
					backgroundColor: "#007BFF",
					color: "white",
					cursor: "pointer",
				}}
			>
				Add Text
			</button>
			<input
				type="file"
				accept=".svg,.glb"
				onChange={handleFileUpload}
				style={{ marginTop: 10 }}
			/>
		</div>
	);
};

const PivotWrapper = ({ children }) => {
	const [selected, setSelected] = useState(false);
	return (
		<PivotControls
			depthTest={false}
			anchor={[0, 0, 0]}
			scale={1.2}
			visible={selected}
		>
			<mesh
				onPointerUp={(e) => {
					e.stopPropagation();
					setSelected(true);
				}}
				onPointerMissed={() => setSelected(false)}
			>
				{children}
			</mesh>
		</PivotControls>
	);
};

const Text = ({ writing, backgroundColor, index }) => {
	return (
		<Center key={writing} position={[0, 1, 0]}>
			<Text3D size={1.5} font="/Inter_Bold.json">
				{writing}
				<meshStandardMaterial color={backgroundColor} />
			</Text3D>
		</Center>
	);
};

export const ThreeScene = () => {
	const { backgroundColor, writing, texts, svgData, glbData } = useStore();

	return (
		<>
			<Canvas camera={{ position: [0, 0, 150] }} style={{ height: "100vh" }}>
				<color attach="background" args={[backgroundColor]} />
				<OrbitControls makeDefault />
				<Environment preset="city" />
				<ambientLight intensity={0.25} />
				<Bounds fit clip observe>
					{svgData && (
						<PivotWrapper>
							<Svg3D />
						</PivotWrapper>
					)}

					{glbData && (
						<PivotWrapper>
							<Glb3D />
						</PivotWrapper>
					)}

					{texts.map((text, index) => (
						<PivotWrapper key={index}>
							<Text
								key={index}
								writing={text}
								backgroundColor={backgroundColor}
								index={index}
							/>
						</PivotWrapper>
					))}
				</Bounds>
			</Canvas>
			<UI />
		</>
	);
};

const ThreeSkeleton = () => {
	return (
		<div className="w-screen h-screen flex justify-center items-center text-4xl">
			Loading...
		</div>
	);
};

// For Next to not load server side
