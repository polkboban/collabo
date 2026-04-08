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
import os
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client

security = HTTPBearer()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_ANON_KEY")

if not supabase_url or not supabase_key:
    print("\n[WARNING] Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend .env!\n")

supabase_client: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

def verify_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not supabase_client:
        raise HTTPException(status_code=500, detail="Supabase not configured on backend")
        
    token = credentials.credentials
    try:
        user_response = supabase_client.auth.get_user(token)
        
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        return user_response.user
    except Exception as e:
        print(f"[DEBUG] Auth failed: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

app = FastAPI(title="Autonomous Content Factory API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://collabo-one.vercel.app",
    ], 
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

class AdvancedSettings(BaseModel):
    creativity: int = 70
    keywords: str = ""
    ctaUrl: str = ""

class CampaignRequest(BaseModel):
    source_material: str
    tone: str
    brand_voice: BrandVoice | None = None
    channels: List[str] = ["Blog Post", "Twitter Thread", "Email Teaser"]
    advanced_settings: AdvancedSettings | None = None 

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

def get_llm(custom_temperature: float = 0.7):
    import os
    from dotenv import load_dotenv
    from crewai import LLM
    
    load_dotenv() 
    groq_key = os.getenv("GROQ_API_KEY")
    
    if not groq_key:
        raise ValueError("GROQ_API_KEY is missing. Check your .env file!")
        
    os.environ["GROQ_API_KEY"] = groq_key
        
    return LLM(
        model="groq/llama-3.1-8b-instant",
        api_key=groq_key,
        temperature=custom_temperature 
    )

def run_crew_in_background(request: CampaignRequest, message_queue: Queue):
    try:
        temp = 0.7
        if request.advanced_settings:
            temp = request.advanced_settings.creativity / 100.0
            
        llm = get_llm(custom_temperature=temp) 

        from pydantic import create_model
        requested_channels_str = ", ".join(request.channels)
        dynamic_fields = {
            channel.lower().replace(" ", "_").replace("-", "_"): (str, ...) 
            for channel in request.channels
        }
        DynamicCampaignKit = create_model('DynamicCampaignKit', **dynamic_fields)

        def create_callback(agent_name):
            def callback(step_output):
                message_queue.put({"type": "update", "agent": agent_name, "message": f"{agent_name} is processing data..."})
            return callback

        is_url = request.source_material.strip().startswith("http") or "www." in request.source_material
        research_tools = [ScrapeWebsiteTool()] if is_url else []

        researcher = Agent(
            role="Lead Research and Fact-Checker",
            goal="Extract the absolute truth and core value propositions from raw source material.",
            backstory="You are a meticulous researcher.",
            allow_delegation=False,
            tools=research_tools, 
            llm=llm  
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

        if is_url:
            research_desc = f"Use your ScrapeWebsiteTool to read this exact URL: '{request.source_material}'. You MUST pass this URL as the 'website_url' parameter. After reading it, extract features, specs, audience, and the main value proposition."
        else:
            research_desc = f"Analyze this text: '{request.source_material}'. Extract features, specs, audience, and the main value proposition."

        t1_research = Task(
            description=research_desc,
            expected_output="A structured Fact-Sheet containing core_features, technical_specs, target_audience, and value_proposition.",
            agent=researcher
        )

        advanced_instructions = ""
        
        if request.brand_voice:
            advanced_instructions += "\n\n--- BRAND VOICE & IDENTITY ---"
            if request.brand_voice.company_name:
                advanced_instructions += f"\n- COMPANY NAME: {request.brand_voice.company_name}"
            if request.brand_voice.target_audience:
                advanced_instructions += f"\n- TARGET AUDIENCE: {request.brand_voice.target_audience}"
            if request.brand_voice.custom_rules:
                advanced_instructions += f"\n- STRICT BRAND RULES: {request.brand_voice.custom_rules}"
            advanced_instructions += "\n------------------------------\n"

        if request.advanced_settings:
            if request.advanced_settings.keywords:
                advanced_instructions += f"\n- MANDATORY KEYWORDS: You MUST naturally weave these exact keywords into the copy: {request.advanced_settings.keywords}"
            if request.advanced_settings.ctaUrl:
                advanced_instructions += f"\n- CALL TO ACTION: You MUST conclude the copy by urging the user to click this link: {request.advanced_settings.ctaUrl}"

        t2_copy = Task(
            description=(
                "Read the Fact-Sheet provided by the Researcher.\n"
                "CRITICAL INSTRUCTION: Before you write the copy, you must open a <thinking> block.\n"
                "Inside the <thinking> block, write out your strategy: What is the core emotion? Who is the audience? What hook will work best?\n"
                f"After you close the </thinking> block, write the final copy for these exact channels: {requested_channels_str}.\n"
                f"{advanced_instructions}\n\n" 
                "CRITICAL FORMATTING RULES FOR YOUR FINAL OUTPUT:\n"
                "1. Use generous spacing. ALWAYS put double line breaks (\\n\\n) between paragraphs.\n"
                "2. Use Markdown Headers (## and ###) to separate different sections.\n"
                "3. Use **bold text** heavily to emphasize key features, metrics, and important buzzwords.\n"
                "4. Use bullet points (-) whenever listing features or benefits to make it easy to read."
            ),
            expected_output=f'Highly formatted Markdown document with drafts for: {requested_channels_str}.',
            agent=copywriter,
            context=[t1_research]
        )
        
        t3_edit = Task(
            description=("Compare the Copywriter's drafts against the original Fact-Sheet.\n"
                         "Hallucination Check: If the Copywriter invented ANY features or specs not in the Fact-Sheet, reject it and rewrite it accurately.\n"
                         f"Tone Audit: Ensure the language matches the '{request.tone}' tone.\n"
                         f"Format Requirement: You MUST format the output to include exactly these formats: {requested_channels_str}."),
            expected_output="The final, polished marketing assets.",
            agent=editor,
            context=[t1_research, t2_copy],
            output_json=DynamicCampaignKit 
        )

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
async def stream_campaign(request: CampaignRequest, user: dict = Depends(verify_user)):
    
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

        is_url = request.source_material.strip().startswith("http") or "www." in request.source_material
        research_tools = [ScrapeWebsiteTool()] if is_url else []

        researcher = Agent(
            role='Lead Research and Fact-Checker',
            goal='Extract the absolute truth and core value propositions from raw source material.',
            backstory='You are a highly analytical, meticulous researcher. You never invent information. If something is unclear, you flag it.',
            verbose=True, allow_delegation=False, tools=research_tools, llm=llm, step_callback=create_callback("Researcher")
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

        pretty_format = request.format_type.replace("_", " ").title()

        if is_url:
            research_desc = f"Use your ScrapeWebsiteTool to read this exact URL: '{request.source_material}'. You MUST pass this URL as the 'website_url' parameter. After reading it, extract features, specs, audience, and the main value proposition."
        else:
            research_desc = f"Analyze this text: '{request.source_material}'. Extract features, specs, audience, and the main value proposition."

        t1_research = Task(
            description=research_desc,
            expected_output='A strict Fact-Sheet with core features and value propositions.',
            agent=researcher
        )

        brand_instructions = ""
        if request.brand_voice:
            brand_instructions = "\n\n--- BRAND VOICE & IDENTITY ---"
            if request.brand_voice.company_name:
                brand_instructions += f"\n- COMPANY NAME: {request.brand_voice.company_name}"
            if request.brand_voice.target_audience:
                brand_instructions += f"\n- TARGET AUDIENCE: {request.brand_voice.target_audience}"
            if request.brand_voice.custom_rules:
                brand_instructions += f"\n- STRICT BRAND RULES: {request.brand_voice.custom_rules}"

        t2_copy = Task(
            description=(f"Using ONLY the Fact-Sheet provided, generate a {pretty_format}. "
                         f"Tone Requirement: You must write in a '{request.tone}' style.\n"
                         f"{brand_instructions}\n\n" 
                         "CRITICAL FORMATTING RULES:\n"
                         "1. ALWAYS put double line breaks (\\n\\n) between paragraphs.\n"
                         "2. Use Markdown Headers (## and ###).\n"
                         "3. Use **bold text** heavily.\n"
                         "4. Use bullet points (-) for features."),
            expected_output='Highly formatted Markdown document.',
            agent=copywriter, context=[t1_research]
        )

        t3_edit = Task(
            description=("Compare the Copywriter's draft against the original Fact-Sheet for hallucinations. "
                         f"Ensure the language matches the '{request.tone}' tone.\n"
                         "CRITICAL: You must return the final polished markdown string inside a valid JSON object."),
            expected_output='A strict JSON object containing EXACTLY this key: "content". The value is the markdown string.',
            agent=editor,
            context=[t1_research, t2_copy],
            output_json=SingleAssetKit 
        )

        crew = Crew(
            agents=[researcher, copywriter, editor], 
            tasks=[t1_research, t2_copy, t3_edit], 
            process=Process.sequential,
            verbose=True,
            planning=False, 
            function_calling_llm=llm 
        )
        
        message_queue.put({"type": "update", "agent": "System", "message": f"Starting focused regeneration for {pretty_format}..."})
        result = crew.kickoff()
        
        output_data = result.json_dict
        if not output_data:
            import json
            raw_text = result.raw.replace("```json", "").replace("```", "").strip()
            output_data = json.loads(raw_text, strict=False)

        message_queue.put({"type": "complete", "data": {"format_type": request.format_type, "content": output_data.get("content", "")}})

    except Exception as e:
        message_queue.put({"type": "error", "message": f"Pipeline Error: {str(e)}"})

@app.post("/api/stream-regenerate")
async def stream_regenerate(request: RegenerateRequest, user: dict = Depends(verify_user)):
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