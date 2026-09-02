import os
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import AnyHttpUrl, BaseModel, Field

from server.pdf.exporter import render_pdf


class PdfRequest(BaseModel):
    resume: dict[str, Any]
    frontendUrl: AnyHttpUrl = Field(alias="frontendUrl")


app = FastAPI(title="简册 PDF Service", version="1.0.0")
origins = [origin.strip() for origin in os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",") if origin.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=False, allow_methods=["POST", "GET"], allow_headers=["Content-Type"])


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/pdf")
async def create_pdf(request: PdfRequest) -> Response:
    frontend_url = str(request.frontendUrl).rstrip("/")
    if origins and frontend_url not in origins:
        raise HTTPException(status_code=400, detail="不允许的前端渲染地址")
    if request.resume.get("version") != 1:
        raise HTTPException(status_code=422, detail="不支持的 Resume Schema 版本")
    pdf = await render_pdf(frontend_url, request.resume)
    return Response(content=pdf, media_type="application/pdf", headers={"Content-Disposition": 'attachment; filename="resume.pdf"'})
