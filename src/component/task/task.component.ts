import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      captcha: ["", Validators.required],
    });
  }

  get usernameControl() {
    return this.loginForm.get("username")!;
  }
  get passwordControl() {
    return this.loginForm.get("password")!;
  }
  get captchaControl() {
    return this.loginForm.get("captcha")!;
  }

  navigateToLogin() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.http
        .get<any[]>("http://localhost:3000/users", {
          params: {
            username: username,
            password: password,
          },
        })
        .subscribe({
          next: (users) => {
            if (users.length === 1) {
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("username", username);
              this.router.navigate(["/dashbord"]);
            } else {
              alert("نام کاربری یا رمز عبور اشتباه است!");
            }
          },
          error: () => {
            alert("خطا در ارتباط با سرور!");
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
