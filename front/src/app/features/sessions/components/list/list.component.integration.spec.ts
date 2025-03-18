import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { of } from 'rxjs';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('ListComponent Integration Test', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionServiceSpy: jest.Mocked<SessionService>;
  let sessionApiServiceSpy: jest.Mocked<SessionApiService>;

  beforeEach(async () => {
    const mockSessionService = {
      sessionInformation: { id: 1, admin: true, username: 'testUser' }
    } as unknown as jest.Mocked<SessionService>;

    const mockSessionApiService = {
      all: jest.fn().mockReturnValue(of([
        { id: 1, name: 'Session 1', description: 'Description 1', teacher_id: 1, date: '2024-03-15' },
        { id: 2, name: 'Session 2', description: 'Description 2', teacher_id: 2, date: '2024-04-10' }
      ]))
    } as unknown as jest.Mocked<SessionApiService>;

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;

    sessionServiceSpy = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    sessionApiServiceSpy = TestBed.inject(SessionApiService) as jest.Mocked<SessionApiService>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionApiService.all() to fetch sessions', () => {
    expect(sessionApiServiceSpy.all).toHaveBeenCalled();
  });

  it('should display the correct number of sessions', (done) => {
    component.sessions$.subscribe(sessions => {
      expect(sessions.length).toBe(2);
      expect(sessions[0].name).toBe('Session 1');
      expect(sessions[1].name).toBe('Session 2');
      done();
    });
  });

  it('should return correct user information from sessionService', () => {
    expect(component.user).toEqual({
      id: 1,
      admin: true,
      username: 'testUser'
    });
  });
});
