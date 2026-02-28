import { AlertTriangle, Lightbulb, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DifferentialDiagnosis } from "@/types";

const RED_FLAG_REGEX = /urgent:|red flag:/i;

interface SuggestionPanelProps {
	differentials: DifferentialDiagnosis[];
	onAccept?: (suggestion: string) => void;
	suggestions: string[];
}

export function SuggestionPanel({
	suggestions,
	onAccept,
	differentials,
}: SuggestionPanelProps) {
	// Calculate Gaps
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

	if (suggestions.length === 0 && sortedGaps.length === 0) {
		return (
			<Card className="border-primary/10 bg-primary/5">
				<CardHeader className="pb-2">
					<div className="flex items-center gap-2">
						<Lightbulb className="h-4 w-4 text-primary" />
						<CardTitle className="font-medium text-primary/80 text-sm">
							AI Insights
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Suggestions and insights will appear based on the conversation
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<Lightbulb className="h-4 w-4 text-primary" />
					<CardTitle className="font-medium text-primary text-sm">
						Actionable Insights
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* AI Suggestions (Questions) */}
				{suggestions.length > 0 && (
					<div className="space-y-2">
						<div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
							Next Best Questions
						</div>
						{suggestions.slice(0, 3).map((suggestion) => {
							const isRedFlag =
								suggestion.toLowerCase().includes("urgent") ||
								suggestion.toLowerCase().includes("red flag") ||
								suggestion.toLowerCase().includes("critical");

							return (
								<div
									className={`flex items-start justify-between gap-3 rounded-md border p-3 shadow-sm ${
										isRedFlag
											? "border-red-200 bg-red-50/50"
											: "border-primary/10 bg-primary/5"
									}`}
									key={suggestion}
								>
									<div className="flex gap-2">
										{isRedFlag ? (
											<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
										) : (
											<div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary/40" />
										)}
										<p
											className={`text-sm ${isRedFlag ? "font-medium text-red-900" : ""}`}
										>
											{suggestion.replace(RED_FLAG_REGEX, "").trim()}
										</p>
									</div>

									{onAccept && (
										<Button
											className={
												isRedFlag
													? "text-red-700 hover:bg-red-100 hover:text-red-800"
													: "text-primary hover:bg-primary/20 hover:text-primary"
											}
											onClick={() => onAccept(suggestion)}
											size="sm"
											variant="ghost"
										>
											Ask
										</Button>
									)}
								</div>
							);
						})}
					</div>
				)}

				{/* High Yield Gaps */}
				{sortedGaps.length > 0 && (
					<div className="space-y-2 border-t pt-2">
						<div className="font-semibold text-muted-foreground text-xs uppercase tracking-wider">
							Missing High-Yield Data
						</div>
						{sortedGaps.slice(0, 3).map(([evidence, info]) => (
							<div
								className="group flex items-start gap-2 rounded-md bg-muted/40 p-2.5 transition-colors hover:bg-muted/60"
								key={evidence}
							>
								<div className="mt-0.5 rounded-full bg-primary/10 p-1">
									<Search className="h-3 w-3 text-primary" />
								</div>
								<div className="min-w-0 flex-1 space-y-0.5">
									<p className="font-medium text-foreground text-sm leading-snug">
										{evidence}
									</p>
									<p className="text-[11px] text-muted-foreground leading-tight">
										Clarifies:{" "}
										<span className="font-medium">
											{info.affects.join(", ")}
										</span>
									</p>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
