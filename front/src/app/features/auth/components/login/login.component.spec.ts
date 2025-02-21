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
  }

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
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {
    // Given
    jest.spyOn(authServiceMock, 'login').mockReturnValue(of(sessionInformationMock));
    const credentials = {
      email: 'yoga@studio.com',
      password: 'test!1234'
    };

    component.form.setValue(credentials);

    // When
    component.submit();

    // Then
    // Login must have been called once with the credentials
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authServiceMock.login).toHaveBeenCalledWith(credentials);

    // SessionService must have been called once with the sessionInformation
    expect(sessionServiceMock.logIn).toHaveBeenCalledTimes(1);
    expect(sessionServiceMock.logIn).toHaveBeenCalledWith(sessionInformationMock);

    // Router must have been called once with the route to navigate to
    expect(routerMock.navigate).toHaveBeenCalledTimes(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should not login when using bad credentials', () => {
    // Given
    jest.spyOn(authServiceMock, 'login').mockReturnValue(throwError(() => new Error('Bad credentials')));
    const credentials = {
      email: 'yoga@studio.com',
      password: 'bad password'
    };

    component.form.setValue(credentials);

    // When
    component.submit();

    // Then
    // Login must have been called once with the credentials
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
    expect(authServiceMock.login).toHaveBeenCalledWith(credentials);

    // SessionService and Router must not have been called
    expect(sessionServiceMock.logIn).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();

    // The component must be in error state
    expect(component.onError).toBe(true);
  });

});