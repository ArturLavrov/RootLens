from fastapi import APIRouter
from app.incidents.schemas import CreateIncidentRequest, IncidentResponse
from app.incidents import module

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.post("", response_model=IncidentResponse)
async def create_incident(request: CreateIncidentRequest):
    return await module.declare_incident(request)


@router.get("", response_model=list[IncidentResponse])
async def get_incidents():
    return await module.get_incidents()
