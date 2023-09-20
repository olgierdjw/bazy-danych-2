import {Component} from '@angular/core';
import {TrainsService} from "../../services/trains.service";
import {Train} from "../../models/train.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-available-trains',
  templateUrl: './available-trains.component.html',
  styleUrls: ['./available-trains.component.css']
})
export class AvailableTrainsComponent {
  trains: Train[] = [];

  public constructor(private trainsService: TrainsService, private router: Router) {
    trainsService.allTrains().subscribe(value => {
      console.log(value)
      // @ts-ignore
      this.trains = value.map(t => t as Train);
    });
  }

  totalValue(seatDetail: number[]) {
    let sum = 0;
    // iterate and sum total_price field
    for (let i = 0; i < seatDetail.length; i++) {
      if (seatDetail[i] == 0)
        continue;
      sum += 1;
    }
    return sum;
  }

  dateString(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    const options: Intl.DateTimeFormatOptions = {dateStyle: 'medium'};
    const timeString = `${date.getHours()}:${date.getMinutes()}`;
    return `${date.toLocaleDateString(undefined, options)} ${timeString}`;
  }

  seeTrainDetails(train: Train) {
    console.log("redirecting to train details");
    let trainId = train._id;
    this.router.navigate(['train', trainId]);
  }

}
