from uuid import UUID

from pydantic import BaseModel, ConfigDict


class EmployeeResponse(BaseModel):
    id: UUID
    name: str
    email: str
    avatar_url: str | None = None

    model_config = ConfigDict(
        frozen=True,
    )