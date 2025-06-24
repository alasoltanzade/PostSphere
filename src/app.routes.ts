import { Routes } from "@angular/router";
import { authGuard } from "./auth.guard";

// Lazy-Loaded route
export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./component/task/task.component").then((c) => c.TaskComponent),
    canActivate: [authGuard],
  },
  {
    path: "dashbord",
    loadComponent: () =>
      import("./component/task/dashbord/dashbord.component").then(
        (c) => c.TaskDashbordComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "create",
    loadComponent: () =>
      import("./component/task/create/create.component").then(
        (c) => c.CreateComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: "testimonials",
    loadComponent: () =>
      import("./component/task/testimonials/testimonials.component").then(
        (c) => c.TestimonialsComponent
      ),
    canActivate: [authGuard],
  },
];



// { path: "Address",
//   loadComponent: () => import("path file").then((c) => c.component) }