import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Train} from "../../models/train.model";
import {TrainsService} from "../../services/trains.service";
import {Reservation} from "../../models/reservation.model";

@Component({
  selector: 'app-seat-details',
  templateUrl: './seat-details.component.html',
  styleUrls: ['./seat-details.component.css']
})
export class SeatDetailsComponent implements OnChanges {
  @Input() train!: Train;
  @Input() seat_id!: number;
  free?: number;

  reservationDetails?: Reservation;

  // new new reservation data
  userFullName: string = "";
  userEmail: string = "";

  // set 3
  canStep3: boolean = false;

  @Output() closeComponentEVent = new EventEmitter<boolean>();

  public constructor(private trainsService: TrainsService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('train' in changes || 'seat_id' in changes) {
      this.free = this.train.free_seats[this.seat_id];
      if (!this.free) {
        this.trainsService.reservationDetails(this.train._id, this.seat_id)
          .subscribe(value => {
            console.log("RESERVATION-DETAILS")
            console.log(value)
            this.reservationDetails = value as Reservation;
          });
      }
    }
  }

  async makeReservation(train_id: string, seat_id: number, email: string, discount: number) {
    this.trainsService.buyTicket(train_id, seat_id, email, discount, this.userFullName);
    this.userFullName = "";
    this.userEmail = "";
    await new Promise(f => setTimeout(f, 1500));
    this.trainsService.updateServerData();
  }

  async deleteReservation(email: string) {
    this.trainsService.reservationDelete(email, this.train._id, this.seat_id);
    await new Promise(f => setTimeout(f, 1500));
    this.trainsService.updateServerData();
  }

  showWindows() {
    this.canStep3 = this.userEmail.length > 1 && this.userFullName.length > 1;
  }

  newEmail(newEmail: string) {
    this.userEmail = newEmail;
    console.log("pick:", newEmail);
    this.showWindows();
  }

  closeButtonHandler() {
    this.closeComponentEVent.emit(true);
  }

  dateString(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleString();
  }
}
