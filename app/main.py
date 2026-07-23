from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import os

from app.db import init_db
from app.routers import onboarding, config, chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(title="WhatsBiz IL", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(onboarding.router)
app.include_router(config.router)
app.include_router(chat.router)

STATIC_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")

app.mount("/static", StaticFiles(directory=STATIC_DIR, check_dir=False), name="static")


@app.get("/health")
async def health():
    from app.config import DEMO_MODE
    return {"status": "ok", "demo_mode": DEMO_MODE}


@app.get("/")
async def root():
    return FileResponse(os.path.join(TEMPLATES_DIR, "index.html"))


@app.get("/onboarding")
async def onboarding_page():
    return FileResponse(os.path.join(TEMPLATES_DIR, "onboarding.html"))


@app.get("/dashboard")
async def dashboard_page():
    return FileResponse(os.path.join(TEMPLATES_DIR, "dashboard.html"))
