import { Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecordingIndicatorProps {
	isProcessing: boolean;
	isRecording: boolean;
	onToggle: () => void;
}

function getButtonIcon(isProcessing: boolean, isRecording: boolean) {
	if (isProcessing) {
		return <Loader2 className="h-6 w-6 animate-spin" />;
	}
	if (isRecording) {
		return <MicOff className="h-6 w-6" />;
	}
	return <Mic className="h-6 w-6" />;
}

function getStatusText(isProcessing: boolean, isRecording: boolean) {
	if (isProcessing) {
		return "Processing...";
	}
	if (isRecording) {
		return "Recording...";
	}
	return "Start Recording";
}

export function RecordingIndicator({
	isRecording,
	isProcessing,
	onToggle,
}: RecordingIndicatorProps) {
	return (
		<div className="flex items-center gap-4">
			<Button
				className="h-14 w-14 rounded-full"
				disabled={isProcessing}
				onClick={onToggle}
				size="lg"
				variant={isRecording ? "destructive" : "default"}
			>
				{getButtonIcon(isProcessing, isRecording)}
			</Button>

			<div className="flex flex-col">
				<span className="font-medium text-sm">
					{getStatusText(isProcessing, isRecording)}
				</span>
				{isRecording && (
					<div className="mt-1 flex items-center gap-2">
						<span
							className={cn("h-2 w-2 rounded-full bg-red-500", "animate-pulse")}
						/>
						<span className="text-muted-foreground text-xs">
							Ambient listening active
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
