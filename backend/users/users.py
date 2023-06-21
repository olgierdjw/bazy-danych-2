from typing import Optional
from fastapi import APIRouter, HTTPException
from dependencies import db
from reservations.schemas import Reservation
from users.schemas import *

router = APIRouter(
    prefix="/users"
)
users_collection = db["users"]


def get_user(email: str) -> Optional[UserDb]:
    user = users_collection.find_one({"email": email})
    print("email", email)
    if user is None:
        return None
    return UserDb.parse_obj(user)


def reservation_log(reservation: Reservation, ticket_username: str, final_cost: float):
    user = get_user(reservation.email)
    history_record = {
        "ticket_username": ticket_username,
        "train": reservation.train_id,
        "seat": reservation.seat,
        "final_cost": final_cost,
        "reservation_time": reservation.reservation_time,
        "canceled": reservation.canceled
    }
    if user is not None:
        users_collection.update_one({"email": user.email}, {"$push": {"history": history_record}})
        print("History record added successfully.")
    else:
        print("User not found.")


def log_reservation_cancel(email: str, train_id: str, seat_id: int):
    print(f"set user {email} history of seat {seat_id} in train {train_id} to false")
    user = users_collection.find_one({"email": email})

    if user:
        for reservation in user["history"]:
            if reservation["train"] == train_id and reservation["seat"] == seat_id:
                reservation["canceled"] = True
                break
        users_collection.update_one({"_id": user["_id"]}, {"$set": {"history": user["history"]}})
        print("Reservation canceled successfully.")
    else:
        print("User not found.")


@router.get("/")
def users_list() -> list:
    return list(users_collection.find({}))


@router.get("/details")
def users_list(email: str) -> dict:
    user: dict = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.post("/register")
def user_register(new_user: UserRegister) -> None:
    if get_user(new_user.email):
        raise HTTPException(status_code=404, detail="User already exists.")
    new_user = UserServer(**new_user.dict(), total_reservations=0)
    users_collection.insert_one(new_user.dict())
