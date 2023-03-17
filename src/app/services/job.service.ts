import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_API_URL } from 'src/common/constants';
import { IDirection } from '../models/direction';
import { IJob } from '../models/job';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  constructor(private http: HttpClient) {}

  getAllJobs(): Observable<IJob[]> {
    return this.http.get<IJob[]>(BASE_API_URL + '/jobs');
  }

  getJobById(id: string): Observable<IJob> {
    return this.http.get<IJob>(BASE_API_URL + '/jobs/' + id);
  }

  getJobDirections(id: string): Observable<IDirection[]> {
    return this.http.get<IDirection[]>(
      BASE_API_URL + '/jobs/' + id + '/directions'
    );
  }
}
