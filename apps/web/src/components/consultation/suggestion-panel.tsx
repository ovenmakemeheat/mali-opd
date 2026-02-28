import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SuggestionPanelProps {
	onAccept?: (suggestion: string) => void;
	suggestions: string[];
}

export function SuggestionPanel({
	suggestions,
	onAccept,
}: SuggestionPanelProps) {
	if (suggestions.length === 0) {
		return (
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center gap-2">
						<Lightbulb className="h-4 w-4 text-yellow-500" />
						<CardTitle className="font-medium text-sm">
							AI Suggestions
						</CardTitle>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-sm">
						Suggestions will appear based on the conversation
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<Lightbulb className="h-4 w-4 text-yellow-500" />
					<CardTitle className="font-medium text-sm">
						Next Best Questions
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="space-y-2">
				{suggestions.slice(0, 3).map((suggestion) => (
					<div
						className="flex items-start justify-between gap-2 rounded-lg bg-muted/50 p-2"
						key={suggestion}
					>
						<p className="text-sm">{suggestion}</p>
						{onAccept && (
							<Button
								onClick={() => onAccept(suggestion)}
								size="sm"
								variant="ghost"
							>
								Ask
							</Button>
						)}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
