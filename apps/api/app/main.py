from fastapi import FastAPI
from app.modules.incidents.restapi.router import router as incidents_router

app = FastAPI(title="RootLens API")

app.include_router(incidents_router, prefix="/api/v1")
