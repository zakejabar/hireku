from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from agents.criteria_agent import CriteriaOutput, run_criteria_agent

router = APIRouter()


class CriteriaRequest(BaseModel):
    job_description: str


@router.post("/generate", response_model=CriteriaOutput)
async def generate_criteria(body: CriteriaRequest):
    if not body.job_description.strip():
        raise HTTPException(status_code=400, detail="job_description cannot be empty")
    try:
        return run_criteria_agent(body.job_description)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
