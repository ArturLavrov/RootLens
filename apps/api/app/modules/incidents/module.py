# incidents/module.p
from uuid import UUID, uuid4
from app.modules.incidents.models import Incident, DeclareIncidentRequest, Error, ValidationError
from app.modules.incidents.db import db

async def declare_incident(request: DeclareIncidentRequest) -> Incident | ValidationError | Error:
    """
    Declare a new incident in the system.
    """
    result = Incident.create(id=uuid4(),title=request.title,description=request.description,severity=request.severity,product=request.product)
    if result is Incident:
        db.save_incident(result)
    return result


async def get_all_incidents() -> list[Incident] | Error:
    """
    Return all registered incidents.
    """
    incidents = db.get_all_incidents()
    return incidents


async def get_incident_by_id(incident_id: str) -> Incident | Error:
    """
    Return incident by identifier.
    """
    incident = db.get_incident_by_id(incident_id)
    return incident
