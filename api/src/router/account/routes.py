from fastapi import APIRouter, Depends, Request

from src.dependencies.keycloak import verify_keycloak_token

from .handlers import (
    get_profile_me_handler,
    update_profile_handler,
    change_password_handler,
)

from .models import (
    UpdateProfileRequest,
    ChangePasswordRequest,
)


account_router = APIRouter(
    prefix="/account",
    tags=["Account"],
)

@account_router.get("/me")
async def route_me(
        request: Request,
        payload: dict = Depends(verify_keycloak_token),
    ):
    return {
        "data": payload,
    }

@account_router.get("/profile")
async def route_profile(
        request: Request,
        payload: dict = Depends(verify_keycloak_token),
    ):
    return await get_profile_me_handler(
        request=request,
        payload=payload,
    )

@account_router.post("/update-profile")
async def route_update_profile(
        request: Request,
        params: UpdateProfileRequest,
        payload: dict = Depends(verify_keycloak_token),
    ):
    return await update_profile_handler(
        request=request,
        params=params,
        payload=payload,
    )

@account_router.post("/change-password")
async def route_change_password(
        request: Request,
        params: ChangePasswordRequest,
        payload: dict = Depends(verify_keycloak_token),
    ):
    return await change_password_handler(
        request=request,
        params=params,
        payload=payload,
    )
