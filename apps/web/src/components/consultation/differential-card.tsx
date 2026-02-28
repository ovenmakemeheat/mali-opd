import { FileText } from "lucide-react";
import { useEvidence } from "@/components/consultation/evidence-context";
import { Badge } from "@/components/ui/badge";
import type { DifferentialDiagnosis } from "@/types";

interface DifferentialCardProps {
	differential: DifferentialDiagnosis;
	rank: number;
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
	const percentage = Math.round(confidence * 100);
	let colorClass = "bg-red-100 text-red-800";
	if (percentage >= 70) {
		colorClass = "bg-green-100 text-green-800";
	} else if (percentage >= 40) {
		colorClass = "bg-yellow-100 text-yellow-800";
	}

	return <Badge className={colorClass}>{percentage}% confidence</Badge>;
}

export function DifferentialCard({
	differential,
	rank,
}: DifferentialCardProps) {
	const { hoveredEvidenceId, setHoveredEvidenceId } = useEvidence();

	return (
		<div
			className={`rounded-md border bg-card p-3 shadow-sm ${
				rank === 1 ? "border-primary/50 ring-1 ring-primary/20" : ""
			}`}
		>
			<div className="mb-2 flex items-start justify-between gap-2">
				<div className="flex items-center gap-2">
					<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground text-xs">
						{rank}
					</span>
					<span className="font-semibold text-sm leading-none">
						{differential.diagnosis}
					</span>
				</div>
				<ConfidenceBadge confidence={differential.confidence} />
			</div>

			{(differential.supportingEvidence.length > 0 ||
				differential.missingEvidence.length > 0) && (
				<div className="mt-3 flex flex-col gap-3">
					{differential.supportingEvidence.length > 0 && (
						<div className="space-y-1.5">
							<p className="font-semibold text-green-700 text-xs dark:text-green-400">
								Supporting Evidence
							</p>
							<div className="flex flex-wrap gap-2">
								{differential.supportingEvidence.map((evidence, i) => {
									const isDimmed =
										hoveredEvidenceId !== null &&
										hoveredEvidenceId !== evidence.evidenceId;
									const isHighlighted =
										hoveredEvidenceId !== null &&
										evidence.evidenceId !== undefined &&
										hoveredEvidenceId === evidence.evidenceId;

									return (
										<button
											className={`group relative flex items-center gap-1.5 rounded border border-green-200 bg-green-50 px-2 py-1 text-left text-green-800 text-xs transition-all duration-200 hover:bg-green-100 ${
												isDimmed ? "opacity-40" : "opacity-100"
											} ${isHighlighted ? "z-10 scale-105 shadow-sm ring-1 ring-green-400" : ""}`}
											key={
												evidence.evidenceId
													? `${evidence.evidenceId}-${i}`
													: `supp-${i}`
											}
											onMouseEnter={() => {
												if (evidence.evidenceId) {
													setHoveredEvidenceId(evidence.evidenceId);
												}
											}}
											onMouseLeave={() => setHoveredEvidenceId(null)}
											type="button"
										>
											<span>{evidence.text}</span>
											{evidence.evidenceId && (
												<FileText className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
											)}
										</button>
									);
								})}
							</div>
						</div>
					)}

					{differential.missingEvidence.length > 0 && (
						<div className="space-y-1.5">
							<p className="font-semibold text-orange-700 text-xs dark:text-orange-400">
								Missing Evidence
							</p>
							<div className="flex flex-wrap gap-2">
								{differential.missingEvidence.map((evidence, i) => {
									let colorClass =
										"bg-orange-50 border-orange-200 text-orange-800";
									if (evidence.priority === "high") {
										colorClass = "bg-red-50 border-red-200 text-red-800";
									}
									if (evidence.priority === "low") {
										colorClass =
											"bg-yellow-50 border-yellow-200 text-yellow-800";
									}

									return (
										<div
											className={`group relative flex cursor-help items-center gap-1.5 rounded border px-2 py-1 text-[11px] transition-colors hover:shadow-sm ${colorClass}`}
											key={evidence.text || `miss-${i}`}
										>
											<span className="font-medium">{evidence.text}</span>

											{/* Mapped Question Tooltip */}
											{evidence.mappedQuestion && (
												<div className="fade-in slide-in-from-bottom-2 pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden w-48 -translate-x-1/2 animate-in flex-col rounded-md border bg-popover p-2 text-popover-foreground shadow-xl group-hover:flex">
													<p className="mb-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-widest">
														Next Question
													</p>
													<p className="text-foreground text-xs leading-snug">
														{evidence.mappedQuestion}
													</p>
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

interface DifferentialListProps {
	differentials: DifferentialDiagnosis[];
}

export function DifferentialList({ differentials }: DifferentialListProps) {
	if (differentials.length === 0) {
		return (
			<div className="py-8 text-center text-muted-foreground text-sm">
				Differential diagnoses will appear as the consultation progresses
			</div>
		);
	}

	return (
		<div className="space-y-3">
			{differentials
				.sort((a, b) => b.confidence - a.confidence)
				.map((d, i) => (
					<DifferentialCard differential={d} key={d.id ?? i} rank={i + 1} />
				))}
		</div>
	);
}
