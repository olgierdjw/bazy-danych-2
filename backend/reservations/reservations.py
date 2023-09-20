from datetime import datetime
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Depends
from dependencies import db, client
from reservations.schemas import Reservation
from reservations.schemas import ReservationBasic
from reservations.schemas import ReservationDb
from trains.schemas import TrainDb
from users.schemas import UserDb
from users.users import get_user, log_reservation_cancel
from statistics.statistics import new_reservation as log_new_reservation
from users.users import reservation_log as log_user_reservation

router = APIRouter(
    prefix="/reservations"
)

reservations_collection = db["reservations"]
trains_collection = db["trains"]


def user_parser(request: ReservationBasic) -> UserDb:
    user = get_user(request.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/make")
def make_reservation(request: ReservationBasic, user: UserDb = Depends(user_parser)):
    with client.start_session() as session:
        with session.start_transaction():
            train = trains_collection.find_one({"_id": ObjectId(request.train_id)}, session=session)
            if train is None:
                raise HTTPException(status_code=404, detail="Train not found")
            train: TrainDb = TrainDb.parse_obj(train)

            seat_taken: bool = train.free_seats[request.seat] == 0
            if seat_taken:
                raise HTTPException(status_code=404, detail="Seat number invalid or taken")

            reservation = Reservation(
                email=user.email,
                train_id=train.id,
                seat=request.seat,
                reservation_time=str(int(datetime.now().timestamp())),
                discount=request.discount,
                ticket_username=request.ticket_username,
                canceled=False
            )

            reservations_collection.insert_one(reservation.dict(), session=session)

            updated_seats: list[int] = train.free_seats
            updated_seats[request.seat] = 0
            trains_collection.update_one({'_id': ObjectId(train.id)}, {'$set': {'free_seats': updated_seats}},
                                         session=session)
            log_new_reservation(request.discount, user.email, train.full_price)
            final_cost = train.full_price * (request.discount / 100)
            log_user_reservation(reservation, request.ticket_username, final_cost)


@router.get("/details")
def seat_details(train_id: str, seat_id: int):
    db_reservation = reservations_collection.find_one({"train_id": train_id, "seat": seat_id})
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="No reservation(s) found")
    reservation = ReservationDb.parse_obj(db_reservation)
    return reservation


@router.get("/delete")
def reservation_delete(email_to_change_log: str, train_id: str, seat_id: int):
    train: dict = trains_collection.find_one({"_id": ObjectId(train_id)})
    train: TrainDb = TrainDb.parse_obj(train)

    # zaznaczenie zwolneiniea miejsca
    updated_seats: list[int] = train.free_seats
    updated_seats[seat_id] = 1

    reservations_collection.delete_one({"train_id": train_id, "seat": seat_id})
    trains_collection.update_one({'_id': ObjectId(train_id)}, {'$set': {'free_seats': updated_seats}})
    log_reservation_cancel(email_to_change_log, train_id, seat_id)
    # log_global_stats_delete_reservation()
