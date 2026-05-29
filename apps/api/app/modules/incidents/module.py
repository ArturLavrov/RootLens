# incidents/module.p
from datetime import datetime, timezone
from uuid import UUID, uuid4
from app.incidents.models import Incident

_incidents: list[Incident] = []

async def declare_incident(request: DeclareIncidentRequest) -> Incident:
    """
    Declare a new incident in the system.
    The incident is currently stored in memory.
    """

    incident = Incident(
        id=uuid4(),
        title=request.title,
        description=request.description,
        severity=request.severity,
        product=request.product,
        status="open",
        created_at=datetime.now(timezone.utc),
    )

    return db.save_incident(incident);


async def get_incidents() -> list[Incident]:
    """
    Return all registered incidents.
    """
    
    return db.get_all_incidents();


async def get_incident_by_id(incident_id: UUID) -> Incident | None:
     """
    Return incident by identifier.

    Returns None when incident does not exist.
    """
    return db.get_incident_by_id(incident_id)
