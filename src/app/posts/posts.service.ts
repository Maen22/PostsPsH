import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

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
              imagePath: post.imagePath,
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

  addPost(title: string, content: string, image: File): void {
    const post = { title, content };

    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((response) => {
        const post: Post = {
          id: response.post.id,
          title: response.post.title,
          content: response.post.content,
          imagePath: response.post.imagePath,
        };
        this.posts.push({ ...post });
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, post: Post) {
    const updatedPost = {
      title: post.title,
      content: post.content,
      imagePath: null,
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
        this.router.navigate(['/']);
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
  imagePath: string;
}
