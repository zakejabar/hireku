import uuid

jobs: dict[str, dict] = {}


def create_job(total: int) -> str:
    job_id = str(uuid.uuid4())
    jobs[job_id] = {
        "job_id": job_id,
        "total": total,
        "processed": 0,
        "status": "processing",
        "results": [],
    }
    return job_id


def update_job(job_id: str, result: dict) -> None:
    jobs[job_id]["results"].append(result)
    jobs[job_id]["processed"] += 1
    if jobs[job_id]["processed"] >= jobs[job_id]["total"]:
        jobs[job_id]["status"] = "done"


def fail_job(job_id: str) -> None:
    jobs[job_id]["status"] = "error"


def get_job(job_id: str) -> dict | None:
    return jobs.get(job_id)
