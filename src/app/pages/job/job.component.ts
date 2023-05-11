import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { IJob } from 'src/app/models/job';
import { ActivatedRoute, Params } from '@angular/router';
import { IDirection } from 'src/app/models/direction';
import { DirectionService } from 'src/app/services/direction.service';
import { Subscription } from 'rxjs';
import { JobService } from 'src/app/services/job.service';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
})
export class JobComponent implements OnInit, OnDestroy {
  job: IJob;
  directions: IDirection[];
  isOpenDirections = false;

  subscription = new Subscription();

  currentPage = 1;
  limit = 5;
  totalDocs = 0;
  totalPages = 0;

  searchField = '';
  filterMetadata = { count: 0 };

  isLoadingJobInfo = false;
  isLoadingDirs = false;
  isLoadingMore = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private directionsSerivce: DirectionService,
    private jobsService: JobService,
    private filterService: FilterService
  ) {}

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  goBack() {
    this.filterService.changeSearch('');
    this.location.back();
  }

  openDirections() {
    this.isOpenDirections = !this.isOpenDirections;
  }

  ngOnInit(): void {
    this.isLoadingJobInfo = true;
    this.isLoadingDirs = true;
    this.filterService.changeSearch('');

    this.route.params.subscribe((params: Params) => {
      this.subscription.add(
        this.jobsService.getJobById(params['id']).subscribe((job: IJob) => {
          this.job = job;
          this.isLoadingJobInfo = false;
        })
      );
      this.subscription.add(
        this.directionsSerivce
          .getJobDirections(params['id'], this.currentPage, this.limit)
          .subscribe((res) => {
            this.directions = res.items;
            this.totalDocs = res.meta.totalDocs;
            this.totalPages = res.meta.totalPages;
            this.isLoadingDirs = false;
          })
      );

      this.subscription.add(
        this.directionsSerivce
          .getAllJobDirections(params['id'])
          .subscribe((res) => {
            this.filterService.changeData(res);
          })
      );
      this.subscription.add(
        this.filterService.currentSearch.subscribe((search) => {
          this.searchField = search;
        })
      );
    });
  }

  loadMore(): void {
    this.currentPage++;
    this.isLoadingMore = true;
    this.subscription.add(
      this.directionsSerivce
        .getJobDirections(this.job.id.toString(), this.currentPage, this.limit)
        .subscribe((res) => {
          this.directions = [...this.directions, ...res.items];
          this.totalDocs = res.meta.totalDocs;
          this.totalPages = res.meta.totalPages;
          this.isLoadingMore = false;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
