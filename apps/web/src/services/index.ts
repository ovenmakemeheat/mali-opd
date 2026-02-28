import { MOCKUP_MODE } from "@/lib/config";
import type {
	AIResponse,
	ConsultationState,
	PatientInfo,
	SessionCreate,
	TranscriptionInput,
} from "@/types";

import {
	processTranscription as apiProcessTranscription,
	checkHealth,
	createSession,
	endSession,
	getPatients,
	getSession,
} from "./consultation";
import {
	createMockSession,
	getMockPatients,
	processMockTranscription,
} from "./mock";

export async function createConsultationSession(
	patient: PatientInfo,
	data?: SessionCreate
): Promise<ConsultationState> {
	if (MOCKUP_MODE) {
		return createMockSession(patient);
	}
	const response = await createSession(
		data || {
			patientId: patient.id,
			patientName: patient.name,
			age: patient.age ?? undefined,
			gender: patient.gender ?? undefined,
		}
	);
	return getSession(response.sessionId);
}

export function processTranscription(
	input: TranscriptionInput
): Promise<AIResponse> {
	if (MOCKUP_MODE) {
		return Promise.resolve(processMockTranscription(input.text));
	}
	return apiProcessTranscription(input);
}

export function endConsultationSession(
	sessionId: string
): Promise<{ status: string }> {
	if (MOCKUP_MODE) {
		return Promise.resolve({ status: "ended" });
	}
	return endSession(sessionId);
}

export function getPatientList(): Promise<PatientInfo[]> {
	if (MOCKUP_MODE) {
		return Promise.resolve(getMockPatients());
	}
	return getPatients();
}

export function checkBackendHealth(): Promise<{ status: string }> {
	if (MOCKUP_MODE) {
		return Promise.resolve({ status: "mock" });
	}
	return checkHealth();
}
