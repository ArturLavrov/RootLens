from mediatr import Mediator

from app.modules.employees.db import db
from app.modules.employees.models import Employee, Error
from app.modules.employees.events.events import EmployeeCreated


async def search_employees(name: str) -> list[Employee] | Error:
    return await db.search_employees_by_name(name)

async def add_employee(employee: Employee) -> Employee | Error:
    await db.add_employee(employee)
    await Mediator.send_async(
        EmployeeCreated(
            employee.id, employee.name, employee.email, employee.title)
        )
    return