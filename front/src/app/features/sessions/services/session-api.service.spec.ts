import { HttpClientModule } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all sessions', () => {
    service.all().subscribe((sessions) => {
      expect(sessions).toEqual([mockSession]);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');
    req.flush([mockSession]);
  });

  it('should fetch session details', () => {
    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session', () => {
    service.delete('1').subscribe((response) => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a new session', () => {
    service.create(mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(mockSession);
  });

  it('should update a session', () => {
    service.update('1', mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession);
  });

  it('should allow participation in a session', () => {
    service.participate('1', 'user123').subscribe((response) => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1/participate/user123');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should allow unparticipation from a session', () => {
    service.unParticipate('1', 'user123').subscribe((response) => {
      expect(response).toEqual({});
    });
    const req = httpMock.expectOne('api/session/1/participate/user123');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
