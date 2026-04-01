from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

# Load environment variables
load_dotenv()

app = FastAPI(title="Autonomous Content Factory API")

# --- CORS SETUP ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allows your Next.js frontend
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods (POST, GET, etc.)
    allow_headers=["*"], # Allows all headers
)

# --- API MODELS ---
class CampaignRequest(BaseModel):
    source_material: str
    tone: str

class FactSheet(BaseModel):
    core_features: List[str] = Field(description="Main product features extracted from the text")
    technical_specs: List[str] = Field(description="Any technical specifications or metrics")
    target_audience: str = Field(description="The intended audience for this product or feature")
    value_proposition: str = Field(description="The single most important benefit or 'hero' value proposition")
    ambiguous_statements: List[str] = Field(description="Flagged statements from the source that are confusing or lack detail")

class CampaignResponse(BaseModel):
    status: str
    campaign_markdown: str

# --- AI SETUP ---
def get_llm():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    return LLM(model="gemini/gemini-2.5-flash", api_key=api_key)

def create_agents(llm):
    researcher = Agent(
        role='Lead Research and Fact-Checker',
        goal='Extract the absolute truth and core value propositions from raw source material.',
        backstory='You are a highly analytical, meticulous researcher. You never invent information. If something is unclear, you flag it.',
        verbose=True, allow_delegation=False, llm=llm
    )
    copywriter = Agent(
        role='Senior Creative Copywriter',
        goal='Transform structured fact-sheets into engaging marketing copy.',
        backstory='You are a master storyteller. You strictly use the facts provided by the Research team.',
        verbose=True, allow_delegation=False, llm=llm
    )
    editor = Agent(
        role='Editor-in-Chief',
        goal='Audit content for accuracy, tone, and hallucinations before final publication.',
        backstory='You are a ruthless editor. You cross-reference claims against the fact-sheet and ensure the requested tone is met.',
        verbose=True, allow_delegation=False, llm=llm
    )
    return researcher, copywriter, editor

# --- API ENDPOINTS ---
@app.post("/api/generate-campaign", response_model=CampaignResponse)
async def generate_campaign(request: CampaignRequest):
    try:
        llm = get_llm()
        researcher, copywriter, editor = create_agents(llm)

        # 1. Research Task
        t1_research = Task(
            description=f'Analyze this text: "{request.source_material}". Extract features, specs, audience, and the main value proposition. Flag any vague statements.',
            expected_output='A structured JSON Fact-Sheet.',
            agent=researcher, 
            output_json=FactSheet
        )
        
        # 2. Copywriting Task
        t2_copy = Task(
            description=(f"Using ONLY the Fact-Sheet provided, generate: \n"
                         f"1) A 500-word Blog Post.\n"
                         f"2) A 5-post Twitter (X) Thread.\n"
                         f"3) A 1-paragraph Email Teaser.\n"
                         f"Tone Requirement: You must write in a '{request.tone}' style. "
                         f"Ensure the 'value_proposition' is the hero of every piece."),
            expected_output='Markdown document with the Blog, Twitter Thread, and Email.',
            agent=copywriter,
            context=[t1_research]
        )
        
        # 3. Editing Task
        t3_edit = Task(
            description=("Compare the Copywriter's drafts against the original Fact-Sheet.\n"
                         "Hallucination Check: If the Copywriter invented ANY features or specs not in the Fact-Sheet, reject it and rewrite it accurately.\n"
                         f"Tone Audit: Ensure the language matches the '{request.tone}' tone.\n"
                         "Output the final, polished Campaign Kit containing the Blog, Thread, and Email."),
            expected_output='A polished, hallucination-free markdown document with the 3 assets.',
            agent=editor,
            context=[t1_research, t2_copy]
        )

        crew = Crew(
            agents=[researcher, copywriter, editor],
            tasks=[t1_research, t2_copy, t3_edit],
            process=Process.sequential
        )

        # Execute the process
        result = crew.kickoff()

        return CampaignResponse(
            status="success",
            campaign_markdown=result.raw
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Autonomous Content Factory API is running."}