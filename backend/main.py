import uvicorn
from bson.objectid import ObjectId
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic.json import ENCODERS_BY_TYPE

from dependencies import db, client
from reservations import reservations
from trains import trains
from users import users
from statistics import statistics


def encode_object_id(obj_id: ObjectId):
    return str(obj_id)


ENCODERS_BY_TYPE[ObjectId] = encode_object_id
app = FastAPI()
app.include_router(trains.router)
app.include_router(reservations.router)
app.include_router(users.router)
app.include_router(statistics.router)

# Configure CORS middleware
origins = [
    "http://localhost",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trains_collection = db["trains"]
test_collection = db["test"]


@app.on_event("startup")
async def startup_event():
    trains_count = trains_collection.count_documents({})
    if trains_count == 0:
        trains.add_example_trains(20)
        statistics.reset_statistics()


@app.on_event("shutdown")
def shutdown_event():
    client.close()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
