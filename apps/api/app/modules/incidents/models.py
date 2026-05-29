import uuid

class Incident:
    def __init__(self, title: str, description: str, severity: str, product: str, environment: str) -> None:
        self.id = self.__generate__id()
        self.title = title
        self.description = description
        self.severity = severity
        self.product = product
        self.environment = environment

    def update_title(self, title: str) -> None:
        self.title = title

    def update_description(self, description: str) -> None:
        self.description = description

    def is_critical(self) -> bool:
        return self.severity == "Critical"

    @staticmethod
    def __generate__id() -> uuid :
        return uuid.uuid4()


class DeclareIncidentRequest:
    pass