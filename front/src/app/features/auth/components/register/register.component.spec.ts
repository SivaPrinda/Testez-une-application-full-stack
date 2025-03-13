import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    // Setup the testing module with mock services and dependencies
    authService = {
      register: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    router = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Test to verify that the component is created successfully
    expect(component).toBeTruthy();
  });

  it('should have a valid form when all fields are filled correctly', () => {
    // Test to ensure the form is valid when all required fields are filled
    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123',
    });
    expect(component.form.valid).toBeTruthy();
  });

  it('should have an invalid form when required fields are empty', () => {
    // Test to verify the form is invalid when required fields are empty
    component.form.setValue({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    });
    expect(component.form.invalid).toBeTruthy();
  });

  it('should call authService.register and navigate on successful registration', () => {
    // Mock a successful registration response
    authService.register.mockReturnValue(of(void 0));
    // Fill the form with valid data
    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123',
    });
    // Submit the form
    component.submit();
    // Verify that the authService.register method is called with correct data
    expect(authService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123',
    });
    // Verify that the router navigates to the login page
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true if registration fails', () => {
    // Mock a failed registration response
    authService.register.mockReturnValue(
      throwError(() => new Error('Registration failed'))
    );
    // Fill the form with valid data
    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'securePassword123',
    });
    // Submit the form
    component.submit();
    // Verify that the component's onError flag is set to true
    expect(component.onError).toBeTruthy();
  });
});
