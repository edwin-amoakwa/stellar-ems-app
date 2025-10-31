// angular import
import {Component, inject} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {UntypedFormBuilder, Validators, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {AuthService, LoginPayload} from '../../auth.service';
import {UserSession} from '../../core/user-session';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(UntypedFormBuilder);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      userPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const payload: LoginPayload = this.loginForm.value;

      try {
        const response = await this.authService.login(payload);
        this.isLoading = false;
        // Handle successful login - could store token, redirect, etc.
        console.log('Login successful:', response);
        if(response.success)
        {
          UserSession.login(response.data);
        }
        this.router.navigate(['/dashboard']); // Adjust route as needed
      } catch (error: any) {
        this.isLoading = false;
        this.errorMessage = error.message || 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get userPassword() {
    return this.loginForm.get('userPassword');
  }
}
