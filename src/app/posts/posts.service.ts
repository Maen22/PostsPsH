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
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdatedListener(): Observable<{ posts: Post[]; postCount: number }> {
    return this.postsUpdated.asObservable();
  }

  getPosts(pageSize: number, page: number): void {
    const queryParams = `?pageSize=${pageSize}&page=${page}`;
    this.http
      .get<{
        message: string;
        posts: PostResponse[];
        maxPosts: number;
      }>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(
        map((response) => {
          return {
            posts: response.posts.map((post): Post => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
              } as Post;
            }),
            maxPosts: response.maxPosts,
          };
        })
      )
      .subscribe((response) => {
        const { posts, maxPosts } = response;
        this.posts = posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: maxPosts,
        });
      });
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(`http://localhost:3000/api/posts/${postId}`);
  }

  addPost(title: string, content: string, image: File): void {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((_) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', postId);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: postId, title, content, imagePath: image };
    }
    this.http
      .put<{ message: string }>(
        `http://localhost:3000/api/posts/${postId}`,
        postData
      )
      .subscribe((_) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(
      `http://localhost:3000/api/posts/${postId}`
    );
  }
}

interface PostResponse {
  _id: string;
  title: string;
  content: string;
  imagePath: string;
}
