import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const collectedParams = [
	{ label: "Blood Pressure", value: "120/80 mmHg" },
	{ label: "Heart Rate", value: "72 bpm" },
	{ label: "Temperature", value: "36.8 °C" },
	{ label: "Weight", value: "65 kg" },
	{ label: "Height", value: "170 cm" },
];

const collectingParams = [
	{ label: "SpO2", status: "กำลังวัด…" },
	{ label: "Respiratory Rate", status: "กำลังวัด…" },
];

const mockParams = [
	{ label: "Pain Score", value: "—" },
	{ label: "Allergy", value: "—" },
	{ label: "Chief Complaint", value: "—" },
];

export function DynamicSection() {
	return (
		<div className="grid h-full grid-cols-3 gap-4">
			{/* Column 1: Collected Parameters */}
			<Card className="h-full" size="sm">
				<CardHeader>
					<CardTitle>Parameter ที่เก็บแล้ว</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{collectedParams.map((param) => (
							<div
								className="flex items-baseline justify-between border-border border-b border-dashed pb-2 last:border-0 last:pb-0"
								key={param.label}
							>
								<span className="text-muted-foreground text-xs tracking-wide">
									{param.label}
								</span>
								<span className="font-medium text-foreground text-sm">
									{param.value}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Column 2: Currently Collecting */}
			<Card className="h-full" size="sm">
				<CardHeader>
					<CardTitle>กำลังเก็บ</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{collectingParams.map((param) => (
							<div
								className="flex items-baseline justify-between border-border border-b border-dashed pb-2 last:border-0 last:pb-0"
								key={param.label}
							>
								<span className="text-muted-foreground text-xs tracking-wide">
									{param.label}
								</span>
								<span className="animate-pulse font-medium text-amber-500 text-sm">
									{param.status}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Column 3: Mock / Pending */}
			<Card className="h-full" size="sm">
				<CardHeader>
					<CardTitle>Mock (รอก่อน)</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						{mockParams.map((param) => (
							<div
								className="flex items-baseline justify-between border-border border-b border-dashed pb-2 last:border-0 last:pb-0"
								key={param.label}
							>
								<span className="text-muted-foreground text-xs tracking-wide">
									{param.label}
								</span>
								<span className="font-medium text-muted-foreground text-sm">
									{param.value}
								</span>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
