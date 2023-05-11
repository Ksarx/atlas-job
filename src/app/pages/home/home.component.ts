import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Fields } from 'src/app/constants/fields';
import { Skills } from 'src/app/constants/skills';
import { IFilter } from 'src/app/models/filter';
import { IJob } from 'src/app/models/job';
import { FilterService } from 'src/app/services/filter.service';
import { JobService } from 'src/app/services/job.service';

interface Option {
  label: string;
  value: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  jobs: IJob[] = [];
  allJobs: IJob[] = [];

  fieldForm: FormGroup;
  fields = Fields;
  field = 'Все профессии';

  currentPage = 1;
  limit = 5;
  totalDocs = 0;
  totalPages = 0;

  subscription = new Subscription();

  searchField = '';
  filterMetadata = { count: 0 };

  isLoading = false;
  isLoadingMore = false;

  showDropdown = false;
  filter = false;
  skillForm: FormGroup;
  skillOptions = Skills;

  constructor(
    private jobsService: JobService,
    private filterService: FilterService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const formControls = this.skillOptions.map(
      (control) => new FormControl(false)
    );
    const selectAllControl = new FormControl(false);

    this.skillForm = this.fb.group({
      skillOptions: new FormArray(formControls),
      selectAll: selectAllControl,
    });
  }

  getControls() {
    return (this.skillForm.get('skillOptions') as FormArray).controls;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  ngOnInit(): void {
    this.isLoading = true;
    // Создаем фильтр по областям
    this.fieldForm = new FormGroup({});
    let firstChecked = false;
    for (let _ of this.fields) {
      !firstChecked
        ? this.fieldForm.addControl('field', new FormControl(_.value))
        : this.fieldForm.addControl('field', new FormControl());
      firstChecked = true;
    }

    // Создаем чекбоксы
    this.onChanges();

    this.subscription.add(
      this.jobsService
        .getJobs(this.field, this.currentPage, this.limit)
        .subscribe((res) => {
          this.jobs = res.items;
          this.totalDocs = res.meta.totalDocs;
          this.totalPages = res.meta.totalPages;
          this.isLoading = false;
        })
    );

    this.subscription.add(
      this.jobsService.getAllJobs().subscribe((res) => {
        this.filterService.changeData(res);
        this.allJobs = res;
      })
    );

    this.subscription.add(
      this.fieldForm.valueChanges.subscribe((changes) => {
        this.isLoading = true;
        this.field = changes.field;
        this.currentPage = 1;
        this.jobsService
          .getJobs(this.field, this.currentPage, this.limit)
          .subscribe((res) => {
            this.jobs = res.items;
            this.totalDocs = res.meta.totalDocs;
            this.totalPages = res.meta.totalPages;
            this.isLoading = false;
          });
      })
    );

    this.subscription.add(
      this.filterService.currentSearch.subscribe((search) => {
        this.searchField = search;
        this.fieldForm.get('field')?.setValue('Все профессии');
      })
    );

    this.subscription.add(
      this.filterService.currentData.subscribe((res) => {
        this.jobs = res;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadMore(): void {
    this.currentPage++;
    this.isLoadingMore = true;
    this.subscription.add(
      this.jobsService
        .getJobs(this.field, this.currentPage, this.limit)
        .subscribe((res) => {
          this.jobs = [...this.jobs, ...res.items];
          this.totalDocs = res.meta.totalDocs;
          this.totalPages = res.meta.totalPages;
          this.isLoadingMore = false;
        })
    );
  }

  onChanges(): void {
    // Subscribe to changes on the selectAll checkbox
    this.skillForm.get('selectAll')?.valueChanges.subscribe((bool) => {
      this.skillForm
        .get('skillOptions')
        ?.patchValue(Array(this.skillOptions.length).fill(bool), {
          emitEvent: false,
        });
    });

    // Subscribe to changes on the music preference checkboxes
    this.skillForm.get('musicPreferences')?.valueChanges.subscribe((val) => {
      const allSelected = val.every((bool: any) => bool);
      if (this.skillForm.get('selectAll')?.value !== allSelected) {
        this.skillForm
          .get('selectAll')
          ?.patchValue(allSelected, { emitEvent: false });
      }
    });
  }

  submit() {
    this.filter = true;
    const selectedPreferences = this.skillForm.value.skillOptions
      .map((checked: any, index: any) =>
        checked ? this.skillOptions[index].id : null
      )
      .filter((value: any) => value !== null);
    let filteredSkills = this.skillOptions.filter((skill) =>
      selectedPreferences.includes(skill.id)
    );

    let newJobs: IJob[] = [];
    this.allJobs.forEach((job: IJob) => {
      if (filteredSkills.every((elem) => job.skills.includes(elem.name))) {
        newJobs.push(job);
      }
    });
    this.jobs = newJobs;
  }

  cancel() {
    this.filter = false;
    window.location.reload();
  }
}
