"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConsultationStore } from "@/store/consultation";

export default function NotePage() {
	const _router = useRouter();
	const { patient, symptoms, differentials, checklist } =
		useConsultationStore();
	const [signed, setSigned] = useState(false);

	const primaryDiagnosis = differentials[0];
	const answeredItems = checklist.filter((i) => i.status === "answered");

	const soapNote = generateSOAPNote(
		patient,
		symptoms,
		answeredItems,
		differentials
	);

	const handleSign = () => {
		setSigned(true);
	};

	return (
		<div className="h-full overflow-y-auto p-4">
			<div className="mx-auto grid max-w-5xl grid-cols-2 gap-6">
				<div>
					<h3 className="mb-4 font-semibold text-lg">Generated SOAP Note</h3>
					<Card>
						<CardContent className="pt-4">
							<pre className="whitespace-pre-wrap font-mono text-sm">
								{soapNote}
							</pre>
						</CardContent>
					</Card>
				</div>

				<div className="space-y-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Primary Diagnosis</CardTitle>
						</CardHeader>
						<CardContent>
							{primaryDiagnosis ? (
								<div>
									<p className="font-medium text-lg">
										{primaryDiagnosis.diagnosis}
									</p>
									<p className="text-muted-foreground text-sm">
										{Math.round(primaryDiagnosis.confidence * 100)}% confidence
									</p>
									{primaryDiagnosis.supportingEvidence.length > 0 && (
										<div className="mt-2">
											<p className="font-medium text-muted-foreground text-xs">
												Supporting:
											</p>
											<p className="text-sm">
												{primaryDiagnosis.supportingEvidence.join(", ")}
											</p>
										</div>
									)}
								</div>
							) : (
								<p className="text-muted-foreground">No diagnosis yet</p>
							)}
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Clinical Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p className="text-muted-foreground">Symptoms</p>
									<p className="font-medium">{symptoms.length}</p>
								</div>
								<div>
									<p className="text-muted-foreground">Questions</p>
									<p className="font-medium">
										{answeredItems.length}/{checklist.length}
									</p>
								</div>
								<div>
									<p className="text-muted-foreground">Differentials</p>
									<p className="font-medium">{differentials.length}</p>
								</div>
								<div>
									<p className="text-muted-foreground">Status</p>
									<p className="font-medium">{signed ? "Signed" : "Pending"}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="flex flex-col gap-2">
						<Button
							className="w-full"
							disabled={signed}
							onClick={handleSign}
							size="lg"
						>
							{signed ? "✓ Signed" : "Sign & Save"}
						</Button>
						<Button className="w-full" disabled={!signed} variant="outline">
							Export to EMR
						</Button>
						<Button className="w-full" disabled={!signed} variant="outline">
							Print
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function generateSOAPNote(
	patient: {
		name: string;
		age: number | null;
		gender: string | null;
		id: string;
	} | null,
	symptoms: Array<{
		name: string;
		duration: string | null;
		notes: string | null;
	}>,
	answeredItems: Array<{ question: string; answer: string | null }>,
	differentials: Array<{ diagnosis: string; confidence: number }>
): string {
	const subjective = `
PATIENT: ${patient?.name ?? "Unknown"} ${patient?.age ? `(${patient.age}y)` : ""} ${patient?.gender ?? ""}
ID: ${patient?.id ?? "N/A"}

CHIEF COMPLAINT: ${symptoms[0]?.name ?? "N/A"}

HISTORY OF PRESENT ILLNESS:
${
	symptoms.length > 0
		? symptoms
				.map(
					(s) =>
						`• ${s.name}${s.duration ? ` - ${s.duration}` : ""}${s.notes ? `: ${s.notes}` : ""}`
				)
				.join("\n")
		: "No symptoms documented"
}`.trim();

	const objective = `
EXAMINATION FINDINGS:
${
	answeredItems.length > 0
		? answeredItems
				.map((i) => `• ${i.question} ${i.answer ?? "Not specified"}`)
				.join("\n")
		: "No examination findings documented"
}`.trim();

	const assessment = `
DIFFERENTIAL DIAGNOSIS:
${
	differentials.length > 0
		? differentials
				.sort((a, b) => b.confidence - a.confidence)
				.map(
					(d, i) =>
						`${i + 1}. ${d.diagnosis} (${Math.round(d.confidence * 100)}% confidence)`
				)
				.join("\n")
		: "Assessment pending"
}`.trim();

	const plan = `
PLAN:
• Further evaluation recommended
• Follow-up as needed
• Patient counseled on warning signs`;

	return `${subjective}

---

${objective}

---

${assessment}

---

${plan}`;
}
