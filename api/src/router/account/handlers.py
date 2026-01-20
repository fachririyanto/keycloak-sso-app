from fastapi import HTTPException, status, Request

from lib.keycloak import keycloak_admin, keycloak_openid

from .models import (
    UpdateProfileRequest,
    ChangePasswordRequest,
)


async def get_profile_me_handler(
        request: Request,
        payload: dict,
    ):
    try:
        user_id = payload["sub"]
        user = keycloak_admin.get_user(user_id=user_id)

        return {
            "data": user,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


async def update_profile_handler(
        request: Request,
        params: UpdateProfileRequest,
        payload: dict,
    ):
    try:
        if params.first_name is None:
            raise ValueError("First name is required")
        if params.last_name is None:
            raise ValueError("Last name is required")

        user_id = payload["sub"]

        await keycloak_admin.a_update_user(
            user_id=user_id,
            payload={
                "firstName": params.first_name,
                "lastName": params.last_name,
            },
        )

        return {
            "message": "Profile updated successfully",
        }
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


async def change_password_handler(
        request: Request,
        params: ChangePasswordRequest,
        payload: dict,
    ):
    try:
        if params.old_password is None:
            raise ValueError("Old password is required")
        if params.new_password is None:
            raise ValueError("New password is required")
        if params.confirm_password is None:
            raise ValueError("Confirm password is required")
        if params.new_password != params.confirm_password:
            raise ValueError("New password and confirm password do not match")

        # Verify current password
        try:
            keycloak_openid.token(
                username=payload["preferred_username"],
                password=params.old_password,
            )
        except:
            raise ValueError("Old password is incorrect")

        user_id = payload["sub"]

        await keycloak_admin.a_set_user_password(
            user_id=user_id,
            password=params.new_password,
            temporary=False,
        )

        return {
            "message": "Password changed successfully",
        }
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
