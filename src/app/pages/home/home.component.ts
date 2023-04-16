import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IFilter } from 'src/app/models/filter';
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

  isLoading = true;

  citiesForm: FormGroup;
  cities: IFilter[] = [
    { id: 1, name: 'Peru' },
    { id: 2, name: 'Bolivia' },
    { id: 3, name: 'Ecuador' },
    { id: 4, name: 'Colombia' },
    { id: 5, name: 'Panama' },
    { id: 6, name: 'Dominicana' },
    { id: 7, name: 'Mexico' },
  ];

  constructor(
    private jobsService: JobService,
    private formBuilder: FormBuilder
  ) {}

  openSkills() {
    this.isOpenSkills = !this.isOpenSkills;
  }

  openDirections() {
    this.isOpenDirections = !this.isOpenDirections;
  }

  ngOnInit(): void {
    this.jobsService.getAllJobs().subscribe((jobs) => {
      this.jobs = jobs;
      this.isLoading = false;
    });
    this.citiesForm = this.formBuilder.group({
      selectedCitiesIds: [],
    });
  }
}
