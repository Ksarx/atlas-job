import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { DirectionService } from 'src/app/services/direction.service';
import { JobService } from 'src/app/services/job.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  searchText = '';
  data: any[] = [];
  isJobDetailsPage = false;
  jobId: number;
  focus = false;

  constructor(
    private router: Router,
    private jobsService: JobService,
    private directionsService: DirectionService,
    private searchService: SearchService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.data = [];
        const currentPath = event.urlAfterRedirects;
        this.isJobDetailsPage = currentPath.includes('/jobs/');
        if (this.isJobDetailsPage) {
          const parts = currentPath.split('/');
          this.jobId = parts[2];
        } else {
          this.isJobDetailsPage = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchTextChange() {
    if (this.isJobDetailsPage) {
      this.getDirectionNames(this.jobId);
    } else {
      this.getJobNames();
    }
  }

  getJobNames() {
    this.subscription.add(
      this.jobsService.getJobNames(this.searchText).subscribe((res) => {
        this.data = res.data;
      })
    );
  }

  getDirectionNames(jobId: number) {
    this.subscription.add(
      this.directionsService
        .getDirectionNames(jobId, this.searchText)
        .subscribe((res) => {
          this.data = res.data;
        })
    );
  }

  clearSearch() {
    this.focus = false;
    this.searchText = '';
    this.searchService.setSearch(this.searchText);
  }

  search(name = '') {
    if (name != '') {
      this.focus = false;
      this.searchService.setSearch(name);
    } else {
      this.focus = false;
      this.searchService.setSearch(this.searchText);
    }
  }

  goToHome() {
    this.searchText = '';
    this.searchService.setSearch(this.searchText);
    this.router.navigate(['/']);
  }
}
