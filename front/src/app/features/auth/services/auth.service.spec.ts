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
    // Setup the testing module with required modules and inject services
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify that no pending HTTP requests remain
    httpMock.verify();
  });

  it('should be created', () => {
    // Test to ensure the AuthService is created successfully
    expect(service).toBeTruthy();
  });

  it('should call register with correct URL and payload', () => {
    // Mock request data for registration
    const mockRequest: RegisterRequest = {
      firstName: 'Test',
      lastName: 'Testing',
      email: 'testuser',
      password: 'password123',
    };

    // Call the register method and expect no response body
    service.register(mockRequest).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    // Verify that the correct HTTP method and endpoint are used
    const req = httpMock.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    // Ensure the request body matches the mock data
    expect(req.request.body).toEqual(mockRequest);
    req.flush(null);
  });

  it('should call login and return session information', () => {
    // Mock request data for login
    const mockRequest: LoginRequest = {
      email: 'testuser',
      password: 'password123',
    };
    // Mock response data representing session information
    const mockResponse: SessionInformation = {
      token: 'abc123',
      id: 1,
      type: '',
      username: '',
      firstName: '',
      lastName: '',
      admin: true,
    };

    // Call the login method and expect the correct session information
    service.login(mockRequest).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    // Verify that the correct HTTP method and endpoint are used
    const req = httpMock.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    // Ensure the request body matches the mock data
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });
});
