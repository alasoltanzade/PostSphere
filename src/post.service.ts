import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "./environment";
import { Observable } from "rxjs";

@Injectable({ providedIn: "root" })
export class PostService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createPost(postData: any) {
    return this.http.post(`${this.apiUrl}/posts`, postData);
  }

  // getUserStats(username: string) {
  //   return this.http
  //     .get<any[]>(`${this.apiUrl}/stats?username=${username}`)
  //     .pipe(
  //       map((stats) => stats[0] || { postCount: 0, followers: 0, following: 0 })
  //     );
  // }

  getUserStats(username: string) {
    return this.http.get<any>(`${this.apiUrl}/stats/${username}`);
  }

  // Post methods
  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/posts`);
  }

  updatePost(id: number, post: any) {
    return this.http.put(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number) {
    return this.http.delete(`${this.apiUrl}/posts/${id}`);
  }

  likePost(postId: number, userId: string) {
    return this.http.post(`${this.apiUrl}/posts/${postId}/like`, { userId });
  }

  unlikePost(postId: number, userId: string) {
    return this.http.post(`${this.apiUrl}/posts/${postId}/unlike`, { userId });
  }

  // Comment methods
  getComments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/comments`);
  }

  addComment(comment: any) {
    return this.http.post(`${this.apiUrl}/comments`, comment);
  }

  // Follow methods
  getFollowing(username: string) {
    return this.http.get<string[]>(`${this.apiUrl}/stats/${username}`);
  }

  followUser(follower: string, followee: string) {
    return this.http.post(`${this.apiUrl}/follow`, { follower, followee });
  }

  unfollowUser(follower: string, followee: string) {
    return this.http.post(`${this.apiUrl}/unfollow`, { follower, followee });
  }

  getFollowerCount(username: string): Observable<number> {
    return this.http
      .get<any>(`${this.apiUrl}/stats/${username}`)
      .pipe(map((response) => response.followers));
  }
}
