from typing import Dict, Any, List, Optional
from typing_extensions import TypedDict

class StartupAnalysisState(TypedDict):
    startup_id: str
    name: str
    website_url: str
    founder_linkedin: Optional[str]
    scraped_text: Optional[str]
    founder_analysis: Optional[Dict[str, Any]]
    security_analysis: Optional[Dict[str, Any]]
    compliance_analysis: Optional[Dict[str, Any]]
    final_report: Optional[Dict[str, Any]]
    execution_logs: List[str]