import json
import os
import re
from typing import TypedDict

from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from pydantic import BaseModel

from agents.criteria_agent import CriteriaOutput


class CandidateScore(BaseModel):
    criterion_name: str
    score: int
    reasoning: str


class CandidateResult(BaseModel):
    filename: str
    candidate_name: str
    overall_score: float
    verdict: str
    scores: list[CandidateScore]
    summary: str


class ScreeningState(TypedDict):
    cv_text: str
    filename: str
    criteria: dict
    raw_profile: dict
    profile: dict
    scores: list[dict]
    overall_score: float
    verdict: str
    summary: str


llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    model="deepseek/deepseek-chat-v3-0324",
)


def _clean(text: str) -> dict:
    cleaned = re.sub(r"```(?:json)?|```", "", text).strip()
    return json.loads(cleaned)


def parse_cv(state: ScreeningState) -> ScreeningState:
    prompt = f"""Parse this CV text and return a basic JSON summary. Return ONLY valid JSON, no markdown:
{{
  "raw_text_length": <int>,
  "sections_found": ["<section name>"]
}}

CV:
{state["cv_text"][:3000]}"""
    response = llm.invoke(prompt)
    state["raw_profile"] = _clean(response.content)
    return state


def extract_profile(state: ScreeningState) -> ScreeningState:
    prompt = f"""Extract structured profile from this CV. Return ONLY valid JSON, no markdown:
{{
  "name": "<full name or Unknown>",
  "skills": ["<skill>"],
  "experience": ["<job title at company, duration>"],
  "education": ["<degree, institution>"]
}}

CV:
{state["cv_text"][:4000]}"""
    response = llm.invoke(prompt)
    state["profile"] = _clean(response.content)
    return state


def score_against_criteria(state: ScreeningState) -> ScreeningState:
    criteria = state["criteria"]
    all_criteria = criteria.get("must_have", []) + criteria.get("nice_to_have", [])
    criteria_list = "\n".join(
        f"- {c['name']} (weight {c['weight']}): {c['description']}"
        for c in all_criteria
    )
    deal_breakers = "\n".join(f"- {d}" for d in criteria.get("deal_breakers", []))

    prompt = f"""Score this candidate against each hiring criterion. Return ONLY a JSON array, no markdown:
[
  {{"criterion_name": "<name>", "score": <1-10>, "reasoning": "<one sentence>"}}
]

Criteria:
{criteria_list}

Deal-breakers (score 0 if present):
{deal_breakers}

Candidate profile:
Name: {state["profile"].get("name", "Unknown")}
Skills: {", ".join(state["profile"].get("skills", []))}
Experience: {", ".join(state["profile"].get("experience", []))}
Education: {", ".join(state["profile"].get("education", []))}"""

    response = llm.invoke(prompt)
    state["scores"] = _clean(response.content)
    return state


def generate_summary(state: ScreeningState) -> ScreeningState:
    scores = state["scores"]
    must_have_names = {c["name"] for c in state["criteria"].get("must_have", [])}

    if scores:
        must_have_scores = [s["score"] for s in scores if s["criterion_name"] in must_have_names]
        all_scores = [s["score"] for s in scores]
        if must_have_scores:
            overall = (sum(must_have_scores) * 0.7 / len(must_have_scores) +
                       sum(all_scores) * 0.3 / len(all_scores)) * 10
        else:
            overall = sum(all_scores) / len(all_scores) * 10
        overall = round(min(overall, 100), 1)
    else:
        overall = 0.0

    if overall >= 70:
        verdict = "Hire"
    elif overall >= 45:
        verdict = "Maybe"
    else:
        verdict = "Pass"

    scores_text = "\n".join(
        f"- {s['criterion_name']}: {s['score']}/10 — {s['reasoning']}"
        for s in scores
    )
    prompt = f"""Write a 2-3 sentence hiring summary for this candidate. Be direct and factual.

Role: {state["criteria"].get("role", "the position")}
Overall score: {overall}/100
Verdict: {verdict}
Scores:
{scores_text}

Return ONLY the summary text, no JSON, no markdown."""

    response = llm.invoke(prompt)
    state["overall_score"] = overall
    state["verdict"] = verdict
    state["summary"] = response.content.strip()
    return state


def build_screening_graph() -> StateGraph:
    graph = StateGraph(ScreeningState)
    graph.add_node("parse_cv", parse_cv)
    graph.add_node("extract_profile", extract_profile)
    graph.add_node("score_against_criteria", score_against_criteria)
    graph.add_node("generate_summary", generate_summary)
    graph.set_entry_point("parse_cv")
    graph.add_edge("parse_cv", "extract_profile")
    graph.add_edge("extract_profile", "score_against_criteria")
    graph.add_edge("score_against_criteria", "generate_summary")
    graph.add_edge("generate_summary", END)
    return graph.compile()


screening_graph = build_screening_graph()


def run_screening_agent(cv_text: str, filename: str, criteria: CriteriaOutput) -> CandidateResult:
    initial_state: ScreeningState = {
        "cv_text": cv_text,
        "filename": filename,
        "criteria": criteria.model_dump(),
        "raw_profile": {},
        "profile": {},
        "scores": [],
        "overall_score": 0.0,
        "verdict": "Pass",
        "summary": "",
    }
    result = screening_graph.invoke(initial_state)
    return CandidateResult(
        filename=filename,
        candidate_name=result["profile"].get("name", "Unknown"),
        overall_score=result["overall_score"],
        verdict=result["verdict"],
        scores=[CandidateScore(**s) for s in result["scores"]],
        summary=result["summary"],
    )
