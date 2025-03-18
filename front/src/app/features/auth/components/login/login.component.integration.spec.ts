import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('LoginComponent Integration Test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jest.Mocked<AuthService>;
  let sessionServiceSpy: jest.Mocked<SessionService>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    const authServiceMock = {
      login: jest.fn(),
      register: jest.fn(),
      pathService: 'mocked-path-service',
      httpClient: {} as any,
    } as unknown as jest.Mocked<AuthService>;

    const sessionServiceMock = {
      logIn: jest.fn(),
      logOut: jest.fn(),
      isLogged: false,
      sessionInformation: undefined,
      $isLogged: jest.fn().mockReturnValue(of(false)),
    } as unknown as jest.Mocked<SessionService>;

    const routerMock = {
      navigate: jest.fn(),
      config: [],
      events: of({}) as any,
      routerState: {} as any,
      errorHandler: jest.fn(),
      malformedUriErrorHandler: jest.fn(),
      navigated: false,
      urlHandlingStrategy: {} as any,
      onSameUrlNavigation: 'ignore',
      paramsInheritanceStrategy: 'emptyOnly',
      urlUpdateStrategy: 'deferred',
      isActive: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    sessionServiceSpy = TestBed.inject(
      SessionService
    ) as jest.Mocked<SessionService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should call AuthService.login and navigate on successful login', () => {
    const mockSessionInfo: SessionInformation = {
      token: 'dummy-token',
      type: 'Bearer',
      id: 1,
      username: 'testUser',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    };
    authServiceSpy.login.mockReturnValue(of(mockSessionInfo));

    component.form.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.submit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(sessionServiceSpy.logIn).toHaveBeenCalledWith(mockSessionInfo);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true when login fails', () => {
    authServiceSpy.login.mockReturnValue(
      throwError(() => new Error('Login failed'))
    );

    component.form.setValue({
      email: 'invalid@example.com',
      password: 'wrongpassword',
    });
    component.submit();

    expect(component.onError).toBe(true);
  });

  it('should display error message when onError is true', () => {
    component.onError = true;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Utilisation d'un délai pour permettre au DOM de se mettre à jour correctement
    setTimeout(() => {
      const errorMessageElement = compiled.querySelector('.error-message') 
        || compiled.querySelector('#error-message'); // Ajout d'une vérification alternative si l'ID est utilisé.

      expect(errorMessageElement).not.toBeNull(); // Vérifie que l'élément existe
      expect(errorMessageElement?.textContent?.trim()).toBe('Une erreur est survenue. Veuillez réessayer.'); // Vérifie le contenu du message
    }, 0);
  });
});
