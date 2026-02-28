import { z } from "zod";

export const SymptomSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	duration: z.string().nullable(),
	severity: z.enum(["mild", "moderate", "severe"]).nullable(),
	notes: z.string().nullable(),
	confidence: z.number().min(0).max(1),
});

export const ClinicalFactSchema = z.object({
	key: z.string(),
	value: z.string(),
	source: z.enum(["conversation", "exam", "history"]),
	confidence: z.number().min(0).max(1),
});

export const ChecklistStatusSchema = z.enum([
	"answered",
	"partial",
	"not_asked",
]);

export const ChecklistItemSchema = z.object({
	id: z.string(),
	question: z.string(),
	category: z.string(),
	status: ChecklistStatusSchema,
	answer: z.string().nullable(),
});

export const DifferentialDiagnosisSchema = z.object({
	id: z.string(),
	diagnosis: z.string(),
	confidence: z.number().min(0).max(1),
	supportingEvidence: z.array(z.string()),
	missingEvidence: z.array(z.string()),
});

export const PatientInfoSchema = z.object({
	id: z.string(),
	name: z.string(),
	age: z.number().nullable(),
	gender: z.enum(["male", "female", "other"]).nullable(),
	history: z.array(z.string()),
});

export const ConsultationStateSchema = z.object({
	sessionId: z.string(),
	patient: PatientInfoSchema.nullable(),
	symptoms: z.array(SymptomSchema),
	clinicalFacts: z.array(ClinicalFactSchema),
	checklist: z.array(ChecklistItemSchema),
	differentials: z.array(DifferentialDiagnosisSchema),
	transcriptSegments: z.array(z.string()),
	suggestedQuestions: z.array(z.string()),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const SessionCreateSchema = z.object({
	patientId: z.string(),
	patientName: z.string(),
	age: z.number().optional(),
	gender: z.enum(["male", "female", "other"]).optional(),
});

export const TranscriptionInputSchema = z.object({
	sessionId: z.string(),
	text: z.string(),
});

export const AIResponseSchema = z.object({
	extractedSymptoms: z.array(SymptomSchema),
	clinicalFacts: z.array(ClinicalFactSchema),
	suggestedQuestions: z.array(z.string()),
	differentials: z.array(DifferentialDiagnosisSchema),
	checklistUpdates: z.array(ChecklistItemSchema),
});

export type Symptom = z.infer<typeof SymptomSchema>;
export type ClinicalFact = z.infer<typeof ClinicalFactSchema>;
export type ChecklistStatus = z.infer<typeof ChecklistStatusSchema>;
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type DifferentialDiagnosis = z.infer<typeof DifferentialDiagnosisSchema>;
export type PatientInfo = z.infer<typeof PatientInfoSchema>;
export type ConsultationState = z.infer<typeof ConsultationStateSchema>;
export type SessionCreate = z.infer<typeof SessionCreateSchema>;
export type TranscriptionInput = z.infer<typeof TranscriptionInputSchema>;
export type AIResponse = z.infer<typeof AIResponseSchema>;

export const ConsultationPhaseSchema = z.enum([
	"start",
	"consultation",
	"diagnosis",
	"note",
	"summary",
]);

export type ConsultationPhase = z.infer<typeof ConsultationPhaseSchema>;
