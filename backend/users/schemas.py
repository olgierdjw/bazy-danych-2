from pydantic import BaseModel, EmailStr
from dependencies import FromMongoDB


class UserRegister(BaseModel):
    email: EmailStr
    username: str


class UserServer(UserRegister):
    total_reservations: int


class UserDb(UserServer, FromMongoDB):
    pass
