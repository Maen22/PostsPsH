import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
      .get<{ message: string; posts: Post[] }>(
        'http://localhost:3000/api/posts'
      )
      .subscribe((response) => {
        const { posts } = response;
        this.posts = posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPost(title: string, content: string): void {
    const post = { id: null, title, content };
    this.http
      .post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe((response) => {
        console.log(response.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
