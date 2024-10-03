"use client";

import React, { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useStore } from "./useStore";
interface DropzoneWrapperProps {
	children: React.ReactNode;
	onFileUpload?: (file: File) => Promise<void>;
}

export function DropzoneWrapper({
	children,
	onFileUpload,
}: DropzoneWrapperProps) {
	const [dragActive, setDragActive] = useState(false);
	const [uploading, setUploading] = useState(false);

	const { setSvgData, setGlbData, setImageData } = useStore();

	//this is for when the upload button gets added back in
	const handleFileUpload = (event) => {
		const file = event.target.files[0];

		if (file) {
			const fileName = file.name.toLowerCase();
			const url = URL.createObjectURL(file);
			if (file.type === "image/svg+xml") {
				setSvgData(url);
			} else if (fileName.endsWith(".glb")) {
				setGlbData(url);
			} else if (
				["image/jpeg", "image/png", "image/webp"].includes(file.type)
			) {
				setImageData(url);
			}
		}
	};

	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback(
		async (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);
			const file = e.dataTransfer.files?.[0];

			if (file) {
				const fileName = file.name.toLowerCase();
				const url = URL.createObjectURL(file);
				if (file.type === "image/svg+xml") {
					setSvgData(url);
				} else if (fileName.endsWith(".glb")) {
					setGlbData(url);
				} else if (
					["image/jpeg", "image/png", "image/webp"].includes(file.type)
				) {
					setImageData(url);
				}
			}

			if (file) {
				setUploading(true);
				if (onFileUpload) {
					try {
						await onFileUpload(file);
					} catch (error) {
						console.error("File upload failed:", error);
					}
				} else {
					// Simulating file upload with a delay if no onFileUpload provided
					await new Promise((resolve) => setTimeout(resolve, 500));
					console.log("File uploaded:", file.name);
				}
				setUploading(false);
			}
		},
		[onFileUpload]
	);

	return (
		<div
			className="relative w-full h-full"
			onDragEnter={handleDrag}
			onDragLeave={handleDrag}
			onDragOver={handleDrag}
			onDrop={handleDrop}
		>
			{children}
			{dragActive && (
				<div className="absolute inset-0 border-4 border-dashed border-primary bg-primary/10 pointer-events-none z-10" />
			)}
			{uploading && (
				<div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
					<div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
						<Loader2 className="h-6 w-6 animate-spin text-primary" />
						<span className="text-sm font-medium">Generating...</span>
					</div>
				</div>
			)}
		</div>
	);
}
