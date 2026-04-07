import json
import asyncio
import threading
from queue import Queue
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from crewai import Agent, Task, Crew, Process, LLM
from dotenv import load_dotenv
from sse_starlette.sse import EventSourceResponse
from crewai_tools import ScrapeWebsiteTool 
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

class BrandVoice(BaseModel):
    company_name: str = ""
    target_audience: str = ""
    custom_rules: str = ""

class CampaignRequest(BaseModel):
    source_material: str
    tone: str
    brand_voice: BrandVoice | None = None

class FactSheet(BaseModel):
    core_features: List[str] = Field(description="Main product features extracted from the text")
    technical_specs: List[str] = Field(description="Any technical specifications or metrics")
    target_audience: str = Field(description="The intended audience for this product or feature")
    value_proposition: str = Field(description="The single most important benefit or 'hero' value proposition")
    ambiguous_statements: List[str] = Field(description="Flagged statements from the source that are confusing or lack detail")

class RegenerateRequest(BaseModel):
    source_material: str
    tone: str
    format_type: str
    brand_voice: BrandVoice | None = None

class SingleAssetKit(BaseModel):
    content: str = Field(description="The finalized generated content in markdown format.")

def get_llm():
    import os
    from dotenv import load_dotenv
    from crewai import LLM
    
    load_dotenv() 
    groq_key = os.getenv("GROQ_API_KEY")
    
    if not groq_key:
        raise ValueError("GROQ_API_KEY is missing. Check your .env file!")
        
    return LLM(
        model="groq/llama-3.1-8b-instant",
        api_key=groq_key
    )

def run_crew_in_background(request: CampaignRequest, message_queue: Queue):
    try:
        llm = get_llm()
        
        def create_callback(agent_name):
            def callback(step_output):
                message_queue.put({"type": "update", "agent": agent_name, "message": f"{agent_name} is processing data..."})
            return callback

        scrape_tool = ScrapeWebsiteTool()

        researcher = Agent(
            role="Lead Research and Fact-Checker",
            goal="Extract the absolute truth and core value propositions from raw source material or website URLs.",
            backstory="You are a meticulous researcher. If given a URL, you use your web scraping tool to read it. If given raw text, you analyze it directly.",
            allow_delegation=False,
            tools=[scrape_tool], 
            llm=my_llm
        )
        copywriter = Agent(
            role='Senior Creative Copywriter',
            goal='Transform structured fact-sheets into engaging marketing copy.',
            backstory='You are a master storyteller. You strictly use the facts provided by the Research team.',
            verbose=True, allow_delegation=False, llm=llm,
            step_callback=create_callback("Copywriter")
        )
        
        editor = Agent(
            role='Editor-in-Chief',
            goal='Audit content for accuracy, tone, and hallucinations before final publication.',
            backstory='You are a ruthless editor. You cross-reference claims against the fact-sheet and ensure the requested tone is met.',
            verbose=True, allow_delegation=False, llm=llm,
            step_callback=create_callback("Editor")
        )

        t1_research = Task(
            description=(
                f"Analyze this source material: '{request.source_material}'.\n"
                "If the source material is a URL, use your ScrapeWebsiteTool to read the contents of the page first.\n"
                "Extract features, specs, audience, and the main value proposition. Flag any vague statements."
            ),
            expected_output="A structured Fact-Sheet containing core_features, technical_specs, target_audience, and value_proposition.",
            agent=researcher
        )
        
        brand_context = ""
        if request.brand_voice and request.brand_voice.company_name:
            brand_context = (
                f"\n\nCRITICAL BRAND GUIDELINES:\n"
                f"- Company Name: {request.brand_voice.company_name}\n"
                f"- Target Audience: {request.brand_voice.target_audience}\n"
                f"- Mandatory Rules: {request.brand_voice.custom_rules}\n"
                f"You MUST adhere to these rules strictly."
            )

        t2_copy = Task(
            description=(
                "Read the Fact-Sheet provided by the Researcher.\n"
                "CRITICAL INSTRUCTION: Before you write the copy, you must open a <thinking> block.\n"
                "Inside the <thinking> block, write out your strategy: What is the core emotion? Who is the audience? What hook will work best?\n"
                "After you close the </thinking> block, write the final Blog Post, Twitter Thread, and Email Teaser."
            ),
            expected_output='Markdown document with the requested content.',
            agent=copywriter,
            context=[t1_research]
        )
        
        t3_edit = Task(
            description=("Compare the Copywriter's drafts against the original Fact-Sheet.\n"
                         "Hallucination Check: If the Copywriter invented ANY features or specs not in the Fact-Sheet, reject it and rewrite it accurately.\n"
                         f"Tone Audit: Ensure the language matches the '{request.tone}' tone."),
            expected_output="The final, polished marketing assets.",
            agent=editor,
            context=[t1_research, t2_copy],
            output_json=CampaignKit 
        )
        my_llm = get_llm()

        crew = Crew(
            agents=[researcher, copywriter, editor],
            tasks=[t1_research, t2_copy, t3_edit],
            verbose=True,
            planning=False 
        )

        message_queue.put({"type": "update", "agent": "System", "message": "Starting the campaign generation pipeline..."})
        
        result = crew.kickoff()
        
        output_data = result.json_dict
        
        if not output_data:
            import json
            raw_text = result.raw.replace("```json", "").replace("```", "").strip()
            output_data = json.loads(raw_text, strict=False)

        print(f"\n SUCCESS! Sending these keys to the frontend: {output_data.keys()}\n")
        
        message_queue.put({"type": "complete", "data": output_data})

    except Exception as e:
        print(f"\n CRITICAL CRASH: {str(e)}\n")
        message_queue.put({"type": "error", "message": f"Pipeline Error: {str(e)}"})

@app.post("/api/stream-campaign")
async def stream_campaign(request: CampaignRequest):
    message_queue = Queue()

    thread = threading.Thread(target=run_crew_in_background, args=(request, message_queue))
    thread.start()

    async def event_generator():
        while True:
            if not message_queue.empty():
                msg = message_queue.get()
                
                if msg["type"] == "error":
                    yield json.dumps({"error": msg["message"]})
                    break
                    
                yield json.dumps(msg)
                
                if msg["type"] == "complete":
                    break
            else:
                await asyncio.sleep(0.5)

    return EventSourceResponse(event_generator())

def run_single_regeneration(request: RegenerateRequest, message_queue: Queue):
    try:
        llm = get_llm()
        
        def create_callback(agent_name):
            def callback(step_output):
                message_queue.put({"type": "update", "agent": agent_name, "message": f"{agent_name} is refining the {request.format_type}..."})
            return callback

        researcher = Agent(
            role='Lead Research and Fact-Checker',
            goal='Extract the absolute truth and core value propositions from raw source material.',
            backstory='You are a highly analytical, meticulous researcher. You never invent information. If something is unclear, you flag it.',
            verbose=True, allow_delegation=False, llm=llm, step_callback=create_callback("Researcher")
        )
        copywriter = Agent(
            role='Senior Creative Copywriter',
            goal='Transform structured fact-sheets into engaging marketing copy.',
            backstory='You are a master storyteller. You strictly use the facts provided by the Research team.',
            verbose=True, allow_delegation=False, llm=llm, step_callback=create_callback("Copywriter")
        )
        editor = Agent(
            role='Editor-in-Chief',
            goal='Audit content for accuracy, tone, and hallucinations before final publication.',
            backstory='You are a ruthless editor. You cross-reference claims against the fact-sheet and ensure the requested tone is met.',
            verbose=True, allow_delegation=False, llm=llm, step_callback=create_callback("Editor")
        )

        format_map = {
            "blog": "A 500-word Blog Post",
            "twitter": "A 5-post Twitter (X) Thread",
            "email": "A 1-paragraph Email Teaser"
        }
        target_format = format_map.get(request.format_type, "content")

        t1_research = Task(
            description=f'Analyze this text: "{request.source_material}". Extract features, specs, audience, and the main value proposition.',
            expected_output='A strict JSON object containing EXACTLY these keys: "core_features" (list), "technical_specs" (list), "target_audience" (string), "value_proposition" (string), "ambiguous_statements" (list). Do not output any other text.',
            agent=researcher
        )

        t2_copy = Task(
            description=(f"Using ONLY the Fact-Sheet provided, generate {target_format}. "
                         f"Tone Requirement: You must write in a '{request.tone}' style."),
            expected_output='Markdown document with the requested content.',
            agent=copywriter, context=[t1_research]
        )

        t3_edit = Task(
            description=("Compare the Copywriter's draft against the original Fact-Sheet for hallucinations. "
                         f"Tone Audit: Ensure the language matches the '{request.tone}' tone. Output the final asset perfectly."),
            expected_output='A strict JSON object containing EXACTLY this key: "content". The value should be the polished markdown string. Do not output any other text.',
            agent=editor,
            context=[t1_research, t2_copy]
        )

        crew = Crew(agents=[researcher, copywriter, editor], tasks=[t1_research, t2_copy, t3_edit], process=Process.sequential)
        
        message_queue.put({"type": "update", "agent": "System", "message": f"Starting focused regeneration for {request.format_type}..."})
        result = crew.kickoff()
        
        output_data = result.json_dict
        if not output_data:
            import json
            raw_text = result.raw.replace("```json", "").replace("```", "").strip()
            output_data = json.loads(raw_text, strict=False)

        if "content" in output_data and isinstance(output_data["content"], list):
            output_data["content"] = "\n\n".join(str(item) for item in output_data["content"])

        message_queue.put({"type": "complete", "data": {"format_type": request.format_type, "content": output_data.get("content", "")}})

    except Exception as e:
        message_queue.put({"type": "error", "message": str(e)})

@app.post("/api/stream-regenerate")
async def stream_regenerate(request: RegenerateRequest):
    message_queue = Queue()
    thread = threading.Thread(target=run_single_regeneration, args=(request, message_queue))
    thread.start()

    async def event_generator():
        while True:
            if not message_queue.empty():
                msg = message_queue.get()
                if msg["type"] == "error":
                    yield json.dumps({"error": msg["message"]})
                    break
                yield json.dumps(msg)
                if msg["type"] == "complete":
                    break
            else:
                await asyncio.sleep(0.5)

    return EventSourceResponse(event_generator())

@app.get("/")
def read_root():
    return {"message": "Autonomous Content Factory API is running."}