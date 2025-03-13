import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

// Mock session data for testing
describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    date: new Date('2023-01-01'),
    description: 'This is a test session',
    teacher_id: 42,
    users: [101, 102],
  };

  // Setup the testing module with mock services, dependencies, and component creation
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Ensure there are no outstanding HTTP requests after each test
  afterEach(() => {
    httpMock.verify();
  });

  // Test to ensure the SessionApiService is created successfully
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test to ensure all sessions are fetched successfully
  // Verify the correct HTTP GET method and endpoint are used
  it('should fetch all sessions', () => {
    service.all().subscribe((sessions) => {
      expect(sessions).toEqual([mockSession]);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush([mockSession]);
  });

  // Test to ensure session details are fetched correctly
  // Verify the correct HTTP GET method and endpoint are used
  it('should fetch session details', () => {
    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  // Test to ensure a session can be deleted successfully
  // Verify the correct HTTP DELETE method and endpoint are used
  it('should delete a session', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // Test to ensure a new session is created successfully
  // Verify the correct HTTP POST method and endpoint are used
  it('should create a new session', () => {
    service.create(mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(mockSession);
  });

  // Test to ensure an existing session is updated successfully
  // Verify the correct HTTP PUT method and endpoint are used
  it('should update a session', () => {
    service.update('1', mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession);
  });

  // Test to ensure users can participate in a session successfully
  // Verify the correct HTTP POST method and endpoint are used
  it('should allow participation in a session', () => {
    service.participate('1', 'user123').subscribe((response) => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1/participate/user123');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  // Test to ensure users can unparticipate from a session successfully
  // Verify the correct HTTP DELETE method and endpoint are used
  it('should allow unparticipation from a session', () => {
    service.unParticipate('1', 'user123').subscribe((response) => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1/participate/user123');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
