from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from app.modules.incidents.models import Incident, Client
from app.modules.incidents.restapi.models import (
    CreateIncidentRequest,
    IncidentResponse,
    ClientResponse
)
from app.modules.incidents.module import (
    declare_incident,
    get_all_incidents,
)
from app.modules.incidents.models import ValidationError, Error

router = APIRouter(prefix="/incidents", tags=["Incidents"])

def map_to_incident_model(incident: Incident) -> IncidentResponse:
    def map_to_client_response(client: Client) -> dict:
        return {
            "id": client.id,
            "name": client.name,
        }

    return IncidentResponse(
        id=str(incident.id),
        public_id=incident.public_id,
        title=incident.title,
        description=incident.description,
        severity=incident.severity,
        affected_clients=[
            map_to_client_response(client)
            for client in incident.affected_clients
        ],
        affects_all_clients=incident.affects_all_clients,
        reported_date=incident.reported_date,
        created_on=incident.created_on,
        modified_on=incident.modified_on,
        status=incident.status,
        priority=incident.priority,
        impact=incident.impact,
        environment=incident.environment,
        participants=[],
        communication_channels=[],
        mitigation_steps=[],
    )

@router.post("",status_code=status.HTTP_201_CREATED,)
async def create_incident(request: CreateIncidentRequest):
    result = await declare_incident(request)

    match result:
        case Incident():
            return JSONResponse(content=None, status_code=status.HTTP_201_CREATED)

        case ValidationError():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.message,
            )

        case Error():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.message,
            )

        case _:
            raise ValueError(f"Unexpected result type: {type(result)}")

@router.get("", response_model=list[IncidentResponse])
async def get_incidents():
    incidents = await get_all_incidents()
    return [map_to_incident_model(incident) for incident in incidents]


@router.get("/{id}",response_model=IncidentResponse)
async def get_incident(id: str,) -> IncidentResponse:
    pass
