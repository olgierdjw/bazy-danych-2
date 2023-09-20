import {Component} from '@angular/core';
import {Train} from "../../models/train.model";
import {TrainsService} from "../../services/trains.service";
import {ActivatedRoute, Router} from "@angular/router";
@Component({
  selector: 'app-train-details',
  templateUrl: './train-details.component.html',
  styleUrls: ['./train-details.component.css']
})
export class TrainDetailsComponent {
  seatDetails: number = 0;
  trainId: string = '';
  train!: Train;

  public constructor(private trainsService: TrainsService, private router: Router, private routeArgument: ActivatedRoute) {
    this.routeArgument.params.subscribe(params => {
      this.trainId = params['id'];
      this.findTrain();
    });
  }

  findTrain() {
    this.trainsService.getTrainById(this.trainId).subscribe(value => {
      this.train = value as Train;
      console.log("train parsed", value);
      console.log(this.train);
    });
  }

  exit() {
    this.router.navigate(['trains']);
  }

  calculateSum(arr: number[]): number {
    return arr.reduce((sum: number, num: number) => sum + num, 0);
  }

  dateString(timestamp: string): string {
    const date = new Date(parseInt(timestamp)*1000);
    return date.toLocaleString();
  }
}
