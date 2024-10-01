import { create } from "zustand";

export const useStore = create((set) => ({
	backgroundColor: "#FF6347",
	setBackgroundColor: (color) => set({ backgroundColor: color }),
	writing: "Hello UIKIT!",
	setWriting: (text) => set({ writing: text }),
	texts: [],
	addText: (text) => set((state) => ({ texts: [...state.texts, text] })),
	svgData: null,
	setSvgData: (data) => set({ svgData: data }),
	glbData: null, // Add glbData state
	setGlbData: (data) => set({ glbData: data }),
}));
