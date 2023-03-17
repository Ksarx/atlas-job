import { Component, Input, OnInit } from '@angular/core';
import { IJob } from 'src/app/models/job';
import { JobService } from 'src/app/services/job.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  jobs: IJob[] = [];

  isOpenSkills = false;
  isOpenDirections = false;

  constructor(private jobsService: JobService) {}

  openSkills() {
    this.isOpenSkills = !this.isOpenSkills;
  }

  openDirections() {
    this.isOpenDirections = !this.isOpenDirections;
  }

  ngOnInit(): void {
    this.jobsService.getAllJobs().subscribe((jobs) => {
      this.jobs = jobs;
    });
  }
}
