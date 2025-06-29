import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PostService } from "../../../post.service";

@Component({
  selector: "app-testimonials",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./testimonials.component.html",
  styleUrls: ["./testimonials.component.scss"],
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
  userFollowing: string[] = [];
  authorFollowerCounts: { [author: string]: number } = {};
  allComments: any[] = [];
  isLoading = true;

  constructor(private router: Router, private postService: PostService) {}

  ngOnInit() {
    this.currentUser = localStorage.getItem("username")!;
    this.loadData();
  }

  async loadData() {
    try {
      // Load posts
      const postsResponse = await this.postService.getPosts().toPromise();
      this.posts = Array.isArray(postsResponse)
        ? postsResponse.map((post) => ({ ...post, name: post.username }))
        : [];

      // Load comments
      const commentsResponse = await this.postService.getComments().toPromise();
      this.allComments = Array.isArray(commentsResponse)
        ? commentsResponse
        : [];

      // Load following
      if (this.currentUser) {
        const followingResponse = await this.postService
          .getFollowing(this.currentUser)
          .toPromise();
        this.userFollowing = Array.isArray(followingResponse)
          ? followingResponse
          : [];
      }

      // Load follower counts
      await this.loadFollowerCounts();

      this.initializeDisplay();
    } catch (error) {
      console.error("Failed to load data", error);
      // Provide safe defaults
      this.posts = [];
      this.allComments = [];
      this.userFollowing = [];

      // Temporary mock data for debugging
      this.posts = [
        {
          id: 1,
          instrument: "Piano",
          description: "Classic piano",
          name: "admin",
          year: 3,
          date: new Date().toISOString(),
          likes: { count: 2, users: [] },
        },
      ];

      this.allComments = [
        {
          id: 1,
          postId: 1,
          name: "John",
          message: "Great post!",
          date: new Date().toISOString(),
        },
      ];
    } finally {
      this.isLoading = false;
    }
  }

  async loadFollowerCounts() {
    const authors = [...new Set(this.posts.map((p) => p.username))];
    for (const author of authors) {
      if (author) {
        this.authorFollowerCounts[author] =
          (await this.postService.getFollowerCount(author).toPromise()) || 0;
      }
    }
  }

  initializeDisplay() {
    this.posts.forEach((post) => {
      if (!post.likes) {
        post.likes = {
          count: 0,
          users: [],
        };
      }
    });

    this.displayedPosts = [...this.posts];
    this.updatePagedPosts();
  }

  isPostOwner(post: any): boolean {
    return post.username === this.currentUser;
  }

  startEditing(post: any) {
    this.editingPostId = post.id;
    this.tempPost = { ...post };
  }

  async saveEdit() {
    if (!this.editingPostId) return;

    try {
      const updatedPost = await this.postService
        .updatePost(this.editingPostId, this.tempPost)
        .toPromise();

      // Update local state
      const index = this.posts.findIndex((p) => p.id === this.editingPostId);
      if (index !== -1) {
        this.posts[index] = updatedPost;
        this.displayedPosts = [...this.posts];
      }

      this.editingPostId = null;
    } catch (error) {
      console.error("Failed to update post", error);
    }
  }

  async deletePost(postId: number) {
    try {
      await this.postService.deletePost(postId).toPromise();

      // Update local state
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.displayedPosts = this.displayedPosts.filter(
        (post) => post.id !== postId
      );

      // Delete comments
      this.allComments = this.allComments.filter(
        (comment) => comment.postId !== postId
      );

      this.updatePagedPosts();
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }

  updatePagedPosts() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedPosts = this.displayedPosts.slice(startIndex, endIndex);

    this.pagedPosts.forEach((post) => {
      if (!this.newComment[post.id]) {
        this.newComment[post.id] = { author: "", message: "" };
      }
    });
  }

  getComments(postId: number) {
    return this.allComments.filter((comment) => comment.postId === postId);
  }

  async toggleLike(post: any) {
    if (!this.currentUser) {
      alert("برای لایک کردن باید وارد حساب کاربری خود شوید");
      return;
    }

    try {
      const userIndex = post.likes.users.indexOf(this.currentUser);

      if (userIndex !== -1) {
        await this.postService
          .unlikePost(post.id, this.currentUser)
          .toPromise();
        post.likes.users.splice(userIndex, 1);
        post.likes.count--;
      } else {
        await this.postService.likePost(post.id, this.currentUser).toPromise();
        post.likes.users.push(this.currentUser);
        post.likes.count++;
      }
    } catch (error) {
      console.error("Failed to toggle like", error);
    }
  }

  hasLiked(post: any): boolean {
    return this.currentUser && post.likes.users.includes(this.currentUser);
  }

  async addComment(post: any) {
    const commentData = {
      postId: post.id,
      name: this.newComment[post.id].author || "Anonymous",
      message: this.newComment[post.id].message,
      date: new Date().toISOString(),
    };

    try {
      const newComment = await this.postService
        .addComment(commentData)
        .toPromise();
      this.allComments.push(newComment);
      this.newComment[post.id] = { author: "", message: "" };
    } catch (error) {
      console.error("Failed to add comment", error);
    }
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
      return order === "new" ? dateB - dateA : dateA - dateB;
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

  totalPages(): number {
    return Math.ceil(this.displayedPosts.length / this.itemsPerPage);
  }

  cancelEdit() {
    this.editingPostId = null;
  }

  async toggleFollow(author: string) {
    if (!this.currentUser) {
      alert("برای فالو کردن باید وارد حساب کاربری خود شوید");
      return;
    }

    try {
      const isFollowing = this.userFollowing.includes(author);

      if (isFollowing) {
        await this.postService
          .unfollowUser(this.currentUser, author)
          .toPromise();
        this.userFollowing = this.userFollowing.filter((u) => u !== author);
      } else {
        await this.postService.followUser(this.currentUser, author).toPromise();
        this.userFollowing.push(author);
      }

      // Update follower count
      this.authorFollowerCounts[author] =
        (await this.postService.getFollowerCount(author).toPromise()) || 0;
    } catch (error) {
      console.error("Failed to toggle follow", error);
    }
  }

  isFollowing(author: string): boolean {
    return this.userFollowing.includes(author);
  }
}
