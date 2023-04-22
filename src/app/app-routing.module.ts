import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { JobComponent } from './pages/job/job.component';
import { TrajectoryComponent } from './pages/trajectory/trajectory.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'jobs/:id', component: JobComponent },
  { path: 'trajectory', component: TrajectoryComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
