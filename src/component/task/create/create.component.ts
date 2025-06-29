import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { PostService } from "../../../post.service";
import { UserStats } from "../../../model/user-stats.model";
import { Post } from "../../../model/post.model";

@Component({
  selector: "app-create",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit {
  username: string = "";
  userStats: UserStats = {
    postCount: 0,
    followers: 0,
    following: 0,
  };
  postForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, private postService: PostService) {}

  ngOnInit() {
    this.username = localStorage.getItem("username") || "";
    this.initForm();
    this.loadUserStats();
  }

  private initForm() {
    this.postForm = this.fb.group({
      instrument: ["", [Validators.required, Validators.minLength(2)]],
      description: ["", [Validators.required, Validators.minLength(6)]],
      year: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  get instrumentControl(): AbstractControl {
    return this.postForm.get("instrument")!;
  }
  get descriptionControl(): AbstractControl {
    return this.postForm.get("description")!;
  }
  get yearControl(): AbstractControl {
    return this.postForm.get("year")!;
  }

  addPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true; //تنظیم وضعیت بارگذاری

    // const newPost = {
    //   ...this.postForm.value, //مقادیر فرم (instrument, description, year)
    //   username: this.username, //نام کاربری از سرویس احراز هویت گرفته شده
    //   date: new Date().toISOString(),
    // };

    const newPost: Post = {
      instrument: this.postForm.value.instrument,
      description: this.postForm.value.description,
      year: this.postForm.value.year,
      username: this.username,
      date: new Date().toISOString(),
      id: 0,
      name: ""
    };



    this.postService.createPost(newPost).subscribe({
      //ارسال درخواست ایجاد پست
      next: () => {
        this.postForm.reset(); //reset form
        this.loadUserStats(); // بارگذاری مجدد آمار کاربر
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Post creation failed!!!!!!!!!", err);
        this.isLoading = false;
      },
    });
  }

  loadUserStats() {
    this.postService.getUserStats(this.username).subscribe({
      next: (stats: UserStats) => {
        this.userStats = {
          postCount: stats.postCount ?? 0,
          followers: stats.followers ?? 0,
          following: stats.following ?? 0,
        };
      },
      error: (err) => {
        console.error("Failed to load user stats", err);
        this.resetUserStats();
      },
    });
  }

  private resetUserStats() {
    this.userStats = { postCount: 0, followers: 0, following: 0 };
  }
}
