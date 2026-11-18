import httpx
import json
import os
from typing import Optional, Dict, Any
from pathlib import Path

from app.config import settings

COMFYUI_URL = settings.COMFYUI_URL

class ComfyUIClient:
    """Client for interacting with ComfyUI API."""
    
    def __init__(self, base_url: str = COMFYUI_URL):
        self.base_url = base_url.rstrip("/")
    
    async def get_system_stats(self) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/system_stats", timeout=10)
            resp.raise_for_status()
            return resp.json()
    
    async def get_queue(self) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/queue", timeout=10)
            resp.raise_for_status()
            return resp.json()
    
    async def submit_prompt(self, workflow: dict, client_id: str = "appyux") -> str:
        """Submit a workflow to ComfyUI. Returns prompt_id."""
        payload = {"prompt": workflow, "client_id": client_id}
        async with httpx.AsyncClient() as client:
            resp = await client.post(f"{self.base_url}/prompt", json=payload, timeout=30)
            resp.raise_for_status()
            data = resp.json()
            return data.get("prompt_id")
    
    async def get_history(self, prompt_id: str) -> dict:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"{self.base_url}/history/{prompt_id}", timeout=10)
            resp.raise_for_status()
            return resp.json()
    
    async def get_progress(self, prompt_id: str) -> dict:
        """Check if a prompt is still in queue or completed."""
        queue = await self.get_queue()
        running = queue.get("queue_running", [])
        pending = queue.get("queue_pending", [])
        
        for item in running:
            if item[1] == prompt_id:
                return {"status": "running", "position": 0}
        for i, item in enumerate(pending):
            if item[1] == prompt_id:
                return {"status": "queued", "position": i + 1}
        
        # Not in queue — check history
        history = await self.get_history(prompt_id)
        if prompt_id in history:
            return {"status": "completed", "position": 0, "outputs": history[prompt_id].get("outputs", {})}
        return {"status": "unknown", "position": -1}
    
    def load_workflow(self, workflow_name: str) -> dict:
        """Load a workflow template from JSON file."""
        workflow_path = Path(__file__).parent.parent / "workflows" / f"{workflow_name}.json"
        if not workflow_path.exists():
            raise FileNotFoundError(f"Workflow not found: {workflow_name}")
        with open(workflow_path) as f:
            return json.load(f)
    
    def prepare_workflow(self, workflow: dict, inputs: dict) -> dict:
        """Prepare a workflow by injecting input values."""
        # Deep copy
        import copy
        wf = copy.deepcopy(workflow)
        # Inject inputs based on workflow node mappings
        # This is workflow-specific; extend per workflow type
        for node_id, params in inputs.items():
            if node_id in wf:
                for key, value in params.items():
                    if "inputs" in wf[node_id]:
                        wf[node_id]["inputs"][key] = value
        return wf

comfyui = ComfyUIClient()
