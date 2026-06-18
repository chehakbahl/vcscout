import os
from typing import Dict, Any
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

def run_founder_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the founder's background and team market-fit.
    """
    print(f"--- STARTING FOUNDER AGENT FOR: {state['name']} ---")
    
    # 1. Pull relevant information out of the shared state
    founder_info = state.get("founder_linkedin", "No LinkedIn provided")
    startup_name = state["name"]
    
    # 2. Setup our LLM (Reads OPENAI_API_KEY from your future environment variables)
    # We use a fallback temperature of 0 for sharp, analytical reporting
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    
    # 3. Design the prompt to guide the AI's analysis
    prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "You are an expert Venture Capital Investment Associate specializing in founder background checks.\n"
            "Analyze the provided founder information and generate a concise evaluation.\n"
            "Return your final thoughts under three strict headers:\n"
            "1. Track Record (Past achievements/companies)\n"
            "2. Domain Expertise (Why are they qualified to build this?)\n"
            "3. Red Flags (Any potential risks or execution gaps)"
        )),
        ("human", "Analyze the founder for startup '{startup_name}'. Provided Info: {founder_info}")
    ])
    
    # 4. Invoke the AI
    chain = prompt | llm
    response = chain.invoke({"startup_name": startup_name, "founder_info": founder_info})
    
    # 5. Append this agent's log to the execution tracker
    logs = state.get("execution_logs", [])
    logs.append("Founder Agent Completed Check")
    
    # 6. Return ONLY the keys we want to update in the global state
    return {
        "founder_analysis": {
            "raw_report": response.content,
            "status": "COMPLETED"
        },
        "execution_logs": logs
    }