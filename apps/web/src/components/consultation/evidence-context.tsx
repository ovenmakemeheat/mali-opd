"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

interface EvidenceContextType {
	hoveredEvidenceId: string | null;
	setHoveredEvidenceId: (id: string | null) => void;
}

const EvidenceContext = createContext<EvidenceContextType | undefined>(
	undefined
);

export function EvidenceProvider({ children }: { children: React.ReactNode }) {
	const [hoveredEvidenceId, setHoveredEvidenceId] = useState<string | null>(
		null
	);

	return (
		<EvidenceContext.Provider
			value={{ hoveredEvidenceId, setHoveredEvidenceId }}
		>
			{children}
		</EvidenceContext.Provider>
	);
}

export function useEvidence() {
	const context = useContext(EvidenceContext);
	if (context === undefined) {
		throw new Error("useEvidence must be used within an EvidenceProvider");
	}
	return context;
}
