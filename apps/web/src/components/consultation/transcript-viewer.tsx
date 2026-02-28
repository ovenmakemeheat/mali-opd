import { MessageSquare } from "lucide-react";
import { useEvidence } from "@/components/consultation/evidence-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TranscriptSegment } from "@/types";

interface TranscriptViewerProps {
	segments: TranscriptSegment[];
}

export function TranscriptViewer({ segments }: TranscriptViewerProps) {
	const { hoveredEvidenceId, setHoveredEvidenceId } = useEvidence();

	if (segments.length === 0) {
		return (
			<Card className="flex h-full flex-col">
				<CardHeader className="shrink-0 pb-2">
					<div className="flex items-center gap-2">
						<MessageSquare className="h-4 w-4" />
						<CardTitle className="font-medium text-sm">
							Live Transcript
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="flex-1 overflow-y-auto">
					<p className="text-muted-foreground text-sm italic">
						Start recording to see transcription...
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="flex h-full flex-col">
			<CardHeader className="shrink-0 pb-2">
				<div className="flex items-center gap-2">
					<MessageSquare className="h-4 w-4" />
					<CardTitle className="font-medium text-sm">Live Transcript</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="flex-1 overflow-y-auto pr-2">
				<div className="space-y-2">
					{segments.map((segment, i) => {
						const isDimmed =
							hoveredEvidenceId !== null &&
							hoveredEvidenceId !== segment.evidenceId;
						const isHighlighted =
							hoveredEvidenceId !== null &&
							segment.evidenceId !== undefined &&
							hoveredEvidenceId === segment.evidenceId;

						return (
							<button
								className={`flex w-full cursor-default items-start gap-3 rounded-lg border bg-card p-3 text-left text-card-foreground shadow-sm transition-all duration-200 ease-in-out hover:border-primary/40 hover:shadow-md ${
									isDimmed ? "opacity-30" : "opacity-100"
								} ${isHighlighted ? "border-primary/30 bg-primary/5 ring-1 ring-primary/30" : ""}`}
								key={segment.id || i}
								onMouseEnter={() => {
									if (segment.evidenceId) {
										setHoveredEvidenceId(segment.evidenceId);
									}
								}}
								onMouseLeave={() => setHoveredEvidenceId(null)}
								type="button"
							>
								<span className="mt-0.5 w-4 shrink-0 text-right font-medium text-[10px] text-muted-foreground/60">
									{i + 1}
								</span>
								<p
									className={`text-sm leading-relaxed ${isHighlighted ? "font-medium text-primary" : "text-foreground"}`}
								>
									{segment.text}
								</p>
							</button>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
