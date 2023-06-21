from pydantic import BaseModel, EmailStr

from dependencies import FromMongoDB


class ReservationBasic(BaseModel):
    email: EmailStr
    ticket_username: str
    train_id: str
    seat: int
    discount: int


class Reservation(ReservationBasic):
    reservation_time: str
    canceled: bool


class ReservationDb(FromMongoDB, Reservation):
    # Can read MongoDb ObjectID type as string
    pass
