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

@Component({
  selector: "app-create",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit {
  username: string = "";
  followerCount: number = 0;
  followingCount: number = 0;
  postCount: number = 0;
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

    this.isLoading = true;
    const newPost = {
      ...this.postForm.value,
      username: this.username,
      date: new Date().toISOString(),
    };

    this.postService.createPost(newPost).subscribe({
      next: () => {
        this.postForm.reset();
        this.loadUserStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Post creation failed", err);
        this.isLoading = false;
      },
    });
  }
  // Update in create.component.ts
  loadUserStats() {
    this.postService.getUserStats(this.username).subscribe({
      next: (stats: any) => {
        this.postCount = stats.postCount || 0;
        this.followerCount = stats.followers || 0;
        this.followingCount = stats.following || 0;
      },
      error: (err) => {
        console.error("Failed to load user stats", err);
        // Set default values
        this.postCount = 0;
        this.followerCount = 0;
        this.followingCount = 0;
      },
    });
  }
}
