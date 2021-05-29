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
  posts: Post[] | undefined;
  private postsSubscribtion: Subscription | undefined;

  constructor(private postsService: PostsService) {}

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();
    this.postsSubscribtion = this.postsService
      .getPostUpdatedListener()
      .subscribe(
        (newPosts) => {
          this.posts = newPosts;
        },
        (err) => console.log(err)
      );
  }

  ngOnDestroy() {
    this.postsSubscribtion!.unsubscribe();
  }
}
