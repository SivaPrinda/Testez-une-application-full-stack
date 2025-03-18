import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormComponent } from './form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '../../../../services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from '../../../../services/teacher.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { expect } from '@jest/globals';

describe('FormComponent Integration Test', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let sessionApiServiceSpy: jest.Mocked<SessionApiService>;
  let sessionServiceSpy: jest.Mocked<SessionService>;
  let teacherServiceSpy: jest.Mocked<TeacherService>;
  let matSnackBarSpy: jest.Mocked<MatSnackBar>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(async () => {
    const mockSessionApiService = {
      detail: jest.fn().mockReturnValue(
        of({
          id: '1',
          name: 'Session Test',
          date: '2024-03-15',
          teacher_id: 1,
          description: 'Sample session description.',
        })
      ),
      create: jest.fn().mockReturnValue(of({})),
      update: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<SessionApiService>;

    const mockSessionService = {
      sessionInformation: { admin: true },
    } as unknown as jest.Mocked<SessionService>;

    const mockTeacherService = {
      all: jest
        .fn()
        .mockReturnValue(of([{ id: 1, firstName: 'John', lastName: 'Doe' }])),
    } as unknown as jest.Mocked<TeacherService>;

    const mockMatSnackBar = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    const mockRouter = {
      navigate: jest.fn(),
      url: '/sessions/update/1',
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: Router, useValue: mockRouter },
        FormBuilder,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    sessionApiServiceSpy = TestBed.inject(
      SessionApiService
    ) as jest.Mocked<SessionApiService>;
    sessionServiceSpy = TestBed.inject(
      SessionService
    ) as jest.Mocked<SessionService>;
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

  it('should initialize the form correctly for update mode', () => {
    expect(component.onUpdate).toBe(true);
    expect(component.sessionForm?.value).toEqual({
      name: 'Session Test',
      date: '2024-03-15',
      teacher_id: 1,
      description: 'Sample session description.',
    });
  });

  it('should submit and create a new session', () => {
    component.onUpdate = false;
    component.sessionForm?.setValue({
      name: 'New Session',
      date: '2024-04-01',
      teacher_id: 1,
      description: 'New session created for testing.',
    });

    component.submit();

    expect(sessionApiServiceSpy.create).toHaveBeenCalledWith({
      name: 'New Session',
      date: '2024-04-01',
      teacher_id: 1,
      description: 'New session created for testing.',
    });
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Session created !',
      'Close',
      { duration: 3000 }
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should submit and update an existing session', () => {
    component.onUpdate = true;
    component.sessionForm?.setValue({
      name: 'Updated Session',
      date: '2024-05-01',
      teacher_id: 1,
      description: 'Updated session for testing.',
    });

    component.submit();

    expect(sessionApiServiceSpy.update).toHaveBeenCalledWith('1', {
      name: 'Updated Session',
      date: '2024-05-01',
      teacher_id: 1,
      description: 'Updated session for testing.',
    });
    expect(matSnackBarSpy.open).toHaveBeenCalledWith(
      'Session updated !',
      'Close',
      { duration: 3000 }
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should navigate to sessions page if user is not admin', () => {
    sessionServiceSpy.sessionInformation!.admin = false;

    // Forcer la re-création du composant après le changement de rôle
    fixture.destroy();
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sessions']);
  });
});
