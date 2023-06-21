import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TrainsService} from "../../services/trains.service";

@Component({
  selector: 'email-list',
  template: `
      <div id="email-list-component">
          <div id="title">
              <h3>Wybierz klienta</h3>
          </div>

          <div id="list">

              <div class="user" *ngFor="let user of availableEmails"
                   (click)="pickEmail(user[0])"
                   [ngClass]="{'current-pick': user[0] === currentEmail}">
                  <div class="email">          {{user[0]}}       </div>
                  <div class="cnt">          {{user[1]}}        </div>
              </div>

          </div>
      </div>

  `,
  styleUrls: ['./email-list.component.css']
})
export class EmailListComponent {
  @Output() emailPick = new EventEmitter<string>();
  @Output() usernamePick = new EventEmitter<string>();

  @Input() currentEmail: string = '';

  availableEmails: [string, number][] = [];

  constructor(usersEmailsService: TrainsService) {
    usersEmailsService.allUsers().subscribe(users => {
      let tmp: Map<string, number> = new Map<string, number>();
      users.map(user => tmp.set(user.email, user.total_reservations));
      this.availableEmails = Array.from(tmp).sort((a, b) => b[1] - a[1]);
    });
  }

  pickEmail(email: string) {
    this.emailPick.emit(email);
  }
}
