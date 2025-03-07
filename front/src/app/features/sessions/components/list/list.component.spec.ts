import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { of } from 'rxjs';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionService: Partial<SessionService>;
  let mockSessionApiService: Partial<SessionApiService>;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'Test',
      date: new Date('2023-01-01'),
      teacher_id: 123,
      description: 'Session test',
      users: [],
    },
    {
      id: 1,
      name: 'Test',
      date: new Date('2023-01-01'),
      teacher_id: 123,
      description: 'Session test',
      users: [],
    },
  ];

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: { admin: true } as SessionInformation,
    };

    mockSessionApiService = {
      all: () => of(mockSessions),
    };

    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch sessions and assign them to sessions$', (done) => {
    component.sessions$.subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions);
      done();
    });
  });

  it('should return user session information', () => {
    expect(component.user).toEqual(mockSessionService.sessionInformation);
  });

  it('should return undefined if session information is not available', () => {
    mockSessionService.sessionInformation = undefined;
    expect(component.user).toBeUndefined();
  });
});
