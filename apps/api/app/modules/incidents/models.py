from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import UUID, uuid4


@dataclass(frozen=True)
class Error:
    message: str


@dataclass(frozen=True)
class ValidationError:
    message: str


@dataclass(frozen=True)
class Client:
    id: str
    name: str


@dataclass(frozen=True)
class DeclareIncidentRequest:
    affected_clients: list[Client]
    affects_all_clients: bool
    env: str
    severity: str
    title: str
    description: str


class Incident:
    def __init__(
        self,
        incident_id: UUID,
        public_id: str,
        title: str,
        description: str,
        severity: str,
        reported_date: datetime,
        created_on: datetime,
        modified_on: datetime,
        status: str,
        priority: str,
        impact: str,
        env: str,
        affected_clients: list[Client],
        affects_all_clients: bool,
    ) -> None:
        self._id = incident_id
        self._public_id = public_id
        self._title = title
        self._description = description
        self._severity = severity
        self._reported_date = reported_date
        self._created_on = created_on
        self._modified_on = modified_on
        self._status = status
        self._priority = priority
        self._impact = impact
        self._env = env
        self._affected_clients = affected_clients
        self._affects_all_clients = affects_all_clients

    @classmethod
    def create(
        cls,
        title: str,
        description: str,
        severity: str,
        env:str,
        affected_clients: list[Client],
        affects_all_clients: bool,
    ) -> "Incident | ValidationError":

        if not title or title.isspace():
            return ValidationError(message="Title cannot be empty")

        if not description or description.isspace():
            return ValidationError(message="Description cannot be empty")

        if not severity or severity.isspace():
            return ValidationError(message="Severity cannot be empty")

        if not affects_all_clients and len(affected_clients) == 0:
            return ValidationError(
                message="Affected clients cannot be empty unless incident affects all clients"
            )

        for client in affected_clients:
            if not client.id or client.id.isspace():
                return ValidationError(message="Client id cannot be empty")

            if not client.name or client.name.isspace():
                return ValidationError(message="Client name cannot be empty")

        now = datetime.now(timezone.utc)

        return cls(
            incident_id=uuid4(),
            public_id=f"INC-{uuid4().hex[:8].upper()}",
            title=title.strip(),
            description=description.strip(),
            severity=severity.strip(),
            reported_date=now,
            created_on=now,
            modified_on=now,
            status="Open",
            priority="Medium",
            impact="Unknown",
            env=env,
            affected_clients=affected_clients,
            affects_all_clients=affects_all_clients,
        )

    @property
    def id(self) -> UUID:
        return self._id

    @property
    def public_id(self) -> str:
        return self._public_id

    @property
    def title(self) -> str:
        return self._title

    @property
    def description(self) -> str:
        return self._description

    @property
    def severity(self) -> str:
        return self._severity

    @property
    def affected_clients(self) -> list[Client]:
        return self._affected_clients

    @property
    def affects_all_clients(self) -> bool:
        return self._affects_all_clients

    @property
    def status(self) -> str:
        return self._status

    @property
    def priority(self) -> str:
        return self._priority

    @property
    def impact(self) -> str:
        return self._impact

    @property
    def environment(self) -> str:
        return self._env

    @property
    def reported_date(self) -> datetime:
        return self._reported_date

    @property
    def created_on(self) -> datetime:
        return self._created_on

    @property
    def modified_on(self) -> datetime:
        return self._modified_on

    def _touch(self) -> None:
        self._modified_on = datetime.now(timezone.utc)