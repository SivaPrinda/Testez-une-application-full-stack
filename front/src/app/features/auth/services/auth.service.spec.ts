import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { expect } from '@jest/globals';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call register with correct URL and payload', () => {
    const mockRequest: RegisterRequest = {
      firstName: 'Test',
      lastName: 'Testing',
      email: 'testuser',
      password: 'password123',
    };

    service.register(mockRequest).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(null);
  });

  it('should call login and return session information', () => {
    const mockRequest: LoginRequest = {
      email: 'testuser',
      password: 'password123',
    };
    const mockResponse: SessionInformation = {
      token: 'abc123',
      id: 1,
      type: '',
      username: '',
      firstName: '',
      lastName: '',
      admin: true,
    };

    service.login(mockRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
