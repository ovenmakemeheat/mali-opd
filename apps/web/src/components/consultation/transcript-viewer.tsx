import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TranscriptViewerProps {
	segments: string[];
}

export function TranscriptViewer({ segments }: TranscriptViewerProps) {
	if (segments.length === 0) {
		return (
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center gap-2">
						<MessageSquare className="h-4 w-4" />
						<CardTitle className="font-medium text-sm">
							Live Transcript
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm italic">
						Start recording to see transcription...
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<MessageSquare className="h-4 w-4" />
					<CardTitle className="font-medium text-sm">Live Transcript</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="max-h-48 space-y-2 overflow-y-auto">
					{segments.map((segment, i) => (
						<div className="flex items-start gap-2" key={segment.slice(0, 20)}>
							<span className="shrink-0 text-muted-foreground text-xs">
								{String(i + 1).padStart(2, "0")}
							</span>
							<p className="text-sm">{segment}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
