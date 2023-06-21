import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  DashboardTrainCapacityComponent
} from "../../ui-dumb/dashboard-train-capacity/dashboard-train-capacity.component";
import {TrainsService} from "../../../services/trains.service";
import {RouterLink} from "@angular/router";
import {Stats} from "../../../models/stats";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DashboardTrainCapacityComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  statistics: Stats = {
    adult_tickets: 0,
    total_reservations: 0,
    last_reservation_time: "",
    revenue: 0,
    student_tickets: 1
  };

  constructor(private trainsService: TrainsService) {
    trainsService.getStats().subscribe(value => {
      this.statistics = value as Stats;
      console.log("statistics to print", this.statistics);
    });
  }
}
