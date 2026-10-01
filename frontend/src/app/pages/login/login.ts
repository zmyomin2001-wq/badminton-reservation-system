import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm;
  message = signal('');
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.message.set('');

    this.http.post<{
      message: string;
      token: string;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>(
      'http://localhost:3000/api/auth/login',
      this.loginForm.getRawValue()
    ).subscribe({
      next: (response) => {
        console.log('Login API response:', response.message);

        sessionStorage.setItem('token', response.token);

        this.message.set('Login successful');
        this.isLoading = false;

        this.router.navigate(['/']);
      },
      error: (error) => {
        this.message.set(
          error.error?.message || 'Login failed'
        );

        this.isLoading = false;
      }
    });
  }
}

