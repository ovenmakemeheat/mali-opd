import { create } from "zustand";
import {
	createConsultationSession,
	endConsultationSession,
	processTranscription as processTranscriptionService,
} from "@/services";
import type {
	AIResponse,
	ChecklistItem,
	ConsultationPhase,
	DifferentialDiagnosis,
	PatientInfo,
	Symptom,
} from "@/types";

interface ConsultationStore {
	addTranscriptSegment: (text: string) => void;
	checklist: ChecklistItem[];
	clinicalFacts: Array<{
		key: string;
		value: string;
		source: string;
		confidence: number;
	}>;
	differentials: DifferentialDiagnosis[];
	endSession: () => Promise<void>;
	error: string | null;
	isProcessing: boolean;
	isRecording: boolean;
	patient: PatientInfo | null;
	phase: ConsultationPhase;
	processTranscription: (text: string) => Promise<void>;
	reset: () => void;
	sessionId: string | null;
	setPatient: (patient: PatientInfo) => void;

	setPhase: (phase: ConsultationPhase) => void;
	startSession: (patient: PatientInfo) => Promise<void>;
	suggestedQuestions: string[];
	symptoms: Symptom[];
	toggleRecording: () => void;
	transcriptSegments: string[];
	updateFromAI: (response: AIResponse) => void;
}

const initialState = {
	phase: "start" as ConsultationPhase,
	patient: null,
	sessionId: null,
	symptoms: [],
	clinicalFacts: [],
	checklist: [],
	differentials: [],
	transcriptSegments: [],
	suggestedQuestions: [],
	isRecording: false,
	isProcessing: false,
	error: null,
};

export const useConsultationStore = create<ConsultationStore>((set, get) => ({
	...initialState,

	setPhase: (phase) => set({ phase }),

	setPatient: (patient) => set({ patient }),

	startSession: async (patient) => {
		set({ isProcessing: true, error: null });
		try {
			const state = await createConsultationSession(patient);
			set({
				sessionId: state.sessionId,
				patient,
				symptoms: state.symptoms,
				checklist: state.checklist,
				differentials: state.differentials,
				phase: "consultation",
				isProcessing: false,
			});
		} catch (error) {
			set({ error: (error as Error).message, isProcessing: false });
		}
	},

	processTranscription: async (text) => {
		const { sessionId } = get();
		if (!sessionId) {
			return;
		}

		set({ isProcessing: true });
		try {
			const response = await processTranscriptionService({
				sessionId,
				text,
			});
			get().updateFromAI(response);
			set({ isProcessing: false });
		} catch (error) {
			set({ error: (error as Error).message, isProcessing: false });
		}
	},

	updateFromAI: (response) => {
		set((state) => ({
			symptoms: mergeSymptoms(state.symptoms, response.extractedSymptoms),
			clinicalFacts: [...state.clinicalFacts, ...response.clinicalFacts],
			checklist: mergeChecklist(state.checklist, response.checklistUpdates),
			differentials: response.differentials,
			suggestedQuestions: response.suggestedQuestions,
		}));
	},

	toggleRecording: () => set((state) => ({ isRecording: !state.isRecording })),

	endSession: async () => {
		const { sessionId } = get();
		if (sessionId) {
			await endConsultationSession(sessionId);
		}
		set({ phase: "summary" });
	},

	reset: () => set(initialState),

	addTranscriptSegment: (text) =>
		set((state) => ({
			transcriptSegments: [...state.transcriptSegments, text],
		})),
}));

function mergeSymptoms(existing: Symptom[], newSymptoms: Symptom[]): Symptom[] {
	const merged = [...existing];
	for (const symptom of newSymptoms) {
		const existingIndex = merged.findIndex((s) => s.name === symptom.name);
		if (existingIndex >= 0) {
			merged[existingIndex] = { ...merged[existingIndex], ...symptom };
		} else {
			merged.push(symptom);
		}
	}
	return merged;
}

function mergeChecklist(
	existing: ChecklistItem[],
	updates: ChecklistItem[]
): ChecklistItem[] {
	const merged = [...existing];
	for (const item of updates) {
		const existingIndex = merged.findIndex((i) => i.question === item.question);
		if (existingIndex >= 0) {
			merged[existingIndex] = { ...merged[existingIndex], ...item };
		} else {
			merged.push(item);
		}
	}
	return merged;
}
