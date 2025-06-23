import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  counter: number = 1;
  posts: any[] = [];
  instrument: string = '';
  description: string = '';
  name: string = '';
  year: string = '';
  username: string = '';
  followerCount: number = 0;
  followingCount: number = 0;
  postCount: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.username = storedUsername;
      this.name = storedUsername;
      this.loadUserStats(); // بارگیری آمار کاربر
    } else {
      this.router.navigate(['/task']);
    }

    const storedCounter = localStorage.getItem('counter');
    this.counter = storedCounter ? parseInt(storedCounter) : 1;

    const storedPosts = localStorage.getItem('posts');
    this.posts = storedPosts ? JSON.parse(storedPosts) : [];
  }

  addPost() {
    if (!this.instrument || !this.description || !this.name || !this.year) {
      alert('لطفاً تمام فیلدها را پر کنید!');
      return;
    }

    const newPost = {
      instrument: this.instrument,
      description: this.description,
      name: this.name,
      year: this.year,
      date: new Date().toISOString(),
      id: this.counter,
    };

    this.posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(this.posts));
    localStorage.setItem('counter', (++this.counter).toString());

    this.postCount++;
    this.instrument = '';
    this.description = '';
    this.name = '';
    this.year = '';
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
