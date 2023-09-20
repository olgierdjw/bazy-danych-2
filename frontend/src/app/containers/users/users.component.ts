import {Component} from '@angular/core';
import {TrainsService} from "../../services/trains.service";
import {Router} from "@angular/router";
import {User} from "../../models/user";

class UserHistoryRecord {
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {

  allUsers: User[] = [];

  // register
  newEmail: string = '';
  newUsername: string = '';

  public constructor(private trainsService: TrainsService, private router: Router) {
    trainsService.allUsers().subscribe(value => {
      this.allUsers = value as User[];
    })
  }

  userDetailsRedirect(user: User) {
    console.log("redirecting to user details");
    this.router.navigate(['client', user.email]);
  }

  createUserHandler() {
    this.trainsService.userRegister(this.newEmail, this.newUsername);
    this.trainsService.updateServerData();
    this.router.navigate(['trains']);
  }
}
