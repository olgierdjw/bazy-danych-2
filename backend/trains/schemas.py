from dependencies import FromMongoDB


class TrainDb(FromMongoDB):
    name: str
    free_seats: list[int]
    full_price: int
    departure_time: str
