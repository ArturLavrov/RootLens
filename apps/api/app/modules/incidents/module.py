# incidents/module.p
from uuid import UUID, uuid4
from app.modules.incidents.models import Incident, DeclareIncidentRequest
from app.modules.incidents.db import db
from app.modules.products.module import get_all_products

products = get_all_products();

async def declare_incident(request: DeclareIncidentRequest) -> Incident:
    """
    Declare a new incident in the system.
    """

    incident = Incident.create(
        id=uuid4(),
        title=request.title,
        description=request.description,
        severity=request.severity,
        product=request.product,
    )

    return db.save_incident(incident);


async def get_incidents() -> list[Incident]:
    """
    Return all registered incidents.
    """
    incidents = db.get_all_incidents();
    for incident in incidents:
        product = products.find(incident.productId)
        incident.set_product(product)


async def get_incident_by_id(incident_id: UUID) -> Incident | None:
    """
    Return incident by identifier.
    """
    incident = db.get_all_incidents()
    product = products.find(incident.productId)
    incident.set_product(product)

    return None
