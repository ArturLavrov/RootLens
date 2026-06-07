from fastapi import APIRouter, HTTPException, status
from app.modules.incidents.models import Incident, Client, DeclareIncidentRequest, NotFound, Error, Employee
from app.modules.incidents.restapi.models import (
    CreateIncidentRequest,
    IncidentResponse,
    ClientResponse
)
from app.modules.incidents.module import (
    declare_incident,
    get_all_incidents,
    get_incident_by_id,
    update_incident
)
from app.modules.incidents.models import ValidationError
from datetime import datetime, timezone

router = APIRouter(prefix="/incidents", tags=["Incidents"])

def map_to_incident_model(incident: Incident) -> IncidentResponse:
    def map_to_client_response(client: Client) -> dict:
        return {
            "id": client.id,
            "name": client.name,
        }

    def map_to_employee_response(emp: "Employee") -> dict:
        return {
            "id": emp.id,
            "display_name": emp.name,
            "email": emp.email,
            "role": "",
            "is_active": True,
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
        participants=[map_to_employee_response(e) for e in getattr(incident, 'participants', [])],
        communication_channels=[],
        mitigation_steps=[],
    )

@router.post("",status_code=status.HTTP_200_OK,)
async def create_incident(request: CreateIncidentRequest):
    declare_inc_request = DeclareIncidentRequest(
        affected_clients=[Client(id=c.id, name=c.name) for c in request.affected_clients],
        affects_all_clients=bool(request.affects_all_clients),
        env=request.env,
        severity=request.severity,
        title=request.title,
        description=request.description,
        participants=[Employee(id=p.id, name=p.name, email=p.email) for p in getattr(request, 'participants', [])],
    )

    result = await declare_incident(declare_inc_request)

    match result:
        case Incident():
            # return created incident representation
            return map_to_incident_model(result)

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

@router.put("/{id}", response_model=IncidentResponse)
async def update_incident_endpoint(id: str, request: CreateIncidentRequest):
    existing = await get_incident_by_id(id)
    if isinstance(existing, Error):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=existing.message)
    if isinstance(existing, NotFound):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incident not found")

    clients = [Client(id=c.id, name=c.name) for c in request.affected_clients]
    participants = [Employee(id=p.id, name=p.name, email=p.email) for p in getattr(request, 'participants', [])]

    updated_inc = Incident(
        incident_id=existing.id,
        public_id=existing.public_id,
        title=request.title,
        description=request.description,
        severity=request.severity,
        reported_date=existing.reported_date,
        created_on=existing.created_on,
        modified_on=datetime.now(timezone.utc),
        status=existing.status,
        priority=existing.priority,
        impact=existing.impact,
        env=request.env,
        affected_clients=clients,
        affects_all_clients=bool(request.affects_all_clients),
        participants=participants,
    )

    result = await update_incident(updated_inc)
    if isinstance(result, Error):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=result.message)

    return map_to_incident_model(result)

@router.get("", response_model=list[IncidentResponse])
async def get_incidents():
    incidents = await get_all_incidents()
    if isinstance(incidents, Error):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=incidents.message)
    return [map_to_incident_model(incident) for incident in incidents]


@router.get("/{id}",response_model=IncidentResponse)
async def get_incident(id: str,) -> IncidentResponse:
    incident = await get_incident_by_id(id)
    if isinstance(incident, Error):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=incident.message)
    if isinstance(incident, NotFound):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incident not found")
    return map_to_incident_model(incident)

