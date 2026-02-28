import { Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { PatientInfo } from "@/types";

interface PatientSelectorProps {
	onCreateNew: (patient: Omit<PatientInfo, "id">) => void;
	onSelect: (patient: PatientInfo) => void;
	patients: PatientInfo[];
}

export function PatientSelector({
	patients,
	onSelect,
	onCreateNew,
}: PatientSelectorProps) {
	const [search, setSearch] = useState("");
	const [showNewPatient, setShowNewPatient] = useState(false);
	const [newPatient, setNewPatient] = useState<{
		name: string;
		age: string;
		gender: "male" | "female" | "other";
	}>({
		name: "",
		age: "",
		gender: "male",
	});

	const filtered = patients.filter(
		(p) =>
			p.name.toLowerCase().includes(search.toLowerCase()) ||
			p.id.toLowerCase().includes(search.toLowerCase())
	);

	const handleCreate = () => {
		if (!newPatient.name.trim()) {
			return;
		}
		onCreateNew({
			name: newPatient.name,
			age: newPatient.age ? Number.parseInt(newPatient.age, 10) : null,
			gender: newPatient.gender,
			history: [],
		});
		setNewPatient({ name: "", age: "", gender: "male" });
		setShowNewPatient(false);
	};

	return (
		<Card className="mx-auto max-w-2xl">
			<CardHeader>
				<CardTitle>Select Patient</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="relative">
					<Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="pl-9"
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by name or ID..."
						value={search}
					/>
				</div>

				<div className="grid max-h-64 gap-2 overflow-y-auto">
					{filtered.map((patient) => (
						<button
							className="flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
							key={patient.id}
							onClick={() => onSelect(patient)}
							type="button"
						>
							<div>
								<p className="font-medium">{patient.name}</p>
								<p className="text-muted-foreground text-xs">
									ID: {patient.id}
								</p>
							</div>
							<div className="flex gap-1">
								{patient.age && <Badge variant="outline">{patient.age}y</Badge>}
								{patient.gender && (
									<Badge variant="outline">{patient.gender}</Badge>
								)}
							</div>
						</button>
					))}
				</div>

				{showNewPatient ? (
					<div className="space-y-3 rounded-lg border p-3">
						<Input
							onChange={(e) =>
								setNewPatient((p) => ({ ...p, name: e.target.value }))
							}
							placeholder="Patient name"
							value={newPatient.name}
						/>
						<div className="flex gap-2">
							<Input
								className="w-24"
								onChange={(e) =>
									setNewPatient((p) => ({ ...p, age: e.target.value }))
								}
								placeholder="Age"
								type="number"
								value={newPatient.age}
							/>
							<select
								className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
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
						<div className="flex gap-2">
							<Button className="flex-1" onClick={handleCreate}>
								Create & Start
							</Button>
							<Button
								onClick={() => setShowNewPatient(false)}
								variant="outline"
							>
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<Button
						className="w-full"
						onClick={() => setShowNewPatient(true)}
						variant="outline"
					>
						<UserPlus className="mr-2 h-4 w-4" />
						New Patient
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
