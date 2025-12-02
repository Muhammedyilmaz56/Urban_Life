from fastapi import FastAPI
from app.routes import complaint_routes
from app.routes import auth_routes

from app.utils.db import get_db 
from app.models.base import Base
from app.utils.db import engine 
app =FastAPI(title="Urbanlife Apı")
app.include_router(auth_routes.router)


@app.get("/")
def root():
    return {"message":"urbalife Api is running"}
