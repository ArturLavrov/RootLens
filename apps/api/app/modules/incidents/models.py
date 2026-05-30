from dataclasses import dataclass
from uuid import UUID, uuid4

from app.modules.incidents.models import ValidationError

class Incident:
    def __init__(
        self,
        incident_id: UUID,
        title: str,
        description: str,
    ) -> None:
        self._id = incident_id
        self._title = title
        self._description = description

    @classmethod
    def create(
        cls,
        title: str,
        description: str,
    ) -> "Incident | ValidationError":

        if not title or title.isspace():
            return ValidationError("Title cannot be empty")

        if not description or description.isspace():
            return ValidationError("Description cannot be empty")

        return cls(
            incident_id=uuid4(),
            title=title,
            description=description,
        )

    @property
    def id(self) -> UUID:
        return self._id

    @property
    def title(self) -> str:
        return self._title

    @property
    def description(self) -> str:
        return self._description

    def update_title(self, title: str) -> ValidationError | None:
        if not title or title.isspace():
            return ValidationError("Title cannot be empty")

        self._title = title
        return None

    def update_description(self, description: str) -> ValidationError | None:
        if not description or description.isspace():
            return ValidationError("Description cannot be empty")

        self._description = description
        return None


class DeclareIncidentRequest:
    pass

@dataclass
class Error:
    message: str

@dataclass
class ValidationError:
    pass