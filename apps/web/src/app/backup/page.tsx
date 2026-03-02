"use client";

import { Search, Stethoscope, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MOCKUP_MODE } from "@/lib/config";
import { useConsultationStore } from "@/store/consultation";
import type { PatientInfo } from "@/types";

export default function HomePage() {
	const router = useRouter();
	const { startSession, isProcessing } = useConsultationStore();
	const [search, setSearch] = useState("");
	const [newPatient, setNewPatient] = useState({
		name: "",
		age: "",
		gender: "male" as "male" | "female" | "other",
	});

	const patients = getMockPatients();

	const filtered = patients.filter(
		(p) =>
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.id.toLowerCase().includes(search.toLowerCase())
	);

	const handleSelectPatient = async (patient: PatientInfo) => {
		await startSession(patient);
		router.push("/consultation/session-active");
	};

	const handleCreatePatient = async () => {
		if (!newPatient.name.trim()) {
			return;
		}
		const patient: PatientInfo = {
			id: `P${Date.now()}`,
			name: newPatient.name,
			age: newPatient.age ? Number.parseInt(newPatient.age, 10) : null,
			gender: newPatient.gender,
			history: [],
		};
		await startSession(patient);
		router.push("/consultation/session-active");
	};

	return (
		<div className="flex h-full flex-col items-center justify-center p-4">
			<div className="mb-8 text-center">
				<div className="mb-4 flex justify-center">
					<div className="rounded-full bg-primary/10 p-4 shadow-sm">
						<Stethoscope className="h-10 w-10 text-primary" />
					</div>
				</div>
				<h1 className="mb-2 font-bold text-2xl tracking-tight">
					MALI OPD Assistant
				</h1>
				<p className="text-muted-foreground">
					Select a patient or start a new walk-in session
				</p>
				{MOCKUP_MODE && (
					<Badge className="mt-2" variant="outline">
						Demo Mode
					</Badge>
				)}
			</div>

			<div className="flex w-full max-w-4xl flex-col gap-6 md:h-[420px] md:flex-row">
				{/* Left Column: Existing Patients */}
				<Card className="flex flex-1 flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md dark:bg-card">
					<CardHeader className="border-b bg-muted/30 pb-4 dark:bg-muted/10">
						<CardTitle className="font-semibold text-lg">
							Select Patient
						</CardTitle>
					</CardHeader>
					<CardContent className="flex min-h-0 flex-1 flex-col space-y-4 p-4">
						<div className="relative shrink-0">
							<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								className="bg-background pl-9 focus-visible:ring-primary/50"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by name or ID..."
								value={search}
							/>
						</div>

						<div className="min-h-0 flex-1 overflow-y-auto pr-2">
							<div className="flex flex-col gap-2">
								{filtered.map((patient) => (
									<button
										className="group flex items-center justify-between rounded-lg border border-transparent bg-muted/20 p-3 text-left transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm dark:bg-muted/5 dark:hover:border-primary/40 dark:hover:bg-primary/10"
										disabled={isProcessing}
										key={patient.id}
										onClick={() => handleSelectPatient(patient)}
										type="button"
									>
										<div>
											<p className="font-medium transition-colors group-hover:text-primary">
												{patient.name}
											</p>
											<p className="text-muted-foreground text-xs">
												ID: {patient.id}
											</p>
										</div>
										<div className="flex gap-1">
											{patient.age && (
												<Badge className="bg-background" variant="outline">
													{patient.age}y
												</Badge>
											)}
											{patient.gender && (
												<Badge
													className="bg-background capitalize"
													variant="outline"
												>
													{patient.gender}
												</Badge>
											)}
										</div>
									</button>
								))}
								{filtered.length === 0 && (
									<div className="py-8 text-center text-muted-foreground text-sm">
										No patients found.
									</div>
								)}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Right Column: New Patient Walk-in */}
				<Card className="flex flex-1 flex-col overflow-hidden border-primary/20 bg-primary/5 shadow-sm transition-shadow hover:shadow-md dark:border-primary/10 dark:bg-primary/5">
					<CardHeader className="border-primary/10 border-b bg-background/50 pb-4 dark:border-primary/5 dark:bg-background/80">
						<CardTitle className="flex items-center gap-2 font-semibold text-lg text-primary">
							<UserPlus className="h-5 w-5" />
							Quick Start Walk-in
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-1 flex-col justify-center space-y-5 p-6">
						<div className="space-y-5">
							<div className="space-y-1.5">
								<label className="font-medium text-sm" htmlFor="patientName">
									Patient Name
								</label>
								<Input
									className="bg-background"
									id="patientName"
									onChange={(e) =>
										setNewPatient((p) => ({ ...p, name: e.target.value }))
									}
									placeholder="e.g. John Doe"
									value={newPatient.name}
								/>
							</div>
							<div className="flex gap-3">
								<div className="flex-[0.7] space-y-1.5">
									<label className="font-medium text-sm" htmlFor="patientAge">
										Age
									</label>
									<Input
										className="bg-background"
										id="patientAge"
										onChange={(e) =>
											setNewPatient((p) => ({ ...p, age: e.target.value }))
										}
										placeholder="Years"
										type="number"
										value={newPatient.age}
									/>
								</div>
								<div className="flex-1 space-y-1.5">
									<label
										className="font-medium text-sm"
										htmlFor="patientGender"
									>
										Gender
									</label>
									<select
										className="h-9 w-full rounded-md border bg-background px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
										id="patientGender"
										onChange={(e) =>
											setNewPatient((p) => ({
												...p,
												gender: e.target.value as "male" | "female" | "other",
											}))
										}
										value={newPatient.gender}
									>
										<option value="male">Male</option>
										<option value="female">Female</option>
										<option value="other">Other</option>
									</select>
								</div>
							</div>
							<div className="pt-4">
								<Button
									className="w-full py-6 font-semibold text-base shadow-md"
									disabled={isProcessing || !newPatient.name.trim()}
									onClick={handleCreatePatient}
								>
									{isProcessing ? "Preparing Session..." : "Start Consultation"}
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function getMockPatients(): PatientInfo[] {
	return [
		{
			id: "P001",
			name: "John Smith",
			age: 45,
			gender: "male",
			history: ["Hypertension", "Type 2 Diabetes"],
		},
		{
			id: "P002",
			name: "Sarah Johnson",
			age: 32,
			gender: "female",
			history: ["Asthma"],
		},
		{
			id: "P003",
			name: "Michael Chen",
			age: 58,
			gender: "male",
			history: ["Coronary Artery Disease", "Hyperlipidemia"],
		},
		{
			id: "P004",
			name: "Emily Davis",
			age: 28,
			gender: "female",
			history: [],
		},
		{
			id: "P005",
			name: "Robert Wilson",
			age: 62,
			gender: "male",
			history: ["CKD Stage 3", "Gout"],
		},
	];
}
