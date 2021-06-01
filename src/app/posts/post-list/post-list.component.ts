import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private postsSubscribtion: Subscription | undefined;
  isLoading = false;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.postsService.getPosts();
    this.isLoading = true;
    this.postsSubscribtion = this.postsService
      .getPostUpdatedListener()
      .subscribe(
        (newPosts) => {
          this.posts = newPosts;
          this.isLoading = false;
        },
        (err) => console.log(err)
      );
  }

  onDelete(postId: string): void {
    this.postsService.deletePost(postId);
  }
  ngOnDestroy() {
    this.postsSubscribtion!.unsubscribe();
  }
}
