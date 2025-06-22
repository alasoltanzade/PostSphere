import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  ngOnInit() {
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

    this.instrument = '';
    this.description = '';
    this.name = '';
    this.year = '';
  }
}
