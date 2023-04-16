import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDirection } from '../models/direction';
import { IJob } from '../models/job';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  getAllJobs(): Observable<IJob[]> {
    return this.http.get<IJob[]>(environment.apiUrl + '/jobs');
  }

  getJobById(id: string): Observable<IJob> {
    return this.http.get<IJob>(environment.apiUrl + '/jobs/' + id);
  }

  getJobDirections(id: string): Observable<IDirection[]> {
    return this.http.get<IDirection[]>(
      environment.apiUrl + '/jobs/' + id + '/directions'
    );
  }
}
