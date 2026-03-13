import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fields = [
	{ label: "ชื่อ-นามสกุล", value: "สมชาย ใจดี" },
	{ label: "อายุ", value: "45 ปี" },
	{ label: "เพศ", value: "ชาย" },
	{ label: "HN", value: "HN-204581" },
	{ label: "น้ำหนัก", value: "72 กก." },
	{ label: "ส่วนสูง", value: "170 ซม." },
	{ label: "BMI", value: "24.9" },
	{ label: "ชีพจร", value: "78 ครั้ง/นาที" },
	{ label: "ความดัน (Sys)", value: "128 mmHg" },
	{ label: "ความดัน (Dias)", value: "82 mmHg" },
	{ label: "SpO₂", value: "98%" },
	{ label: "อุณหภูมิ", value: "36.8 °C" },
];

export function StaticSection() {
	return (
		<div>
			<Card size="sm">
				<CardHeader>
					<CardTitle>ข้อมูลผู้ป่วย</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-6 gap-x-4 gap-y-3">
						{fields.map((field) => (
							<div key={field.label}>
								<p className="mb-0.5 font-semibold text-muted-foreground text-xs tracking-wide">
									{field.label}
								</p>
								<p className="text-foreground text-sm">{field.value}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
