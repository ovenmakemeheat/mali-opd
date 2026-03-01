import { CheckCircle2, Search, Zap } from "lucide-react";
import type { DifferentialDiagnosis } from "@/types";

interface GapAnalysisPanelProps {
	differentials: DifferentialDiagnosis[];
}

export function GapAnalysisPanel({ differentials }: GapAnalysisPanelProps) {
	if (differentials.length === 0) {
		return null;
	}

	// Extract unique missing evidence from top differentials
	const topDifferentials = differentials.slice(0, 3);
	const missingPieces = new Map<
		string,
		{ count: number; affects: string[]; maxConfidence: number }
	>();

	for (const diff of topDifferentials) {
		for (const missing of diff.missingEvidence) {
			const existing = missingPieces.get(missing.text);
			if (existing) {
				existing.count++;
				existing.affects.push(diff.diagnosis);
			} else {
				missingPieces.set(missing.text, {
					count: 1,
					affects: [diff.diagnosis],
					maxConfidence: diff.confidence,
				});
			}
		}
	}

	const sortedGaps = Array.from(missingPieces.entries()).sort(
		(a, b) => b[1].maxConfidence - a[1].maxConfidence
	);

	if (sortedGaps.length === 0) {
		return (
			<div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50/50 p-3 text-sm">
				<CheckCircle2 className="h-4 w-4 text-green-600" />
				<span className="font-medium text-green-800">
					Clinical picture complete. No major gaps.
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2 rounded-md border border-orange-200 bg-orange-50/30 p-3 text-sm">
			<div className="flex items-center gap-1.5 font-semibold text-orange-800">
				<Zap className="h-4 w-4 fill-orange-500 text-orange-600" />
				<span>High Yield Questions</span>
			</div>

			<div className="space-y-2">
				{sortedGaps.slice(0, 3).map(([evidence, info]) => (
					<div
						className="group relative flex flex-col gap-1 rounded bg-white/60 p-2 transition-colors hover:bg-white"
						key={evidence}
					>
						<div className="flex items-center gap-1.5">
							<Search className="h-3 w-3 shrink-0 text-orange-500" />
							<span className="font-medium text-foreground text-xs leading-none">
								{evidence}
							</span>
						</div>
						<span className="pl-4 text-[11px] text-muted-foreground leading-tight">
							Clarifies: {info.affects.join(", ")}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
