from fastapi import FastAPI, APIRouter

from .account.routes import account_router


# Global app routers variable
app_routers = [
    account_router,
]


def register_router(router: APIRouter):
    """Append new router into global app routers"""
    global app_routers
    app_routers.append(router)


def load_routers(app: FastAPI):
    """Load all registered routers"""
    global app_routers

    for route in app_routers:
        app.include_router(router=route)

    return app