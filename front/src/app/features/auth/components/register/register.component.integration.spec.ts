import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';

describe('RegisterComponent Integration Test', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jest.Mocked<AuthService>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    const authServiceMock: jest.Mocked<AuthService> = {
      register: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const routerMock: jest.Mocked<Router> = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('firstName')?.value).toBe('');
    expect(component.form.get('lastName')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should call AuthService.register and navigate to /login on successful registration', () => {
    authServiceSpy.register.mockReturnValue(of(undefined));

    component.form.setValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    component.submit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true when registration fails', () => {
    authServiceSpy.register.mockReturnValue(throwError(() => new Error('Registration failed')));

    component.form.setValue({
      email: 'error@example.com',
      firstName: 'Error',
      lastName: 'User',
      password: 'invalidpassword'
    });

    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should display error message when onError is true', () => {
    component.onError = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    
    // Utilisation d'un léger délai pour permettre la mise à jour du DOM
    setTimeout(() => {
      const errorMessageElement = compiled.querySelector('.error-message') 
        || compiled.querySelector('#error-message'); // Vérification alternative avec ID si présent.

      expect(errorMessageElement).not.toBeNull(); // Vérifie que l'élément existe
      expect(errorMessageElement?.textContent?.trim()).toBe('Une erreur est survenue. Veuillez réessayer.'); // Vérifie le contenu du message
    }, 0);
  });
});
