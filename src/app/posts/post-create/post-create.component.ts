import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { asyncMimeTypeValidator } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  private mode = 'create';
  private postId: string | undefined | null;
  post: Post | undefined;
  isLoading = false;
  form: FormGroup | undefined;
  imagePreview: string | undefined;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: Validators.required }),
      // this field is not binded to HTML because no need to show it
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [asyncMimeTypeValidator],
      }),
    });

    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.postId = paramMap.get('id');
        this.isLoading = true;
        this.postsService.getPost(this.postId!).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
          this.isLoading = false;
          // If EDIT MODE
          this.form!.setValue({
            title: postData.title,
            content: postData.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form?.patchValue({ image: file });
    this.form?.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form!.invalid) {
      return;
    }
    this.isLoading = true;
    const { title, content, image } = this.form!.value;

    if (this.mode === 'create') {
      this.postsService.addPost(title, content, image);
      this.form!.reset();
    } else {
      this.postsService.updatePost(this.postId!, { title, content });
    }
  }
}
