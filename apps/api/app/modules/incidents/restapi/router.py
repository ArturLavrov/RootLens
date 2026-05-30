from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from app.modules.incidents.models import Incident
from app.modules.incidents.restapi.models import (
    CreateIncidentRequest,
    IncidentResponse,
)
from app.modules.incidents.module import (
    declare_incident,
    get_all_incidents,
)
from app.modules.incidents.models import ValidationError, Error

router = APIRouter(prefix="/incidents", tags=["Incidents"])

def map_to_incident_model(incident):
    #TODO: implement this method with a mapping logic
    pass


@router.post("",response_model=IncidentResponse,status_code=status.HTTP_201_CREATED,)
async def create_incident(request: CreateIncidentRequest):
    result = await declare_incident(request)

    match result:
        case Incident():
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
            )

        case ValidationError():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.message,
            )

        case Error():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=result.message,
            )

        case _:
            raise ValueError(f"Unexpected result type: {type(result)}")

@router.get("", response_model=list[IncidentResponse])
async def get_incidents():
    incidents = await get_all_incidents()
    return [
        map_to_incident_model(incident) for incident in incidents
    ]
