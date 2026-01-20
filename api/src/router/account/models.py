from pydantic import BaseModel


class UpdateProfileRequest(BaseModel):
    first_name: str
    last_name: str


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
    confirm_password: str
