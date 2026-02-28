"use client";

import { ChecklistPanel } from "@/components/consultation/checklist-panel";
import { DifferentialList } from "@/components/consultation/differential-card";
import { SuggestionPanel } from "@/components/consultation/suggestion-panel";
import { SymptomList } from "@/components/consultation/symptom-card";
import { TranscriptViewer } from "@/components/consultation/transcript-viewer";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useConsultationStore } from "@/store/consultation";

export default function ConsultationPage() {
	const {
		symptoms,
		checklist,
		differentials,
		transcriptSegments,
		suggestedQuestions,
	} = useConsultationStore();

	return (
		<div className="h-full min-h-0 p-4">
			<ResizablePanelGroup
				className="h-full items-stretch"
				orientation="horizontal"
			>
				{/* Left Pane: Transcript Stream (25%) */}
				<ResizablePanel defaultSize={25} minSize={15}>
					<div className="mr-2 flex h-full flex-col overflow-hidden rounded-lg border bg-card/50 shadow-sm">
						<div className="border-b bg-muted/40 px-3 py-2">
							<h3 className="font-medium text-muted-foreground text-sm">
								Live Transcript
							</h3>
						</div>
						<div className="flex-1 overflow-y-auto p-3">
							<TranscriptViewer segments={transcriptSegments} />
						</div>
					</div>
				</ResizablePanel>

				<ResizableHandle
					className="mx-1 w-2 bg-transparent data-[panel-group-direction=vertical]:h-2"
					withHandle
				/>

				{/* Center Pane: Active Clinical Picture (45%) */}
				<ResizablePanel defaultSize={45} minSize={30}>
					<div className="flex h-full flex-col gap-4 overflow-y-auto px-2">
						<div className="space-y-2">
							<h3 className="px-1 font-semibold text-primary">
								Active Symptoms
							</h3>
							<SymptomList symptoms={symptoms} />
						</div>

						<div className="mt-2 space-y-2">
							<h3 className="px-1 font-semibold text-primary">
								Differential Diagnosis
							</h3>
							<DifferentialList differentials={differentials} />
						</div>
					</div>
				</ResizablePanel>

				<ResizableHandle
					className="mx-1 w-2 bg-transparent data-[panel-group-direction=vertical]:h-2"
					withHandle
				/>

				{/* Right Pane: Action & Guidance (30%) */}
				<ResizablePanel defaultSize={30} minSize={20}>
					<div className="flex h-full flex-col gap-4 overflow-y-auto pl-2">
						<SuggestionPanel suggestions={suggestedQuestions} />
						<ChecklistPanel items={checklist} />
					</div>
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	);
}
