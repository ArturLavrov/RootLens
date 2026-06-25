from fastapi import APIRouter, Query

from app.modules.employees import module
from app.modules.employees.models import Employee
from app.modules.employees.restapi.models import EmployeeResponse

router = APIRouter(
    prefix="/employees",
    tags=["employees"],
)


def to_response(employee: Employee) -> EmployeeResponse:
    return EmployeeResponse(
        id=employee.id,
        name=employee.name,
        email=employee.email,
    )

@router.get("/search",response_model=list[EmployeeResponse],summary="Search employees",)
async def search(
    name: str = Query(
        ...,
        min_length=1,
        description="Employee name or part of the employee name.",
    ),
) -> list[EmployeeResponse]:
    """
    Searches employees by name.
    """
    employees = await module.search_employees(name)
    return [to_response(employee) for employee in employees]