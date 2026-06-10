# HireKu — Claude Code Context

## What this project is

HireKu is an AI-powered CV screening tool for Indonesian SMBs. Two core flows:
1. **Criteria builder** — user describes a role in plain text, AI structures it into a criteria JSON (must-haves, nice-to-haves, deal-breakers)
2. **CV screener** — user uploads a batch of CVs (PDF), AI agent scores each one against the criteria, outputs a ranked shortlist with reasoning and verdict (Hire / Maybe / Pass)

Proof-of-concept only. No auth, no database, no multi-user.

---

## Tech stack

| Layer | Tech |
|---|---|
| Backend framework | FastAPI (Python 3.11+) |
| AI agent | LangGraph >= 0.2 + langchain-openai |
| LLM | DeepSeek V3 via OpenRouter (`deepseek/deepseek-chat-v3-0324:free`) |
| LLM client | `ChatOpenAI` pointed at OpenRouter base URL |
| PDF parsing | pypdf |
| Job state | In-memory dict (no DB for POC) |
| Frontend | Next.js 14 App Router, TypeScript |
| Styling | Tailwind CSS |
| HTTP client | fetch (native) |

**Important:** Never use the Anthropic SDK. Use `langchain-openai.ChatOpenAI` with OpenRouter. Model string is always `deepseek/deepseek-chat-v3-0324:free`.

LLM init pattern used everywhere:
```python
from langchain_openai import ChatOpenAI
import os

llm = ChatOpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    model="deepseek/deepseek-chat-v3-0324:free",
)
```

---

## Environment variables

```bash
# backend/.env
OPENROUTER_API_KEY=your_key_here
```

Load with `python-dotenv` in `main.py`. Never hardcode the key.

---

## Repository structure

```
hireku/
├── CLAUDE.md
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env              ← you create this from .env.example
│   ├── .env.example
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── criteria_agent.py
│   │   └── screening_agent.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── criteria.py
│   │   └── screening.py
│   └── utils/
│       ├── __init__.py
│       ├── pdf_parser.py
│       └── job_store.py
└── frontend/
    ├── app/
    │   ├── page.tsx
    │   ├── criteria/
    │   │   └── page.tsx
    │   └── screening/
    │       ├── page.tsx
    │       └── [jobId]/
    │           └── page.tsx
    ├── components/
    │   ├── CriteriaForm.tsx
    │   ├── UploadZone.tsx
    │   ├── ProgressBar.tsx
    │   └── CandidateCard.tsx
    └── lib/
        └── api.ts
```

---

## Data schemas — use these exactly, do not invent new field names

### Backend (Pydantic)

```python
from pydantic import BaseModel

class Criterion(BaseModel):
    name: str
    description: str
    weight: int  # 1 = nice-to-have, 2 = important, 3 = must-have

class CriteriaOutput(BaseModel):
    role: str
    must_have: list[Criterion]
    nice_to_have: list[Criterion]
    deal_breakers: list[str]

class CriteriaRequest(BaseModel):
    job_description: str

class CandidateScore(BaseModel):
    criterion_name: str
    score: int  # 1-10
    reasoning: str

class CandidateResult(BaseModel):
    filename: str
    candidate_name: str
    overall_score: float
    verdict: str  # "Hire" | "Maybe" | "Pass"
    scores: list[CandidateScore]
    summary: str

class JobStatus(BaseModel):
    job_id: str
    total: int
    processed: int
    status: str  # "processing" | "done" | "error"
    results: list[CandidateResult]
```

### Frontend (TypeScript)

```typescript
export interface Criterion {
  name: string;
  description: string;
  weight: number;
}

export interface CriteriaOutput {
  role: string;
  must_have: Criterion[];
  nice_to_have: Criterion[];
  deal_breakers: string[];
}

export interface CandidateScore {
  criterion_name: string;
  score: number;
  reasoning: string;
}

export interface CandidateResult {
  filename: string;
  candidate_name: string;
  overall_score: number;
  verdict: 'Hire' | 'Maybe' | 'Pass';
  scores: CandidateScore[];
  summary: string;
}

export interface JobStatus {
  job_id: string;
  total: number;
  processed: number;
  status: 'processing' | 'done' | 'error';
  results: CandidateResult[];
}
```

---

## API endpoints

```
POST /criteria/generate
  Body: { job_description: string }
  Returns: CriteriaOutput

POST /screen/upload
  Body: multipart/form-data — files (PDF[]) + criteria (JSON string)
  Returns: { job_id: string }

GET /screen/status/{job_id}
  Returns: JobStatus

GET /screen/report/{job_id}
  Returns: JobStatus (same shape, status will be "done")
```

CORS is enabled for `http://localhost:3000` in `main.py`.

---

## Agent architecture

### Criteria agent (`agents/criteria_agent.py`)

Single-node LangGraph chain.

```
[generate_criteria]
  input:  job_description (str)
  output: CriteriaOutput (JSON)
```

Prompt must instruct the model to return only valid JSON matching CriteriaOutput schema. No preamble, no markdown fences.

### Screening agent (`agents/screening_agent.py`)

Four-node LangGraph pipeline.

```
[parse_cv] → [extract_profile] → [score_against_criteria] → [generate_summary]
```

- **parse_cv**: receives raw PDF text string, returns basic structured dict
- **extract_profile**: returns `{ name, skills[], experience[], education[] }`
- **score_against_criteria**: returns `{ criterion_name, score (1-10), reasoning }[]`
- **generate_summary**: returns `{ overall_score, verdict, summary }`

Each node receives the full state dict and adds its output to it.

---

## Async job pattern

1. `POST /screen/upload` spawns a background task using FastAPI's `BackgroundTasks`
2. Returns `{ job_id }` immediately — do not await the agent
3. Background task processes CVs one by one, updating the in-memory `jobs` dict after each
4. Frontend polls `GET /screen/status/{job_id}` every 2000ms
5. When `status === "done"`, frontend stops polling and renders results

```python
# utils/job_store.py pattern
jobs: dict[str, dict] = {}

def create_job(job_id: str, total: int):
    jobs[job_id] = {
        "job_id": job_id,
        "total": total,
        "processed": 0,
        "status": "processing",
        "results": []
    }

def update_job(job_id: str, result: dict):
    jobs[job_id]["results"].append(result)
    jobs[job_id]["processed"] += 1
    if jobs[job_id]["processed"] >= jobs[job_id]["total"]:
        jobs[job_id]["status"] = "done"
```

---

## JSON from LLM — always strip and parse safely

The model sometimes wraps JSON in markdown fences despite instructions. Always clean before parsing:

```python
import json, re

def parse_json_response(text: str) -> dict:
    cleaned = re.sub(r"```(?:json)?|```", "", text).strip()
    return json.loads(cleaned)
```

---

## Build order — follow strictly, verify each step before moving on

| Step | File | Status |
|---|---|---|
| 0 | Scaffolding — directory tree, main.py, requirements.txt, Next.js bootstrap | ✅ Done |
| 1 | `utils/pdf_parser.py` | ⬜ Next |
| 2 | `agents/criteria_agent.py` | ⬜ |
| 3 | `routers/criteria.py` | ⬜ |
| 4 | `agents/screening_agent.py` | ⬜ |
| 5 | `utils/job_store.py` | ⬜ |
| 6 | `routers/screening.py` | ⬜ |
| 7 | `frontend/lib/api.ts` | ⬜ |
| 8 | `components/` (CriteriaForm, UploadZone, ProgressBar, CandidateCard) | ⬜ |
| 9 | `app/criteria/page.tsx` | ⬜ |
| 10 | `app/screening/page.tsx` | ⬜ |
| 11 | `app/screening/[jobId]/page.tsx` | ⬜ |
| 12 | `app/page.tsx` (landing/nav) | ⬜ |

---

## Known constraints

- No database — job state lives in memory, resets on server restart
- No auth — single-user POC only
- Scanned CVs not supported — pypdf cannot extract text from image-only PDFs; raise a clear error if text is empty after extraction
- LangGraph version: use `langgraph>=0.2` StateGraph API
- CORS: backend allows `http://localhost:3000` only
- Polling interval: 2000ms on frontend, no websockets

---

## How to run (once deps are installed)

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then add your OPENROUTER_API_KEY
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```
