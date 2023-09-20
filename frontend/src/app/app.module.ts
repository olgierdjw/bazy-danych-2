import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AvailableTrainsComponent } from './containers/available-trains/available-trains.component';
import {HttpClientModule} from "@angular/common/http";
import { TrainDetailsComponent } from './containers/train-details/train-details.component';
import { SeatDetailsComponent } from './components/seat-details/seat-details.component';
import {FormsModule} from "@angular/forms";
import {DashboardComponent} from "./home/feature-smart/dashboard/dashboard.component";


import { RouterModule, Routes } from '@angular/router';
import { EmailListComponent } from './components/email-list/email-list.component';
import { UsersComponent } from './containers/users/users.component';
import { UserDetailsComponent } from './containers/user-details/user-details.component';
import { CompanyRevenueComponent } from './containers/company-revenue/company-revenue.component';
const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'trains', component: AvailableTrainsComponent },
  { path: 'train/:id', component: TrainDetailsComponent },
  { path: 'clients', component: UsersComponent },
  { path: 'client/:email', component: UserDetailsComponent },
  { path: 'books', component: CompanyRevenueComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
]
@NgModule({
  declarations: [
    AppComponent,
    AvailableTrainsComponent,
    TrainDetailsComponent,
    SeatDetailsComponent,
    EmailListComponent,
    EmailListComponent,
    UsersComponent,
    UserDetailsComponent,
    CompanyRevenueComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    DashboardComponent,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
