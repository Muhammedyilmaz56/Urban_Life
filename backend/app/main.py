from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from app.routes import complaint_routes
from app.routes import auth_routes
from app.routes import assignment_routes
from app.routes import user_routes
from app.routes import official_routes
from app.routes.worker_router import router as worker_router
from app.routes.category_routes import router as category_router
from app.routes.admin_routes import router as admin_router

from app.utils.db import get_db, engine
from app.models.base import Base
from app.models.worker import Worker
from app.routes.employee_routes import router as employee_router
app = FastAPI(title="Urbanlife API")


app.include_router(category_router)
app.include_router(official_routes.router)
app.include_router(worker_router)
app.include_router(auth_routes.router)
app.include_router(complaint_routes.router)
app.include_router(assignment_routes.router)
app.include_router(user_routes.router)
app.include_router(admin_router)
app.include_router(employee_router)
# Statik dosyalar
app.mount("/media", StaticFiles(directory="media"), name="media")

@app.get("/auth/open-app", response_class=HTMLResponse)
def open_mobile_app_bridge(token: str):
    deep_link = f"cityflow://reset-password/{token}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>CityFlow Yönlendiriliyor...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{ font-family: sans-serif; text-align: center; padding: 40px 20px; background-color: #f4f4f4; }}
            .btn {{ display: block; background-color: #4F46E5; color: white; padding: 15px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 20px; font-size: 18px; }}
        </style>
    </head>
    <body>
        <h3>CityFlow Uygulaması Açılıyor...</h3>
        <p>Otomatik açılmazsa aşağıdaki butona tıklayın:</p>
        
        <a href="{deep_link}" class="btn">Uygulamayı Aç</a>
        
        <script>
            window.onload = function() {{
                window.location.href = "{deep_link}";
            }};
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/")
def root():
    return {"message": "UrbanLife API is running"}