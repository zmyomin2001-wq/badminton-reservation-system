
import { Component, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm;
  message = signal('');
  isLoading = signal(false);
  isSuccess = signal(false);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    this.registerForm.markAllAsTouched();
    this.message.set('');

    if (this.registerForm.invalid) {
      return;
    }

    const { name, email, password, confirmPassword } =
      this.registerForm.getRawValue();

    if (password !== confirmPassword) {
      this.registerForm.controls.confirmPassword.setErrors({
        passwordMismatch: true
      });
      return;
    }

    this.isLoading.set(true);

    this.http.post<{ message: string }>(
      'http://localhost:3000/api/auth/register',
      { name, email, password }
    ).subscribe({
      next: (response) => {
        this.message.set(response.message);
        this.isSuccess.set(true);
        this.isLoading.set(false);
        this.registerForm.reset();
      },
      error: (error) => {
        this.message.set(
          error.error?.message || 'Registration failed'
        );
        this.isSuccess.set(false);
        this.isLoading.set(false);
      }
    });
  }
}