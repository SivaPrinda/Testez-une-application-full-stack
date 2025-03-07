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

  beforeEach(async () => {
    sessionServiceMock = {
      $isLogged: jest.fn(() => of(true)),
      logOut: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

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

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  it('should return observable from $isLogged', (done) => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.$isLogged().subscribe(isLogged => {
      expect(isLogged).toBe(true);
      done();
    });
  });

  it('should call logOut and navigate on logout', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.logout();
    expect(sessionServiceMock.logOut).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['']);
  });
});
