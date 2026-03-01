from pydantic import BaseModel, Field
from datetime import datetime
from typing import Any, Literal
from enum import Enum


class Severity(str, Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"


class ChecklistStatus(str, Enum):
    ANSWERED = "answered"
    PARTIAL = "partial"
    NOT_ASKED = "not_asked"


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class Symptom(BaseModel):
    id: str | None = None
    name: str
    duration: str | None = None
    severity: Severity | None = None
    notes: str | None = None
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class ClinicalFact(BaseModel):
    key: str
    value: str
    source: Literal["conversation", "exam", "history"] = "conversation"
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class ChecklistItem(BaseModel):
    id: str
    question: str
    category: str = "General"
    status: ChecklistStatus = ChecklistStatus.NOT_ASKED
    answer: str | None = None


class DifferentialDiagnosis(BaseModel):
    id: str
    diagnosis: str
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)
    supporting_evidence: list[str] = Field(default_factory=list)
    missing_evidence: list[str] = Field(default_factory=list)


class PatientInfo(BaseModel):
    id: str
    name: str
    age: int | None = None
    gender: Gender | None = None
    history: list[str] = Field(default_factory=list)


class ConsultationState(BaseModel):
    session_id: str
    patient: PatientInfo | None = None
    symptoms: list[Symptom] = Field(default_factory=list)
    clinical_facts: list[ClinicalFact] = Field(default_factory=list)
    checklist: list[ChecklistItem] = Field(default_factory=list)
    differentials: list[DifferentialDiagnosis] = Field(default_factory=list)
    transcript_segments: list[str] = Field(default_factory=list)
    suggested_questions: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)


class TranscriptionInput(BaseModel):
    session_id: str
    text: str


class AIResponse(BaseModel):
    extracted_symptoms: list[Symptom] = Field(default_factory=list)
    clinical_facts: list[ClinicalFact] = Field(default_factory=list)
    suggested_questions: list[str] = Field(default_factory=list)
    differentials: list[DifferentialDiagnosis] = Field(default_factory=list)
    checklist_updates: list[ChecklistItem] = Field(default_factory=list)


class SessionCreate(BaseModel):
    patient_id: str
    patient_name: str
    age: int | None = None
    gender: Gender | None = None


class SessionResponse(BaseModel):
    session_id: str
    status: str


class PatientCreate(BaseModel):
    name: str
    age: int | None = None
    gender: Gender | None = None
    history: list[str] = Field(default_factory=list)


class SOAPNote(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str


class ConsultationPhase(str, Enum):
    START = "start"
    CONSULTATION = "consultation"
    DIAGNOSIS = "diagnosis"
    NOTE = "note"
    SUMMARY = "summary"
