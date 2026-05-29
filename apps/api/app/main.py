from fastapi import FastAPI
from app.incidents.restapi import router as incidents_router

app = FastAPI(title="RootLens API")

app.include_router(incidents_router, prefix="/api/v1")
