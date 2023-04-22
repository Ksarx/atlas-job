import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IDirection } from 'src/app/models/direction';

@Component({
  selector: 'direction-item',
  templateUrl: './direction-item.component.html',
  styleUrls: ['./direction-item.component.scss'],
})
export class DirectionItemComponent {
  @Input() direction: IDirection;
  isOpen = false;

  constructor(private router: Router) {}

  openInfo() {
    this.isOpen = !this.isOpen;
  }

  goToTrajectory() {
    this.router.navigate(['trajectory']);
  }
}
