import json
import os
import re
from typing import TypedDict

from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END

from pydantic import BaseModel


class Criterion(BaseModel):
    name: str
    description: str
    weight: int


class CriteriaOutput(BaseModel):
    role: str
    must_have: list[Criterion]
    nice_to_have: list[Criterion]
    deal_breakers: list[str]


class CriteriaState(TypedDict):
    job_description: str
    result: dict


llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    model="deepseek/deepseek-chat-v3-0324",
)

PROMPT = """You are a hiring criteria expert. Given a job description, extract structured hiring criteria.

Return ONLY valid JSON with this exact structure, no markdown fences, no preamble:
{{
  "role": "<job title>",
  "must_have": [
    {{"name": "<criterion>", "description": "<detail>", "weight": 3}}
  ],
  "nice_to_have": [
    {{"name": "<criterion>", "description": "<detail>", "weight": 1}}
  ],
  "deal_breakers": ["<disqualifying condition>"]
}}

Rules:
- weight 3 = must-have, weight 2 = important, weight 1 = nice-to-have
- must_have: 3-6 items, nice_to_have: 2-4 items, deal_breakers: 1-3 items
- Be specific and actionable

Job description:
{job_description}"""


def generate_criteria(state: CriteriaState) -> CriteriaState:
    response = llm.invoke(PROMPT.format(job_description=state["job_description"]))
    cleaned = re.sub(r"```(?:json)?|```", "", response.content).strip()
    state["result"] = json.loads(cleaned)
    return state


def build_criteria_graph() -> StateGraph:
    graph = StateGraph(CriteriaState)
    graph.add_node("generate_criteria", generate_criteria)
    graph.set_entry_point("generate_criteria")
    graph.add_edge("generate_criteria", END)
    return graph.compile()


criteria_graph = build_criteria_graph()


def run_criteria_agent(job_description: str) -> CriteriaOutput:
    result = criteria_graph.invoke({"job_description": job_description, "result": {}})
    return CriteriaOutput(**result["result"])
