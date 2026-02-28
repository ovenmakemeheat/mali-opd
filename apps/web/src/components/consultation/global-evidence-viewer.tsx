"use client";

import { FileText } from "lucide-react";
import { useEvidence } from "@/components/consultation/evidence-context";
import { useConsultationStore } from "@/store/consultation";

export function GlobalEvidenceViewer() {
	const { hoveredEvidenceId } = useEvidence();
	const evidences = useConsultationStore((state) => state.evidences);

	if (!hoveredEvidenceId) {
		return null;
	}

	const evidence = evidences.find((e) => e.id === hoveredEvidenceId);

	if (!evidence) {
		return null;
	}

	return (
		<div className="fade-in slide-in-from-bottom-4 fixed bottom-6 left-6 z-100 w-85 animate-in rounded-xl border border-primary/20 bg-background p-4 shadow-2xl ring-1 ring-black/5 dark:bg-zinc-950 dark:ring-white/10">
			<div className="mb-2 flex items-center gap-1.5 font-semibold text-primary text-sm">
				<FileText className="h-4 w-4" /> Source Transcript
			</div>
			<p className="text-muted-foreground text-sm leading-relaxed">
				"{evidence.text}"
			</p>

			<div className="mt-3 text-right">
				<span className="font-medium text-[10px] text-muted-foreground uppercase tracking-widest">
					Auto-Extracted Match
				</span>
			</div>
		</div>
	);
}
