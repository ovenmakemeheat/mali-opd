import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PatientInfo } from "@/types";

interface PatientInfoCardProps {
	patient: PatientInfo;
}

export function PatientInfoCard({ patient }: PatientInfoCardProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg">{patient.name}</CardTitle>
					<div className="flex gap-2">
						{patient.age && (
							<Badge variant="outline">{patient.age} years</Badge>
						)}
						{patient.gender && (
							<Badge variant="outline">{patient.gender}</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<div>
						<p className="font-semibold text-muted-foreground text-xs">
							Patient ID
						</p>
						<p className="text-sm">{patient.id}</p>
					</div>
					{patient.history.length > 0 && (
						<div>
							<p className="mb-1 font-semibold text-muted-foreground text-xs">
								Medical History
							</p>
							<div className="flex flex-wrap gap-1">
								{patient.history.map((item) => (
									<Badge key={item} variant="secondary">
										{item}
									</Badge>
								))}
							</div>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
