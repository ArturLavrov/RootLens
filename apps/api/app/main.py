from fastapi import FastAPI
from app.modules.incidents.restapi.router import router as incidents_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="RootLens API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(incidents_router, prefix="/api/v1")
