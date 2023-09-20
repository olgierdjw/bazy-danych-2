import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, map, Observable, throwError} from "rxjs";
import {Train} from "../models/train.model";
import {User} from "../models/user";
import {Stats} from "../models/stats";
import {catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TrainsService {
  private trainsUrl = 'http://127.0.0.1:8000/trains';
  private trains$ = new BehaviorSubject<Train[]>([]);
  private usersUrl = 'http://127.0.0.1:8000/users';
  private users$ = new BehaviorSubject<User[]>([]);
  private statsUsr = 'http://127.0.0.1:8000/statistics';
  private stats$ = new BehaviorSubject<Stats>({
    adult_tickets: 0,
    total_reservations: 0,
    last_reservation_time: "",
    revenue: 0,
    student_tickets: 1
  });


  constructor(private httpClient: HttpClient) {
    this.updateServerData();
  }


  allTrains(): Observable<Train[]> {
    return this.trains$.asObservable();
  }

  allUsers(): Observable<User[]> {
    return this.users$.asObservable();
  }

  getStats(): Observable<Stats> {
    return this.stats$.asObservable();
  }

  getTrainById(trainId: string): Observable<Train | undefined> {
    console.log("getTrainById with argument", trainId);
    return this.allTrains().pipe(
      map((trains: Train[]) => trains.find(train => train._id === trainId))
    );
  }

  reservationDetails(trainId: string, seatId: number) {
    const url = `http://127.0.0.1:8000/reservations/details?train_id=${trainId}&seat_id=${seatId}`;
    return this.httpClient.get(url);
  }

  reservationDelete(email: string, trainId: string, seatId: number) {
    const url = `http://127.0.0.1:8000/reservations/delete?train_id=${trainId}&seat_id=${seatId}&email_to_change_log=${email}`;
    this.httpClient.get(url).subscribe(value => {
      console.log(value);
      this.updateServerData();
    });
    console.log("DELETE", trainId, seatId);
  }

  buyTicket(train_id: string, seat_id: number, email: string, discount: number, ticket_username: string) {
    const url = 'http://127.0.0.1:8000/reservations/make';
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json');

    const body = {
      email: email,
      train_id: train_id,
      seat: seat_id,
      discount: discount,
      ticket_username: ticket_username

    };
    console.log("buy ticket request data:", body);

    this.httpClient.post(url, body, {headers})
      .subscribe(response => {
        console.log(response);
      });
  }

  userDetails(email: string): Observable<any> {
    const url = `http://127.0.0.1:8000/users/details?email=${encodeURIComponent(email)}`;
    return this.httpClient.get(url)
      .pipe(
        catchError(error => {
          // Handle any error that occurred during the HTTP request
          console.error('Error:', error);
          return throwError(error);
        })
      );
  }

  userRegister(email: string, username: string) {
    let url = 'http://127.0.0.1:8000/users/register';
    const headers = new HttpHeaders()
      .set('accept', 'application/json')
      .set('Content-Type', 'application/json');

    const body = {
      email: email,
      username: username
    };
    console.log("create new user:", body);

    this.httpClient.post(url, body, {headers})
      .subscribe(response => {
        console.log(response);
      });
  }

  public updateServerData() {
    this.httpClient.get<Train[]>(this.trainsUrl).pipe(
      map((trains: Train[]) => {
        return trains;
      })
    ).subscribe(
      (trains: Train[]) => {
        this.trains$.next(trains);
        console.log("trains data updated");
      },
      (error: any) => {
        console.error(error);
      }
    );

    this.httpClient.get<User[]>(this.usersUrl).pipe(
      map((users: User[]) => {
        return users;
      })
    ).subscribe(
      (users: User[]) => {
        this.users$.next(users);
        console.log("users data updated");
      },
      (error: any) => {
        console.error(error);
      }
    );

    this.httpClient.get<Stats>(this.statsUsr).pipe(
      map((s: Stats) => {
        return s;
      })
    ).subscribe(
      (newStats: Stats) => {
        this.stats$.next(newStats);
        console.log("stats data updated");
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

}
