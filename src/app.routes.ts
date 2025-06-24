import { Routes } from '@angular/router';
import { TaskComponent } from './component/task/task.component';
import { TaskDashbordComponent } from './component/task/dashbord/dashbord.component';
import { CreateComponent } from './component/task/create/create.component';
import { TestimonialsComponent } from './component/task/testimonials/testimonials.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [

  { path: 'task', component: TaskComponent },
  { path: 'task/dashbord', component: TaskDashbordComponent },
  { path: 'task/create', component: CreateComponent },
  { path: 'task/testimonials', component: TestimonialsComponent },
  {
    path: 'task/dashbord',
    component: TaskDashbordComponent,
    canActivate: [authGuard],
  },
];
