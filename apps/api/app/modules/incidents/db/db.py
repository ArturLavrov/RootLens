# incidents/db.py
from uuid import UUID
from app.modules.incidents.models import Incident

_incidents: list[Incident] = []


async def save_incident(incident: Incident,) -> Incident:
    """
    Save incident in the in-memory storage.
    """

    _incidents.append(incident)

    return incident


async def get_incident_by_id(incident_id: UUID,) -> Incident | None:
    """
    Return incident by identifier.
    """

    return next(
        (
            incident
            for incident in _incidents
            if incident.id == incident_id
        ),
        None,
    )


async def get_all_incidents() -> list[Incident]:
    """
    Return all incidents from the in-memory storage.
    """

    return _incidents


async def update_incident(incident: Incident) -> Incident | None:
    """
    Update an existing incident in the in-memory storage. Returns the updated incident or None if not found.
    """
    for idx, inc in enumerate(_incidents):
        if inc.id == incident.id:
            _incidents[idx] = incident
            return incident
    return None

