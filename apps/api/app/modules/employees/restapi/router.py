from http.client import HTTPResponse

from fastapi import APIRouter, HTTPException, Query, status, Response

from app.modules.employees import module
from app.modules.employees.models import Employee, Error
from app.modules.employees.restapi.models import (
    CreateEmployeeRequest,
    EmployeeResponse,
)

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


@router.post(
    "",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create employee",
)
async def create_employee(
    request: CreateEmployeeRequest,
) -> EmployeeResponse:
    employee = Employee(
        name=request.name,
        email=request.email,
        title = request.title,
    )

    result = await module.add_employee(employee)

    match result:
        case Employee():
            return Response(status_code=status.HTTP_201_CREATED)

        case Error():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.message,
            )
    return None


@router.get(
    "/search",
    response_model=list[EmployeeResponse],
    summary="Search employees",
)
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