from fastapi import APIRouter
from app.modules.incidents.restapi.models import CreateIncidentRequest, IncidentResponse
from app.modules.incidents.module import declare_incident, get_incidents, get_incident_by_id

router = APIRouter(prefix="/incidents", tags=["Incidents"])

@router.post("", response_model=IncidentResponse)
async def create_incident(request: CreateIncidentRequest):
    return await declare_incident()


@router.get("", response_model=list[IncidentResponse])
async def get_incidents():
    return await get_incidents()
