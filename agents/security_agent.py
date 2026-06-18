import os
from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

def run_security_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the startup's digital footprint for security risks.
    """
    print(f"--- STARTING SECURITY AGENT FOR: {state['name']} ---")
    
    # 1. Gather inputs from shared state
    website_url = state.get("website_url", "No Website URL provided")
    startup_name = state["name"]
    
    # 2. Setup the LLM
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
    # 3. Create the specialized cyber security analysis prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "You are a Senior Cybersecurity Auditor evaluating early-stage startups.\n"
            "Analyze the provided digital presence vectors and evaluate potential threat surfaces.\n"
            "Provide your findings under three strict headers:\n"
            "1. Attack Surface (Potential weak points based on their web presence/stack)\n"
            "2. Data Privacy Exposure (Risks handling user or investor data)\n"
            "3. Mitigation Recommendations (Actionable security steps)"
        )),
        ("human", "Analyze security for startup '{startup_name}' via target link: {website_url}")
    ])
    
    # 4. Invoke the AI
    chain = prompt | llm
    response = chain.invoke({"startup_name": startup_name, "website_url": website_url})
    
    # 5. Update our shared logs
    logs = state.get("execution_logs", [])
    logs.append("Security Agent Completed Check")
    
    # 6. Return keys to merge back into state
    return {
        "security_analysis": {
            "raw_report": response.content,
            "status": "COMPLETED"
        },
        "execution_logs": logs
    }