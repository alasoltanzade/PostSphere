import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  constructor(private router: Router) {}

  navigateToLogin() {

    // get inputt-viewchild
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    if (this.validateUser(username, password)) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);

      this.router.navigate(["/dashbord"]);
    } else {
      alert("نام کاربری یا رمز عبور اشتباه است!");
    }
  }

  private validateUser(username: string, password: string): boolean {
    const validUsers = [
      { username: "admin", password: "12345" },
      { username: "soltanzade", password: "12345" },
      { username: "mosavi", password: "12345" },
      { username: "dehghan", password: "12345" },
      { username: "fallahi", password: "12345" },
    ];

    return validUsers.some(
      (user) => user.username === username && user.password === password
    );
  }
}



//gurd.ts  -- interseptour token  - service  - login reactive form - directivve 