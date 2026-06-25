from app.modules.employees.db import db
from app.modules.employees.models import Employee

async def search_employees(name: str) -> list[Employee]:
    return await db.search_employees_by_name(name)