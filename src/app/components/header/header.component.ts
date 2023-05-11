import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterService } from 'src/app/services/filter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscription = new Subscription();
  searchText = '';
  data: any;
  filterMetadata = { count: 0 };
  focus = false;

  constructor(private filterService: FilterService, private router: Router) {}

  ngOnInit(): void {
    this.subscription.add(
      this.filterService.currentData.subscribe((data) => {
        this.data = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearSearch() {
    this.focus = false;
    this.searchText = '';
    this.filterService.changeSearch(this.searchText);
  }

  search(name = '') {
    if (name != '') {
      this.focus = false;
      this.filterService.changeSearch(name);
    } else {
      this.focus = false;
      this.filterService.changeSearch(this.searchText);
    }
  }

  goToHome() {
    this.searchText = '';
    this.filterService.changeSearch('');
    this.router.navigate(['/']);
  }
}
