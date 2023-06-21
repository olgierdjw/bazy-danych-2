import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Train} from "../../../models/train.model";

@Component({
  selector: 'app-dashboard-train-capacity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-train-capacity.component.html',
  styleUrls: ['./dashboard-train-capacity.component.css']
})
export class DashboardTrainCapacityComponent {
  @Input() trains!: Train[]

  capacity(train: Train) {
    let totalCapacity = train.free_seats.length;
    let seatsTaken = train.free_seats.filter((v) => v === 1).length;
    return seatsTaken/totalCapacity;
  }
}
