import { Component, Input } from '@angular/core';
import { IDirection } from 'src/app/models/direction';

@Component({
  selector: 'direction-item',
  templateUrl: './direction-item.component.html',
  styleUrls: ['./direction-item.component.scss'],
})
export class DirectionItemComponent {
  @Input() direction: IDirection;
  isOpen = false;

  openInfo() {
    this.isOpen = !this.isOpen;
  }
}
