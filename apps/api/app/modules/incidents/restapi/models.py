from pydantic import BaseModel


class CreateIncidentRequest(BaseModel):
    title: str
    description: str | None = None
    severity: str


class IncidentResponse(BaseModel):
    id: str
    title: str
    description: str | None = None
    severity: str