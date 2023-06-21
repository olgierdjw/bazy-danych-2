import {Component} from '@angular/core';
import {TrainsService} from "../../services/trains.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserHistoryRecord} from "../../models/user";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent {
  userEmail: string = '';
  userProfile?: User;

  public constructor(private trainsService: TrainsService, private router: Router, private routeArgument: ActivatedRoute) {
    this.routeArgument.params.subscribe(params => {
      this.userEmail = params['email'];
      this.loadFullUserProfile();
    });
  }

  loadFullUserProfile() {
    this.trainsService.userDetails(this.userEmail).subscribe(value =>
      this.userProfile = value as User);
  }

  totalValue(allUserTickets: UserHistoryRecord[]) {
    let sum = 0;
    // iterate and sum total_price field
    for (let i = 0; i < allUserTickets.length; i++) {
      if (allUserTickets[i].canceled)
        continue;
      sum += allUserTickets[i].final_cost;
    }
    return sum;
  }

  deleteReservationButtonHandler(trainId: string, seat: number) {
    this.trainsService.reservationDelete(this.userProfile!.email, trainId, seat);
  }
}
