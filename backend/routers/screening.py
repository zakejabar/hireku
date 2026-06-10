import json

from fastapi import APIRouter, BackgroundTasks, File, Form, HTTPException, UploadFile

from agents.criteria_agent import CriteriaOutput
from agents.screening_agent import CandidateResult, run_screening_agent
from utils.job_store import create_job, get_job, update_job
from utils.pdf_parser import extract_text_from_pdf

router = APIRouter()


async def process_cvs(job_id: str, files_data: list[tuple[str, bytes]], criteria: CriteriaOutput):
    for filename, file_bytes in files_data:
        try:
            cv_text = extract_text_from_pdf(file_bytes)
            result = run_screening_agent(cv_text, filename, criteria)
            update_job(job_id, result.model_dump())
        except Exception as e:
            update_job(job_id, {
                "filename": filename,
                "candidate_name": "Unknown",
                "overall_score": 0.0,
                "verdict": "Pass",
                "scores": [],
                "summary": f"Error processing CV: {e}",
            })


@router.post("/upload")
async def upload_cvs(
    background_tasks: BackgroundTasks,
    files: list[UploadFile] = File(...),
    criteria: str = Form(...),
):
    criteria_obj = CriteriaOutput(**json.loads(criteria))
    files_data = [(f.filename or "unknown.pdf", await f.read()) for f in files]
    job_id = create_job(len(files_data))
    background_tasks.add_task(process_cvs, job_id, files_data, criteria_obj)
    return {"job_id": job_id}


@router.get("/status/{job_id}")
def get_status(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/report/{job_id}")
def get_report(job_id: str):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
