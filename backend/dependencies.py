from bson import ObjectId
from pydantic import BaseModel, Field, validator
from pymongo import MongoClient

client = MongoClient("mongodb+srv://user-1:xvazAyxo53QjNRdx@cluster0.hvrxxdq.mongodb.net/?retryWrites=true&w=majority")
db = client["main-database"]


class FromMongoDB(BaseModel):
    id: str = Field(alias='_id')

    @validator('id', pre=True)
    def parse_objectid(cls, value):
        if isinstance(value, ObjectId):
            return str(value)
        return value
