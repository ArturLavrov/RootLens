from fastapi import FastAPI
from app.modules.incidents.restapi.router import router as incidents_router
from app.modules.employees.restapi.router import router as employees_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import status
from fastapi.requests import Request

app = FastAPI(title="RootLens API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"detail": exc.errors()}, headers={"Access-Control-Allow-Origin": "*"})

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    # Ensure CORS header is present even on 500 responses so browsers can surface the error
    return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"detail": "Internal Server Error"}, headers={"Access-Control-Allow-Origin": "*"})

app.include_router(incidents_router, prefix="/api/v1")
app.include_router(employees_router, prefix="/api/v1")
