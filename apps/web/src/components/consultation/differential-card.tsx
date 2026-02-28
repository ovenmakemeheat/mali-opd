import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	return (
		<Card className={rank === 1 ? "border-primary" : ""}>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="font-bold text-lg text-muted-foreground">
							#{rank}
						</span>
						<CardTitle className="font-medium text-sm">
							{differential.diagnosis}
						</CardTitle>
					</div>
					<ConfidenceBadge confidence={differential.confidence} />
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="grid grid-cols-2 gap-4">
					<div>
						<p className="mb-1 font-semibold text-green-700 text-xs dark:text-green-400">
							Supporting Evidence
						</p>
						<ul className="space-y-0.5 text-xs">
							{differential.supportingEvidence.length > 0 ? (
								differential.supportingEvidence.map((evidence) => (
									<li className="flex items-start gap-1" key={evidence}>
										<span className="text-green-600">✓</span>
										{evidence}
									</li>
								))
							) : (
								<li className="text-muted-foreground">None identified</li>
							)}
						</ul>
					</div>
					<div>
						<p className="mb-1 font-semibold text-orange-700 text-xs dark:text-orange-400">
							Missing Evidence
						</p>
						<ul className="space-y-0.5 text-xs">
							{differential.missingEvidence.length > 0 ? (
								differential.missingEvidence.map((evidence) => (
									<li className="flex items-start gap-1" key={evidence}>
										<span className="text-orange-600">?</span>
										{evidence}
									</li>
								))
							) : (
								<li className="text-muted-foreground">Complete</li>
							)}
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
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
