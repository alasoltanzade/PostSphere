import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { PostService } from "../../../post.service";
import { Post, Like } from "../../../model/post.model";
import { FollowerCount } from "../../../model/follower.model";
import { PostComment } from "../../../model/comment.model";
import { ChangeDetectorRef } from "@angular/core";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import Point from "ol/geom/Point";
import Feature from "ol/Feature";
import Map from "ol/Map";

@Component({
  selector: "app-testimonials",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./testimonials.component.html",
  styleUrls: ["./testimonials.component.scss"],
})
export class TestimonialsComponent implements OnInit {
  posts: Post[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 3;
  displayedPosts: Post[] = [];
  pagedPosts: Post[] = [];
  editingPostId: number | null = null;
  tempPost: Partial<Post> = {};
  currentUser: string | null = null;
  newComment: { [key: number]: { author: string; message: string } } = {};
  userFollowing: string[] = [];
  authorFollowerCounts: FollowerCount = {};
  allComments: PostComment[] = [];
  isLoading = true;
  map!: Map;
  vectorSource = new VectorSource();
  showCoordinatesModal = false;
  selectedCoordinates: { lat: number | null; lng: number | null } = {
    lat: null,
    lng: null,
  };

  constructor(
    private router: Router,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) {}

  showCoordinates(post: Post) {
    this.selectedCoordinates = {
      lat: post.latitude || null,
      lng: post.longitude || null,
    };
    this.showCoordinatesModal = true;

    // بعد از باز شدن مودال، نقشه را مقداردهی اولیه کنید
    setTimeout(() => {
      this.initMap();
      if (this.selectedCoordinates.lat && this.selectedCoordinates.lng) {
        this.showLocationOnMap(
          this.selectedCoordinates.lng,
          this.selectedCoordinates.lat
        );
      }
    }, 0);
  }

  private showLocationOnMap(lon: number, lat: number) {
    if (!this.map) return;

    const coordinate = fromLonLat([lon, lat]);

    this.vectorSource.clear();
    const feature = new Feature(new Point(coordinate));
    this.vectorSource.addFeature(feature);

    this.map.getView().setCenter(coordinate);
    this.map.getView().setZoom(15);
  }

  private initMap() {
    this.map = new Map({
      target: "map-modal",
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: this.vectorSource,
        }),
      ],
      view: new View({
        center: fromLonLat([51.389, 35.6892]),
        zoom: 10,
      }),
    });
  }

  // متد بستن مودال
  closeCoordinatesModal() {
    this.showCoordinatesModal = false;
    if (this.map) {
      this.map.dispose();
    }
  }

  ngOnInit() {
    this.currentUser = localStorage.getItem("username")!;
    this.loadData();
  }

  //بارگذاری اولیه داده‌ها
  async loadData() {
    try {
      // Load posts
      const postsResponse = await this.postService.getPosts().toPromise();
      this.posts = ((postsResponse as Post[]) || []).map((post) => ({
        ...post,
        name: post.username,
        likes: post.likes || { count: 0, users: [] },
      }));

      // Load comments
      const commentsResponse = await this.postService.getComments().toPromise();
      this.allComments = (commentsResponse as PostComment[]) || [];

      // Load following
      if (this.currentUser) {
        const followingResponse = await this.postService
          .getFollowing(this.currentUser)
          .toPromise();

        // Ensure it's always an array
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
    } finally {
      this.isLoading = false;
    }
  }

  async loadFollowerCounts() {
    const authors = [...new Set(this.posts.map((p) => p.username))];
    for (const author of authors) {
      if (author) {
        const count = await this.postService
          .getFollowerCount(author)
          .toPromise();
        this.authorFollowerCounts[author] = (count as number) || 0;
      }
    }
  }

  initializeDisplay() {
    this.posts.forEach((post) => {
      // Initialize likes
      if (!post.likes) {
        post.likes = {
          count: 0,
          users: [],
        };
      }

      // Initialize newComment for this post
      if (post.id && !this.newComment[post.id]) {
        this.newComment[post.id] = { author: "", message: "" };
      }
    });

    this.displayedPosts = [...this.posts];
    this.updatePagedPosts();
  }

  isPostOwner(post: Post): boolean {
    return !!this.currentUser && post.username === this.currentUser;
  }

  startEditing(post: Post) {
    this.editingPostId = post.id || null;
    this.tempPost = { ...post };
  }

  async saveEdit() {
    if (!this.editingPostId || !this.tempPost) return;

    try {
      const updatedPost = await this.postService
        .updatePost(this.editingPostId, this.tempPost as Post)
        .toPromise();

      const index = this.posts.findIndex((p) => p.id === this.editingPostId);
      if (index !== -1) {
        this.posts[index] = updatedPost as Post;
        this.displayedPosts = [...this.posts];
      }
      this.editingPostId = null;
    } catch (error) {
      console.error("Failed to update post", error);
    }
  }

  cancelEdit() {
    this.editingPostId = null;
  }

  async deletePost(postId: number) {
    try {
      await this.postService.deletePost(postId).toPromise();

      // Update local state
      this.posts = this.posts.filter((post) => post.id !== postId);
      this.displayedPosts = this.displayedPosts.filter(
        (post) => post.id !== postId
      );
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

    // Initialize comment structure for the current page
    this.pagedPosts.forEach((post) => {
      if (post.id && !this.newComment[post.id]) {
        this.newComment[post.id] = { author: "", message: "" };
      }
    });

    // Force change detection
    this.cdr.detectChanges();
  }

  async toggleLike(post: Post) {
    if (!this.currentUser) {
      alert("برای لایک کردن باید وارد حساب کاربری خود شوید");
      return;
    }

    if (!post.likes) post.likes = { count: 0, users: [] };

    try {
      if (this.hasLiked(post)) {
        await this.postService
          .unlikePost(post.id!, this.currentUser)
          .toPromise();
        post.likes.users = post.likes.users.filter(
          (u) => u !== this.currentUser
        );
        post.likes.count--;
      } else {
        await this.postService.likePost(post.id!, this.currentUser).toPromise();
        post.likes.users.push(this.currentUser!);
        post.likes.count++;
      }
    } catch (error) {
      console.error("Full error details:", error); // Add this line
      console.error("خطا در ثبت لایک", error);
    }
  }

  hasLiked(post: Post): boolean {
    return (
      !!this.currentUser &&
      !!post.likes &&
      post.likes.users.includes(this.currentUser)
    );
  }

  getComments(postId: number): PostComment[] {
    return this.allComments.filter((comment) => comment.postId === postId);
  }

  async addComment(post: Post) {
    if (!post.id) return;

    const commentData: PostComment = {
      // Explicit type
      postId: post.id,
      name: this.newComment[post.id].author || "Anonymous",
      message: this.newComment[post.id].message,
      date: new Date().toISOString(),
    };

    try {
      const newComment = await this.postService
        .addComment(commentData)
        .toPromise();
      this.allComments.push(newComment as PostComment);
      this.newComment[post.id] = { author: "", message: "" };
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  }

  searchPosts(searchTerm: string) {
    if (!searchTerm) {
      this.displayedPosts = [...this.posts];
    } else {
      const term = searchTerm.toLowerCase();
      this.displayedPosts = this.posts.filter(
        (post) =>
          post.instrument.toLowerCase().includes(term) ||
          post.description.toLowerCase().includes(term) ||
          (post.name && post.name.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
    this.updatePagedPosts();
  }

  sortPosts(order: "new" | "old") {
    this.displayedPosts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === "new" ? dateB - dateA : dateA - dateB;
    });
    this.updatePagedPosts();
  }

  nextPage() {
    const totalPages = this.totalPages();
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.updatePagedPosts(); // Ensure this is called
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagedPosts(); // Ensure this is called
    }
  }

  totalPages(): number {
    return Math.ceil(this.displayedPosts.length / this.itemsPerPage);
  }

  async toggleFollow(author: string) {
    if (!this.currentUser) {
      alert("برای فالو کردن باید وارد حساب کاربری خود شوید");
      return;
    }

    try {
      if (!Array.isArray(this.userFollowing)) {
        this.userFollowing = [];
      }
      const wasFollowing = this.isFollowing(author);

      if (wasFollowing) {
        await this.postService
          .unfollowUser(this.currentUser, author)
          .toPromise();
        this.userFollowing = this.userFollowing.filter((u) => u !== author);
      } else {
        await this.postService.followUser(this.currentUser, author).toPromise();
        this.userFollowing.push(author);
      }

      // Refresh follower count
      const count = await this.postService.getFollowerCount(author).toPromise();
      this.authorFollowerCounts[author] = (count as number) || 0;
    } catch (error) {
      console.error("خطا در ثبت فالو", error);
    }
  }

  isFollowing(author: string): boolean {
    return (
      Array.isArray(this.userFollowing) && this.userFollowing.includes(author)
    );
  }

  updateCommentAuthor(postId: number, value: string) {
    if (!this.newComment[postId]) {
      this.newComment[postId] = { author: "", message: "" };
    }
    this.newComment[postId].author = value;
  }

  updateCommentMessage(postId: number, value: string) {
    if (!this.newComment[postId]) {
      this.newComment[postId] = { author: "", message: "" };
    }
    this.newComment[postId].message = value;
  }
}
