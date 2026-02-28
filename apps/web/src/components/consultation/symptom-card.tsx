import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Symptom } from "@/types";

interface SymptomCardProps {
	symptom: Symptom;
}

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

function ConfidenceBar({ confidence }: { confidence: number }) {
	const percentage = Math.round(confidence * 100);
	return (
		<div className="flex items-center gap-2">
			<div className="h-1.5 flex-1 rounded-full bg-muted">
				<div
					className="h-full rounded-full bg-primary"
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<span className="text-muted-foreground text-xs">{percentage}%</span>
		</div>
	);
}

export function SymptomCard({ symptom }: SymptomCardProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="font-medium text-sm">{symptom.name}</CardTitle>
					<SeverityBadge severity={symptom.severity} />
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				{symptom.duration && (
					<p className="text-muted-foreground text-xs">
						Duration: {symptom.duration}
					</p>
				)}
				{symptom.notes && <p className="text-sm">{symptom.notes}</p>}
				<ConfidenceBar confidence={symptom.confidence} />
			</CardContent>
		</Card>
	);
}

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
