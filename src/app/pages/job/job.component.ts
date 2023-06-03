import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IJob } from 'src/app/models/job';
import { ActivatedRoute, Params } from '@angular/router';
import { IDirection } from 'src/app/models/direction';
import { DirectionService } from 'src/app/services/direction.service';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit, OnDestroy {
  job: IJob;
  jobId: number;

  directions: IDirection[];

  currentPage = 1;
  limit = 5;
  totalDocs = 0;
  totalPages = 0;

  searchField = '';

  isJobLoading = true;
  isDirectionsLoading = true;
  isMoreDirectionsLoading = false;

  subscription = new Subscription();

  faculties: any[] = [];
  facultiesGroup: FormGroup;
  selectAllFaculties = true;
  facultiesQuery = '';
  facultiesDropdown = false;

  search = '';

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private directionsService: DirectionService,
    private jobsService: JobService,
    private formBuilder: FormBuilder,
    private searchService: SearchService
  ) {}

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.jobId = parseInt(params['id']);
      this.getDirections();

      this.jobsService.getJobById(this.jobId).subscribe((res) => {
        this.job = res.data;
        this.isJobLoading = false;
      });
    });

    this.subscription.add(
      this.directionsService.getDirectionFaculties().subscribe((res: any) => {
        this.faculties = res.data;
        const formControls = this.faculties.map(
          (faculty) => new FormControl(true)
        );
        this.facultiesGroup = this.formBuilder.group({
          selectAllFaculties: new FormControl(true),
          faculties: new FormArray(formControls),
        });
      })
    );

    this.subscription.add(
      this.searchService.search$.subscribe((res) => {
        this.search = res;
        this.currentPage = 1;
        this.totalDocs = 0;
        this.totalPages = 0;
        this.getDirections();
      })
    );
  }

  loadMoreDirections(): void {
    this.currentPage++;
    this.isMoreDirectionsLoading = true;
    this.subscription.add(
      this.directionsService
        .getJobDirections(
          this.jobId,
          this.currentPage,
          this.limit,
          this.facultiesQuery,
          this.search
        )
        .subscribe((res) => {
          this.directions.push(...res.data);
          if (res.meta) {
            this.totalDocs = res.meta.total_docs ? res.meta.total_docs : 0;
            this.totalPages = res.meta.total_pages;
          }
          this.isDirectionsLoading = false;
        })
    );
  }

  getDirections(): void {
    this.isDirectionsLoading = true;
    this.subscription.add(
      this.directionsService
        .getJobDirections(
          this.jobId,
          this.currentPage,
          this.limit,
          this.facultiesQuery,
          this.search
        )
        .subscribe((res) => {
          this.directions = res.data;
          if (res.meta) {
            this.totalDocs = res.meta.total_docs ? res.meta.total_docs : 0;
            this.totalPages = res.meta.total_pages;
          }
          this.isDirectionsLoading = false;
        })
    );
  }

  submit() {
    let values = this.facultiesGroup.get('faculties')?.value;
    let buf: any[] = [];
    for (let i = 0; i < this.faculties.length; i++) {
      if (values[i]) {
        buf.push(this.faculties[i]);
      }
    }
    this.facultiesQuery = buf.join(',');
    this.currentPage = 1;
    this.totalDocs = 0;
    this.totalPages = 0;

    this.getDirections();
  }

  cancel() {
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
