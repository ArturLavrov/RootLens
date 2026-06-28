from dataclasses import dataclass
from uuid import UUID, uuid4

@dataclass(frozen=True)
class Error:
    message: str


class Employee:
    def __init__(
        self,
        name: str,
        email: str,
        title: str,
        employee_id: UUID | None = None,
    ) -> None:
        self._id = employee_id or uuid4()
        self._name = name
        self._email = email
        self._title = title

    @property
    def id(self) -> UUID:
        return self._id

    @property
    def name(self) -> str:
        return self._name

    @property
    def email(self) -> str:
        return self._email

    @property
    def title(self) -> str:
        return self._title