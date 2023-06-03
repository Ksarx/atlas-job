import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IJob } from 'src/app/models/job';
import { JobService } from 'src/app/services/job.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  jobs: IJob[] = [];

  fields: any[] = [];
  fieldsGroup = new FormGroup({});
  field = '';

  // Meta
  currentPage = 1;
  limit = 6;
  totalPages = 0;
  totalDocs = 0;

  subscription = new Subscription();

  isJobsLoading = true;
  isFieldsLoading = true;
  isLoadingMoreJobs = false;
  isSkillsLoading = true;

  skills: any[] = [];
  skillsGroup: FormGroup;
  selectAllSkills = true;
  skillQuery = '';
  skillsDropdown = false;

  search = '';

  constructor(
    private jobsService: JobService,
    private formBuilder: FormBuilder,
    private searchService: SearchService
  ) {}

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  ngOnInit(): void {
    this.getJobs();

    this.subscription.add(
      this.jobsService.getJobFields().subscribe((res: any) => {
        this.fields = [...['Все профессии'], ...res.data];
        console.log(res.data);
        this.fieldsGroup.addControl('field', new FormControl('Все профессии'));
        for (let field of this.fields) {
          this.fieldsGroup.addControl('field', new FormControl(field));
        }
        this.isFieldsLoading = false;
      })
    );

    this.subscription.add(
      this.fieldsGroup.valueChanges.subscribe((changes: any) => {
        this.isFieldsLoading = true;
        this.field = changes.field;
        this.currentPage = 1;
        this.totalDocs = 0;
        this.totalPages = 0;
        this.getJobs();
      })
    );

    this.subscription.add(
      this.jobsService.getJobSkills().subscribe((res: any) => {
        this.skills = res.data;
        const formControls = this.skills.map((skill) => new FormControl(true));
        this.skillsGroup = this.formBuilder.group({
          selectAllSkills: new FormControl(true),
          skills: new FormArray(formControls),
        });
      })
    );

    this.subscription.add(
      this.searchService.search$.subscribe((res) => {
        this.search = res;
        this.currentPage = 1;
        this.totalDocs = 0;
        this.totalPages = 0;
        this.getJobs();
      })
    );
  }

  getJobs(): void {
    this.isJobsLoading = true;
    this.subscription.add(
      this.jobsService
        .getJobs(
          this.currentPage,
          this.limit,
          this.field,
          this.skillQuery,
          this.search
        )
        .subscribe((res) => {
          this.jobs = res.data;
          if (res.meta) {
            this.totalDocs = res.meta.total_docs;
            this.totalPages = res.meta.total_pages;
          }
          this.isJobsLoading = false;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadMoreJobs(): void {
    this.currentPage++;
    this.isLoadingMoreJobs = true;
    this.subscription.add(
      this.jobsService
        .getJobs(
          this.currentPage,
          this.limit,
          this.field,
          this.skillQuery,
          this.search
        )
        .subscribe((res) => {
          this.jobs.push(...res.data);
          if (res.meta) {
            this.totalDocs = res.meta.total_docs;
            this.totalPages = res.meta.total_pages;
          }
          this.isLoadingMoreJobs = false;
        })
    );
  }

  submit() {
    const values = this.skillsGroup.get('skills')?.value;
    let buf: any[] = [];
    for (let i = 0; i < this.skills.length; i++) {
      if (values[i]) {
        buf.push(this.skills[i]);
      }
    }
    this.skillQuery = buf.join(',');
    this.currentPage = 1;
    this.totalDocs = 0;
    this.totalPages = 0;
    this.getJobs();
  }

  cancel() {
    window.location.reload();
  }
}
