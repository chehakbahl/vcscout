import os
import sys
from dotenv import load_dotenv

# Force Python to include the current directory in its search path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

# Load environment variables
load_dotenv()

# Now the import will work perfectly!
from graph import analysis_graph

print("Checking LangGraph configuration...")

compiled_nodes = list(analysis_graph.nodes.keys())
print(f"Successfully compiled nodes: {compiled_nodes}")

if "founder_agent" in compiled_nodes and "security_agent" in compiled_nodes:
    print("\n🎉 SUCCESS! Your multi-agent LangGraph workflow is wired perfectly.")
else:
    print("\n❌ Error: Missing expected worker nodes in graph configuration.")