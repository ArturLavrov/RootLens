from app.modules.employees.models import Employee

_EMPLOYEES: list[Employee] = [
    Employee(name="John Smith", email="john.smith@example.com"),
    Employee(name="Jane Doe", email="jane.doe@example.com"),
    Employee(name="Johnny Williams", email="johnny.williams@example.com"),
    Employee(name="Alice Johnson", email="alice.johnson@example.com"),
]

async def search_employees_by_name(name: str) -> list[Employee]:
    search_term = name.strip().lower()

    return [
        employee
        for employee in _EMPLOYEES
        if search_term in employee.name.lower()
    ]