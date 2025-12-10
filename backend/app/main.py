from fastapi import FastAPI
from fastapi.responses import HTMLResponse 

from app.routes import complaint_routes
from app.routes import auth_routes
from app.routes import assignment_routes

from app.utils.db import get_db 
from app.models.base import Base
from app.utils.db import engine 
from app.routes.user_routes import router as user_router
from app.routes.complaint_routes import router as complaint_router
from fastapi.staticfiles import StaticFiles
from app.routes import user_routes
from app.routes import official_routes

app = FastAPI(title="Urbanlife API")

app.include_router(official_routes.router)

app.include_router(auth_routes.router)
app.include_router(complaint_routes.router)
app.include_router(assignment_routes.router)
app.include_router(user_router)
app.include_router(complaint_router)
app.mount("/media", StaticFiles(directory="media"), name="media")
app.include_router(user_routes.router)
@app.get("/auth/open-app", response_class=HTMLResponse)
def open_mobile_app_bridge(token: str):
    """
    Bu endpoint, mailden gelen kullanıcıyı karşılar ve
    CityFlow mobil uygulamasını açması için yönlendirir.
    """
    
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
            // Sayfa yüklenir yüklenmez uygulamayı açmaya zorla
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