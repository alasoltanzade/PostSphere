import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const loginGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  console.log("LoginGuard - isLoggedIn:", isLoggedIn);

  if (isLoggedIn) {
    console.log("Redirecting to dashboard");
    return router.navigateByUrl("/dashbord");
  }

  return true;
};
