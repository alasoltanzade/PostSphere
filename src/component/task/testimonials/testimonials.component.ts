import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss'],
})
export class TestimonialsComponent implements OnInit {
  posts: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  displayedPosts: any[] = [];
  pagedPosts: any[] = [];

  // برای مدیریت کامنت‌های جدید
  newComment: { [key: number]: { author: string; message: string } } = {};

  constructor() {}

  ngOnInit() {
    this.loadPosts();
    this.updatePagedPosts();
  }

  loadPosts() {
    const storedPosts = localStorage.getItem('posts');
    this.posts = storedPosts ? JSON.parse(storedPosts) : [];
    this.displayedPosts = [...this.posts];
  }

  updatePagedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedPosts = this.displayedPosts.slice(startIndex, endIndex);

    // مقداردهی اولیه کامنت‌های جدید برای هر پست
    this.pagedPosts.forEach((post) => {
      if (!this.newComment[post.id]) {
        this.newComment[post.id] = { author: '', message: '' };
      }
    });
  }

  getComments(postId: number) {
    const storedComments = localStorage.getItem('comments');
    const allComments = storedComments ? JSON.parse(storedComments) : [];
    return allComments.filter((comment: any) => comment.postId === postId);
  }

  toggleLike(post: any) {
    post.liked = !post.liked;
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  addComment(post: any) {
    const commentData = {
      postId: post.id,
      name: this.newComment[post.id].author || 'Anonymous',
      message: this.newComment[post.id].message,
      date: new Date().toLocaleString(),
    };

    const storedComments = localStorage.getItem('comments');
    const existingComments = storedComments ? JSON.parse(storedComments) : [];
    existingComments.push(commentData);
    localStorage.setItem('comments', JSON.stringify(existingComments));

    // ریست فیلدهای کامنت
    this.newComment[post.id] = { author: '', message: '' };
  }

  searchPosts(searchTerm: string) {
    if (!searchTerm) {
      this.displayedPosts = [...this.posts];
    } else {
      this.displayedPosts = this.posts.filter(
        (post) =>
          post.instrument.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.currentPage = 1;
    this.updatePagedPosts();
  }

  sortPosts(order: string) {
    this.displayedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'new' ? dateB - dateA : dateA - dateB;
    });
    this.updatePagedPosts();
  }

  nextPage() {
    const totalPages = Math.ceil(
      this.displayedPosts.length / this.itemsPerPage
    );
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePagedPosts();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedPosts();
    }
  }
}
