import { useState } from "react";
import { PivotControls } from "@react-three/drei";

export const PivotWrapper = ({ children }) => {
	const [selected, setSelected] = useState(false);
	return (
		<PivotControls
			depthTest={false}
			anchor={[0, 0, 0]}
			scale={1.2}
			visible={selected}
			onDrag={() => setSelected(true)}
			onDragEnd={() => setSelected(true)}
			// enabled={selected}
		>
			<mesh
				onPointerDown={(e) => {
					if (!selected) {
						e.stopPropagation();
						setSelected(true);
					}
				}}
				onPointerMissed={() => setSelected(false)}
			>
				{children}
			</mesh>
		</PivotControls>
	);
};
