import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading = false;

  constructor(private authService: AuthService) {}

  onSignup(signupForm: NgForm) {
    if (signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
      signupForm.value.email,
      signupForm.value.password
    );
  }
}
