from typing import Optional
from random import randrange
import datetime
from fastapi import APIRouter
from dependencies import db

router = APIRouter(
    prefix="/trains"
)
trains_collection = db["trains"]


def random_departure_time(days: int) -> str:
    today = datetime.datetime.now()
    new_date = today + datetime.timedelta(days=days)
    new_timestamp = int(new_date.timestamp())
    return str(new_timestamp)


def add_example_trains(seats_num: int, trains_names: Optional[list[str]] = None):
    if trains_names is None:
        trains_names = ['Wawel', 'Mehoffer', 'Malczewski', "Łokietek"]
    new_trains = []
    for name in trains_names:
        full_price = randrange(20) + 39
        departure_day = randrange(5)
        departure_time = random_departure_time(departure_day)
        new_trains.append({'name': name, 'free_seats': [1 for _ in range(seats_num)], 'full_price': full_price,
                           "departure_time": departure_time})
    trains_collection.insert_many(new_trains)


@router.get("/")
def list_trains():
    return list(trains_collection.find({}))
