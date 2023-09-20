from datetime import datetime
from fastapi import APIRouter
from dependencies import db

router = APIRouter(
    prefix="/statistics"
)

stats_collection = db["statistics"]
reservations_collection = db["reservations"]
trains_collection = db["trains"]


@router.get("/")
def stats() -> dict:
    return stats_collection.find_one({})


def reset_statistics():
    empty_stats = {"adult_tickets": 0, "student_tickets": 0, "total_reservations": 0, "revenue": 0,
                   "last_reservation_time": "TBA"}
    stats_collection.delete_many({})
    stats_collection.insert_one(empty_stats)


def new_reservation(discount: int, email: str, full_price: float):
    adult_price = discount == 100
    if adult_price:
        stats_collection.update_one({}, {"$inc": {"adult_tickets": 1}}, upsert=True)
    else:
        stats_collection.update_one({}, {"$inc": {"student_tickets": 1}}, upsert=True)

    last_reservation_time = datetime.now()
    old_stats = stats_collection.find_one()
    print(old_stats, "old stats")
    stats_collection.update_one({}, {"$set": {"last_reservation_time": last_reservation_time}}, upsert=True)
    stats_collection.update_one({}, {"$inc": {"total_reservations": 1}}, upsert=True)
    stats_collection.update_one({}, {"$inc": {"revenue": full_price * (discount / 100)}}, upsert=True)
    db["users"].update_one({"email": email}, {"$inc": {"total_reservations": 1}}, upsert=True)


def delete_reservation(adult_price: bool, value: float):
    if adult_price:
        stats_collection.update_one({}, {"$dec": {"adult_tickets": 1}}, upsert=True)
    else:
        stats_collection.update_one({}, {"$dec": {"student_tickets": 1}}, upsert=True)

    stats_collection.update_one({}, {"$dec": {"revenue": value}}, upsert=True)
