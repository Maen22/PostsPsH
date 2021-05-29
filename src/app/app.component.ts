import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  storedPosts: { title: string; content: string }[] = [];

  onPostAdded(post: { title: string; content: string }) {
    this.storedPosts.push(post);
  }
}
