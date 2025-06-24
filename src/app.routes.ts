import { Routes } from "@angular/router";

// Lazy-Loaded route
export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./component/task/task.component").then((c) => c.TaskComponent),
  },
  {
    path: "dashbord",
    loadComponent: () =>
      import("./component/task/dashbord/dashbord.component").then(
        (c) => c.TaskDashbordComponent
      ),
  },
  {
    path: "create",
    loadComponent: () =>
      import("./component/task/create/create.component").then(
        (c) => c.CreateComponent
      ),
  },
  {
    path: "testimonials",
    loadComponent: () =>
      import("./component/task/testimonials/testimonials.component").then(
        (c) => c.TestimonialsComponent
      ),
  },
];



// { path: "Address",
//   loadComponent: () => import("path file").then((c) => c.component) }