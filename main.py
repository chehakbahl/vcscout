import os
import sys
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from dotenv import load_dotenv


# Ensure local imports work cleanly
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
load_dotenv()

from graph import analysis_graph

app = FastAPI(title="VC Scout AI Agents Pipeline")

# Pydantic schema representing incoming requests
class AnalysisRequest(BaseModel):
    startup_name: str = Field(..., example="Stripe")
    website_url: str = Field(..., example="https://stripe.com")
    founder_linkedin: Optional[str] = Field(None, example="https://linkedin.com/in/collison")

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "VC Scout AI Agents"}

@app.post("/analyze")
async def trigger_analysis(payload: AnalysisRequest):
    """
    Kicks off the multi-agent LangGraph workflow for a target startup.
    """
    try:
        # Initialize the state schema using inputs from our API call
        initial_state = {
            "startup_id": "api_generated_id",
            "name": payload.startup_name,
            "website_url": payload.website_url,
            "founder_linkedin": payload.founder_linkedin,
            "scraped_text": "",
            "founder_analysis": None,
            "security_analysis": None,
            "compliance_analysis": None,
            "final_report": None,
            "execution_logs": []
        }
        
        # Execute the compiled multi-agent LangGraph pipeline synchronously!
        final_state = analysis_graph.invoke(initial_state)
        
        # Return the collected intelligence directly back to our user interface
        return {
            "success": True,
            "startup": payload.startup_name,
            "logs": final_state.get("execution_logs", []),
            "analysis": {
                "founder_report": final_state.get("founder_analysis"),
                "security_report": final_state.get("security_analysis")
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))