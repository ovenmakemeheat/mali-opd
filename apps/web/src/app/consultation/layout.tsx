"use client";

import { ClipboardList, FileText, Stethoscope } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { RecordingIndicator } from "@/components/consultation/recording-indicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCKUP_MODE } from "@/lib/config";
import { getMockConsultationState } from "@/services/mock";
import { useConsultationStore } from "@/store/consultation";

export default function ConsultationLayout({
	children,
}: {
	children: ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);

	const {
		patient,
		symptoms,
		isRecording,
		isProcessing,
		toggleRecording,
		processTranscription,
		endSession,
		reset,
		addTranscriptSegment,
		updateFromAI,
	} = useConsultationStore();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (MOCKUP_MODE && mounted && symptoms.length === 0) {
			const mockState = getMockConsultationState();
			updateFromAI({
				extractedSymptoms: mockState.symptoms,
				clinicalFacts: [],
				suggestedQuestions: mockState.suggestedQuestions,
				differentials: mockState.differentials,
				checklistUpdates: mockState.checklist,
			});
		}
	}, [mounted, symptoms.length, updateFromAI]);

	const simulateTranscription = async () => {
		const sampleTexts = [
			"Patient reports chest pain for the past three days",
			"The pain is sharp and radiates to the left arm",
			"No shortness of breath or sweating noted",
			"Patient has history of hypertension and diabetes",
			"Pain worsens with exertion and improves with rest",
		];
		const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
		addTranscriptSegment(text);
		await processTranscription(text);
	};

	const handleEndSession = async () => {
		await endSession();
		router.push("/consultation/session-active/summary");
	};

	const _handleNewSession = () => {
		reset();
		router.push("/");
	};

	if (!mounted) {
		return null;
	}

	const isActiveConsultation = pathname.includes("session-active");

	if (!isActiveConsultation) {
		return <>{children}</>;
	}

	const tabs = [
		{
			href: "/consultation/session-active",
			label: "Consultation",
			icon: <Stethoscope className="h-4 w-4" />,
		},
		{
			href: "/consultation/session-active/diagnosis",
			label: "Diagnosis",
			icon: <ClipboardList className="h-4 w-4" />,
		},
		{
			href: "/consultation/session-active/note",
			label: "Note",
			icon: <FileText className="h-4 w-4" />,
		},
	];

	return (
		<div className="flex h-full flex-col">
			<div className="border-b bg-muted/30 px-4 py-2">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						{patient ? (
							<div className="flex items-center gap-2">
								<span className="font-medium">{patient.name}</span>
								<span className="text-muted-foreground text-sm">
									({patient.id})
								</span>
								{patient.age && <Badge variant="outline">{patient.age}y</Badge>}
							</div>
						) : (
							<span className="text-muted-foreground">No patient selected</span>
						)}

						<div className="flex items-center gap-1">
							{tabs.map((tab) => {
								const isActive = pathname === tab.href;
								return (
									<Link
										className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
											isActive
												? "bg-primary text-primary-foreground"
												: "hover:bg-muted"
										}`}
										// biome-ignore lint/suspicious/noExplicitAny: Next.js typed routes require casting here
										href={tab.href as any}
										key={tab.href}
									>
										{tab.icon} {tab.label}
									</Link>
								);
							})}
						</div>
					</div>

					<div className="flex items-center gap-2">
						<RecordingIndicator
							isProcessing={isProcessing}
							isRecording={isRecording}
							onToggle={() => {
								toggleRecording();
								if (MOCKUP_MODE && !isRecording) {
									simulateTranscription();
								}
							}}
						/>
						<Button onClick={handleEndSession} size="sm" variant="destructive">
							End Session
						</Button>
					</div>
				</div>
			</div>

			<div className="flex-1 overflow-hidden">{children}</div>
		</div>
	);
}
