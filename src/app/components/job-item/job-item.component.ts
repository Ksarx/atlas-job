import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IJob } from 'src/app/models/job';

@Component({
  selector: 'job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss'],
})
export class JobItemComponent {
  @Input() job: IJob;
  isOpen = false;

  constructor(private router: Router) {}

  openInfo() {
    this.isOpen = !this.isOpen;
  }

  goToJob() {
    this.router.navigate(['/jobs/', this.job.id]);
  }
}
