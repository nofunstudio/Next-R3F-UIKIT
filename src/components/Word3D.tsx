import { Center, Text3D } from "@react-three/drei";
import { useStore } from "./useStore";
import { PivotWrapper } from "./PivotWrapper";
import { useRef, useEffect } from "react";
const Text = ({ writing, backgroundColor }) => {
	return (
		<PivotWrapper>
			<Center key={writing} position={[0, 1, 0]}>
				<Text3D size={1.5} font="/Inter_Bold.json">
					{writing}
					<meshStandardMaterial
						color={backgroundColor}
						roughness={0.25}
						metalness={0.19}
					/>
				</Text3D>
			</Center>
		</PivotWrapper>
	);
};

export function Word3D() {
	const { texts, writing, backgroundColor } = useStore();
	return (
		<>
			{texts.map((text, index) => (
				<Text key={index} writing={text} backgroundColor={backgroundColor} />
			))}
		</>
	);
}

export const UI = () => {
	const { writing, setWriting, addText } = useStore();
	const inputRef = useRef(null);

	useEffect(() => {
		if (inputRef.current) inputRef.current.focus();
	}, []);

	return (
		<div style={{ position: "absolute", bottom: 10, left: 10 }}>
			<div style={{ display: "flex", alignItems: "center" }}>
				<input
					ref={inputRef}
					value={writing}
					onChange={(e) => setWriting(e.target.value)}
					style={{
						padding: 10,
						borderRadius: 5,
						border: "1px solid #ccc",
						width: "70%",
						marginRight: 2,
					}}
				/>
				<button
					onClick={() => addText(writing)}
					style={{
						padding: 10,
						borderRadius: 5,
						border: "1px solid #ccc",
						backgroundColor: "#007BFF",
						color: "white",
						cursor: "pointer",
					}}
				>
					+
				</button>
			</div>
		</div>
	);
};
