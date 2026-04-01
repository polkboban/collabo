from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List
from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
import os

load_dotenv()

app = FastAPI(title="Autonomous Content Factory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

class CampaignKit(BaseModel):
    blog_post: str = Field(description="The polished 500-word blog post in markdown format.")
    twitter_thread: str = Field(description="The polished 5-post Twitter (X) thread.")
    email_teaser: str = Field(description="The polished 1-paragraph email teaser.")

class CampaignResponse(BaseModel):
    status: str
    blog_post: str
    twitter_thread: str
    email_teaser: str
    campaign_markdown: str

class CampaignRequest(BaseModel):
    source_material: str
    tone: str

class FactSheet(BaseModel):
    core_features: List[str] = Field(description="Main product features extracted from the text")
    technical_specs: List[str] = Field(description="Any technical specifications or metrics")
    target_audience: str = Field(description="The intended audience for this product or feature")
    value_proposition: str = Field(description="The single most important benefit or 'hero' value proposition")
    ambiguous_statements: List[str] = Field(description="Flagged statements from the source that are confusing or lack detail")

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

@app.post("/api/generate-campaign", response_model=CampaignResponse)
async def generate_campaign(request: CampaignRequest):
    try:
        llm = get_llm()
        researcher, copywriter, editor = create_agents(llm)

        t1_research = Task(
            description=f'Analyze this text: "{request.source_material}". Extract features, specs, audience, and the main value proposition. Flag any vague statements.',
            expected_output='A structured JSON Fact-Sheet.',
            agent=researcher, 
            output_json=FactSheet
        )
        
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
        
        t3_edit = Task(
            description=("Compare the Copywriter's drafts against the original Fact-Sheet.\n"
                         "Hallucination Check: If the Copywriter invented ANY features or specs not in the Fact-Sheet, reject it and rewrite it accurately.\n"
                         f"Tone Audit: Ensure the language matches the '{request.tone}' tone.\n"
                         "Output the final assets perfectly separated into the required JSON structure."),
            expected_output='A JSON object containing the blog_post, twitter_thread, and email_teaser perfectly separated.',
            agent=editor,
            context=[t1_research, t2_copy],
            output_json=CampaignKit 
        )

        crew = Crew(
            agents=[researcher, copywriter, editor],
            tasks=[t1_research, t2_copy, t3_edit],
            process=Process.sequential
        )

        result = crew.kickoff()
        
        output_data = result.json_dict
        if not output_data: 
            import json
            raw_text = result.raw.replace("```json", "").replace("```", "").strip()
            output_data = json.loads(raw_text)

        blog = output_data.get("blog_post", "")
        twitter = output_data.get("twitter_thread", "")
        email = output_data.get("email_teaser", "")

        full_md = f"# Campaign Kit\n\n## Blog Post\n{blog}\n\n---\n## Twitter Thread\n{twitter}\n\n---\n## Email Teaser\n{email}"

        return CampaignResponse(
            status="success",
            blog_post=blog,
            twitter_thread=twitter,
            email_teaser=email,
            campaign_markdown=full_md
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Autonomous Content Factory API is running."}