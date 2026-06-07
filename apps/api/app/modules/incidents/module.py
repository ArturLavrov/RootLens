# incidents/module.p
from app.modules.incidents.models import Incident, DeclareIncidentRequest, Error, NotFound, ValidationError
from app.modules.incidents.db import db
from uuid import UUID

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
    # try UUID first
    try:
        iid = UUID(incident_id)
        incident = await db.get_incident_by_id(iid)
        if incident is not None:
            return incident
    except Exception:
        return NotFound

async def update_incident(inc: Incident) -> Incident | Error:
    """
    Update an incident.
    """
    updated_inc = await db.update_incident(inc)
    if updated_inc is None:
        return Error(message="Incident not found")
    return updated_inc
