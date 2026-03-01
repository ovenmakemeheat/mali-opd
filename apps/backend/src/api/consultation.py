from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from pydantic import BaseModel
from datetime import datetime
import json
import uuid

from src.models.schema import (
    PatientInfo,
    ConsultationState,
    TranscriptionInput,
    AIResponse,
    Symptom,
    ClinicalFact,
    ChecklistItem,
    DifferentialDiagnosis,
    SessionCreate,
    SessionResponse,
    PatientCreate,
    SOAPNote,
)
from src.agents.consultation_agent import consultation_graph

router = APIRouter()

sessions: dict[str, ConsultationState] = {}
patients: dict[str, PatientInfo] = {}


@router.post("/patients", response_model=PatientInfo)
async def create_patient(data: PatientCreate):
    patient_id = f"P{uuid.uuid4().hex[:8].upper()}"
    patient = PatientInfo(
        id=patient_id,
        name=data.name,
        age=data.age,
        gender=data.gender,
        history=data.history,
    )
    patients[patient_id] = patient
    return patient


@router.get("/patients", response_model=list[PatientInfo])
async def list_patients():
    return list(patients.values())


@router.get("/patients/{patient_id}", response_model=PatientInfo)
async def get_patient(patient_id: str):
    if patient_id not in patients:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patients[patient_id]


@router.post("/sessions", response_model=SessionResponse)
async def create_session(data: SessionCreate):
    session_id = str(uuid.uuid4())

    patient = PatientInfo(
        id=data.patient_id,
        name=data.patient_name,
        age=data.age,
        gender=data.gender,
        history=patients.get(
            data.patient_id, PatientInfo(id=data.patient_id, name=data.patient_name)
        ).history,
    )

    sessions[session_id] = ConsultationState(
        session_id=session_id,
        patient=patient,
    )

    return SessionResponse(session_id=session_id, status="created")


@router.get("/sessions/{session_id}", response_model=ConsultationState)
async def get_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions[session_id]


@router.post("/sessions/{session_id}/transcribe", response_model=AIResponse)
async def process_transcription(session_id: str, data: TranscriptionInput):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    session.transcript_segments.append(data.text)

    result = consultation_graph.invoke(
        {
            "messages": [],
            "transcript": data.text,
            "symptoms": [s.model_dump() for s in session.symptoms],
            "clinical_facts": [f.model_dump() for f in session.clinical_facts],
            "checklist": [c.model_dump() for c in session.checklist],
            "differentials": [d.model_dump() for d in session.differentials],
        }
    )

    session.symptoms = [Symptom(**s) for s in result.get("symptoms", [])]
    session.clinical_facts = [
        ClinicalFact(**f) for f in result.get("clinical_facts", [])
    ]
    session.checklist = [ChecklistItem(**c) for c in result.get("checklist", [])]
    session.differentials = [
        DifferentialDiagnosis(**d) for d in result.get("differentials", [])
    ]
    session.suggested_questions = result.get("suggested_questions", [])
    session.updated_at = datetime.now()

    return AIResponse(
        extracted_symptoms=session.symptoms,
        clinical_facts=session.clinical_facts,
        suggested_questions=session.suggested_questions,
        differentials=session.differentials,
        checklist_updates=session.checklist,
    )


@router.get("/sessions/{session_id}/note", response_model=SOAPNote)
async def generate_soap_note(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    primary_diagnosis = session.differentials[0] if session.differentials else None

    subjective = f"""
Patient: {session.patient.name if session.patient else "Unknown"}
Chief Complaint: {session.symptoms[0].name if session.symptoms else "N/A"}

History of Present Illness:
{chr(10).join(f"- {s.name}: {s.duration or ''} {s.notes or ''}" for s in session.symptoms)}
""".strip()

    objective = (
        chr(10).join(
            f"- {item.question}: {item.answer or 'Not answered'}"
            for item in session.checklist
            if item.status == "answered"
        )
        or "No objective findings recorded"
    )

    assessment = (
        chr(10).join(
            f"{i + 1}. {d.diagnosis} ({int(d.confidence * 100)}% confidence)"
            for i, d in enumerate(session.differentials)
        )
        or "Assessment pending"
    )

    plan = """
- Further evaluation recommended
- Follow-up as needed
""".strip()

    return SOAPNote(
        subjective=subjective,
        objective=objective,
        assessment=assessment,
        plan=plan,
    )


@router.post("/sessions/{session_id}/sign")
async def sign_session(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")

    session = sessions[session_id]
    session.updated_at = datetime.now()
    return {"status": "signed", "session_id": session_id}


@router.delete("/sessions/{session_id}")
async def end_session(session_id: str):
    if session_id in sessions:
        del sessions[session_id]
    return {"status": "ended"}


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()

    if session_id not in sessions:
        sessions[session_id] = ConsultationState(session_id=session_id)

    session = sessions[session_id]

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "transcription":
                text = message.get("text", "")
                session.transcript_segments.append(text)

                result = consultation_graph.invoke(
                    {
                        "messages": [],
                        "transcript": text,
                        "symptoms": [s.model_dump() for s in session.symptoms],
                        "clinical_facts": [
                            f.model_dump() for f in session.clinical_facts
                        ],
                        "checklist": [c.model_dump() for c in session.checklist],
                        "differentials": [
                            d.model_dump() for d in session.differentials
                        ],
                    }
                )

                session.symptoms = [Symptom(**s) for s in result.get("symptoms", [])]
                session.clinical_facts = [
                    ClinicalFact(**f) for f in result.get("clinical_facts", [])
                ]
                session.suggested_questions = result.get("suggested_questions", [])

                await websocket.send_json(
                    {
                        "type": "update",
                        "extracted_symptoms": [
                            s.model_dump() for s in session.symptoms
                        ],
                        "clinical_facts": [
                            f.model_dump() for f in session.clinical_facts
                        ],
                        "suggested_questions": session.suggested_questions,
                        "differentials": [
                            d.model_dump() for d in session.differentials
                        ],
                        "checklist_updates": [
                            c.model_dump() for c in session.checklist
                        ],
                    }
                )

    except WebSocketDisconnect:
        pass
