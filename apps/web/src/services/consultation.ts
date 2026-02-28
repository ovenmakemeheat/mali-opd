import type {
	AIResponse,
	ConsultationState,
	PatientInfo,
	SessionCreate,
	TranscriptionInput,
} from "@/types";
import { apiClient } from "./api";

export interface SessionResponse {
	sessionId: string;
	status: string;
}

export interface HealthResponse {
	status: string;
	version: string;
}

export function checkHealth(): Promise<HealthResponse> {
	return apiClient.get<HealthResponse>("/health");
}

export function createSession(data: SessionCreate): Promise<SessionResponse> {
	return apiClient.post<SessionResponse>("/sessions", data);
}

export function getSession(sessionId: string): Promise<ConsultationState> {
	return apiClient.get<ConsultationState>(`/sessions/${sessionId}`);
}

export function processTranscription(
	data: TranscriptionInput
): Promise<AIResponse> {
	return apiClient.post<AIResponse>(
		`/sessions/${data.sessionId}/transcribe`,
		data
	);
}

export function endSession(sessionId: string): Promise<{ status: string }> {
	return apiClient.delete<{ status: string }>(`/sessions/${sessionId}`);
}

export function createWebSocketConnection(
	sessionId: string,
	onMessage: (data: AIResponse) => void
): WebSocket {
	const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000"}/api/ws/${sessionId}`;
	const ws = new WebSocket(wsUrl);

	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);
		if (data.type === "update") {
			onMessage(data);
		}
	};

	return ws;
}

export function getPatients(): Promise<PatientInfo[]> {
	return apiClient.get<PatientInfo[]>("/patients");
}
