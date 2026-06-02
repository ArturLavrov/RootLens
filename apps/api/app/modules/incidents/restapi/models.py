from datetime import datetime
from pydantic import BaseModel


class ClientResponse(BaseModel):
    id: str
    name: str

class EmployeeResponse(BaseModel):
    id: str
    display_name: str
    email: str
    role: str
    is_active: bool


class CommunicationChannelResponse(BaseModel):
    id: str
    display_name: str
    type: str
    link: str


class MitigationStepResponse(BaseModel):
    id: str
    order: int
    text: str
    owner: EmployeeResponse


class IncidentResponse(BaseModel):
    id: str
    public_id: str
    title: str
    description: str
    severity: str
    affected_clients: list[ClientResponse]

    reported_date: datetime
    created_on: datetime
    modified_on: datetime

    participants: list[EmployeeResponse]

    status: str
    priority: str
    impact: str

    communication_channels: list[CommunicationChannelResponse]
    mitigation_steps: list[MitigationStepResponse]


class ClientRequest(BaseModel):
    id: str
    name: str

class ClientResponse(BaseModel):
    id: str
    name: str

class CreateIncidentRequest(BaseModel):
    title: str
    severity: str
    description: str
    env: str
    affected_clients: list[ClientRequest]
    affects_all_clients: bool = False