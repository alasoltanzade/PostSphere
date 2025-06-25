import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
  // @ViewChild("usernameInput") usernameInput!: ElementRef<HTMLInputElement>;
  // @ViewChild("passwordInput") passwordInput!: ElementRef<HTMLInputElement>;

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
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
      const username = this.loginForm.get("username")?.value;
      const password = this.loginForm.get("password")?.value;

      if (this.validateUser(username, password)) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        this.router.navigate(["/dashbord"]);
      } else {
        alert("نام کاربری یا رمز عبور اشتباه است!");
      }
    } else {
      this.loginForm.markAllAsTouched();
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

  // sendData() {
  //   const data = { message: "Hello from TaskComponent" };
  //   this.http
  //     .post("https://example.com/api/send", data)
  //     .subscribe((response) => {
  //       console.log(response);
  //     });
  // }
}
