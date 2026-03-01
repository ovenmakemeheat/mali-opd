from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, BaseMessage
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
from operator import add
import json
import uuid

from src.core.config import settings
from src.models.schema import (
    Symptom,
    ClinicalFact,
    ChecklistItem,
    DifferentialDiagnosis,
    Severity,
    ChecklistStatus,
)


class ConsultationGraphState(TypedDict):
    messages: Annotated[list[BaseMessage], add]
    transcript: str
    symptoms: list[dict]
    clinical_facts: list[dict]
    checklist: list[dict]
    differentials: list[dict]
    suggested_questions: list[str]
    next_action: str


def get_llm():
    if settings.mockup_mode:
        return None
    return ChatOpenAI(
        model=settings.model_name,
        openai_api_key=settings.api_key,
        openai_api_base=settings.base_url,
    )


SYSTEM_PROMPT = """You are MALI, an intelligent OPD (Outpatient Department) assistant.

Your role is to analyze doctor-patient conversations in real-time and:
1. Extract symptoms with duration, severity, and relevant details
2. Identify clinical facts (positives and negatives)
3. Track what questions have been asked vs. what's missing
4. Generate and update differential diagnoses
5. Suggest the next most valuable question

Always respond in JSON format with these fields:
- symptoms: list of {id, name, duration, severity (mild/moderate/severe), notes, confidence (0-1)}
- clinical_facts: list of {key, value, source (conversation/exam/history), confidence}
- checklist_updates: list of {id, question, category, status (answered/partial/not_asked), answer}
- differentials: list of {id, diagnosis, confidence, supporting_evidence: [], missing_evidence: []}
- suggested_questions: list of questions to ask next
- next_action: one of "gather_more", "exam_suggested", "diagnosis_ready"

Be concise and clinically accurate. Focus on what matters for diagnosis."""


MOCK_SYMPTOMS = [
    {
        "id": str(uuid.uuid4()),
        "name": "Chest pain",
        "duration": "3 days",
        "severity": "moderate",
        "notes": "Worse on exertion",
        "confidence": 0.95,
    },
    {
        "id": str(uuid.uuid4()),
        "name": "Shortness of breath",
        "duration": "1 week",
        "severity": "mild",
        "notes": "On climbing stairs",
        "confidence": 0.88,
    },
]

MOCK_CHECKLIST = [
    {
        "id": str(uuid.uuid4()),
        "question": "Location of chest pain?",
        "category": "HPI",
        "status": "answered",
        "answer": "Left side, radiating to left arm",
    },
    {
        "id": str(uuid.uuid4()),
        "question": "Duration of symptoms?",
        "category": "HPI",
        "status": "answered",
        "answer": "3 days",
    },
    {
        "id": str(uuid.uuid4()),
        "question": "Associated nausea?",
        "category": "Associated",
        "status": "partial",
        "answer": None,
    },
]

MOCK_DIFFERENTIALS = [
    {
        "id": str(uuid.uuid4()),
        "diagnosis": "Unstable Angina",
        "confidence": 0.72,
        "supporting_evidence": ["Chest pain on exertion", "Radiating to left arm"],
        "missing_evidence": ["ECG results", "Troponin levels"],
    },
    {
        "id": str(uuid.uuid4()),
        "diagnosis": "Myocardial Infarction",
        "confidence": 0.45,
        "supporting_evidence": ["Chest pain", "Age >45"],
        "missing_evidence": ["ECG changes", "Troponin elevation"],
    },
]

MOCK_SUGGESTIONS = [
    "Ask about radiation of pain to jaw or back",
    "Ask about associated symptoms: nausea, sweating",
    "Consider asking about family history of heart disease",
]


def extract_clinical_info(state: ConsultationGraphState) -> dict:
    if settings.mockup_mode:
        return {
            "symptoms": state.get("symptoms", []) + MOCK_SYMPTOMS,
            "clinical_facts": state.get("clinical_facts", []),
            "checklist": MOCK_CHECKLIST,
            "differentials": MOCK_DIFFERENTIALS,
            "suggested_questions": MOCK_SUGGESTIONS,
            "next_action": "gather_more",
            "messages": [],
        }

    llm = get_llm()

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        *state["messages"],
        HumanMessage(content=f"Analyze this transcript segment: {state['transcript']}"),
    ]

    response = llm.invoke(messages)

    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0]
        parsed = json.loads(content)
    except Exception:
        parsed = {
            "symptoms": [],
            "clinical_facts": [],
            "checklist_updates": [],
            "differentials": [],
            "suggested_questions": [],
            "next_action": "gather_more",
        }

    for symptom in parsed.get("symptoms", []):
        if "id" not in symptom:
            symptom["id"] = str(uuid.uuid4())

    for diff in parsed.get("differentials", []):
        if "id" not in diff:
            diff["id"] = str(uuid.uuid4())

    for item in parsed.get("checklist_updates", []):
        if "id" not in item:
            item["id"] = str(uuid.uuid4())

    return {
        "symptoms": state.get("symptoms", []) + parsed.get("symptoms", []),
        "clinical_facts": state.get("clinical_facts", [])
        + parsed.get("clinical_facts", []),
        "checklist": parsed.get("checklist_updates", state.get("checklist", [])),
        "differentials": parsed.get("differentials", state.get("differentials", [])),
        "suggested_questions": parsed.get("suggested_questions", []),
        "next_action": parsed.get("next_action", "gather_more"),
        "messages": [response],
    }


def route_next_action(state: ConsultationGraphState) -> str:
    return state.get("next_action", "gather_more")


def build_consultation_graph():
    graph = StateGraph(ConsultationGraphState)

    graph.add_node("extract", extract_clinical_info)
    graph.set_entry_point("extract")
    graph.add_edge("extract", END)

    return graph.compile()


consultation_graph = build_consultation_graph()
