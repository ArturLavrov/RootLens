from app.modules.employees.models import Employee, Error

from uuid import UUID

_EMPLOYEES: list[Employee] = [
    Employee(
        employee_id=UUID("11111111-1111-1111-1111-111111111111"),
        name="John Smith",
        email="john.smith@example.com",
        title="Senior Software Engineer",
    ),
    Employee(
        employee_id=UUID("22222222-2222-2222-2222-222222222222"),
        name="Jane Doe",
        email="jane.doe@example.com",
        title="Engineering Manager",
    ),
    Employee(
        employee_id=UUID("33333333-3333-3333-3333-333333333333"),
        name="Johnny Williams",
        email="johnny.williams@example.com",
        title="Site Reliability Engineer",
    ),
    Employee(
        employee_id=UUID("44444444-4444-4444-4444-444444444444"),
        name="Alice Johnson",
        email="alice.johnson@example.com",
        title="Product Manager",
    ),
]

async def search_employees_by_name(name: str) -> list[Employee]:
    search_term = name.strip().lower()

    return [
        employee
        for employee in _EMPLOYEES
        if search_term in employee.name.lower()
    ]

async def add_employee(employee: Employee) -> Employee | Error :
    existing_employee = next(
        (
            existing
            for existing in _EMPLOYEES
            if existing.email.lower() == employee.email.lower()
        ),
        None,
    )

    if existing_employee is not None:
        return existing_employee

    _EMPLOYEES.append(employee)

    return employee