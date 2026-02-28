import type {
	AIResponse,
	ChecklistItem,
	ConsultationState,
	DifferentialDiagnosis,
	PatientInfo,
	Symptom,
} from "@/types";

const MOCK_PATIENTS: PatientInfo[] = [
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
];

const MOCK_SYMPTOMS: Symptom[] = [
	{
		id: "s1",
		name: "Chest pain",
		duration: "3 days",
		severity: "moderate",
		notes: "Worse on exertion",
		confidence: 0.95,
	},
	{
		id: "s2",
		name: "Shortness of breath",
		duration: "1 week",
		severity: "mild",
		notes: "On climbing stairs",
		confidence: 0.88,
	},
];

const MOCK_CHECKLIST: ChecklistItem[] = [
	{
		id: "c1",
		question: "Location of chest pain?",
		category: "HPI",
		status: "answered",
		answer: "Left side, radiating to left arm",
	},
	{
		id: "c2",
		question: "Duration of symptoms?",
		category: "HPI",
		status: "answered",
		answer: "3 days",
	},
	{
		id: "c3",
		question: "Associated nausea?",
		category: "Associated",
		status: "partial",
		answer: null,
	},
	{
		id: "c4",
		question: "History of similar episodes?",
		category: "History",
		status: "not_asked",
		answer: null,
	},
	{
		id: "c5",
		question: "Smoking history?",
		category: "Risk Factors",
		status: "not_asked",
		answer: null,
	},
];

const MOCK_DIFFERENTIALS: DifferentialDiagnosis[] = [
	{
		id: "d1",
		diagnosis: "Unstable Angina",
		confidence: 0.72,
		supportingEvidence: [
			"Chest pain on exertion",
			"Radiating to left arm",
			"History of CAD",
		],
		missingEvidence: ["ECG results", "Troponin levels"],
	},
	{
		id: "d2",
		diagnosis: "Myocardial Infarction",
		confidence: 0.45,
		supportingEvidence: ["Chest pain", "Diabetes", "Age >45"],
		missingEvidence: ["ECG changes", "Troponin elevation", "Duration >20min"],
	},
	{
		id: "d3",
		diagnosis: "GERD",
		confidence: 0.35,
		supportingEvidence: ["Chest pain"],
		missingEvidence: ["Relation to meals", "Response to antacids"],
	},
];

const MOCK_SUGGESTED_QUESTIONS = [
	"Ask about radiation of pain to jaw or back",
	"Ask about associated symptoms: nausea, sweating",
	"Ask about smoking history",
	"Consider asking about family history of heart disease",
];

function generateSessionId(): string {
	return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getMockPatients(): Promise<PatientInfo[]> {
	await delay(300);
	return MOCK_PATIENTS;
}

export async function createMockSession(
	patient: PatientInfo
): Promise<ConsultationState> {
	await delay(500);
	const now = new Date().toISOString();
	return {
		sessionId: generateSessionId(),
		patient,
		symptoms: [],
		clinicalFacts: [],
		checklist: [],
		differentials: [],
		transcriptSegments: [],
		suggestedQuestions: [],
		createdAt: now,
		updatedAt: now,
	};
}

export async function processMockTranscription(
	_text: string
): Promise<AIResponse> {
	await delay(800);
	return {
		extractedSymptoms: MOCK_SYMPTOMS,
		clinicalFacts: [],
		suggestedQuestions: MOCK_SUGGESTED_QUESTIONS,
		differentials: MOCK_DIFFERENTIALS,
		checklistUpdates: MOCK_CHECKLIST,
	};
}

export function getMockConsultationState(): ConsultationState {
	const now = new Date().toISOString();
	return {
		sessionId: generateSessionId(),
		patient: MOCK_PATIENTS[0],
		symptoms: MOCK_SYMPTOMS,
		clinicalFacts: [],
		checklist: MOCK_CHECKLIST,
		differentials: MOCK_DIFFERENTIALS,
		transcriptSegments: [
			"Patient presents with chest pain for the past 3 days",
			"Pain is on the left side, radiating to the left arm",
			"Shortness of breath on exertion for about a week",
		],
		suggestedQuestions: MOCK_SUGGESTED_QUESTIONS,
		createdAt: now,
		updatedAt: now,
	};
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
