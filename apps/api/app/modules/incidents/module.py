# incidents/module.p
from app.modules.incidents.models import Incident, DeclareIncidentRequest, Error, NotFound, ValidationError
from app.modules.incidents.db import db

async def declare_incident(request: DeclareIncidentRequest,) -> Incident | ValidationError:
    """
    Declare a new incident in the system.
    """
    result = Incident.create(
        title=request.title,
        description=request.description,
        severity=request.severity,
        env=request.env,
        affected_clients=request.affected_clients,
        affects_all_clients=request.affects_all_clients,
        participants=request.participants,
    )

    if isinstance(result, Incident):
        await db.save_incident(result)

    return result


async def get_all_incidents() -> list[Incident] | Error:
    """
    Return all registered incidents.
    """
    incidents = await db.get_all_incidents()
    return incidents

async def get_incident_by_id(incident_id: str) -> Incident | NotFound | Error:
    """
    Return incident by identifier. Accepts either UUID or public_id (e.g., INC-XXXX).
    """
    # If it's a valid UUID string, look up by UUID
    if Incident.is_valid_id(incident_id):
        incident = await db.get_incident_by_id(incident_id)
        if incident is None:
            return NotFound(message="Incident not found")
        return incident

    # Otherwise, try to look up by public_id (human-readable)
    incident = await db.get_incident_by_public_id(incident_id)
    if incident is None:
        return NotFound(message="Incident not found")
    return incident

async def update_incident(inc: Incident) -> Incident | Error:
    """
    Update an incident.
    """
    updated_inc = await db.update_incident(inc)
    if updated_inc is None:
        return Error(message="Incident not found")
    return updated_inc
