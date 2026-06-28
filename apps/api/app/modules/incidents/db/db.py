# incidents/db.py
from uuid import UUID

from app.modules.incidents.models import Incident, Employee, Error

_incidents: list[Incident] = []
_employees: list[Employee] = []


async def save_incident(incident: Incident) -> Incident:
    """
    Save incident in the in-memory storage.
    Employees are stored separately and correlated by employee id.
    """

    for employee in incident.participants:
        await add_employee(employee)

    _incidents.append(incident)

    return incident


async def get_incident_by_id(incident_id: str) -> Incident | None:
    """
    Return incident by identifier.
    """

    uuid_inc_id = UUID(incident_id)

    return next(
        (
            incident
            for incident in _incidents
            if incident.id == uuid_inc_id
        ),
        None,
    )


async def get_incident_by_public_id(public_id: str) -> Incident | None:
    """
    Return incident by its public identifier, e.g. 'INC-XXXX'.
    """

    return next(
        (
            incident
            for incident in _incidents
            if incident.public_id == public_id
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
    Update an existing incident.
    Employees are stored separately and correlated by employee id.
    """

    for employee in incident.participants:
        await add_employee(employee)

    for idx, inc in enumerate(_incidents):
        if inc.id == incident.id:
            _incidents[idx] = incident
            return incident

    return None


async def update_employee_info(employee: Employee) -> Employee | Error:
    """
    Update employee information in the employees collection.
    """

    for idx, existing_employee in enumerate(_employees):
        if existing_employee.id == employee.id:
            _employees[idx] = employee
            return employee

    return Error("Employee was not found.")


async def get_employee_info(empl_id: str) -> Employee | Error:
    """
    Return employee by identifier.
    """

    employee_id = UUID(empl_id)

    employee = next(
        (
            employee
            for employee in _employees
            if employee.id == employee_id
        ),
        None,
    )

    if employee is None:
        return Error("Employee was not found.")

    return employee


async def add_employee(employee: Employee) -> Employee | Error:
    """
    Add employee to the employees collection.

    If employee already exists, update the existing record.
    """

    for idx, existing_employee in enumerate(_employees):
        if existing_employee.id == employee.id:
            _employees[idx] = employee
            return employee

    _employees.append(employee)

    return employee