import sys

import pymongo
from bson import ObjectId
from pydantic import BaseModel, Field, validator
from pymongo import MongoClient, errors

try:
    client = MongoClient("")
    client.list_database_names()  # check connection
    db = client["main-database"]
except Exception as e:
    print("MongoClient not configured:", e)
    sys.exit(1)


class FromMongoDB(BaseModel):
    id: str = Field(alias='_id')

    @validator('id', pre=True)
    def parse_objectid(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value
