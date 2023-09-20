export interface User {
  email: string,
  username: string,
  total_reservations: number,
  history: UserHistoryRecord[]
}

export interface UserHistoryRecord {
  ticket_username: string,
  train: string,
  seat: number,
  final_cost: number,
  reservation_time: string,
  canceled: boolean
}
