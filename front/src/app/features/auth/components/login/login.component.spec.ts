import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {LoginComponent} from "./login.component";
import {SessionService} from "../../../../services/session.service";
import {AuthService} from "../../services/auth.service";
import {of, throwError} from "rxjs";
import {Router} from "@angular/router";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const sessionInformationMock = {
    token: '',
    type: '',
    id: 1,
    username: '',
    firstName: '',
    lastName: '',
    admin: true
  } // Mock data representing a successful session information response

  const authServiceMock: Partial<AuthService> = {
    login: jest.fn()
  };

  const sessionServiceMock: Partial<SessionService> = {
    logIn: jest.fn()
  };

  const routerMock: Partial<Router> = {
    navigate: jest.fn()
  }

  beforeEach(async () => {
    // Reset all mocks so that we can verify the number of calls to the methods
    jest.resetAllMocks();

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        {provide: SessionService, useValue: sessionServiceMock},
        {provide: AuthService, useValue: authServiceMock},
        {provide: Router, useValue: routerMock}
      ],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Test to verify that the component is created successfully
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {
    // Given
    // Mock a successful login response
    jest.spyOn(authServiceMock, 'login').mockReturnValue(of(sessionInformationMock));
    const credentials = {
      email: 'yoga@studio.com',
      password: 'test!1234'
    };

    // Set form values with valid credentials
    component.form.setValue(credentials);

    // When
    // Submit the form and assert successful interactions
    component.submit();

    // Then
    // Ensure the login method is called with correct data
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authServiceMock.login).toHaveBeenCalledWith(credentials);

    // Ensure the session service is called to store session information
    expect(sessionServiceMock.logIn).toHaveBeenCalledTimes(1);
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(sessionInformationMock);

    // Ensure the router navigates to the correct route
    expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should not login when using bad credentials', () => {
    // Given
    // Mock a failed login attempt with incorrect credentials
    jest.spyOn(authServiceMock, 'login').mockReturnValue(throwError(() => new Error('Bad credentials')));
    const credentials = {
      email: 'yoga@studio.com',
      password: 'bad password'
    };

    // Set form values with invalid credentials
    component.form.setValue(credentials);

    // When
    // Submit the form and assert error state
    component.submit();

    // Then
    // Ensure the login method is called
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authServiceMock.login).toHaveBeenCalledWith(credentials);

    // Ensure no calls are made to the session service or router
    expect(sessionServiceMock.logIn).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();

    // Ensure the component sets the error state correctly
    expect(component.onError).toBe(true);
  });

});