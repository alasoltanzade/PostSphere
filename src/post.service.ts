import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private posts: any[] = [];

  constructor() {}

  addPost(post: any) {
    this.posts.push(post);
    localStorage.setItem("posts", JSON.stringify(this.posts));
  }

  getPosts(): any[] {
    const storedPosts = localStorage.getItem("posts");
    return storedPosts ? JSON.parse(storedPosts) : [];
  }
}
