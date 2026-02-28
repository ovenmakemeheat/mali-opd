import { z } from "zod";

export const EvidenceSchema = z.object({
	id: z.string(),
	text: z.string(),
	timestamp: z.string().optional(),
	source: z.enum(["transcript", "manual"]),
});

export const SymptomSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	duration: z.string().nullable(),
	severity: z.enum(["mild", "moderate", "severe"]).nullable(),
	notes: z.string().nullable(),
	confidence: z.number().min(0).max(1),
	evidenceId: z.string().optional(),
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
	evidenceId: z.string().optional(),
});

export const SupportingEvidenceSchema = z.object({
	text: z.string(),
	evidenceId: z.string().optional(),
});

export const MissingEvidenceSchema = z.object({
	text: z.string(),
	priority: z.enum(["high", "medium", "low"]),
	mappedQuestion: z.string().optional(),
});

export const DifferentialDiagnosisSchema = z.object({
	id: z.string(),
	diagnosis: z.string(),
	confidence: z.number().min(0).max(1),
	supportingEvidence: z.array(SupportingEvidenceSchema),
	missingEvidence: z.array(MissingEvidenceSchema),
});

export const PatientInfoSchema = z.object({
	id: z.string(),
	name: z.string(),
	age: z.number().nullable(),
	gender: z.enum(["male", "female", "other"]).nullable(),
	history: z.array(z.string()),
});

export const TranscriptSegmentSchema = z.object({
	id: z.string().optional(),
	text: z.string(),
	evidenceId: z.string().optional(),
	timestamp: z.string().optional(),
});

export const ConsultationStateSchema = z.object({
	sessionId: z.string(),
	patient: PatientInfoSchema.nullable(),
	evidences: z.array(EvidenceSchema),
	symptoms: z.array(SymptomSchema),
	clinicalFacts: z.array(ClinicalFactSchema),
	checklist: z.array(ChecklistItemSchema),
	differentials: z.array(DifferentialDiagnosisSchema),
	transcriptSegments: z.array(TranscriptSegmentSchema),
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
	evidences: z.array(EvidenceSchema).optional(),
	extractedSymptoms: z.array(SymptomSchema),
	clinicalFacts: z.array(ClinicalFactSchema),
	suggestedQuestions: z.array(z.string()),
	differentials: z.array(DifferentialDiagnosisSchema),
	checklistUpdates: z.array(ChecklistItemSchema),
});

export type Evidence = z.infer<typeof EvidenceSchema>;
export type Symptom = z.infer<typeof SymptomSchema>;
export type ClinicalFact = z.infer<typeof ClinicalFactSchema>;
export type ChecklistStatus = z.infer<typeof ChecklistStatusSchema>;
export type ChecklistItem = z.infer<typeof ChecklistItemSchema>;
export type SupportingEvidence = z.infer<typeof SupportingEvidenceSchema>;
export type MissingEvidence = z.infer<typeof MissingEvidenceSchema>;
export type DifferentialDiagnosis = z.infer<typeof DifferentialDiagnosisSchema>;
export type PatientInfo = z.infer<typeof PatientInfoSchema>;
export type ConsultationState = z.infer<typeof ConsultationStateSchema>;
export type SessionCreate = z.infer<typeof SessionCreateSchema>;
export type TranscriptSegment = z.infer<typeof TranscriptSegmentSchema>;
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
