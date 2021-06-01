import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPostUpdatedListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  getPosts(): void {
    this.http
      .get<{
        message: string;
        posts: PostResponse[];
      }>('http://localhost:3000/api/posts')
      .pipe(
        map((response) => {
          return response.posts.map((post): Post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
            } as Post;
          });
        })
      )
      .subscribe((response) => {
        const posts = response;
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string; title: string; content: string }>(
      `http://localhost:3000/api/posts/${postId}`
    );
  }

  addPost(title: string, content: string): void {
    const post = { title, content };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        console.log(response.message);
        this.posts.push({ id: response.postId, ...post });
        this.postsUpdated.next([...this.posts]);
      });
  }

  updatePost(postId: string, post: Partial<Post>) {
    const updatedPost = {
      title: post.title,
      content: post.content,
    };
    this.http
      .put<{ message: string }>(
        `http://localhost:3000/api/posts/${postId}`,
        updatedPost
      )
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id == postId);
        updatedPosts[oldPostIndex] = { id: postId, ...updatedPost } as Post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>(`http://localhost:3000/api/posts/${postId}`)
      .subscribe((response) => {
        console.log(response.message);
        this.posts = this.posts.filter((post) => {
          return post.id !== postId;
        });
        this.postsUpdated.next([...this.posts]);
      });
  }
}

interface PostResponse {
  _id: string;
  title: string;
  content: string;
}
