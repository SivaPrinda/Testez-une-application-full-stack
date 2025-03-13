import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  let sessionServiceMock: Partial<SessionService>;
  let routerMock: Partial<Router>;

  // Mock services for SessionService and Router with relevant methods
  beforeEach(async () => {
    sessionServiceMock = {
      $isLogged: jest.fn(() => of(true)),
      logOut: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    // Setup the testing module with necessary imports, declarations, and mock providers
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatToolbarModule
      ],
      declarations: [
        AppComponent
      ], providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  // Test to ensure the AppComponent is created successfully
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  // Test to verify the $isLogged observable returns the correct value
  // Subscribe to the observable and assert the expected result
  it('should return observable from $isLogged', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);
      done();
    });
  });

  // Test to ensure the logout method triggers the logOut function in SessionService
  // Ensure the Router navigates to the correct path after logout
  it('should call logOut and navigate on logout', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.logout();
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });
});
