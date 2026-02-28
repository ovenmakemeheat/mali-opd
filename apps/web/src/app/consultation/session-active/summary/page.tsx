"use client";

import { CheckCircle2, Clock, MessageSquare, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConsultationStore } from "@/store/consultation";

export default function SummaryPage() {
	const router = useRouter();
	const { symptoms, checklist, differentials, transcriptSegments, reset } =
		useConsultationStore();

	const answeredCount = checklist.filter((i) => i.status === "answered").length;
	const topDiagnosis = differentials[0];

	const handleNewSession = () => {
		reset();
		router.push("/");
	};

	return (
		<div className="flex h-full items-center justify-center p-4">
			<Card className="mx-auto w-full max-w-lg">
				<CardHeader className="pb-2 text-center">
					<div className="mx-auto mb-4 w-fit rounded-full bg-green-100 p-3">
						<CheckCircle2 className="h-8 w-8 text-green-600" />
					</div>
					<CardTitle className="text-xl">Consultation Complete</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-muted-foreground">
						Session has been ended successfully
					</p>

					<div className="grid grid-cols-2 gap-4">
						<div className="rounded-lg border p-3 text-center">
							<MessageSquare className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
							<p className="font-bold text-lg">{transcriptSegments.length}</p>
							<p className="text-muted-foreground text-xs">
								Transcript Segments
							</p>
						</div>

						<div className="rounded-lg border p-3 text-center">
							<Stethoscope className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
							<p className="font-bold text-lg">{symptoms.length}</p>
							<p className="text-muted-foreground text-xs">
								Symptoms Extracted
							</p>
						</div>

						<div className="rounded-lg border p-3 text-center">
							<Clock className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
							<p className="font-bold text-lg">
								{answeredCount}/{checklist.length}
							</p>
							<p className="text-muted-foreground text-xs">
								Questions Answered
							</p>
						</div>

						<div className="rounded-lg border p-3 text-center">
							<CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
							<p className="font-bold text-lg">{differentials.length}</p>
							<p className="text-muted-foreground text-xs">Differentials</p>
						</div>
					</div>

					{topDiagnosis && (
						<div className="rounded-lg border p-3">
							<p className="mb-1 text-muted-foreground text-xs">
								Primary Diagnosis
							</p>
							<p className="font-medium">{topDiagnosis.diagnosis}</p>
							<p className="text-muted-foreground text-sm">
								{Math.round(topDiagnosis.confidence * 100)}% confidence
							</p>
						</div>
					)}

					<div className="flex flex-col gap-2">
						<Button onClick={handleNewSession} size="lg">
							Start New Consultation
						</Button>
						<Button
							onClick={() => router.push("/consultation/session-active/note")}
							variant="outline"
						>
							View Note
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
