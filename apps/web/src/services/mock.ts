import type {
	AIResponse,
	ChecklistItem,
	ConsultationState,
	DifferentialDiagnosis,
	Evidence,
	PatientInfo,
	Symptom,
} from "@/types";

export const MOCK_EVIDENCES: Evidence[] = [
	{
		id: "ev1",
		text: "Patient presents with chest pain for the past 3 days. Pain is on the left side, radiating to the left arm",
		source: "transcript",
		timestamp: new Date().toISOString(),
	},
	{
		id: "ev2",
		text: "Shortness of breath on exertion for about a week",
		source: "transcript",
		timestamp: new Date(Date.now() - 60_000).toISOString(),
	},
];

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
		evidenceId: "ev1",
	},
	{
		id: "s2",
		name: "Shortness of breath",
		duration: "1 week",
		severity: "mild",
		notes: "On climbing stairs",
		confidence: 0.88,
		evidenceId: "ev2",
	},
];

const MOCK_CHECKLIST: ChecklistItem[] = [
	{
		id: "c1",
		question: "Location of chest pain?",
		category: "HPI",
		status: "answered",
		answer: "Left side, radiating to left arm",
		evidenceId: "ev1",
	},
	{
		id: "c2",
		question: "Duration of symptoms?",
		category: "HPI",
		status: "answered",
		answer: "3 days",
		evidenceId: "ev1",
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
			{ text: "Chest pain on exertion", evidenceId: "ev1" },
			{ text: "Radiating to left arm", evidenceId: "ev1" },
			{ text: "History of CAD" },
		],
		missingEvidence: [
			{
				text: "ECG results",
				priority: "high",
				mappedQuestion: "Do you have any recent ECG results?",
			},
			{
				text: "Troponin levels",
				priority: "high",
				mappedQuestion: "Have we checked troponin levels?",
			},
		],
	},
	{
		id: "d2",
		diagnosis: "Myocardial Infarction",
		confidence: 0.45,
		supportingEvidence: [
			{ text: "Chest pain", evidenceId: "ev1" },
			{ text: "Diabetes" },
			{ text: "Age >45" },
		],
		missingEvidence: [
			{
				text: "ECG changes",
				priority: "high",
				mappedQuestion: "Are there any newly observed ECG changes?",
			},
			{
				text: "Troponin elevation",
				priority: "high",
				mappedQuestion: "Have we seen a rise in troponin?",
			},
			{
				text: "Duration >20min",
				priority: "medium",
				mappedQuestion: "Did the pain last longer than 20 minutes?",
			},
		],
	},
	{
		id: "d3",
		diagnosis: "GERD",
		confidence: 0.35,
		supportingEvidence: [{ text: "Chest pain", evidenceId: "ev1" }],
		missingEvidence: [
			{
				text: "Relation to meals",
				priority: "medium",
				mappedQuestion: "Does the pain get worse after eating?",
			},
			{
				text: "Response to antacids",
				priority: "low",
				mappedQuestion: "Have you tried antacids, and did they help?",
			},
		],
	},
];

const MOCK_SUGGESTED_QUESTIONS = [
	"RED FLAG: Ask if pain radiates to the jaw, neck, or back",
	"Ask about associated symptoms: nausea, sweating, shortness of breath",
	"Clarify if the pain is exertional or occurs at rest",
	"Consider asking about smoking history or family history of early heart disease",
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
		evidences: [],
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
		evidences: MOCK_EVIDENCES,
	};
}

export function getMockConsultationState(): ConsultationState {
	const now = new Date().toISOString();
	return {
		sessionId: generateSessionId(),
		patient: MOCK_PATIENTS[0],
		evidences: MOCK_EVIDENCES,
		symptoms: MOCK_SYMPTOMS,
		clinicalFacts: [],
		checklist: MOCK_CHECKLIST,
		differentials: MOCK_DIFFERENTIALS,
		transcriptSegments: [
			{
				id: "ts1",
				text: "Patient presents with chest pain for the past 3 days",
				evidenceId: "ev1",
			},
			{
				id: "ts2",
				text: "Pain is on the left side, radiating to the left arm",
				evidenceId: "ev1",
			},
			{
				id: "ts3",
				text: "Shortness of breath on exertion for about a week",
				evidenceId: "ev2",
			},
			{ id: "ts4", text: "Okay, I will note that down. Any other symptoms?" },
		],
		suggestedQuestions: MOCK_SUGGESTED_QUESTIONS,
		createdAt: now,
		updatedAt: now,
	};
}

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
