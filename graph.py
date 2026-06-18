from langgraph.graph import StateGraph, END
from state import StartupAnalysisState
from agents.founder_agent import run_founder_agent
from agents.security_agent import run_security_agent

def create_analysis_workflow():
    # 1. Initialize the state graph with our schema
    workflow = StateGraph(StartupAnalysisState)
    
    # 2. Register our agent nodes
    workflow.add_node("founder_agent", run_founder_agent)
    workflow.add_node("security_agent", run_security_agent)
    
    # 3. Design the execution order (Run founder first, then security)
    workflow.set_entry_point("founder_agent")
    workflow.add_edge("founder_agent", "security_agent")
    workflow.add_edge("security_agent", END)
    
    # 4. Compile the graph into an executable runnable app
    return workflow.compile()

# Compile a global instance we can import elsewhere
analysis_graph = create_analysis_workflow()