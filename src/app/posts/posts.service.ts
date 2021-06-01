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

  deletePost(postId: string) {
    this.http
      .delete<{ message: string }>(`http://localhost:3000/api/posts/${postId}`)
      .subscribe((response) => {
        console.log(response.message);
        this.posts = this.posts.filter((post) => {
          return post.id != postId;
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
