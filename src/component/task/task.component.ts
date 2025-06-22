import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task',
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/task/dashbord']);
  }
}
