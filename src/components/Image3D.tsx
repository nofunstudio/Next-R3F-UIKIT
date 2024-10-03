"use client";

import { Suspense, useRef, useLayoutEffect, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useStore } from "./useStore";
import { useBounds } from "@react-three/drei";
import { PivotWrapper } from "./PivotWrapper";

export function Image3D() {
	const { imageData } = useStore();
	const texture = useTexture(imageData);
	const imageRef = useRef();
	const bounds = useBounds();
	const [aspectRatio, setAspectRatio] = useState([1, 1]);

	useLayoutEffect(() => {
		if (texture.image) {
			const { width, height } = texture.image;
			const ratio = width / height;
			setAspectRatio([2 * ratio, 2]); // Adjust the size while maintaining aspect ratio
		}
	}, [texture]);

	useLayoutEffect(() => {
		if (imageRef.current) {
			bounds.refresh(imageRef.current).clip().fit();
		}
	}, [texture]);

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PivotWrapper>
				<mesh ref={imageRef}>
					<planeGeometry args={aspectRatio} />
					<meshBasicMaterial map={texture} transparent={true} />
				</mesh>
			</PivotWrapper>
		</Suspense>
	);
}
