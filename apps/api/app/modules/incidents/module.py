# incidents/module.p
from app.modules.incidents.models import Incident, DeclareIncidentRequest, Error, ValidationError
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


async def get_incident_by_id(incident_id: str) -> Incident | Error:
    """
    Return incident by identifier.
    """
    incident = db.get_incident_by_id(incident_id)
    return incident
