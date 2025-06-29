import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "./environment";
import { Observable } from "rxjs";
import { Post } from "./model/post.model";
import { UserStats } from "./model/user-stats.model";
import { PostComment } from "./model/comment.model";

@Injectable({ providedIn: "root" })
export class PostService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // createPost(postData: any) {
  //   return this.http.post(`${this.apiUrl}/posts`, postData);
  // }
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, post);
  }

  // getUserStats(username: string) {
  //   return this.http.get<any>(`${this.apiUrl}/stats/${username}`);
  // }
  getUserStats(username: string): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/stats/${username}`);
  }

  // Post methods
  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  updatePost(id: number, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }

  likePost(postId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/like`,
      { username }, // Make sure to send an object
      { headers: this.getAuthHeaders() } // Add auth headers if needed
    );
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem("token"); // Get your auth token
    return new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  }

  unlikePost(postId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/posts/${postId}/unlike`,
      { username },
      { headers: this.getAuthHeaders() }
    );
  }

  // Comment methods

  getComments(): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.apiUrl}/comments`);
  }

  addComment(comment: PostComment): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.apiUrl}/comments`, comment);
  }

  // Follow methods
  getFollowing(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/stats/${username}`);
  }

  followUser(follower: string, following: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/follow`, { follower, following });
  }

  unfollowUser(follower: string, following: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/follow/${follower}/${following}`);
  }

  getFollowerCount(username: string): Observable<number> {
    return this.http
      .get<any>(`${this.apiUrl}/stats/${username}`)
      .pipe(map((response) => response.followers));
  }

  // getFollowerCount(username: string): Observable<number> {
  //   return this.http.get<number>(
  //     `${this.apiUrl}/users/${username}/followers/count`
  //   );
  // }
}
