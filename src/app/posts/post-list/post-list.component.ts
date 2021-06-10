import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSubscribtion: Subscription | undefined;
  private authSub: Subscription | undefined;
  isAuthenticated = false;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.postsSubscribtion = this.postsService
      .getPostUpdatedListener()
      .subscribe(
        (postData: { posts: Post[]; postCount: number }) => {
          this.posts = postData.posts;
          this.totalPosts = postData.postCount;
          this.isLoading = false;
        },
        (err) => console.log(err)
      );

    this.isAuthenticated = this.authService.getIsAuthenticated();
    this.authSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string): void {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe((_) => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }
  ngOnDestroy() {
    this.postsSubscribtion?.unsubscribe();
    this.authSub?.unsubscribe();
  }
}
