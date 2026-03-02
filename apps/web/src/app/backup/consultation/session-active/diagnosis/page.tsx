"use client";

import { DifferentialList } from "@/components/consultation/differential-card";
import { SymptomList } from "@/components/consultation/symptom-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useConsultationStore } from "@/store/consultation";

export default function DiagnosisPage() {
	const { symptoms, checklist, differentials } = useConsultationStore();

	const answeredCount = checklist.filter((i) => i.status === "answered").length;
	const partialCount = checklist.filter((i) => i.status === "partial").length;
	const coverage =
		checklist.length > 0
			? Math.round((answeredCount / checklist.length) * 100)
			: 0;

	return (
		<div className="h-full overflow-y-auto p-4">
			<div className="mx-auto max-w-5xl space-y-6">
				<div className="grid grid-cols-3 gap-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Clinical Coverage</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="mb-2 font-bold text-3xl">{coverage}%</div>
							<Progress className="mb-2" value={coverage} />
							<p className="text-muted-foreground text-xs">
								{answeredCount} of {checklist.length} questions answered
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Symptoms Extracted</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="font-bold text-3xl">{symptoms.length}</div>
							<p className="text-muted-foreground text-xs">
								Clinical facts identified
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-sm">Diagnostic Confidence</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="font-bold text-3xl">
								{differentials[0]
									? `${Math.round(differentials[0].confidence * 100)}%`
									: "N/A"}
							</div>
							<p className="text-muted-foreground text-xs">
								Top diagnosis confidence
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-2 gap-6">
					<div>
						<h3 className="mb-4 font-semibold text-lg">Working Diagnosis</h3>
						<DifferentialList differentials={differentials} />
					</div>

					<div className="space-y-4">
						<div>
							<h4 className="mb-2 font-medium">Evidence Gap Analysis</h4>
							<Card>
								<CardContent className="pt-4">
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="text-sm">Questions Answered</span>
											<span className="font-medium text-green-600">
												{answeredCount}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Partially Answered</span>
											<span className="font-medium text-yellow-600">
												{partialCount}
											</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-sm">Not Asked</span>
											<span className="font-medium text-gray-400">
												{
													checklist.filter((i) => i.status === "not_asked")
														.length
												}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						<div>
							<h4 className="mb-2 font-medium">Extracted Symptoms</h4>
							<SymptomList symptoms={symptoms} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
