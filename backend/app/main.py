from fastapi import FastAPI
from app.routes import auth_routes
app =FastAPI(title="Urbanlife Apı")
app.include_router(auth_routes.router)
@app.get("/")
def root():
    return {"message":"urbalife Api is running"}
