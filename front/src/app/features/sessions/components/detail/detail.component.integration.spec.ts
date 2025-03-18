import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';
import { FormBuilder } from '@angular/forms';

describe('DetailComponent Integration Test', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionServiceSpy: jest.Mocked<SessionService>;
  let sessionApiServiceSpy: jest.Mocked<SessionApiService>;
  let teacherServiceSpy: jest.Mocked<TeacherService>;
  let matSnackBarSpy: jest.Mocked<MatSnackBar>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    const mockSessionService = {
      sessionInformation: { admin: true, id: 1 },
    } as unknown as jest.Mocked<SessionService>;

    const mockSessionApiService = {
      detail: jest.fn().mockReturnValue(
        of({
          id: '1',
          name: 'Session Test',
          users: [1, 2],
          teacher_id: 1,
        })
      ),
      delete: jest.fn().mockReturnValue(of({})),
      participate: jest.fn().mockReturnValue(of({})),
      unParticipate: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<SessionApiService>;

    const mockTeacherService = {
      detail: jest.fn().mockReturnValue(
        of({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
        })
      ),
    } as unknown as jest.Mocked<TeacherService>;

    const mockMatSnackBar = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    const mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    sessionServiceSpy = TestBed.inject(
      SessionService
    ) as jest.Mocked<SessionService>;
    sessionApiServiceSpy = TestBed.inject(
      SessionApiService
    ) as jest.Mocked<SessionApiService>;
    teacherServiceSpy = TestBed.inject(
      TeacherService
    ) as jest.Mocked<TeacherService>;
    matSnackBarSpy = TestBed.inject(MatSnackBar) as jest.Mocked<MatSnackBar>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session details on init', () => {
    expect(sessionApiServiceSpy.detail).toHaveBeenCalledWith('1');
    expect(component.session).toEqual({
      id: '1',
      name: 'Session Test',
      users: [1, 2],
      teacher_id: 1,
    });
    expect(teacherServiceSpy.detail).toHaveBeenCalledWith('1');
    expect(component.teacher).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('should delete the session and navigate on success', () => {
    component.delete();
    expect(sessionApiServiceSpy.delete).toHaveBeenCalledWith('1');
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Session deleted !',
      'Close',
      { duration: 3000 }
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should handle participate action correctly', () => {
    component.participate();
    expect(sessionApiServiceSpy.participate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceSpy.detail).toHaveBeenCalled();
  });

  it('should handle unParticipate action correctly', () => {
    component.unParticipate();
    expect(sessionApiServiceSpy.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(sessionApiServiceSpy.detail).toHaveBeenCalled();
  });

  it('should navigate back when back() is called', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });
});
