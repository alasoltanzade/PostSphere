import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})

export class CreateComponent implements OnInit {
  counter: number = 1;
  posts: any[] = [];
  username: string = '';
  followerCount: number = 0;
  followingCount: number = 0;
  postCount: number = 0;

  // فرم واکنش‌گرا - از ! برای اعلام قطعی بودن مقدار استفاده می‌کنیم
  postForm!: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {}

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.loadUserStats();
    } else {
      this.router.navigate(['/task']);
    }

    const storedCounter = localStorage.getItem('counter');
    this.counter = storedCounter ? parseInt(storedCounter) : 1;

    const storedPosts = localStorage.getItem('posts');
    this.posts = storedPosts ? JSON.parse(storedPosts) : [];

    // ایجاد فرم واکنش‌گرا با اعتبارسنجی
    this.postForm = this.fb.group({
      instrument: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      year: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  // getter
  get instrumentControl(): AbstractControl {
    return this.postForm.get('instrument') as AbstractControl;
  }

  get descriptionControl(): AbstractControl {
    return this.postForm.get('description') as AbstractControl;
  }

  get yearControl(): AbstractControl {
    return this.postForm.get('year') as AbstractControl;
  }

  addPost() {
    // validation
    if (!this.postForm || this.postForm.invalid) {
      this.postForm?.markAllAsTouched();
      return;
    }

    // دریافت مقادیر از فرم
    const formValues = this.postForm.value;

    const newPost = {
      instrument: formValues.instrument,
      description: formValues.description,
      name: this.username,
      year: formValues.year,
      date: new Date().toISOString(),
      id: this.counter,
    };

    this.posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(this.posts));
    localStorage.setItem('counter', (++this.counter).toString());

    this.postCount++;
    this.postForm.reset();
  }

  loadUserStats() {
    const storedPosts = localStorage.getItem('posts');
    const allPosts = storedPosts ? JSON.parse(storedPosts) : [];
    this.postCount = allPosts.filter(
      (post: any) => post.name === this.username
    ).length;

    const storedFollowing = localStorage.getItem('userFollowing');
    const userFollowing = storedFollowing ? JSON.parse(storedFollowing) : {};
    this.followerCount = 0;
    for (const user in userFollowing) {
      if (userFollowing[user].includes(this.username)) {
        this.followerCount++;
      }
    }

    if (userFollowing[this.username]) {
      this.followingCount = userFollowing[this.username].length;
    } else {
      this.followingCount = 0;
    }
  }
}
