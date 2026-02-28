import { FileText } from "lucide-react";
import { useEvidence } from "@/components/consultation/evidence-context";
import { Badge } from "@/components/ui/badge";
import type { Symptom } from "@/types";

function SeverityBadge({ severity }: { severity: Symptom["severity"] }) {
	const variants: Record<string, string> = {
		mild: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
		moderate:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
		severe: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
	};

	if (!severity) {
		return null;
	}

	return <Badge className={variants[severity] ?? ""}>{severity}</Badge>;
}

export const SymptomCard = ({ symptom }: { symptom: Symptom }) => {
	const { hoveredEvidenceId, setHoveredEvidenceId } = useEvidence();

	const isDimmed =
		hoveredEvidenceId !== null && hoveredEvidenceId !== symptom.evidenceId;

	const isHighlighted =
		hoveredEvidenceId !== null &&
		symptom.evidenceId !== undefined &&
		hoveredEvidenceId === symptom.evidenceId;

	return (
		<button
			className={`group relative flex w-full items-center justify-between gap-3 rounded-md border p-2 text-left text-sm transition-all duration-200 ${
				isDimmed ? "opacity-40" : "bg-card opacity-100 hover:bg-muted/50"
			} ${isHighlighted ? "scale-[1.01] transform shadow-sm ring-1 ring-primary/50" : ""}`}
			onMouseEnter={() => {
				if (symptom.evidenceId) {
					setHoveredEvidenceId(symptom.evidenceId);
				}
			}}
			onMouseLeave={() => setHoveredEvidenceId(null)}
			type="button"
		>
			<div className="flex min-w-0 flex-1 items-center gap-2">
				<div
					className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10"
					title={`Confidence: ${Math.round(symptom.confidence * 100)}%`}
				>
					<span className="font-bold text-[10px] text-primary">
						{Math.round(symptom.confidence * 100)}
					</span>
				</div>
				<span className="truncate font-medium">{symptom.name}</span>
				{symptom.duration && (
					<span className="truncate text-muted-foreground text-xs">
						• {symptom.duration}
					</span>
				)}
				{symptom.evidenceId && (
					<FileText className="h-3 w-3 shrink-0 text-muted-foreground opacity-30 transition-opacity group-hover:opacity-100" />
				)}
			</div>

			<div className="flex shrink-0 items-center gap-2">
				{symptom.notes && (
					<span className="hidden max-w-[120px] truncate text-muted-foreground text-xs sm:inline-block">
						{symptom.notes}
					</span>
				)}
				<SeverityBadge severity={symptom.severity} />
			</div>
		</button>
	);
};

interface SymptomListProps {
	symptoms: Symptom[];
}

export function SymptomList({ symptoms }: SymptomListProps) {
	if (symptoms.length === 0) {
		return (
			<div className="py-4 text-center text-muted-foreground text-sm">
				No symptoms extracted yet
			</div>
		);
	}

	return (
		<div className="grid gap-2">
			{symptoms.map((symptom, index) => (
				<SymptomCard key={symptom.id ?? index} symptom={symptom} />
			))}
		</div>
	);
}
