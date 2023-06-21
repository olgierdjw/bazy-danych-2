import { Component } from '@angular/core';
import {Train} from "./models/train.model";
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'train-system';

  constructor(private router: Router) {}

  isNotHomePage(): boolean {
    return this.router.url !== '/dashboard';
  }

}
