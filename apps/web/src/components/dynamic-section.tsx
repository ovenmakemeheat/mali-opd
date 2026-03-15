"use client";

import {
	BloodCells,
	Diabetes,
	HeartOrgan,
	Lungs,
	Neurology,
} from "healthicons-react";
import type { ComponentType } from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Suggestion {
	diseases: string[];
	Icon: ComponentType<{ className?: string }>;
	keyword: string;
	question: string;
	reason: string;
}

const suggestions: Suggestion[] = [
	{
		Icon: BloodCells,
		keyword: "leukemia",
		question: "ครอบครัวมีประวัติเป็นมะเร็งเม็ดเลือดขาวหรือไม่?", // สั้น กระชับ
		reason:
			"พันธุกรรมมีส่วนสำคัญ ประวัติครอบครัวเพิ่มความเสี่ยงอย่างมีนัยสำคัญและควรตรวจคัดกรองล่วงหน้า",
		diseases: [
			"Acute Lymphoblastic Leukemia",
			"Chronic Myeloid Leukemia",
			"Non-Hodgkin Lymphoma",
		],
	},
	{
		Icon: HeartOrgan,
		keyword: "heart disease",
		question: "มีอาการเจ็บหน้าอกขณะออกแรงหรือไม่?", // ตัดคำฟุ่มเฟือยออก
		reason:
			"Exertional chest pain เป็นอาการคลาสสิกของ CAD การซักประวัติช่วยป้องกันภาวะกล้ามเนื้อหัวใจตายได้",
		diseases: [
			"Angina Pectoris",
			"Coronary Artery Disease",
			"Myocardial Infarction",
		],
	},
	{
		Icon: Lungs,
		keyword: "dyspnea",
		question: "เหนื่อยหอบขณะเดินขึ้นบันไดหรือออกแรงหรือไม่?",
		reason:
			"Exertional dyspnea บ่งบอกถึงสมรรถภาพปอด/หัวใจลดลง อาจเป็นสัญญาณ COPD หรือ Heart Failure ระยะแรก",
		diseases: ["COPD", "Heart Failure", "Pulmonary Hypertension", "Asthma"],
	},
	{
		Icon: Diabetes,
		keyword: "diabetes",
		question: "มีอาการหิวน้ำบ่อย ปัสสาวะบ่อย หรืออ่อนเพลียผิดปกติไหม?",
		reason:
			"Classic triad ของเบาหวาน (Polydipsia, Polyuria, Fatigue) สำคัญมากในกลุ่มที่มี BMI สูง",
		diseases: [
			"Type 2 Diabetes Mellitus",
			"Type 1 Diabetes Mellitus",
			"Gestational Diabetes",
		],
	},
	{
		Icon: Neurology,
		keyword: "migraine",
		question: "ปวดหัวร่วมกับตาแพ้แสงหรือคลื่นไส้หรือไม่?",
		reason:
			"Photophobia และ Nausea ใช้แยก Migraine ออกจาก Tension headache เพื่อวางแผนการรักษา",
		diseases: ["Migraine with Aura", "Chronic Migraine", "Cluster Headache"],
	},
];

import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const collectedParams = [
	{ label: "Blood Pressure", value: "120/80 mmHg" },
	{ label: "Heart Rate", value: "72 bpm" },
	{ label: "Temperature", value: "36.8 °C" },
	{ label: "Weight", value: "65 kg" },
	{ label: "Height", value: "170 cm" },
];

export function DynamicSection() {
	const [selected, setSelected] = useState<Suggestion>(suggestions[0]);

	return (
		<div className="flex h-full w-full flex-row gap-4">
			{/* Column 1: Collected Parameters */}
			<Card className="w-1/4" size="sm">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div>ข้อมูลที่เก็บแล้ว</div>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button size={"sm"} variant={"outline"}>
									+
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-20">
								<DropdownMenuGroup>
									<DropdownMenuLabel>Add Input</DropdownMenuLabel>
									<DropdownMenuItem>
										Body Diagram
										<DropdownMenuShortcut>+</DropdownMenuShortcut>
									</DropdownMenuItem>
									<DropdownMenuItem>
										...
										<DropdownMenuShortcut>+</DropdownMenuShortcut>
									</DropdownMenuItem>
									<DropdownMenuItem>
										...
										<DropdownMenuShortcut>+</DropdownMenuShortcut>
									</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{collectedParams.map((param) => (
						<div
							className="flex items-baseline justify-between border-border border-b border-dashed py-4 last:border-0"
							key={param.label}
						>
							<span className="text-sm tracking-wide">{param.label}</span>
							<span className="font-medium text-foreground text-sm">
								{param.value}
							</span>
						</div>
					))}
				</CardContent>
			</Card>

			{/* Column 2: Suggestions */}
			<Card className="flex w-3/4 flex-col" size="sm">
				<CardHeader>
					<CardTitle>คำแนะนำ</CardTitle>
				</CardHeader>
				<CardContent className="flex min-h-0 flex-1 gap-4">
					{/* Left 2/3: suggestion list */}
					<div className="flex w-2/3 flex-col overflow-y-auto">
						{suggestions.map((s) => {
							const isActive = s.keyword === selected.keyword;
							return (
								<button
									className={`flex w-full cursor-pointer items-center gap-3 border-border border-b border-dashed py-4 text-left last:border-0 ${
										isActive ? "text-primary" : "text-foreground"
									}`}
									key={s.keyword}
									onClick={() => setSelected(s)}
									type="button"
								>
									<s.Icon className="h-5 w-5 shrink-0 opacity-70" />
									<div className="min-w-0 flex-1">
										<span className="block truncate text-sm opacity-50">
											{s.keyword}
										</span>
										<span className="block truncate text-sm">{s.question}</span>
									</div>
								</button>
							);
						})}
					</div>

					{/* Divider */}
					<div className="w-px shrink-0 bg-border" />

					{/* Right 1/3: detail panel */}
					<div className="flex w-1/3 flex-col gap-3 overflow-y-auto py-4">
						<div className="flex items-start gap-2 border-border border-b border-dashed pb-3">
							<selected.Icon className="mt-0.5 h-5 w-5 shrink-0" />
							<p className="font-medium text-sm leading-snug">
								{selected.question}
							</p>
						</div>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{selected.reason}
						</p>
						<div className="flex flex-col">
							{selected.diseases.map((d) => (
								<span
									className="border-border border-b border-dashed py-1.5 text-sm last:border-0"
									key={d}
								>
									{d}
								</span>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
