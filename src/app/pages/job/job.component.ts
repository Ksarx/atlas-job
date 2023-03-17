import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IJob } from 'src/app/models/job';
import { ActivatedRoute, Params } from '@angular/router';
import { JobService } from 'src/app/services/job.service';
import { IDirection } from 'src/app/models/direction';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit {
  job: IJob;
  directions: IDirection[];
  isOpenDirections = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private jobsSerivce: JobService
  ) {}

  goBack() {
    this.location.back();
  }

  openDirections() {
    this.isOpenDirections = !this.isOpenDirections;
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.jobsSerivce.getJobById(params['id']).subscribe((job: IJob) => {
        this.job = job;
      });
      this.jobsSerivce
        .getJobDirections(params['id'])
        .subscribe((dirs: IDirection[]) => {
          this.directions = dirs;
        });
    });
  }
}
