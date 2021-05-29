import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() {}

  getPostUpdatedListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable();
  }

  getPosts(): Post[] {
    return [...this.posts];
  }

  addPost(title: string, content: string): void {
    const post = { title, content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
