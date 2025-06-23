import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
  editingPostId: number | null = null;
  tempPost: any = {};
  currentUser: string | null = null;
  newComment: { [key: number]: { author: string; message: string } } = {};
  userFollowing: any = {};

  startEditing(post: any) {
    this.editingPostId = post.id;
    this.tempPost = {
      instrument: post.instrument,
      description: post.description,
      name: post.name,
      year: post.year,
    };
  }

  constructor(private router: Router) {}

  ngOnInit() {
    // دریافت نام کاربر از localStorage
    this.currentUser = localStorage.getItem('username');
    if (!this.currentUser) {
      // اگر کاربر لاگین نکرده باشد، به صفحه لاگین هدایت شود
      this.router.navigate(['/task']);
      return;
    }

    const storedFollowing = localStorage.getItem('userFollowing');
    this.userFollowing = storedFollowing ? JSON.parse(storedFollowing) : {};

    // اگر کاربر فعلی اطلاعات فالو ندارد، آن را ایجاد کنید
    if (!this.userFollowing[this.currentUser]) {
      this.userFollowing[this.currentUser] = [];
      this.saveFollowing();
    }

    this.loadPosts();
    this.updatePagedPosts();
  }

  loadPosts() {
    const storedPosts = localStorage.getItem('posts');
    this.posts = storedPosts ? JSON.parse(storedPosts) : [];
    this.displayedPosts = [...this.posts];

    this.posts.forEach((post) => {
      if (!post.likes) {
        post.likes = {
          count: 0,
          users: [],
        };
      }
    });

    this.displayedPosts = [...this.posts];
  }

  isPostOwner(post: any): boolean {
    return post.name === this.currentUser;
  }
  tartEditing(post: any) {
    // فقط اگر کاربر مالک پست است اجازه ویرایش دهد
    if (!this.isPostOwner(post)) {
      alert('شما فقط می‌توانید پست‌های خود را ویرایش کنید!');
      return;
    }

    this.editingPostId = post.id;
    this.tempPost = {
      instrument: post.instrument,
      description: post.description,
      name: post.name,
      year: post.year,
    };
  }

  saveEdit(post: any) {
    // فقط اگر کاربر مالک پست است اجازه ذخیره ویرایش دهد
    if (!this.isPostOwner(post)) {
      alert('شما اجازه ویرایش این پست را ندارید!');
      this.editingPostId = null;
      return;
    }

    post.instrument = this.tempPost.instrument;
    post.description = this.tempPost.description;
    post.name = this.tempPost.name;
    post.year = this.tempPost.year;

    post.lastEdited = new Date().toISOString();

    localStorage.setItem('posts', JSON.stringify(this.posts));

    this.editingPostId = null;
  }

  deletePost(postId: number) {
    // پیدا کردن پست برای بررسی مالکیت
    const post = this.posts.find((p) => p.id === postId);

    // فقط اگر کاربر مالک پست است اجازه حذف دهد
    if (!post || !this.isPostOwner(post)) {
      alert('شما فقط می‌توانید پست‌های خود را حذف کنید!');
      return;
    }

    this.posts = this.posts.filter((post) => post.id !== postId);
    this.displayedPosts = this.displayedPosts.filter(
      (post) => post.id !== postId
    );

    localStorage.setItem('posts', JSON.stringify(this.posts));

    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      const comments = JSON.parse(storedComments);
      const filteredComments = comments.filter(
        (comment: any) => comment.postId !== postId
      );
      localStorage.setItem('comments', JSON.stringify(filteredComments));
    }

    this.updatePagedPosts();
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

  // like
  toggleLike(post: any) {
    if (!this.currentUser) {
      alert('برای لایک کردن باید وارد حساب کاربری خود شوید');
      return;
    }
    const userIndex = post.likes.users.indexOf(this.currentUser);

    if (userIndex !== -1) {
      post.likes.users.splice(userIndex, 1);
      post.likes.count--;
    } else {
      post.likes.users.push(this.currentUser);
      post.likes.count++;
    }

    localStorage.setItem('posts', JSON.stringify(this.posts));
  }
  hasLiked(post: any): boolean {
    return this.currentUser && post.likes.users.includes(this.currentUser);
  }

  // Comment
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

  // Pagination
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
  cancelEdit() {
    this.editingPostId = null;
  }

  // follow
  saveFollowing() {
    localStorage.setItem('userFollowing', JSON.stringify(this.userFollowing));
  }

  toggleFollow(author: string) {
    if (!this.currentUser) {
      alert('برای فالو کردن باید وارد حساب کاربری خود شوید');
      return;
    }

    if (this.currentUser === author) {
      alert('شما نمی‌توانید خودتان را فالو کنید');
      return;
    }

    const userFollowingList = this.userFollowing[this.currentUser];
    const index = userFollowingList.indexOf(author);

    if (index !== -1) {
      userFollowingList.splice(index, 1);
    } else {
      userFollowingList.push(author);
    }

    this.saveFollowing();
  }

  isFollowing(author: string): boolean {
    return (
      this.currentUser && this.userFollowing[this.currentUser]?.includes(author)
    );
  }

  getFollowerCount(author: string): number {
    let count = 0;
    for (const user in this.userFollowing) {
      if (this.userFollowing[user].includes(author)) {
        count++;
      }
    }
    return count;
  }
}
