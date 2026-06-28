from mediatr import Mediator
from app.modules.employees.events.events import EmployeeDataChanged, EmployeeCreated
from app.modules.employees.db import db;
from app.modules.employees.models import Employee

@Mediator.handler
async def on_employee_data_changed(event: EmployeeDataChanged) -> None:
    if event is not None and event.id is not None:
        employee_info = db.get_employee_info(event.id)
        if employee_info is not None:
            employee_info.name = event.name
            employee_info.email = event.email
            db.update_employee_info(employee_info)

@Mediator.handler
async def on_employee_created(event: EmployeeCreated) -> None:
    if event is not None:
        employee = Employee(id=event.id, name=event.name, email=event.email)
        db.add_employee(employee)